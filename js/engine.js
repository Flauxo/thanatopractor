/* ===== THANATOPRACTOR - Core Engine ===== */
const Engine = (() => {
    // ===== GAME STATE =====
    const defaultState = () => ({
        playerName: '',
        day: 1,
        time: 480, // minutes from midnight (8:00 = 480)
        money: 2000,
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
        dayEndTriggered: false,
        alert18Shown: false,
        lastActivityTime: 480,
        lastRandomEventTime: 0,
        chapelTutorialShown: false,
        cremaTutorialShown: false,
        embalmTutorialShown: false,
        viewingTutorialShown: false,
        cremaBroken: false,
        cremaRepairing: false,
        cremaRepairFinishTime: 0,
        moneyWarningShown: false,
        repWarningShown: false,
        stats: { familiesServed: 0, totalEarnings: 0, diceRolls: 0, bestRoll: 0, worstDay: null, bribesAccepted: 0, perfectCremations: 0, consecutivePaperwork: 0 },
        realPlayTimeMS: 0,
        foundItems: [],
        unlockedAchievements: []
    });

    let state = defaultState();
    let tickInterval = null;
    const REAL_DAY_MS = 7 * 60 * 1000; // 7 minutes real = 1 game day
    const GAME_MINUTES_PER_DAY = 840; // 8:00 to 22:00 = 840 min
    const TICK_MS = 500; // tick every 500ms
    const MINUTES_PER_TICK = GAME_MINUTES_PER_DAY / (REAL_DAY_MS / TICK_MS); // ~1 min game per tick

    // ===== GETTERS =====
    function getState() { return state; }
    function getTimeString(t = state.time) {
        const h = Math.floor(t / 60);
        const m = Math.floor(t % 60);
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
        if (state.money >= 20000) Notifications.unlockAchievement('rich_undertaker');
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
        if (state.reputation >= 100) Notifications.unlockAchievement('reputable');
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
            showLevelUpModal(newLevel);
            addMoney(newLevel * 1000, I18n.T('eng.level_bonus'), true);
            if (typeof Audio8Bit !== 'undefined' && Audio8Bit.SFX.levelUp) {
                Audio8Bit.SFX.levelUp();
            }
        }
    }

    function showLevelUpModal(level) {
        const overlay = document.getElementById('levelup-overlay');
        const levelText = document.getElementById('lvl-up-num');
        const quoteText = document.getElementById('lvl-up-quote');
        const dismissBtn = document.getElementById('btn-lvl-up-dismiss');

        if (!overlay) return;

        if (levelText) levelText.textContent = `LEVEL ${level}`;
        
        const rewardText = document.getElementById('lvl-up-reward');
        if (rewardText) rewardText.textContent = `+$${level * 1000}`;
        // Random motivational phrase
        const phrases = DATA.levelUpPhrases || [];
        if (phrases.length > 0 && quoteText) {
            quoteText.textContent = `"${phrases[Math.floor(Math.random() * phrases.length)]}"`;
        }

        overlay.style.display = 'flex';
        stopTime(); 

        dismissBtn.onclick = () => {
            overlay.style.display = 'none';
            // Small delay to ensure isOverlayOpen sees the change
            setTimeout(() => {
                startTime();
            }, 50);
        };
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
        if (s === 0) state.speed = 0;
        else if (s === 1) state.speed = 1; // Normal is 1x
        else if (s === 2) state.speed = 3; // Fast is 3x
        
        document.querySelectorAll('.time-btn').forEach(b => b.classList.remove('active'));
        if (s === 0) document.getElementById('btn-pause').classList.add('active');
        else if (s === 1) document.getElementById('btn-play').classList.add('active');
        else document.getElementById('btn-fast').classList.add('active');
        
        if (typeof Audio8Bit !== 'undefined') Audio8Bit.updateSpeed();
        
        if (s > 0) startTime();
    }

    function tick() {
        if (state.speed === 0 || state.gameOver) return;
        
        // Skip tick if an overlay is open (game is "paused" visually but clock is running)
        if (typeof Main !== 'undefined' && Main.isOverlayOpen()) return;
        if (typeof window.Main !== 'undefined' && window.Main.currentScreen === 'title') { console.log('[TICK] blocked: title screen'); return; }
        
        state.realPlayTimeMS += TICK_MS;
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

        // Monitor active cremations
        state.families.forEach(f => {
            if (f.active && f.cremationStarted && !f.cremated) {
                if (!state.cremaIgnited || state.cremaTemp < 700) {
                    f.cremationTempFailure = true;
                }
            }
        });

        // Room Badges and Reception Action Alerts
        const activeFams = state.families.filter(f => f.active).length;
        const waitingFams = state.families.filter(f => f.active && f.waitingForTransport && !f.transportOrdered).length;
        const canReceive = activeFams < state.viewingRooms;

        // Check scheduled events
        checkSchedule();

        // Random event chance
        const currentLevel = getLevel();
        const isAdvanced = currentLevel >= 3;
        const prob = (isAdvanced ? 0.02 : 0.015) * state.speed;
        const cooldown = 45;
        const boredTimeout = 60; // Max 1 hour of doing nothing
        
        // Random event chance
        const isIdle = activeFams === 0 && waitingFams === 0;
        const canTrigger = isIdle || (isAdvanced && Math.random() < 0.25); // 25% chance to allow even if busy starting Level 3
        const gracePeriodOver = state.realPlayTimeMS >= 60000; // 1 minute grace period

        if (gracePeriodOver && canTrigger && (state.time - state.lastRandomEventTime) >= cooldown && Math.random() < prob) {
            triggerRandomEvent();
        }

        // Forced event if long dead time passes
        if (gracePeriodOver && activeFams === 0 && waitingFams === 0 && (state.time - state.lastActivityTime) >= boredTimeout && (state.time - state.lastRandomEventTime) >= cooldown) {
            state.lastActivityTime = state.time;
            triggerRandomEvent();
        }

        // Bad Luck event chance (Level 3+)
        if (gracePeriodOver && currentLevel >= 3 && (state.time - state.lastRandomEventTime) >= cooldown && Math.random() < 0.015 * state.speed) {
            triggerBadLuckEvent();
        }

        // Cafe orders
        const pendingCafe = state.cafeOrders.filter(o => !o.served).length;
        if (hasUpgrade('cafeteria') && activeFams > 0 && pendingCafe < 2 && Math.random() < 0.03 * state.speed) {
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
            // Persistent Phone/Hearse badge if transport is needed
            if (waitingFams > 0) {
                Notifications.addBadge('phone', true);
            }
        }



        // Daily 18:00h alert
        const currentTotalMinutes = Math.floor(state.time);
        if (currentTotalMinutes === 1080 && !state.alert18Shown) {
            state.alert18Shown = true;
            if (typeof Dialogue !== 'undefined') {
                Dialogue.show(
                    I18n.T('eng.alert_18_title'), 
                    I18n.T('eng.alert_18_msg'),
                    [{ text: I18n.T('eng.ok') }],
                    null,
                    { showReaper: true }
                );
            }
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
                    ], null, { showReaper: true });
                }
            }
        }

        // End of day
        if (state.time >= 1200 && !state.dayEndTriggered) { // 20:00
            state.dayEndTriggered = true;
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

    async function endDay() {
        console.log('[ENDDAY] called. dayEndTriggered='+state.dayEndTriggered+' tickInterval='+(tickInterval!==null));
        if (state.dayEndTriggered && tickInterval === null) { console.log('[ENDDAY] aborted - already ending'); return; }
        state.dayEndTriggered = true;
        stopTime();

        // Force-close any open overlays that could block the transition
        ['dialogue-overlay', 'dice-overlay', 'completion-overlay', 'supplies-overlay', 'credits-overlay', 'levelup-overlay'].forEach(id => {
            const el = document.getElementById(id);
            if (el) el.style.display = 'none';
        });

        // Music fade out 1s before transition
        if (typeof Audio8Bit !== 'undefined') Audio8Bit.fadeOut(1.0);
        await new Promise(r => setTimeout(r, 1000));

        // Disposal logic: bodies left in crematorium (not finished) disappear
        const discarded = state.families.filter(f => f.active && f.wantsCremation && !f.cremated);
        if (discarded.length > 0) {
            discarded.forEach(f => {
                f.active = false;
                f.discardedOvernight = true;
            });
            Engine.showToast(I18n.T('crema.disposal_warning'), 'danger');
        }
        nextDay();
    }

    function nextDay() {
        console.log('[NEXTDAY] starting transition to day ' + (state.day+1));
        state.day++;
        if (state.day >= 7) Notifications.unlockAchievement('daily_grind');
        state.time = 480;
        setSpeed(1);
        state.cremaTemp = 20;
        state.cremaFuel = 0;
        state.cremaIgnited = false;
        state.schedule = [];
        state.dayEvents = [];
        state.dayEndPrompted = false;
        state.dayEndTriggered = false;
        state.alert18Shown = false;
        state.lastActivityTime = 480;
        state.lastRandomEventTime = 480;
        state.alcoholServedToday = 0;
        state.pendingArrivals = 0;
        state.activePaperwork = null;
        state.cafeOrders = [];
        
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
                try {
                    overlay.style.display = 'none';
                    // Force-close any lingering overlays
                    ['dialogue-overlay', 'dice-overlay', 'completion-overlay', 'supplies-overlay', 'levelup-overlay'].forEach(id => {
                        const el = document.getElementById(id);
                        if (el) el.style.display = 'none';
                    });
                    
                    // Generate schedule
                    console.log('[NEXTDAY] Generating schedule...');
                    generateDailySchedule();
                    console.log('[NEXTDAY] Schedule generated: ' + state.schedule.length + ' items');
                    
                    // Navigate to hub
                    if (typeof Main !== 'undefined') Main.showScreen('hub');
                    
                    if (typeof Audio8Bit !== 'undefined') Audio8Bit.fadeIn(1.5);
                } catch(e) {
                    console.error('[NEXTDAY] Error during day setup:', e);
                } finally {
                    // ALWAYS start the clock, even if something above failed
                    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
                    const hubScreen = document.getElementById('hub-screen');
                    if (hubScreen) hubScreen.classList.add('active');
                    
                    stopTime();
                    tickInterval = null;
                    startTime();
                    setSpeed(1);
                    console.log('[NEXTDAY] Clock started. tickInterval=' + (tickInterval !== null) + ' speed=' + state.speed + ' schedule=' + state.schedule.length);
                    if (state.foundItems && state.foundItems.length >= 5) Notifications.unlockAchievement('collector');
                    save();
                }
            }, 3000);
        } else {
            generateDailySchedule();
            try {
                if (typeof Main !== 'undefined') Main.showScreen('hub');
            } catch(e) { console.error('showScreen error:', e); }
            document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
            const hubScreen = document.getElementById('hub-screen');
            if (hubScreen) hubScreen.classList.add('active');
            stopTime();
            startTime();
            setSpeed(1);
            if (typeof Audio8Bit !== 'undefined') Audio8Bit.fadeIn(1.0);
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
                    event.completed = true;
                    showToast(`📋 ${event.desc}`, 'success');
                    if (typeof Families !== 'undefined') Families.completeFamily(event.familyId);
                } else if (event.type === 'repair_done') {
                    state.cremaRepairing = false;
                    state.cremaBroken = false;
                    showToast(I18n.T('crema.repaired_toast'), 'success');
                    updateHUD();
                } else if (event.type === 'cremation_done') {
                    const fam = typeof Families !== 'undefined' ? Families.getById(event.familyId) : null;
                    if (fam) {
                        fam.cremated = true;
                        fam.services.push('cremation');
                        let msg, satChange;
                        
                        if (fam.cremationTempFailure) {
                            msg = I18n.T('crema.bad_msg', fam.deceasedName);
                            satChange = -25;
                        } else {
                            msg = I18n.T('crema.perfect_msg', fam.deceasedName);
                            satChange = 15;

                            // Achievement: Crema Pro
                            state.perfectCremations = (state.perfectCremations || 0) + 1;
                            if (state.perfectCremations >= 5) Notifications.unlockAchievement('crema_pro');
                        }

                        showToast(msg, fam.cremationTempFailure ? 'danger' : 'success');
                        if (typeof Families !== 'undefined') Families.updateSatisfaction(fam.id, satChange, 'Cremation quality');
                        if (typeof Rooms !== 'undefined') Rooms.checkServiceComplete(fam);
                        rollCollectionDiscovery();

                        // Breakdown chance: 20%
                        if (Math.random() < 0.20) {
                            state.cremaBroken = true;
                            showToast(I18n.T('crema.broken_toast'), 'danger');
                            Audio8Bit.SFX.error();
                            updateHUD();
                        }
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
        const windowSize = 600; // 8:00 AM to 6:00 PM (18:00)
        const interval = windowSize / numArrivals;
        
        for (let i = 0; i < numArrivals; i++) {
            // First appointment must be no later than 9:20 AM (80 mins after 8:00 AM)
            let jitter;
            if (i === 0) {
                jitter = Math.floor(Math.random() * Math.min(80, interval * 0.5));
            } else {
                jitter = Math.floor(Math.random() * (interval * 0.5));
            }
            const arrivalTime = Math.floor(480 + (i * interval) + jitter);
            
            state.schedule.push({
                time: arrivalTime,
                type: 'arrival',
                desc: I18n.T('eng.arrival_desc', getTimeString(arrivalTime)),
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
            desc: I18n.T('eng.new_pw', getTimeString(pwTime)),
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
            })), null, { showReaper: true });
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

    function triggerBadLuckEvent() {
        state.lastRandomEventTime = state.time; // Share cooldown with random events
        if (!DATA.badLuckEvents) return;
        const event = DATA.badLuckEvents[Math.floor(Math.random() * DATA.badLuckEvents.length)];
        
        if (typeof Dialogue !== 'undefined') {
            Dialogue.show(I18n.T('dlg.bad_luck'), I18n.T(event.textKey), [{
                text: "OK",
                action: () => {
                    if (event.rep) addReputation(event.rep, I18n.T('dlg.bad_luck'));
                    if (event.money) addMoney(event.money, I18n.T('dlg.bad_luck'));
                }
            }], null, { showReaper: true });
        }
        if (typeof Audio8Bit !== 'undefined') Audio8Bit.SFX.fail();
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

                    if (roll === 20) Notifications.unlockAchievement('nat_20');
                    if (roll === 1) Notifications.unlockAchievement('nat_1');

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
        unlockAchievement(id) {
            if (!state.unlockedAchievements) state.unlockedAchievements = [];
            if (state.unlockedAchievements.includes(id)) return;
            
            const ach = DATA.achievements.find(a => a.id === id);
            if (!ach) return;

            state.unlockedAchievements.push(id);
            save();

            // Show notification dot in Hub
            const dot = document.getElementById('ach-notification');
            if (dot) dot.style.display = 'block';

            // Special Achievement Modal/Toast
            const container = document.body;
            if (container) {
                // Pause game
                stopTime();

                // Create backdrop to block other windows and darken screen
                const backdrop = document.createElement('div');
                backdrop.className = 'achievement-backdrop';
                backdrop.id = 'achievement-backdrop-' + Date.now();
                
                const toast = document.createElement('div');
                toast.className = 'toast achievement-toast achievement-modal';
                
                const title = I18n.T(`ach.${ach.id}.title`) || ach.title;
                const labelText = I18n.T('ach.unlocked_label') || "ACHIEVEMENT UNLOCKED!";

                toast.innerHTML = `
                    <button class="ach-close-btn">&times;</button>
                    <div class="ach-icon">
                        <span class="custom-icon" data-icon="${ach.icon}" style="width:48px;height:48px"></span>
                    </div>
                    <div class="ach-info">
                        <div class="ach-label">${labelText}</div>
                        <div class="ach-title">${title}</div>
                    </div>
                `;
                backdrop.appendChild(toast);
                container.appendChild(backdrop);
                
                if (typeof Icons !== 'undefined') Icons.refresh();
                
                // Play victory sound
                if (window.Audio8Bit && Audio8Bit.SFX.victory) {
                    Audio8Bit.SFX.victory();
                }

                const dismiss = () => {
                    if (backdrop.classList.contains('dismissing')) return;
                    backdrop.classList.add('dismissing');
                    setTimeout(() => {
                        backdrop.remove();
                        // Resume game if no other achievement modals are left AND no other overlay is open AND game was running
                        if (!document.querySelector('.achievement-backdrop')) {
                            if (state.speed > 0 && typeof window.Main !== 'undefined' && !window.Main.isOverlayOpen()) {
                                startTime();
                            }
                        }
                    }, 500);
                };

                // Close on button click
                toast.querySelector('.ach-close-btn').onclick = (e) => {
                    e.stopPropagation();
                    dismiss();
                };

                // Auto-dismiss after 3 seconds
                setTimeout(dismiss, 3000);
            }
        },
        updateReceptionBadge() {
            const badgeArrival = document.getElementById('badge-arrival');
            const badgePhone = document.getElementById('badge-phone');
            const badgePaperwork = document.getElementById('badge-paperwork');
            const mainBadge = document.getElementById('badge-reception');

            // Sub-badge: Arrival (based on pendingArrivals)
            if (badgeArrival) {
                const hasArrivals = (state.pendingArrivals || 0) > 0;
                badgeArrival.style.display = hasArrivals ? 'flex' : 'none';
            }

            // Sub-badge: Paperwork (based on activePaperwork)
            if (badgePaperwork) {
                const hasPaperwork = state.activePaperwork !== null;
                badgePaperwork.style.display = hasPaperwork ? 'flex' : 'none';
            }

            // Sub-badge: Phone (based on families waiting for transport)
            const familyWaiting = state.families.some(f => f.active && f.waitingForTransport && !f.transportOrdered);
            if (badgePhone) {
                badgePhone.style.display = familyWaiting ? 'flex' : 'none';
            }

            // Main Badge: Reception
            const anyActive = (badgeArrival && badgeArrival.style.display === 'flex') ||
                              (badgePhone && badgePhone.style.display === 'flex') ||
                              (badgePaperwork && badgePaperwork.style.display === 'flex');
            
            if (mainBadge) {
                mainBadge.style.display = anyActive ? 'flex' : 'none';
            }
        }
    };

    // ===== TOAST =====
    function showToast(msg, type) {
        const container = document.getElementById('toast-container');
        if (!container) return;

        // Limit to 3 active toasts (excluding those already dismissing)
        const activeToasts = Array.from(container.children).filter(t => !t.classList.contains('dismissing'));
        if (activeToasts.length >= 3) {
            dismissToast(activeToasts[0]);
        }

        // Prevent stacking of identical toasts
        const existing = activeToasts.find(t => t.querySelector('span')?.innerHTML === msg);
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
        setText('hud-level', s.level);
        const repFill = document.getElementById('hud-rep-fill');
        if (repFill) repFill.style.width = s.reputation + '%';

        // Room status bars
        document.querySelectorAll('.rs-day').forEach(el => el.textContent = s.day);
        document.querySelectorAll('.rs-time').forEach(el => el.textContent = getTimeString());
        document.querySelectorAll('.rs-money').forEach(el => el.textContent = s.money);

        // Crema nav bar
        const cremaBar = document.getElementById('nav-crema-temp-bar');
        const brokenX = document.getElementById('nav-crema-broken');

        if (brokenX) brokenX.style.display = (s.cremaBroken || s.cremaRepairing) ? 'flex' : 'none';

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
            if (!state.moneyWarningShown) {
                state.moneyWarningShown = true;
                if (typeof Dialogue !== 'undefined') {
                    Dialogue.show(
                        I18n.T('go.warning_title'), 
                        I18n.T('go.money_explained'), 
                        [{ text: I18n.T('eng.ok') }], null, { showReaper: true }
                    );
                }
            }
            showToast(I18n.T('go.money_warning', state.money), 'danger');
        } else if (state.reputation <= 15) {
            if (!state.repWarningShown) {
                state.repWarningShown = true;
                if (typeof Dialogue !== 'undefined') {
                    Dialogue.show(
                        I18n.T('go.warning_title'), 
                        I18n.T('go.rep_explained'), 
                        [{ text: I18n.T('eng.ok') }], null, { showReaper: true }
                    );
                }
            }
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

    function rollCollectionDiscovery() {
        const chance = 0.15; // 15% chance
        if (Math.random() < chance) {
            const all = DATA.collections || [];
            const available = all.filter(item => !state.foundItems.includes(item.id));
            if (available.length > 0) {
                const found = available[Math.floor(Math.random() * available.length)];
                state.foundItems.push(found.id);
                if (state.foundItems.length >= 5) Notifications.unlockAchievement('collector');
                
                // Show notification dot
                const dot = document.getElementById('collection-dot');
                if (dot) dot.style.display = 'block';
                
                // Show discovery dialogue
                Dialogue.show(I18n.T('col.found_title'), I18n.T('col.found_text', found.name), [
                    { text: I18n.T('ov.dismiss'), action: () => {} }
                ]);
            }
        }
    }

    function showCollection() {
        const dot = document.getElementById('collection-dot');
        if (dot) dot.style.display = 'none';

        const overlay = document.getElementById('collection-overlay');
        const grid = document.getElementById('collection-grid');
        if (!overlay || !grid) return;

        grid.innerHTML = '';
        const all = DATA.collections || [];
        
        all.forEach(item => {
            const isFound = state.foundItems.includes(item.id);
            const slot = document.createElement('div');
            slot.className = isFound ? 'col-slot found' : 'col-slot empty';
            
            if (isFound) {
                slot.innerHTML = `
                    <div class="col-icon">${item.icon}</div>
                    <div class="col-info">
                        <strong>${item.name}</strong>
                    </div>
                `;
                slot.onclick = () => {
                    if (typeof Dialogue !== 'undefined') {
                        Dialogue.show(item.icon + " " + item.name, item.desc, [
                            { text: I18n.T('ov.dismiss') }
                        ]);
                    }
                };
            } else {
                slot.innerHTML = `<div class="col-icon">?</div>`;
            }
            grid.appendChild(slot);
        });

        overlay.style.display = 'flex';
        stopTime();
    }

    return {
        getState, getTimeString, getLevel, getRepStars,
        addMoney, addReputation, addXP,
        startTime, stopTime, setSpeed, tick,
        generateDailySchedule, hasUpgrade, buyUpgrade,
        rollD20, Notifications, showToast, updateHUD,
        save, load, hasSave, resetState,
        checkGameOver, defaultState,
        rollCollectionDiscovery, showCollection,
        unlockAchievement: (id) => Notifications.unlockAchievement(id)
    };
})();
