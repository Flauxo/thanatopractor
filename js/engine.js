/* ===== THANATOPRACTOR - Core Engine ===== */
const Engine = (() => {
    // ===== GAME STATE =====
    const defaultState = () => ({
        playerName: '',
        day: 1,
        time: 480, // minutes from midnight (8:00 = 480)
        money: 50000,
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
        alcoholServedToday: 0,
        viewingRooms: 1,
        speed: 1, // 0=pause, 1=normal, 2=fast
        gameOver: false,
        activePaperwork: null,
        pendingArrivals: 0,
        dayEndPrompted: false,
        lastActivityTime: 480,
        lastRandomEventTime: 0,
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
            showToast(I18n.T('eng.level_up', newLevel), 'success');
            addMoney(10000, I18n.T('eng.level_bonus'));
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
        if (typeof window.Main !== 'undefined' && window.Main.currentScreen === 'title') return;
        const advance = MINUTES_PER_TICK * state.speed;
        state.time += advance;

        // Crematorium temperature logic
        if (state.cremaIgnited && state.cremaFuel > 0) {
            state.cremaTemp = Math.min(1100, state.cremaTemp + 4 * state.speed);
            state.cremaFuel = Math.max(0, state.cremaFuel - 0.02 * state.speed);
            if (state.cremaFuel <= 0) {
                state.cremaIgnited = false;
                showToast(I18n.T('crema.fuel_depleted'), 'warning');
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

        // Forced event if two hours of dead time passes
        if (activeFams === 0 && waitingFams === 0 && (state.time - state.lastActivityTime) >= 120 && (state.time - state.lastRandomEventTime) >= 60) {
            state.lastActivityTime = state.time;
            triggerRandomEvent();
        }
        // Random event chance - during dead time (approx 1 every 2 hours)
        if (activeFams === 0 && waitingFams === 0 && (state.time - state.lastRandomEventTime) >= 60 && Math.random() < 0.008 * state.speed) {
            triggerRandomEvent();
        }

        // Cafe orders
        const pendingCafe = state.cafeOrders.filter(o => !o.served).length;
        if (hasUpgrade('cafeteria') && activeFams > 0 && pendingCafe < 3 && Math.random() < 0.05 * state.speed) {
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

        // Hub Badge for Reception
        if (waitingFams > 0 || state.activePaperwork) {
            Notifications.addBadge('reception', true);
            if (waitingFams > 0) Notifications.addBadge('phone', true);
        }



        // Prompt for early sleep if all tasks done
        if (!state.dayEndPrompted && state.time >= 1020) { // After 5:00 PM
            const remainingArrivals = state.schedule.filter(s => s.type === 'arrival' && !s.triggered).length;
            if (remainingArrivals === 0 && activeFams === 0 && waitingFams === 0 && !state.activePaperwork) {
                state.dayEndPrompted = true;
                if (typeof Dialogue !== 'undefined') {
                    Dialogue.show(I18n.T('eng.end_title'), I18n.T('eng.end_text'), [
                        { text: I18n.T('eng.end_yes'), action: () => endDay() },
                        { text: I18n.T('eng.end_no'), action: () => { 
                            showToast(I18n.T('eng.end_stay'), "");
                        } }
                    ]);
                }
            }
        }

        // End of day
        if (state.time >= 1200) { // 20:00
            endDay();
        }

        updateHUD();
        if (typeof Rooms !== 'undefined' && Rooms.updateActiveRoom) Rooms.updateActiveRoom();
        
        // Refresh Hub/Reception schedules if active
        if (typeof Main !== 'undefined' && Main.currentScreen === 'hub') {
            if (typeof Main.updateHubSchedule === 'function') Main.updateHubSchedule();
        } else if (typeof Rooms !== 'undefined' && Rooms.activeRoom === 'reception') {
            if (typeof Rooms.showReception === 'function') Rooms.showReception();
        }
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
        state.alcoholServedToday = 0;
        
        // Daily costs
        const dailyCost = 100 + (state.upgrades.length * 20);
        addMoney(-dailyCost, I18n.T('eng.daily_expenses', state.day - 1));

        // Transition Overlay
        const overlay = document.getElementById('day-transition-overlay');
        const text = document.getElementById('day-text');
        if (overlay && text) {
            text.textContent = `${I18n.T('hub.day')} ${state.day}`;
            overlay.style.display = 'flex';
            
            // Reset animation
            text.style.animation = 'none';
            text.offsetHeight; // trigger reflow
            text.style.animation = null;

            setTimeout(() => {
                overlay.style.display = 'none';
                if (typeof Main !== 'undefined') Main.showScreen('hub');
                generateDailySchedule();
                startTime();
            }, 3000);
        } else {
            if (typeof Main !== 'undefined') Main.showScreen('hub');
            generateDailySchedule();
            startTime();
        }
    }

    function checkSchedule() {
        const currentMin = Math.floor(state.time);
        state.schedule.forEach(event => {
            if (!event.triggered && currentMin >= event.time) {
                event.triggered = true;
                Audio8Bit.SFX.notification();
                if (event.type === 'paperwork' && event.task) {
                    state.activePaperwork = event.task;
                    showToast(I18n.T('eng.new_pw', getTimeString()), '');
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
                } else if (event.type === 'supplies_delivery') {
                    Object.keys(event.supplies).forEach(k => { state.supplies[k] += event.supplies[k]; });
                    showToast(typeof I18n !== 'undefined' ? I18n.T('ov.shop_delivered') : '📦 Supplies delivered!', 'success');
                    if (typeof window.Rooms !== 'undefined' && window.Rooms.getActiveRoom() === 'embalming') {
                        window.Rooms.showEmbalming();
                    }
                } else if (event.type === 'hearse_arrival') {
                    if (typeof Families !== 'undefined') Families.completeFamily(event.familyId);
                } else if (event.type === 'cremation_done') {
                    const fam = typeof Families !== 'undefined' ? Families.getById(event.familyId) : null;
                    if (fam) {
                        fam.cremated = true;
                        fam.services.push('cremation');
                        let msg, satChange;
                        const temp = event.temp || 800;
                        if (temp >= 780 && temp <= 850) {
                            msg = I18n.T('crema.perfect_msg', fam.deceasedName);
                            satChange = 15;
                        } else if (temp >= 700) {
                            msg = I18n.T('crema.decent_msg', fam.deceasedName);
                            satChange = 5;
                        } else {
                            msg = I18n.T('crema.bad_msg', fam.deceasedName);
                            satChange = -20;
                        }
                        Families.updateSatisfaction(fam.id, satChange, `Cremation at ${Math.round(temp)}°C`);
                        showToast(msg, satChange > 0 ? 'success' : 'danger');
                        if (typeof Rooms !== 'undefined') Rooms.checkServiceComplete(fam);
                    }
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
        // Scale arrivals more aggressively with viewing rooms. Max 8 families per day.
        const numArrivals = Math.min(state.viewingRooms * 2 + Math.floor(state.level / 3), 8);
        const interval = GAME_MINUTES_PER_DAY / numArrivals;
        
        for (let i = 0; i < numArrivals; i++) {
            // Distribute arrivals evenly across the day with some random jitter
            const jitter = Math.floor(Math.random() * (interval * 0.6));
            const arrivalTime = Math.floor(480 + (i * interval) + 15 + jitter);
            
            state.schedule.push({
                time: arrivalTime,
                type: 'arrival',
                desc: I18n.T('eng.arrival_desc', `${Math.floor(arrivalTime/60)}:${(arrivalTime%60).toString().padStart(2,'0')}`),
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
            desc: I18n.T('eng.pw_desk'),
            triggered: false,
            room: null,
            task: pwTask
        });
    }

    // ===== RANDOM EVENTS =====
    function triggerRandomEvent() {
        state.lastRandomEventTime = state.time;
        if (!DATA.randomEvents) return;
        state.lastActivityTime = state.time;
        const event = DATA.randomEvents[Math.floor(Math.random() * DATA.randomEvents.length)];
        if (state.dayEvents.includes(event.type)) return;
        state.dayEvents.push(event.type);
        
        if (event.choices) {
            Dialogue.show(I18n.T('dlg.random_event'), event.text, event.choices.map(c => ({
                text: c.text,
                action: () => {
                    if (c.rep) addReputation(c.rep, c.text);
                    if (c.money) addMoney(c.money, c.text);
                }
            })));
        } else {
            showToast(event.text, '');
            if (event.effect === 'crema_cool') {
                state.cremaTemp = Math.max(20, state.cremaTemp - 200);
            } else if (event.effect === 'supplies') {
                state.supplies.formaldehyde += 5;
                state.supplies.humectant += 4;
                showToast(I18n.T('shop.delivered'), 'success');
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
                showToast(I18n.T('eng.max_training'), 'warning');
                return false;
            }
        } else if (hasUpgrade(id)) return false;
        if (state.level < upg.level) { showToast(I18n.T('eng.need_level', upg.level), 'warning'); return false; }
        if (state.money < upg.cost) { showToast(I18n.T('eng.not_enough'), 'danger'); return false; }
        
        addMoney(-upg.cost, `${I18n.T('office.title')}: ${upg.name}`);
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
                time: Math.round(state.time) + 1,
                type: 'arrival',
                desc: I18n.T('eng.cremation_family'),
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
        resultEl.textContent = I18n.T('dice.modifier', modifier >= 0 ? '+' + modifier : modifier);
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
                    if (roll === 1) { result = I18n.T('dice.crit_fail'); cls = 'crit-fail'; }
                    else if (total <= 4) { result = I18n.T('dice.catastrophic'); cls = 'crit-fail'; }
                    else if (total <= 8) { result = I18n.T('dice.bad'); cls = 'bad'; }
                    else if (total <= 12) { result = I18n.T('dice.mediocre'); cls = 'bad'; }
                    else if (total <= 16) { result = I18n.T('dice.good'); cls = 'good'; }
                    else if (total <= 19) { result = I18n.T('dice.great'); cls = 'good'; }
                    else { result = I18n.T('dice.crit_success'); cls = 'crit-success'; }

                    resultEl.textContent = I18n.T('dice.result', roll + (modifier ? (modifier > 0 ? ' + ' + modifier : ' ' + modifier) : ''), total, result);
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
        addBadge(room, silent = false) {
            const badge = document.getElementById(`badge-${room}`);
            if (badge && badge.style.display !== 'flex') {
                badge.style.display = 'flex';
                if (!silent) Audio8Bit.SFX.notification();
            }
            if (['arrival', 'phone', 'paperwork'].includes(room)) {
                this.addBadge('reception', true);
            }
        },
        clearBadge(room) {
            const badge = document.getElementById(`badge-${room}`);
            if (badge) badge.style.display = 'none';
            if (['arrival', 'phone', 'paperwork'].includes(room)) {
                this.updateReceptionBadge();
            }
        },
        updateReceptionBadge() {
            const arrival = document.getElementById('badge-arrival');
            const phone = document.getElementById('badge-phone');
            const paperwork = document.getElementById('badge-paperwork');
            
            const anyActive = (arrival && arrival.style.display === 'flex') ||
                              (phone && phone.style.display === 'flex') ||
                              (paperwork && paperwork.style.display === 'flex');
            
            const mainBadge = document.getElementById('badge-reception');
            if (mainBadge) {
                mainBadge.style.display = anyActive ? 'flex' : 'none';
            }
        }
    };

    // ===== TOAST =====
    function showToast(msg, type) {
        const container = document.getElementById('toast-container');
        if (!container) return;

        // Prevent stacking of identical toasts
        const existing = Array.from(container.children).find(t => t.querySelector('span')?.innerHTML === msg);
        if (existing) {
            existing.remove();
        }

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
        I18n.applyToDOM();
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
            showGameOver(I18n.T('go.bankrupt_title'), I18n.T('go.bankrupt_reason'), quote);
        } else if (state.reputation <= 0) {
            state.gameOver = true;
            stopTime();
            const quote = DATA.gameOverRep[Math.floor(Math.random() * DATA.gameOverRep.length)];
            showGameOver(I18n.T('go.disgraced_title'), I18n.T('go.disgraced_reason'), quote);
        } else if (state.money <= 500) {
            showToast(I18n.T('go.money_warning', state.money), 'danger');
        } else if (state.reputation <= 15) {
            showToast(I18n.T('go.rep_warning'), 'danger');
        }
    }

    function showGameOver(title, reason, quote) {
        Audio8Bit.stopMusic();
        Audio8Bit.SFX.gameOver();
        document.getElementById('gameover-title').textContent = title;
        document.getElementById('gameover-reason').textContent = reason;
        document.getElementById('gameover-quote').textContent = quote;
        document.getElementById('gameover-stats').innerHTML = `
            ${I18n.T('go.days')} ${state.day}<br>
            ${I18n.T('go.served')} ${state.stats.familiesServed}<br>
            ${I18n.T('go.earnings')} $${state.stats.totalEarnings}<br>
            ${I18n.T('go.best_roll')} ${state.stats.bestRoll}<br>
            ${I18n.T('go.level')} ${state.level}
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
