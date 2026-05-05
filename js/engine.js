/* ===== THANATOPRACTOR - Core Engine ===== */
const Engine = (() => {
    // ===== GAME STATE =====
    const defaultState = () => ({
        playerName: '',
        day: 1,
        time: 480, // minutes from midnight (8:00 = 480)
        money: 5000,
        reputation: 50,
        xp: 0,
        level: 1,
        families: [], // all families (active + completed)
        activeFamilyId: null,
        upgrades: [], // owned upgrade IDs
        embalmTrainCount: 0,
        supplies: { formaldehyde: 10, humectant: 8, dye: 6, outfits: 4 },
        cremaTemp: 20,
        cremaFuel: 0,
        cremaIgnited: false,
        schedule: [], // {time, type, familyId, desc}
        notifications: [],
        dayEvents: [],
        cafeSatisfaction: 100,
        cafeOrders: [],
        viewingRooms: 1,
        speed: 1, // 0=pause, 1=normal, 2=fast
        gameOver: false,
        activePaperwork: null,
        pendingArrivals: 0,
        dayEndPrompted: false,
        lastActivityTime: 480,
        stats: { familiesServed: 0, totalEarnings: 0, diceRolls: 0, bestRoll: 0, worstDay: null }
    });

    let state = defaultState();
    let tickInterval = null;
    const REAL_DAY_MS = 7 * 60 * 1000; // 7 minutes real = 1 game day
    const GAME_MINUTES_PER_DAY = 840; // 8:00 to 22:00 = 840 min
    const TICK_MS = 500; // tick every 500ms
    const MINUTES_PER_TICK = GAME_MINUTES_PER_DAY / (REAL_DAY_MS / TICK_MS); // ~1 min game per tick

    // ===== GETTERS =====
    function getState() { return state; }
    function getTimeString() {
        const h = Math.floor(state.time / 60);
        const m = Math.floor(state.time % 60);
        return `${h.toString().padStart(2,'0')}:${m.toString().padStart(2,'0')}`;
    }
    function getLevel() {
        for (let i = DATA.levelXP.length - 1; i >= 0; i--) {
            if (state.xp >= DATA.levelXP[i]) return i + 1;
        }
        return 1;
    }
    function getRepStars() {
        if (state.reputation >= 80) return '⭐⭐⭐⭐⭐';
        if (state.reputation >= 60) return '⭐⭐⭐⭐';
        if (state.reputation >= 40) return '⭐⭐⭐';
        if (state.reputation >= 20) return '⭐⭐';
        return '⭐';
    }

    // ===== MONEY =====
    function addMoney(amount, reason, silent = false) {
        state.money += amount;
        if (amount > 0) state.stats.totalEarnings += amount;
        updateHUD();
        if (amount > 0 && !silent) {
            Audio8Bit.SFX.money();
            showToast(`+$${amount} — ${reason}`, 'success');
            animateHUD('hud-money', 'money-gain');
        } else if (amount > 0 && silent) {
            Audio8Bit.SFX.money();
        } else if (amount < 0 && !silent) {
            showToast(`-$${Math.abs(amount)} — ${reason}`, 'warning');
            animateHUD('hud-money', 'money-loss');
        }
        checkGameOver();
    }

    // ===== REPUTATION =====
    function addReputation(amount, reason, silent = false) {
        state.reputation = Math.max(0, Math.min(100, state.reputation + amount));
        updateHUD();
        if (!silent) {
            if (amount > 0) {
                showToast(`+${amount} REP — ${reason}`, 'success');
                animateHUD('hud-rep', 'rep-gain');
            } else if (amount < 0) {
                showToast(`${amount} REP — ${reason}`, 'danger');
                animateHUD('hud-rep', 'rep-loss');
            }
        }
        checkGameOver();
    }

    // ===== XP =====
    function addXP(amount) {
        state.xp += amount;
        const newLevel = getLevel();
        if (newLevel > state.level) {
            state.level = newLevel;
            showToast(`🎉 LEVEL UP! You are now Level ${newLevel}!`, 'success');
            addMoney(10000, 'HQ Level Up Bonus');
            Audio8Bit.SFX.success();
        }
    }

    // ===== TIME =====
    function startTime() {
        if (tickInterval) return;
        tickInterval = setInterval(tick, TICK_MS);
    }
    function stopTime() {
        if (tickInterval) { clearInterval(tickInterval); tickInterval = null; }
    }
    function setSpeed(s) {
        state.speed = s;
        document.querySelectorAll('.time-btn').forEach(b => b.classList.remove('active'));
        if (s === 0) document.getElementById('btn-pause').classList.add('active');
        else if (s === 1) document.getElementById('btn-play').classList.add('active');
        else document.getElementById('btn-fast').classList.add('active');
    }

    function tick() {
        if (state.speed === 0 || state.gameOver) return;
        const advance = MINUTES_PER_TICK * state.speed;
        state.time += advance;

        // Crematorium temperature logic
        if (state.cremaIgnited && state.cremaFuel > 0) {
            state.cremaTemp = Math.min(1100, state.cremaTemp + 2 * state.speed);
            state.cremaFuel = Math.max(0, state.cremaFuel - 0.02 * state.speed);
            if (state.cremaFuel <= 0) {
                state.cremaIgnited = false;
                showToast('🔥 Crematorium fuel depleted!', 'warning');
            }
        } else if (state.cremaTemp > 20) {
            state.cremaTemp = Math.max(20, state.cremaTemp - 1 * state.speed);
        }

        // Room Badges and Reception Action Alerts
        const activeFams = state.families.filter(f => f.active).length;
        const waitingFams = state.families.filter(f => f.active && f.waitingForTransport && !f.transportOrdered).length;
        const canReceive = activeFams < state.viewingRooms;

        // Check scheduled events
        checkSchedule();

        // Forced event/paperwork if an hour of dead time passes
        if (activeFams === 0 && waitingFams === 0 && (state.time - state.lastActivityTime) >= 60) {
            state.lastActivityTime = state.time;
            if (!state.activePaperwork && Math.random() > 0.5) {
                // Spawn paperwork
                if (typeof DATA !== 'undefined' && DATA.paperworkTasks) {
                    state.activePaperwork = DATA.paperworkTasks[Math.floor(Math.random() * DATA.paperworkTasks.length)];
                    showToast(`📝 New paperwork at ${getTimeString()}`, '');
                    Notifications.addBadge('reception');
                    Notifications.addBadge('paperwork');
                }
            } else {
                triggerRandomEvent();
            }
        // Random event chance - only after 12:00 PM (2 mins real time) and during dead time
        if (activeFams === 0 && waitingFams === 0 && state.time > 720 && Math.random() < 0.01 * state.speed) {
            triggerRandomEvent();
        }

        // Cafe orders
        if (hasUpgrade('cafeteria') && activeFams > 0 && Math.random() < 0.05 * state.speed) {
            const active = state.families.filter(f => f.active && f.arrived);
            if (active.length > 0 && typeof DATA !== 'undefined' && DATA.cafeOrders) {
                const family = active[Math.floor(Math.random() * active.length)];
                const isAlcohol = Math.random() < 0.2;
                if (isAlcohol) {
                    state.cafeOrders.push({ type: 'alcohol', familyId: family.id, served: false });
                } else {
                    const item = DATA.cafeOrders[Math.floor(Math.random() * DATA.cafeOrders.length)];
                    state.cafeOrders.push({ type: 'food', item, familyId: family.id, served: false });
                }
                Notifications.addBadge('cafeteria');
                state.lastActivityTime = state.time;
            }
        }

        // Auto-cremate if 800C
        if (state.cremaTemp >= 800 && hasUpgrade('crematorium')) {
            const readyForCrema = state.families.find(f => f.active && f.embalmed && f.wantsCremation && !f.cremated && (f.viewed || f.cooldownDone));
            if (readyForCrema && typeof Rooms !== 'undefined' && Rooms.doCremation) {
                Rooms.doCremation(readyForCrema.id);
            }
        }

        // Paperwork task spawn - higher chance during dead time
        if (activeFams === 0 && waitingFams === 0 && !state.activePaperwork && Math.random() < 0.01 * state.speed && typeof DATA !== 'undefined' && DATA.paperworkTasks) {
            state.activePaperwork = DATA.paperworkTasks[Math.floor(Math.random() * DATA.paperworkTasks.length)];
            showToast(`📝 New paperwork at ${getTimeString()}`, '');
            Notifications.addBadge('reception');
            Notifications.addBadge('paperwork');
            state.lastActivityTime = state.time;
        }

        // Hub Badge for Reception
        if (waitingFams > 0 || state.activePaperwork) {
            Notifications.addBadge('reception');
            if (waitingFams > 0) Notifications.addBadge('phone');
        }



        // Prompt for early sleep if all tasks done
        if (!state.dayEndPrompted && state.time >= 1020) { // After 5:00 PM
            const remainingArrivals = state.schedule.filter(s => s.type === 'arrival' && !s.triggered).length;
            if (remainingArrivals === 0 && activeFams === 0 && waitingFams === 0 && !state.activePaperwork) {
                state.dayEndPrompted = true;
                if (typeof Dialogue !== 'undefined') {
                    Dialogue.show('🛌 END OF DAY', "It seems there are no more tasks for today. Do you want to go to sleep?", [
                        { text: "YES, GO TO SLEEP", action: () => endDay() },
                        { text: "NOT YET", action: () => { 
                            showToast("You decided to stay up a bit longer.", "");
                        } }
                    ]);
                }
            }
        }

        // End of day
        if (state.time >= 1320) { // 22:00
            endDay();
        }

        updateHUD();
        if (typeof Rooms !== 'undefined' && Rooms.updateActiveRoom) Rooms.updateActiveRoom();
    }

    function endDay() {
        stopTime();
        state.day++;
        state.time = 480;
        state.cremaTemp = 20;
        state.cremaFuel = 0;
        state.cremaIgnited = false;
        state.schedule = [];
        state.dayEvents = [];
        state.dayEndPrompted = false;
        state.lastActivityTime = 480;
        
        // Daily costs
        const dailyCost = 100 + (state.upgrades.length * 20);
        addMoney(-dailyCost, `Daily expenses (Day ${state.day - 1})`);

        showToast(`🌙 Day ${state.day - 1} ended. A new day dawns at Eternal Rest.`, '');
        
        setTimeout(() => {
            startTime();
            generateDailySchedule();
        }, 1500);
    }

    function checkSchedule() {
        const currentMin = Math.floor(state.time);
        state.schedule.forEach(event => {
            if (!event.triggered && currentMin >= event.time) {
                event.triggered = true;
                Audio8Bit.SFX.notification();
                if (event.type === 'paperwork' && event.task) {
                    state.activePaperwork = event.task;
                    showToast(`📝 New paperwork at ${getTimeString()}`, '');
                    Notifications.addBadge('reception');
                    Notifications.addBadge('paperwork');
                } else if (event.type === 'cooldown_done') {
                    const fam = typeof Families !== 'undefined' ? Families.getById(event.familyId) : null;
                    if (fam) {
                        fam.cooldownDone = true;
                        showToast(`📋 ${event.desc}`, '');
                        if (event.room) Notifications.addBadge(event.room);
                        if (typeof Rooms !== 'undefined') Rooms.checkServiceComplete(fam);
                    }
                } else if (event.type === 'hearse_arrival') {
                    if (typeof Families !== 'undefined') Families.completeFamily(event.familyId);
                } else {
                    showToast(`📋 ${event.desc}`, '');
                    if (event.room) {
                        Notifications.addBadge(event.room);
                        if (event.type === 'arrival') {
                            state.pendingArrivals = (state.pendingArrivals || 0) + 1;
                            if (event.forceCremation) {
                                state.forcedCremation = (state.forcedCremation || 0) + 1;
                            }
                            Notifications.addBadge('arrival');
                            state.lastActivityTime = state.time;
                        }
                    }
                }
            }
        });
    }

    function generateDailySchedule() {
        // Scale arrivals with level and viewing rooms. Max 8 families per day.
        const numArrivals = Math.min(state.viewingRooms + Math.floor(state.level / 2), 8);
        const interval = GAME_MINUTES_PER_DAY / numArrivals;
        
        for (let i = 0; i < numArrivals; i++) {
            // Distribute arrivals evenly across the day with some random jitter
            const jitter = Math.floor(Math.random() * (interval * 0.6));
            const arrivalTime = Math.floor(480 + (i * interval) + 15 + jitter);
            
            state.schedule.push({
                time: arrivalTime,
                type: 'arrival',
                desc: `New family arriving at ${Math.floor(arrivalTime/60)}:${(arrivalTime%60).toString().padStart(2,'0')}`,
                triggered: false,
                room: 'reception'
            });
        }

        // Schedule a paperwork task mid-morning
        const pwTime = 570 + Math.floor(Math.random() * 90); // 9:30-11:00 AM
        const pwTask = DATA.paperworkTasks[Math.floor(Math.random() * DATA.paperworkTasks.length)];
        state.schedule.push({
            time: pwTime,
            type: 'paperwork',
            desc: 'New paperwork on your desk!',
            triggered: false,
            room: null,
            task: pwTask
        });
    }

    // ===== RANDOM EVENTS =====
    function triggerRandomEvent() {
        if (!DATA.randomEvents) return;
        state.lastActivityTime = state.time;
        const event = DATA.randomEvents[Math.floor(Math.random() * DATA.randomEvents.length)];
        if (state.dayEvents.includes(event.type)) return;
        state.dayEvents.push(event.type);
        
        if (event.choices) {
            Dialogue.show('📢 RANDOM EVENT', event.text, event.choices.map(c => ({
                text: c.text,
                action: () => {
                    if (c.rep) addReputation(c.rep, 'Event outcome');
                    if (c.money) addMoney(c.money, 'Event outcome');
                }
            })));
        } else {
            showToast(event.text, '');
            if (event.effect === 'crema_cool') {
                state.cremaTemp = Math.max(20, state.cremaTemp - 200);
            } else if (event.effect === 'supplies') {
                state.supplies.formaldehyde += 5;
                state.supplies.humectant += 4;
                showToast('📦 Supplies restocked!', 'success');
            }
        }
    }

    // ===== UPGRADES =====
    function hasUpgrade(id) { return state.upgrades.includes(id); }
    function buyUpgrade(id) {
        const upg = DATA.upgrades.find(u => u.id === id);
        if (!upg) return false;
        if (upg.repeatable) {
            if (id === 'embalm_train' && state.embalmTrainCount >= (upg.maxRepeats || 5)) {
                showToast('Max training reached!', 'warning');
                return false;
            }
        } else if (hasUpgrade(id)) return false;
        if (state.level < upg.level) { showToast(`Need Level ${upg.level}!`, 'warning'); return false; }
        if (state.money < upg.cost) { showToast('Not enough money!', 'danger'); return false; }
        
        addMoney(-upg.cost, `Purchased: ${upg.name}`);
        if (upg.repeatable) {
            state.embalmTrainCount++;
        } else {
            state.upgrades.push(id);
        }
        
        // Unlock room nav
        if (upg.room) {
            const nav = document.getElementById(`nav-${upg.room}`);
            if (nav) { nav.classList.remove('locked'); const lock = nav.querySelector('.nav-lock'); if (lock) lock.style.display = 'none'; }
        }
        if (id === 'viewing2') state.viewingRooms = 2;
        if (id === 'viewing3') state.viewingRooms = 3;
        if (id === 'crematorium') {
            state.schedule.push({
                time: state.time + 1,
                type: 'arrival',
                desc: 'A family is here for a cremation service.',
                triggered: false,
                room: 'reception',
                forceCremation: true
            });
        }
        
        Audio8Bit.SFX.success();
        return true;
    }

    // ===== DICE =====
    function rollD20(modifier, callback) {
        state.stats.diceRolls++;
        const overlay = document.getElementById('dice-overlay');
        const die = document.getElementById('d20-die');
        const valueEl = document.getElementById('d20-value');
        const resultEl = document.getElementById('dice-result');
        const rollBtn = document.getElementById('btn-dice-roll');
        const closeBtn = document.getElementById('btn-dice-close');

        overlay.style.display = 'flex';
        resultEl.textContent = `Modifier: ${modifier >= 0 ? '+' : ''}${modifier}`;
        resultEl.className = 'dice-result';
        rollBtn.style.display = 'block';
        closeBtn.style.display = 'none';

        const doRoll = () => {
            rollBtn.style.display = 'none';
            die.classList.add('rolling');
            Audio8Bit.SFX.diceRoll();

            let rollCount = 0;
            const rollAnim = setInterval(() => {
                valueEl.textContent = Math.floor(Math.random() * 20) + 1;
                rollCount++;
                if (rollCount > 20) {
                    clearInterval(rollAnim);
                    die.classList.remove('rolling');
                    const roll = Math.floor(Math.random() * 20) + 1;
                    const total = Math.max(1, Math.min(25, roll + modifier));
                    valueEl.textContent = roll;
                    if (roll > state.stats.bestRoll) state.stats.bestRoll = roll;

                    let result, cls;
                    if (roll === 1) { result = '💀 CRITICAL FAIL!'; cls = 'crit-fail'; }
                    else if (total <= 4) { result = '🔥 Catastrophic!'; cls = 'crit-fail'; }
                    else if (total <= 8) { result = '😬 Bad...'; cls = 'bad'; }
                    else if (total <= 12) { result = '😐 Mediocre'; cls = 'bad'; }
                    else if (total <= 16) { result = '👍 Good!'; cls = 'good'; }
                    else if (total <= 19) { result = '✨ Great!'; cls = 'good'; }
                    else { result = '💀✨ CRITICAL SUCCESS!'; cls = 'crit-success'; }

                    resultEl.textContent = `Rolled ${roll}${modifier ? ` + ${modifier}` : ''} = ${total} — ${result}`;
                    resultEl.className = `dice-result ${cls}`;
                    Audio8Bit.SFX.diceResult(total > 12);
                    closeBtn.style.display = 'block';
                    closeBtn.onclick = () => {
                        overlay.style.display = 'none';
                        if (callback) callback(roll, total, result);
                    };
                }
            }, 60);
        };
        rollBtn.onclick = doRoll;
    }

    // ===== NOTIFICATIONS =====
    const Notifications = {
        addBadge(room) {
            const badge = document.getElementById(`badge-${room}`);
            if (badge && badge.style.display !== 'flex') {
                badge.style.display = 'flex';
                Audio8Bit.SFX.notification();
            }
        },
        clearBadge(room) {
            const badge = document.getElementById(`badge-${room}`);
            if (badge) badge.style.display = 'none';
        }
    };

    // ===== TOAST =====
    function showToast(msg, type) {
        const container = document.getElementById('toast-container');
        const toast = document.createElement('div');
        toast.className = `toast ${type || ''}`;
        
        const textSpan = document.createElement('span');
        textSpan.innerHTML = msg; // allow icons
        
        const closeBtn = document.createElement('button');
        closeBtn.className = 'toast-close';
        closeBtn.innerHTML = '✖';
        closeBtn.onclick = () => dismissToast(toast);
        
        toast.appendChild(textSpan);
        toast.appendChild(closeBtn);
        container.appendChild(toast);
        
        const timer = setTimeout(() => dismissToast(toast), 5000);
        toast.dataset.timer = timer;
    }

    function dismissToast(toast) {
        if (!toast || toast.classList.contains('dismissing')) return;
        toast.classList.add('dismissing');
        clearTimeout(toast.dataset.timer);
        toast.style.animation = 'toast-out 0.3s ease-in forwards';
        setTimeout(() => toast.remove(), 300);
    }

    // ===== HUD UPDATE =====
    function updateHUD() {
        const s = state;
        // Main hub
        const setText = (id, val) => { const el = document.getElementById(id); if (el) el.textContent = val; };
        setText('hud-day', s.day);
        setText('hud-time', getTimeString());
        setText('hud-families', s.families.filter(f => f.active).length);
        setText('hud-money', s.money);
        setText('hud-rep', s.reputation);
        const repFill = document.getElementById('hud-rep-fill');
        if (repFill) repFill.style.width = s.reputation + '%';

        // Room status bars
        document.querySelectorAll('.rs-day').forEach(el => el.textContent = s.day);
        document.querySelectorAll('.rs-time').forEach(el => el.textContent = getTimeString());
        document.querySelectorAll('.rs-money').forEach(el => el.textContent = s.money);

        // Crema nav bar
        const cremaBar = document.getElementById('nav-crema-temp-bar');
        if (cremaBar) {
            if (hasUpgrade('crematorium')) {
                cremaBar.style.display = 'flex';
                const fill = document.getElementById('nav-crema-temp-fill');
                const perc = Math.max(0, Math.min(100, (s.cremaTemp - 20) / (1100 - 20) * 100));
                fill.style.height = perc + '%';
                if (perc > 80) fill.style.background = 'var(--danger)';
                else if (perc > 40) fill.style.background = '#ff8800';
                else fill.style.background = '#ffcc00';
            } else {
                cremaBar.style.display = 'none';
            }
        }
    }

    function animateHUD(id, cls) {
        const el = document.getElementById(id);
        if (!el) return;
        el.classList.add(cls);
        setTimeout(() => el.classList.remove(cls), 500);
    }

    // ===== GAME OVER =====
    function checkGameOver() {
        if (state.gameOver) return;
        if (state.money <= 0) {
            state.gameOver = true;
            stopTime();
            const quote = DATA.gameOverMoney[Math.floor(Math.random() * DATA.gameOverMoney.length)];
            showGameOver('BANKRUPT', 'You ran out of money. Even death costs money, apparently.', quote);
        } else if (state.reputation <= 0) {
            state.gameOver = true;
            stopTime();
            const quote = DATA.gameOverRep[Math.floor(Math.random() * DATA.gameOverRep.length)];
            showGameOver('DISGRACED', 'Your reputation hit rock bottom. Nobody trusts you with their dead.', quote);
        } else if (state.money <= 500) {
            showToast('⚠️ WARNING: Money running low! ($' + state.money + ')', 'danger');
        } else if (state.reputation <= 15) {
            showToast('⚠️ WARNING: Reputation dangerously low!', 'danger');
        }
    }

    function showGameOver(title, reason, quote) {
        Audio8Bit.stopMusic();
        Audio8Bit.SFX.gameOver();
        document.getElementById('gameover-title').textContent = title;
        document.getElementById('gameover-reason').textContent = reason;
        document.getElementById('gameover-quote').textContent = quote;
        document.getElementById('gameover-stats').innerHTML = `
            Days survived: ${state.day}<br>
            Families served: ${state.stats.familiesServed}<br>
            Total earnings: $${state.stats.totalEarnings}<br>
            Best dice roll: ${state.stats.bestRoll}<br>
            Level reached: ${state.level}
        `;
        Main.showScreen('gameover');
    }

    // ===== SAVE / LOAD =====
    function save() {
        try { localStorage.setItem('thanatopractor_save', JSON.stringify(state)); } catch(e) {}
    }
    function load() {
        try {
            const data = localStorage.getItem('thanatopractor_save');
            if (data) { state = { ...defaultState(), ...JSON.parse(data) }; return true; }
        } catch(e) {}
        return false;
    }
    function hasSave() {
        return !!localStorage.getItem('thanatopractor_save');
    }
    function resetState() { state = defaultState(); }

    return {
        getState, getTimeString, getLevel, getRepStars,
        addMoney, addReputation, addXP,
        startTime, stopTime, setSpeed, tick,
        generateDailySchedule, hasUpgrade, buyUpgrade,
        rollD20, Notifications, showToast, updateHUD,
        save, load, hasSave, resetState,
        checkGameOver, defaultState
    };
})();
