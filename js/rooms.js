/* ===== THANATOPRACTOR - Room Logic ===== */
const Rooms = (() => {
    let activeRoom = null;

    function updateActiveRoom() {
        if (activeRoom === 'crematorium') updateCrematorium();
        if (activeRoom === 'cafeteria') showCafeteria();
        if (activeRoom === 'embalming') {
            const active = Families.getActive().filter(f => f.arrived && !f.embalmed);
            if (!embalmTarget && active.length > 0) showEmbalming();
        }
    }

    function orderSingleHearse(f) {
        const s = Engine.getState();
        // Removed money check to allow bankruptcy
        
        Engine.addMoney(-150, I18n.T('eng.ordered_hearse'));
        f.transportOrdered = true;
        
        // Mark the transport_ready task as completed in the schedule
        const task = s.schedule.find(t => t.type === 'transport_ready' && t.familyId === f.id);
        if (task) {
            task.completed = true;
            task.desc = `${I18n.T('rec.car_ordered', f.deceasedName)}`;
        }
        // Also mark the original arrival event as completed
        const arrivalTask = s.schedule.find(t => t.type === 'arrival' && t.familyId === f.id);
        if (arrivalTask) arrivalTask.completed = true;
        
        const arrivalTime = Math.round(s.time + 60);
        s.schedule.push({
            time: arrivalTime,
            type: 'hearse_arrival',
            familyId: f.id,
            desc: I18n.T('rec.hearse_picking', f.deceasedName, Engine.getTimeString(arrivalTime)),
            triggered: false,
            completed: false
        });
        
        Engine.showToast(I18n.T('rec.hearse_ordered_for', f.deceasedName), 'success');
        // Don't clear reception badge - let updateReceptionBadge handle it
        Engine.Notifications.updateReceptionBadge();
        if (typeof Main !== 'undefined') Main.showScreen('hub');
    }

    // ===== RECEPTION =====
    function initReception() {
        try {
            const btnArrival = document.getElementById('btn-new-arrival');
            if (btnArrival) {
                btnArrival.onclick = () => {
                    const s = Engine.getState();
                    if ((s.pendingArrivals || 0) <= 0) {
                        Engine.showToast(I18n.T('rec.no_waiting'), 'warning');
                        return;
                    }
                    try {
                        Audio8Bit.SFX.bell();
                        // Fix: getNextPending already decrements pendingArrivals
                        const family = typeof Families.getNextPending === 'function' ? Families.getNextPending() : (() => {
                            s.pendingArrivals--;
                            const fam = Families.generate();
                            Families.addFamily(fam);
                            return fam;
                        })();
                        
                        if (!family) {
                            alert("Family generation returned null! pendingArrivals=" + s.pendingArrivals);
                            return;
                        }
                        s.activeFamilyId = family.id;
                        Dialogue.playArrivalSequence(family);
                        Engine.Notifications.updateReceptionBadge();
                    } catch (err) {
                        alert("ERROR EN NUEVA LLEGADA: " + err.message + "\n" + err.stack);
                    }
                };
            }
        } catch (e) {
            console.error("Error setting up new arrival button", e);
        }
        try {
            const btnPhoneCall = document.getElementById('btn-phone-call');
            if (btnPhoneCall) {
                btnPhoneCall.onclick = () => {
                    Audio8Bit.SFX.click();
                    Engine.Notifications.updateReceptionBadge();
                    Engine.Notifications.clearBadge('phone');
                    const s = Engine.getState();
                    
                    const phoneChoices = [];
                    if (s.level < 10) {
                        phoneChoices.push({
                            text: I18n.T('rec.job_interview'),
                            action: () => {
                                // Removed money check to allow bankruptcy
                                Engine.addMoney(-50, I18n.T('eng.job_call'));
                                Engine.showToast(I18n.T('rec.job_result'), 'warning');
                                if (typeof Main !== 'undefined') Main.showScreen('hub');
                            }
                        });
                    }
                    phoneChoices.push({ 
                    text: I18n.T('rec.order_hearse') + (s.families.filter(f => f.active && f.waitingForTransport && !f.transportOrdered).length > 0 ? ' ❗' : ''), 
                    action: () => {
                    const waitingFams = s.families.filter(f => f.active && f.waitingForTransport && !f.transportOrdered);
                    
                    if (waitingFams.length === 0) {
                        Engine.showToast(I18n.T('rec.no_family_transport'), 'warning');
                        return;
                    }

                    if (waitingFams.length === 1) {
                        orderSingleHearse(waitingFams[0]);
                    } else {
                        // Multiple families waiting
                        const choices = waitingFams.map(f => ({
                            text: `${f.deceasedName} ($150)`,
                            action: () => orderSingleHearse(f)
                        }));
                        choices.push({ text: I18n.T('rec.nevermind'), action: () => {} });
                        Dialogue.show(I18n.T('rec.order_hearse'), I18n.T('rec.select_transport'), choices);
                    }
                }},
                { text: I18n.T('rec.nevermind'), action: () => {} }
            ];

            // Only show flower ordering when requested by a family in viewing
            const hasFlowerRequest = s.families.some(f => 
                f.active && f.embalmed && f.wantsViewing && !f.viewed &&
                f.activeRequests && f.activeRequests.includes('flowers')
            );
            if (hasFlowerRequest) {
                // Insert before 'Nevermind'
                phoneChoices.splice(phoneChoices.length - 1, 0, { 
                    text: I18n.T('rec.order_flowers') + ' 🌸', 
                    action: () => {
                        // Removed money check to allow bankruptcy
                        Engine.addMoney(-50, I18n.T('eng.ordered_flowers'));
                        Engine.showToast(I18n.T('rec.flowers_result'), 'success');
                        Engine.addReputation(5, 'Fresh flowers delivered');
                        
                        // Fulfill request for all families that wanted flowers
                        s.families.forEach(f => {
                            if (f.active && f.activeRequests && f.activeRequests.includes('flowers')) {
                                f.activeRequests = f.activeRequests.filter(r => r !== 'flowers');
                                if (typeof Families !== 'undefined') Families.updateSatisfaction(f.id, 10, 'Fresh flowers');
                            }
                        });

                        if (typeof Main !== 'undefined') Main.showScreen('hub');
                    }
                });
            }

            // Only show maintenance call when crematorium is actually broken
            if (s.cremaBroken || s.cremaRepairing) {
                phoneChoices.splice(phoneChoices.length - 1, 0, {
                    text: I18n.T('rec.call_maintenance') + (s.cremaBroken && !s.cremaRepairing ? ' !!!' : ' (en reparación)'),
                    action: () => {
                    if (s.cremaRepairing) {
                        Engine.showToast(I18n.T('crema.already_repairing'), 'warning');
                        return;
                    }
                    
                    const cost = 200 + Math.floor(Math.random() * 201);
                    // Removed money check to allow bankruptcy

                    const quotes = I18n.T('crema.maintenance_quotes');
                    const quote = Array.isArray(quotes) ? quotes[Math.floor(Math.random() * quotes.length)] : quotes;

                    Dialogue.show(I18n.T('rec.maintenance_title'), `${quote}<br><br>${I18n.T('rec.maintenance_cost', cost)}`, [
                        { text: I18n.T('rec.pay_repair'), action: () => {
                            Engine.addMoney(-cost, I18n.T('eng.crema_repair'));
                            s.cremaRepairing = true;
                            s.cremaRepairFinishTime = s.time + 120;
                            Engine.showToast(I18n.T('crema.repair_started'), 'success');
                            
                            s.schedule.push({
                                time: s.cremaRepairFinishTime,
                                type: 'repair_done',
                                desc: I18n.T('crema.repair_task_desc'),
                                triggered: false,
                                completed: true
                            });

                            Engine.updateHUD();
                            if (typeof Main !== 'undefined') Main.showScreen('hub');
                        }},
                        { text: I18n.T('rec.nevermind'), action: () => {} }
                    ], null, { showReaper: true });
                }});
            }

            const hasPermanentHearse = Engine.hasUpgrade('hearse');
            const hasTempHearse = s.temporaryHearseAvailable;
            const cooldownOver = s.time >= (s.personalHearseCooldown || 0);

            if (hasPermanentHearse || hasTempHearse) {
                let text = '';
                let canUse = true;

                if (hasPermanentHearse) {
                    text = I18n.T('rec.personal_hearse');
                    if (!cooldownOver) {
                        const remaining = Math.ceil((s.personalHearseCooldown - s.time) / 60);
                        text = I18n.T('rec.car_cooldown', remaining);
                        canUse = false;
                    }
                } else {
                    text = I18n.T('rec.niece_car');
                }

                if (s.families.filter(f => f.active && f.waitingForTransport && !f.transportOrdered).length > 0 && canUse) {
                    text += ' ❗';
                }

                phoneChoices.push({
                    text: text,
                    action: () => {
                        if (hasPermanentHearse && !canUse) {
                            Engine.showToast(I18n.T('rec.car_busy'), 'warning');
                            return;
                        }
                        
                        const waitingFams = s.families.filter(f => f.active && f.waitingForTransport && !f.transportOrdered);
                        if (waitingFams.length === 0) {
                            Engine.showToast(I18n.T('rec.no_family_transport'), 'warning');
                            return;
                        }

                        // Use the car for ONE family
                        const f = waitingFams[0];
                        
                        if (hasPermanentHearse) {
                            // Permanent Hearse - Randomized behavior (1-3h wait + extra cooldown)
                            const hours = Math.floor(Math.random() * 3) + 1; // 1, 2, or 3h
                            f.transportOrdered = true;
                            s.personalHearseCooldown = s.time + (hours * 60) + 60; // cooldown = travel time + 1h extra

                            const task = s.schedule.find(t => t.type === 'transport_ready' && t.familyId === f.id);
                            if (task) {
                                task.completed = true;
                                task.desc = I18n.T('rec.personal_enroute', f.deceasedName);
                            }
                            
                            const arrivalTime = Math.round(s.time + (hours * 60));
                            s.schedule.push({
                                time: arrivalTime,
                                type: 'hearse_arrival',
                                familyId: f.id,
                                desc: I18n.T('rec.personal_pickup', f.deceasedName, Engine.getTimeString(arrivalTime)),
                                triggered: false,
                                completed: false
                            });
                            Engine.showToast(I18n.T('rec.car_dispatched', f.deceasedName, hours), 'success');
                        } else {
                            // Niece's Car - IMMEDIATE & SINGLE USE
                            s.temporaryHearseAvailable = false;
                            const nieceTask = s.schedule.find(t => t.type === 'transport_ready' && t.familyId === f.id);
                            if (nieceTask) nieceTask.completed = true;
                            Families.completeFamily(f.id);
                            Engine.showToast(I18n.T('rec.niece_arrived', f.deceasedName), 'success');
                            if (typeof Main !== 'undefined') Main.showScreen('hub');
                        }

                        Engine.Notifications.clearBadge('reception');
                    }
                });
            }

            Dialogue.show(I18n.T('rec.phone_title'), I18n.T('rec.phone_subtitle'), phoneChoices);
        };
            }
        } catch(e) {
            console.error("Error setting up phone call button", e);
        }
        try {
            const btnPaperwork = document.getElementById('btn-paperwork');
            if (btnPaperwork) {
                btnPaperwork.onclick = () => {
                    try {
                        Audio8Bit.SFX.click();
                        Engine.Notifications.updateReceptionBadge();
                        const s = Engine.getState();
                        if (!s.activePaperwork) {
                            Engine.showToast(I18n.T('rec.no_paperwork'), '');
                            return;
                        }

                        const task = s.activePaperwork;
                        const taskText = I18n.T(task.id);
                        Dialogue.show(I18n.T('rec.pw_title'), `${taskText}\n\n${I18n.T('rec.pw_dc', task.dc)}`, [
                { text: I18n.T('rec.pw_roll'), action: () => {
                    const randomDC = Math.max(5, Math.min(20, task.dc + (Math.floor(Math.random() * 7) - 3)));
                    Engine.rollD20(0, (roll, total, result) => {
                        if (total >= randomDC) {
                            Engine.addMoney(task.reward, I18n.T('eng.paperwork_success'));
                            if (task.repReward) Engine.addReputation(task.repReward, I18n.T('eng.paperwork_success'));
                            Engine.showToast(I18n.T('rec.pw_success', task.reward) + ` (DC: ${randomDC})`, 'success');
                            
                            // Check if this was the niece's car paperwork
                            if (task.id === 'pw_niece') {
                                s.temporaryHearseAvailable = true;
                                Engine.showToast(I18n.T('rec.niece_desc'), 'success');
                            }

                            // Achievement: Paperwork Ninja
                            s.consecutivePaperwork = (s.consecutivePaperwork || 0) + 1;
                            if (s.consecutivePaperwork >= 10) Engine.unlockAchievement('paperwork_ninja');
                        } else {
                            Engine.addMoney(task.penalty, I18n.T('eng.paperwork_failed'));
                            if (task.repPenalty) Engine.addReputation(task.repPenalty, I18n.T('eng.paperwork_failed'));
                            Engine.showToast(I18n.T('rec.pw_fail', Math.abs(task.penalty)), 'danger');

                            // Reset consecutive paperwork
                            s.consecutivePaperwork = 0;
                        }
                        s.activePaperwork = null;
                        document.getElementById('btn-paperwork').style.opacity = '1';
                        Engine.Notifications.updateReceptionBadge();
                        if (typeof Main !== 'undefined') Main.showScreen('hub');
                    });
                }},
                { text: DATA.paperworkExcuses[Math.floor(Math.random() * DATA.paperworkExcuses.length)] + ` ${I18n.T('rec.pw_decline')}`, action: () => {
                    // Dismiss the paperwork task completely
                    const activePW = s.activePaperwork;
                    const schedItem = s.schedule.find(item => item.type === 'paperwork' && item.task === activePW && item.triggered);
                    if (schedItem) schedItem.rejected = true;

                    s.activePaperwork = null;
                    Engine.Notifications.updateReceptionBadge();
                    document.getElementById('btn-paperwork').style.opacity = '1';
                    Engine.showToast(I18n.T('rec.pw_discarded'), '');
                    if (typeof Main !== 'undefined') {
                        Main.updateHubSchedule();
                        Main.showScreen('hub');
                    }
                }}
            ], null, { showReaper: true });
                    } catch (err) {
                        alert("ERROR EN PAPELEO: " + err.message + "\n" + err.stack);
                    }
                };
            }
        } catch(e) {
            console.error("Error setting up paperwork button", e);
        }
    }

    function showReception() {
        activeRoom = 'reception';
        // Removed auto-clear of reception badge. Now it clears only when sub-badges are empty.
        Engine.Notifications.updateReceptionBadge(); 
    }

    // ===== EMBALMING =====
    let embalmTarget = null;
    let embalmTasks = { clean: false, treat: false, dress: false, prepare: false };

    function showEmbalming() {
        activeRoom = 'embalming';
        Engine.Notifications.clearBadge('embalming');
        const s = Engine.getState();

        // One-time tutorial
        if (!s.embalmTutorialShown) {
            s.embalmTutorialShown = true;
            Engine.save();
            Dialogue.show(I18n.T('emb.tutorial_title'), I18n.T('emb.tutorial_text'), [
                { text: I18n.T('emb.tutorial_ok') }
            ], null, { showReaper: true });
        }

        const active = Families.getActive().filter(f => f.arrived && !f.embalmed);

        if (active.length === 0) {
            document.getElementById('embalm-status').textContent = I18n.T('emb.no_body');
            document.getElementById('btn-embalm-roll').style.display = 'none';
            resetEmbalmTasks();
            return;
        }

        embalmTarget = active[0];
        document.getElementById('embalm-status').textContent = I18n.T('emb.preparing', embalmTarget.deceasedName);

        // Update supplies display with color coding
        const getCol = (amt, req) => amt < req ? '#ff4444' : (amt < req + 3 ? '#ffbb33' : '#00C851');
        
        const sf = document.getElementById('supply-formal');
        sf.textContent = s.supplies.formaldehyde;
        sf.style.color = getCol(s.supplies.formaldehyde, 2);
        
        const sh = document.getElementById('supply-humect');
        sh.textContent = s.supplies.humectant;
        sh.style.color = getCol(s.supplies.humectant, 2);
        
        const sd = document.getElementById('supply-dye');
        sd.textContent = s.supplies.dye;
        sd.style.color = getCol(s.supplies.dye, 2);
        
        const so = document.getElementById('supply-outfits');
        so.textContent = s.supplies.outfits;
        so.style.color = getCol(s.supplies.outfits, 1);

        // Task clicks
        document.querySelectorAll('.task-item').forEach(el => {
            const task = el.dataset.task;
            el.className = embalmTasks[task] ? 'task-item done' : 'task-item';
            el.onclick = () => {
                if (embalmTasks[task]) {
                    // Untick and refund
                    embalmTasks[task] = false;
                    if (task === 'treat') { s.supplies.formaldehyde += 2; s.supplies.humectant += 2; }
                    if (task === 'dress') { s.supplies.outfits += 1; }
                    Audio8Bit.SFX.click();
                    showEmbalming();
                    return;
                }

                // Tick
                if (task === 'treat' && (s.supplies.formaldehyde < 2 || s.supplies.humectant < 2)) {
                    Engine.showToast(I18n.T('emb.no_chemicals'), 'warning');
                    return;
                }
                if (task === 'dress' && s.supplies.outfits < 1) {
                    Engine.showToast(I18n.T('emb.no_outfits'), 'warning');
                    return;
                }
                
                embalmTasks[task] = true;
                if (task === 'treat') { s.supplies.formaldehyde -= 2; s.supplies.humectant -= 2; }
                if (task === 'dress') { s.supplies.outfits -= 1; }
                
                Audio8Bit.SFX.click();
                showEmbalming();
            };
        });

        const doneCount = Object.values(embalmTasks).filter(v => v).length;
        const penalty = (4 - doneCount) * -3;
        const rollBtn = document.getElementById('btn-embalm-roll');
        
        if (doneCount > 0) {
            rollBtn.style.display = 'block';
            rollBtn.innerHTML = I18n.T('emb.finish', penalty < 0 ? I18n.T('emb.penalty', penalty) : I18n.T('emb.no_penalty'));
        } else {
            rollBtn.style.display = 'none';
        }

        // Buy supplies — open the shop
        document.getElementById('btn-buy-supplies').onclick = () => openSuppliesShop();

        // Roll button
        document.getElementById('btn-embalm-roll').onclick = () => {
            let mod = 0;
            // Penalty for missing tasks: -3 per missing task
            const doneCount = Object.values(embalmTasks).filter(v => v).length;
            const missingPenalty = (4 - doneCount) * -3;
            mod += missingPenalty;

            if (s.supplies.dye >= 2) { mod += 1; s.supplies.dye -= 2; }
            if (Engine.hasUpgrade('embalm_kit')) mod += 2;
            mod += s.embalmTrainCount;

            Engine.rollD20(mod, (roll, total, result) => {
                let quality;
                if (roll === 1) quality = 'catastrophic';
                else if (total <= 5) quality = 'bad';
                else if (total <= 10) quality = 'mediocre';
                else if (total <= 16) quality = 'good';
                else quality = 'excellent';

                embalmTarget.embalmed = true;
                embalmTarget.embalmQuality = quality;
                embalmTarget.services.push('embalming');

                const qFill = document.getElementById('embalm-quality-fill');
                const qText = document.getElementById('embalm-quality-text');
                const pcts = { catastrophic: 5, bad: 25, mediocre: 50, good: 75, excellent: 100 };
                qFill.style.width = pcts[quality] + '%';
                qFill.style.background = quality === 'catastrophic' || quality === 'bad' ? 'var(--danger)' : quality === 'mediocre' ? 'var(--warning)' : 'var(--success)';
                qText.textContent = quality.toUpperCase();

                const msgs = {
                    catastrophic: I18n.getRandom('emb.q_catastrophic_list', embalmTarget.deceasedName),
                    bad: I18n.getRandom('emb.q_bad_list', embalmTarget.deceasedName),
                    mediocre: I18n.getRandom('emb.q_mediocre_list', embalmTarget.deceasedName),
                    good: I18n.getRandom('emb.q_good_list', embalmTarget.deceasedName),
                    excellent: I18n.getRandom('emb.q_excellent_list', embalmTarget.deceasedName)
                };
                Engine.showToast(msgs[quality], quality === 'good' || quality === 'excellent' ? 'success' : 'warning');
                Dialogue.enqueue(I18n.T('emb.quality_title', I18n.T('dice.' + quality)), msgs[quality], [
                    { text: I18n.T('ov.dismiss'), action: () => {
                        showEmbalming(); // Still update the room state
                        if (typeof Main !== 'undefined') Main.showScreen('hub');
                    } }
                ]);
                Families.updateSatisfaction(embalmTarget.id, quality === 'excellent' ? 20 : quality === 'good' ? 10 : quality === 'mediocre' ? 0 : quality === 'bad' ? -15 : -30, `Embalming: ${quality}`);
                
                Engine.rollCollectionDiscovery();

                if (embalmTarget.wantsViewing) {
                    Engine.Notifications.addBadge('viewing');
                } else {
                    const s = Engine.getState();
                    s.schedule.push({
                        time: Math.round(s.time + 60),
                        type: 'cooldown_done',
                        familyId: embalmTarget.id,
                        desc: (embalmTarget.wantsCremation && Engine.hasUpgrade('crematorium')) 
                                ? I18n.T('crema.ready_desc', embalmTarget.deceasedName)
                                : I18n.T('rec.arrival_pickup', embalmTarget.deceasedName),
                        triggered: false,
                        room: (embalmTarget.wantsCremation && Engine.hasUpgrade('crematorium')) ? 'crematorium' : 'reception'
                    });
                }

                resetEmbalmTasks();
                document.getElementById('btn-embalm-roll').style.display = 'none';
                Engine.save();

                // Check if another family still needs embalming
                const remaining = Families.getActive().filter(f => f.arrived && !f.embalmed);
                if (remaining.length > 0) {
                    Engine.Notifications.addBadge('embalming');
                    Engine.showToast(I18n.T('emb.still_needs', remaining[0].deceasedName), '');
                }
            });
        };
    }

    // ===== SUPPLIES SHOP =====
    function getSupplyBase() {
        return {
            formaldehyde: { label: I18n.T('shop.formaldehyde'), base: 18, unit: I18n.T('shop.vials'), key: 'formaldehyde' },
            humectant:    { label: I18n.T('shop.humectant'),    base: 14, unit: I18n.T('shop.jars'),  key: 'humectant' },
            dye:          { label: I18n.T('shop.dye'),          base: 10, unit: I18n.T('shop.tubes'), key: 'dye' },
            outfits:      { label: I18n.T('shop.outfit'),       base: 55, unit: I18n.T('shop.sets'),  key: 'outfits' }
        };
    }

    function openSuppliesShop() {
        const s = Engine.getState();
        const overlay = document.getElementById('supplies-overlay');

        if (s.shopDay !== s.day || !s.shopMults || s.shopRoll === undefined) {
            s.shopDay = s.day;
            s.shopRoll = Math.random();
            s.shopMults = {};
            const baseSupplies = getSupplyBase();
            Object.keys(baseSupplies).forEach(key => {
                let mult;
                if (s.shopRoll < 0.15)      mult = 0.4 + Math.random() * 0.4;   // 0.4–0.8x cheap
                else if (s.shopRoll < 0.6)  mult = 0.8 + Math.random() * 0.6;   // 0.8–1.4x normal
                else if (s.shopRoll < 0.85) mult = 1.5 + Math.random() * 1.5;   // 1.5–3x expensive
                else                        mult = 3.0 + Math.random() * 2.5;   // 3–5.5x extortionate
                s.shopMults[key] = mult;
            });
            Engine.save();
        }

        const prices = {};
        let marketMood = '';
        const roll = s.shopRoll;
        if (roll < 0.15) { marketMood = I18n.T('shop.mood_clearance'); }
        else if (roll < 0.6) { marketMood = I18n.T('shop.mood_normal'); }
        else if (roll < 0.85) { marketMood = I18n.T('shop.mood_high'); }
        else { marketMood = I18n.T('shop.mood_shortage'); }

        document.getElementById('shop-subtitle').textContent = marketMood;

        const supplies = getSupplyBase();
        const quantities = {};
        Object.keys(supplies).forEach(key => {
            const item = supplies[key];
            const mult = s.shopMults[key];
            let discount = Engine.hasItem('magic_sock') ? 0.95 : 1.0;
            prices[key] = Math.ceil(item.base * mult * (s.priceMod || 1) * discount);
            quantities[key] = 0;
        });
 
        function priceClass(key) {
            const ratio = prices[key] / supplies[key].base;
            if (ratio < 0.8) return 'price-cheap';
            if (ratio < 1.5) return 'price-normal';
            if (ratio < 3.0) return 'price-expensive';
            return 'price-extortionate';
        }
 
        function renderShop() {
            let total = 0;
            Object.keys(supplies).forEach(k => total += prices[k] * quantities[k]);
            document.getElementById('shop-total').textContent = total;
 
            document.getElementById('shop-items').innerHTML = Object.keys(supplies).map(key => {
                const item = supplies[key];
                const cls = priceClass(key);
                const stock = s.supplies[key];
                return `
                    <div class="shop-item">
                        <div class="shop-item-name">${item.label}<br><span class="shop-item-stock">${I18n.T('shop.in_stock', stock, item.unit)}</span></div>
                        <div class="shop-item-price ${cls}">$${prices[key]}/${I18n.T('shop.ea')}</div>
                        <div class="shop-qty">
                            <button class="qty-btn" data-key="${key}" data-dir="-1">−</button>
                            <span class="qty-val" id="qty-${key}">${quantities[key]}</span>
                            <button class="qty-btn" data-key="${key}" data-dir="1">+</button>
                        </div>
                    </div>`;
            }).join('');

            // Attach qty button handlers
            document.querySelectorAll('.qty-btn').forEach(btn => {
                btn.onclick = () => {
                    const key = btn.dataset.key;
                    const dir = parseInt(btn.dataset.dir);
                    quantities[key] = Math.max(0, Math.min(20, quantities[key] + dir));
                    renderShop();
                };
            });
        }

        renderShop();
        overlay.style.display = 'flex';

        document.getElementById('btn-shop-cancel').onclick = () => {
            overlay.style.display = 'none';
        };

        document.getElementById('btn-shop-buy').onclick = () => {
            const total = Object.keys(supplies).reduce((sum, k) => sum + prices[k] * quantities[k], 0);
            if (total === 0) { Engine.showToast(I18n.T('shop.select_item'), 'warning'); return; }
            // Removed money check to allow bankruptcy

            Engine.addMoney(-total, I18n.T('eng.supply_purchase'));
            
            s.schedule.push({
                time: Math.round(s.time + 60),
                type: 'supplies_delivery',
                supplies: quantities,
                triggered: false,
                desc: I18n.T('shop.delivery_desc')
            });

            overlay.style.display = 'none';
            showEmbalming();
            Engine.showToast(I18n.T('shop.delivered'), 'success');
        };
    }

    function resetEmbalmTasks() {
        embalmTasks = { clean: false, treat: false, dress: false, prepare: false };
        document.querySelectorAll('.task-item').forEach(el => {
            el.className = 'task-item';
            el.querySelector('.task-check').textContent = '☐';
        });
    }

    function showCafeteria() {
        activeRoom = 'cafeteria';
        Engine.Notifications.clearBadge('cafeteria');
        const orderList = document.getElementById('cafe-order-list');
        const s = Engine.getState();

        if (s.cafeOrders.length === 0) {
            orderList.innerHTML = `<p class="dim-text">${I18n.T('cafe.no_orders')}</p>`;
            return;
        }

        const servedIndices = s.cafeOrders.map((o, i) => o.served ? i : -1).filter(i => i !== -1).slice(-3);

        orderList.innerHTML = s.cafeOrders.map((o, i) => {
            if (o.served && !servedIndices.includes(i)) return null;
            
            const iconHTML = o.type === 'alcohol' ? Icons.getHTML('🍺') : Icons.getHTML(o.item.icon);
            if (o.served) return `<div class="action-btn" style="opacity:0.4">${iconHTML} ${o.type === 'alcohol' ? I18n.T('cafe.alcohol_request') : o.item.item} — ✓ ${I18n.T('cafe.served')}</div>`;
            if (o.type === 'alcohol') {
                return `<div class="action-btn" style="border-color:var(--warning)" onclick="Rooms.handleAlcohol(${i})">${iconHTML} ${I18n.T('cafe.alcohol_request')}</div>`;
            }
            return `<div class="action-btn" onclick="Rooms.serveOrder(${i})">${iconHTML} ${o.item.item} — $${o.item.price}</div>`;
        }).filter(h => h !== null).join('');

        updateCafeSatisfaction();
        CafeGames.init();
    }

    function serveOrder(idx) {
        const s = Engine.getState();
        const order = s.cafeOrders[idx];
        if (!order || order.served) return;

        CafeGames.start(order, (quality) => {
            order.served = true;
            // Reward based on quality: -1=fail, 0=weak, 1=good, 2+=perfect
            let rewardMult = quality >= 2 ? 1.5 : (quality === 1 ? 1 : (quality === 0 ? 0.7 : 0.2));
            let finalPrice = Math.ceil(order.item.price * rewardMult);
            
            let itemName = order.item.item;
            if (itemName === 'Coffee') itemName = I18n.T('cafe.coffee');
            else if (itemName === 'Tea') itemName = I18n.T('cafe.tea');
            else if (itemName === 'Sandwich') itemName = I18n.T('cafe.sandwich');
            else if (itemName === 'Soul Cake') itemName = I18n.T('cafe.soul_cake');
            
            let qualityStr = quality >= 2 ? '+++' : (quality === 1 ? '++' : (quality === 0 ? '+' : '---'));
            if (Engine.hasItem('choc_coin')) finalPrice += 2;
            Engine.addMoney(finalPrice, I18n.T('cafe.sold_reason', itemName, qualityStr));
            
            let satBonus = quality >= 2 ? 10 : (quality === 1 ? 5 : (quality === 0 ? 0 : -15));
            if (Engine.hasItem('pizza_letter')) satBonus += 2;
            Families.updateSatisfaction(order.familyId, satBonus, `${I18n.T('nav.cafeteria')}: ${itemName}`);
            
            const fam = Families.getById(order.familyId);
            if (fam) {
                const cafeName = I18n.T('nav.cafeteria');
                if (!fam.services.includes(cafeName)) fam.services.push(cafeName);
            }
            
            Audio8Bit.SFX.success();
            showCafeteria();
        });
    }

    function handleAlcohol(idx) {
        const s = Engine.getState();
        const order = s.cafeOrders[idx];
        if (!order || order.served) return;
        
        const bribe = 100 + Math.floor(Math.random() * 201);
        
        Dialogue.show(I18n.T('cafe.alcohol_title'), DATA.cafeAlcoholRequests[Math.floor(Math.random() * DATA.cafeAlcoholRequests.length)],
            DATA.cafeAlcoholChoices.map(c => ({
                text: c.isBribe ? c.text.replace('{bribe}', bribe) : c.text,
                action: () => {
                    // If they decide to serve (c.rep < 0 is the check for illegal serving in current logic)
                    if (c.rep < 0 || c.isBribe) {
                        CafeGames.start({ type: 'alcohol', item: { item: 'Alcohol' } }, (quality) => {
                            if (quality >= 1) {
                                if (c.isBribe) {
                                    Engine.addMoney(bribe, 'Alcohol bribe');
                                    s.bribesAccepted = (s.bribesAccepted || 0) + 1;
                                    if (s.bribesAccepted >= 5) Engine.unlockAchievement('bribe_master');
                                }
                                else if (c.money) Engine.addMoney(c.money, 'Alcohol-related');
                                if (c.rep) Engine.addReputation(c.rep, 'Served alcohol illegally');
                                if (c.satisfaction) Families.updateSatisfaction(order.familyId, c.satisfaction + (quality === 2 ? 10 : 0), 'Got what they wanted');
                                s.alcoholServedToday++;
                            } else {
                                Engine.showToast("You spilled the evidence!", 'warning');
                                Engine.addReputation(-5, 'Spilled alcohol / Mess');
                            }
                            
                            order.served = true;
                            const fam = Families.getById(order.familyId);
                            if (fam) {
                                const cafeName = I18n.T('nav.cafeteria');
                                if (!fam.services.includes(cafeName)) fam.services.push(cafeName);
                            }
                            
                            checkInspector(s);
                            showCafeteria();
                        });
                    } else {
                        // Denied
                        if (c.rep) Engine.addReputation(c.rep, I18n.T('cafe.denied_alcohol'));
                        if (c.satisfaction) Families.updateSatisfaction(order.familyId, c.satisfaction, I18n.T('cafe.denied_alcohol'));
                        order.served = true;
                        showCafeteria();
                    }
                }
            }))
        );
    }

    function checkInspector(s) {
        if (s.alcoholServedToday >= 3) {
            // CLOSE CAFETERIA
            s.upgrades = s.upgrades.filter(u => u !== 'cafeteria');
            s.cafeOrders = [];
            s.alcoholServedToday = 0;
            Dialogue.show(I18n.T('cafe.inspector_title'), I18n.T('cafe.inspector_msg'), [
                { text: I18n.T('cafe.inspector_ok'), action: () => {
                    if (typeof Main !== 'undefined') Main.showScreen('hub');
                    const nav = document.getElementById('nav-cafeteria');
                    if (nav) {
                        nav.classList.add('locked');
                        const lock = nav.querySelector('.nav-lock');
                        if (lock) lock.style.display = 'block';
                    }
                }}
            ]);
        }
    }

    function updateCafeSatisfaction() {
        const s = Engine.getState();
        const served = s.cafeOrders.filter(o => o.served).length;
        const total = s.cafeOrders.length || 1;
        const pct = Math.round((served / total) * 100);
        document.getElementById('cafe-sat-fill').style.width = pct + '%';
    }

    // ===== CREMATORIUM =====
    function showCrematorium() {
        activeRoom = 'crematorium';
        Engine.Notifications.clearBadge('crematorium');

        // One-time tutorial
        const s = Engine.getState();
        if (!s.cremaTutorialShown) {
            s.cremaTutorialShown = true;
            Engine.save();
            Dialogue.show(I18n.T('crema.tutorial_title'), I18n.T('crema.tutorial_text'), [
                { text: I18n.T('crema.tutorial_ok') }
            ], null, { showReaper: true });
        }

        updateCrematorium();

        document.getElementById('btn-add-fuel').onclick = () => {
            const s = Engine.getState();
            if (s.money < 50) { Engine.showToast(I18n.T('crema.no_money_fuel'), 'danger'); return; }
            if (s.cremaFuel >= 10) { Engine.showToast(I18n.T('crema.fuel_full'), 'warning'); return; }
            Engine.addMoney(-50, 'Crematorium fuel');
            s.cremaFuel = Math.min(10, s.cremaFuel + 2);
            Audio8Bit.SFX.fire();
            updateCrematorium();
        };

        document.getElementById('btn-ignite').onclick = () => {
            const s = Engine.getState();
            if (!s.cremaIgnited) {
                if (s.cremaFuel <= 0) { Engine.showToast(I18n.T('crema.add_fuel_first'), 'warning'); return; }
                s.cremaIgnited = true;
                Audio8Bit.SFX.fire();
                Engine.showToast(I18n.T('crema.ignited'), '');
            } else {
                s.cremaIgnited = false;
                Engine.showToast(I18n.T('crema.extinguished'), '');
            }
            updateCrematorium();
        };
    }

    function updateCrematorium() {
        const s = Engine.getState();
        document.getElementById('crema-temp').textContent = Math.round(s.cremaTemp) + '°C';
        document.getElementById('crema-temp').style.color = s.cremaTemp >= 780 ? 'var(--success)' : s.cremaTemp >= 500 ? 'var(--warning)' : 'var(--text-primary)';
        document.getElementById('crema-fuel').textContent = `${s.cremaFuel.toFixed(1)}/10`;
        document.getElementById('crema-fuel-fill').style.width = (s.cremaFuel / 10 * 100) + '%';
        const fireEl = document.getElementById('furnace-fire');
        if (fireEl) fireEl.style.height = Math.min(100, (s.cremaTemp / 1100) * 100) + '%';

        const eff = s.cremaTemp >= 780 && s.cremaTemp <= 820 ? I18n.T('crema.eff_perfect') : s.cremaTemp >= 600 ? I18n.T('crema.eff_heating') : s.cremaTemp > 100 ? I18n.T('crema.eff_warming') : '—';
        document.getElementById('crema-efficiency').textContent = eff;

        const igniteBtn = document.getElementById('btn-ignite');
        if (igniteBtn) {
            igniteBtn.textContent = s.cremaIgnited ? I18n.T('crema.btn_extinguish') : I18n.T('crema.btn_ignite');
        }

        // Schedule list update
        const schedList = document.getElementById('crema-schedule-list');
        if (schedList) {
            const active = Families.getActive().filter(f => f.embalmed && f.wantsCremation && !f.cremated && (f.viewed || f.cooldownDone) && (!f.wantsChapel || f.chapelDone));
            
            // Sort: currently cremating families first
            active.sort((a, b) => {
                const aVal = (a.cremationStarted && !a.cremated) ? 1 : 0;
                const bVal = (b.cremationStarted && !b.cremated) ? 1 : 0;
                return bVal - aVal;
            });
            
            const isAnyCremating = active.some(f => f.cremationStarted && !f.cremated);
            const displayed = active.slice(0, 3);
            
            if (active.length === 0) {
                schedList.innerHTML = `<p class="dim-text">${I18n.T('crema.no_scheduled')}</p>`;
            } else {
                schedList.innerHTML = displayed.map(f => {
                    const ready = s.cremaTemp >= 800;
                    const starting = f.cremationStarted;
                    let statusHTML = '';
                    const locked = s.cremaLock && s.time >= s.cremaLock[0] && s.time <= s.cremaLock[1];
                    if (s.cremaBroken || s.cremaRepairing) {
                        statusHTML = `<span class="danger">${s.cremaRepairing ? I18n.T('crema.repairing_status') : I18n.T('crema.broken_status')}</span>`;
                    } else if (locked) {
                        statusHTML = `<span class="danger">${I18n.T('crema.lock_status')}</span>`;
                    } else if (starting && !f.cremated) {
                        const timeLeft = Math.max(0, Math.round(f.cremationEndTime - s.time));
                        statusHTML = `<span class="warning">${I18n.T('crema.incinerating')} (${timeLeft}m)</span>`;
                    } else if (isAnyCremating) {
                        statusHTML = `<span>${I18n.T('crema.waiting_oven')}</span>`;
                    } else if (ready) {
                        statusHTML = `<button class="action-btn pink-btn" style="padding:4px 8px;width:auto" onclick="Rooms.doCremation(${f.id})">${I18n.T('crema.btn_cremate')}</button>`;
                    } else {
                        statusHTML = `<span>${I18n.T('crema.need_800')}</span>`;
                    }

                    return `<div class="schedule-item">
                        <span>${f.deceasedName}</span>
                        <span>${statusHTML}</span>
                    </div>`;
                }).join('');
            }
        }
    }

    function doCremation(familyId) {
        const f = Families.getById(familyId);
        const s = Engine.getState();
        if (!f || f.cremated || f.cremationStarted) return;
        const locked = s.cremaLock && s.time >= s.cremaLock[0] && s.time <= s.cremaLock[1];
        if (s.cremaBroken || s.cremaRepairing || locked) {
            Engine.showToast(locked ? I18n.T('crema.lock_title') : I18n.T('crema.broken_title'), 'danger');
            return;
        }

        // One cremation at a time check (only active families)
        const isBusy = s.families.some(fam => fam.active && fam.cremationStarted && !fam.cremated);
        if (isBusy) {
            Engine.showToast(I18n.T('crema.waiting_oven'), 'warning');
            return;
        }

        f.cremationStarted = true;
        f.cremationEndTime = s.time + 60;
        f.cremationTempFailure = false; 

        Engine.showToast(I18n.T('crema.cremating', f.deceasedName), 'success');
        Audio8Bit.SFX.fire();

        s.schedule.push({
            time: Math.round(s.time + 60),
            type: 'cremation_done',
            familyId: f.id,
            desc: I18n.T('crema.done_desc', f.deceasedName),
            triggered: false
        });
        
        Engine.save();
        showCrematorium();
    }

    // ===== VIEWING ROOM =====
    let viewingFamily = null;

    function showViewing() {
        activeRoom = 'viewing';
        Engine.Notifications.clearBadge('viewing');

        // One-time tutorial
        const s = Engine.getState();
        if (!s.viewingTutorialShown) {
            s.viewingTutorialShown = true;
            Engine.save();
            Dialogue.show(I18n.T('view.tutorial_title'), I18n.T('view.tutorial_text'), [
                { text: I18n.T('view.tutorial_ok') }
            ], null, { showReaper: true });
        }

        const active = Families.getActive().filter(f => f.embalmed && f.wantsViewing && !f.viewed);

        if (active.length === 0) {
            document.getElementById('view-request-list').innerHTML = `<p class="dim-text">${I18n.T('view.no_active')}</p>`;
            document.getElementById('viewing-controls').style.display = 'none';
            return;
        }

        viewingFamily = active[0];
        
        // Initialize requests if not exists
        if (!viewingFamily.activeRequests) {
            let reqs = [];
            if (Math.random() > 0.4) reqs.push('water');
            if (Math.random() > 0.6) reqs.push('temperature');
            if (Math.random() > 0.8) reqs.push('faint');
            if (reqs.length === 0) {
                reqs.push(Math.random() > 0.5 ? 'privacy' : 'flowers');
            }
            reqs.push('see_body'); // Primary - Now pushed last to appear at the bottom
            viewingFamily.activeRequests = reqs;
        }

        updateViewingUI();

        // Button handlers
        const btnBody = document.getElementById('btn-view-body');
        const btnWater = document.getElementById('btn-view-water');
        const btnTemp = document.getElementById('btn-view-temp');
        const btnFirstAid = document.getElementById('btn-view-firstaid');
        const btnPrivacy = document.getElementById('btn-view-privacy');
        
        btnBody.style.display = 'inline-block';
        btnWater.style.display = 'inline-block';
        btnTemp.style.display = 'inline-block';
        btnFirstAid.style.display = 'inline-block';
        btnPrivacy.style.display = viewingFamily.activeRequests.includes('privacy') ? 'inline-block' : 'none';

        btnBody.onclick = () => {
            if (!viewingFamily.activeRequests.includes('see_body')) {
                Engine.showToast(I18n.T('view.already_seen'), 'warning');
                return;
            }
            showBody();
        };

        btnWater.onclick = () => {
            if (!viewingFamily.activeRequests.includes('water')) {
                Engine.showToast(I18n.T('view.no_water_needed'), 'warning');
                return;
            }
            Audio8Bit.SFX.click();
            Families.updateSatisfaction(viewingFamily.id, 8, 'Brought water');
            viewingFamily.services.push(I18n.T('view.water'));
            Engine.showToast(I18n.T('view.water_served'), 'success');
            viewingFamily.activeRequests = viewingFamily.activeRequests.filter(r => r !== 'water');
            updateViewingUI();
        };

        btnTemp.onclick = () => {
            if (!viewingFamily.activeRequests.includes('temperature')) {
                Engine.showToast(I18n.T('view.no_temp_needed'), 'warning');
                return;
            }
            if (Engine.hasUpgrade('ac_system')) {
                Families.updateSatisfaction(viewingFamily.id, 8, 'Temperature adjusted');
                viewingFamily.services.push(I18n.T('view.temp'));
                Engine.showToast(I18n.T('view.temp_adjusted'), 'success');
                viewingFamily.activeRequests = viewingFamily.activeRequests.filter(r => r !== 'temperature');
                updateViewingUI();
            } else {
                Engine.showToast(I18n.T('view.no_ac'), 'warning');
                Families.updateSatisfaction(viewingFamily.id, -5, 'No A/C');
                updateViewingMood();
            }
        };

        btnFirstAid.onclick = () => {
            if (!viewingFamily.activeRequests.includes('faint')) {
                Engine.showToast(I18n.T('view.no_firstaid_needed'), 'warning');
                return;
            }
            if (Engine.hasUpgrade('firstaid')) {
                Audio8Bit.SFX.success();
                Families.updateSatisfaction(viewingFamily.id, 12, 'First aid administered');
                viewingFamily.services.push(I18n.T('view.firstaid'));
                Engine.showToast(I18n.T('view.firstaid_done'), 'success');
                viewingFamily.activeRequests = viewingFamily.activeRequests.filter(r => r !== 'faint');
                updateViewingUI();
            } else {
                Engine.showToast(I18n.T('view.no_firstaid'), 'danger');
                Families.updateSatisfaction(viewingFamily.id, -10, 'No first aid available');
                updateViewingMood();
            }
        };

        btnPrivacy.onclick = () => {
            if (!viewingFamily.activeRequests.includes('privacy')) return;
            Families.updateSatisfaction(viewingFamily.id, 10, 'Left alone as requested');
            viewingFamily.services.push(I18n.T('view.leave_alone'));
            viewingFamily.activeRequests = viewingFamily.activeRequests.filter(r => r !== 'privacy');
            updateViewingUI();
            Engine.showToast(I18n.T('view.left_alone'), 'success');
            
            // Complete viewing if no more requests
            if (viewingFamily.activeRequests.length === 0) {
                viewingFamily.viewed = true;
                checkServiceComplete(viewingFamily);
            }

            // Return to hub
            if (typeof Main !== 'undefined') {
                Main.showScreen('hub-screen');
                Rooms.updateActiveRoom('hub');
            }
        };
    }

    function updateViewingUI() {
        if (!viewingFamily) return;
        document.getElementById('viewing-controls').style.display = 'block';
        updateViewingMood();

        const reqList = document.getElementById('view-request-list');
        if (viewingFamily.activeRequests.length === 0) {
            reqList.innerHTML = `<p class="dim-text">${I18n.T('view.all_fulfilled')}</p>`;
        } else {
            reqList.innerHTML = viewingFamily.activeRequests.map(type => {
                const r = DATA.viewingRequests.find(req => req.type === type);
                if (!r) return '';
                return `<div class="action-btn" style="pointer-events:none">${Icons.getHTML(r.icon)} ${r.text.replace('{name}', viewingFamily.deceasedName)}</div>`;
            }).join('');
        }
    }

    function showBody() {
        if (!viewingFamily) return;
        const q = viewingFamily.embalmQuality || 'mediocre';
        const reactions = DATA.viewingBodyReactions[q] || DATA.viewingBodyReactions.mediocre;
        const reaction = reactions[Math.floor(Math.random() * reactions.length)].replace('{name}', viewingFamily.deceasedName);

        const satMap = { excellent: 15, good: 8, mediocre: 0, bad: -20, catastrophic: -35 };
        let finalSat = satMap[q];
        if (Engine.hasItem('returned_ring')) finalSat += 10;
        Families.updateSatisfaction(viewingFamily.id, finalSat, `Saw body (${q})`);
        
        const repMap = { excellent: 8, good: 4, mediocre: 0, bad: -10, catastrophic: -20 };
        Engine.addReputation(repMap[q], `Saw body (${q})`);

        Dialogue.show(I18n.T('view.body_title', viewingFamily.deceasedName), reaction, [
            { text: q === 'bad' || q === 'catastrophic' ? I18n.T('view.sorry') : I18n.T('view.glad_goodbye'), action: () => {
                viewingFamily.viewed = true;
                viewingFamily.activeRequests = viewingFamily.activeRequests.filter(r => r !== 'see_body');
                checkServiceComplete(viewingFamily);
                
                // interaction finished, go back to hub
                if (typeof Main !== 'undefined') Main.showScreen('hub');
            }}
        ]);
    }

    function updateViewingMood() {
        if (!viewingFamily) return;
        document.getElementById('view-mood-fill').style.width = viewingFamily.satisfaction + '%';
        document.getElementById('view-mood-val').textContent = viewingFamily.satisfaction + '%';
    }

    // ===== CHAPEL =====
    let chapelFamily = null;
    let chapelRetry = false;

    function showChapel() {
        activeRoom = 'chapel';
        updateChapelBadge();

        // One-time tutorial
        const s = Engine.getState();
        if (!s.chapelTutorialShown) {
            s.chapelTutorialShown = true;
            Engine.save();
            Dialogue.show(I18n.T('chapel.tutorial_title'), I18n.T('chapel.tutorial_text'), [
                { text: I18n.T('chapel.tutorial_ok') }
            ], null, { showReaper: true });
        }

        const ivanQuote = DATA.ivanQuotes[Math.floor(Math.random() * DATA.ivanQuotes.length)];
        document.getElementById('ivan-speech').textContent = ivanQuote;

        const active = Families.getActive().filter(f => f.embalmed && f.wantsChapel && !f.chapelDone && (f.viewed || f.cooldownDone));
        if (active.length === 0) {
            document.getElementById('chapel-service-info').innerHTML = `<p class="dim-text">${I18n.T('chapel.no_service')}</p>`;
            document.getElementById('chapel-sermon-select').style.display = 'none';
            return;
        }

        chapelFamily = active[0];
        document.getElementById('chapel-service-info').innerHTML = `
            <div>${I18n.T('chapel.ceremony_for')} <strong>${chapelFamily.deceasedName}</strong></div>
            <div style="margin-top:8px"><button class="action-btn pink-btn" onclick="Rooms.startSermon()"><span class="custom-icon" data-icon="music"></span> ${I18n.T('chapel.begin')}</button></div>
        `;
    }

    function startSermon() {
        if (!chapelFamily) return;
        const sermonSelect = document.getElementById('chapel-sermon-select');
        const options = document.getElementById('sermon-options');
        sermonSelect.style.display = 'block';

        // Show all religion options
        const religions = Object.keys(DATA.sermons).filter(k => k !== 'wrong');
        options.innerHTML = religions.map(r => {
            const s = DATA.sermons[r];
            const iconStr = DATA.religions.find(re => re.id === r)?.icon || '📚';
            return `<div class="sermon-option" onclick="Rooms.selectSermon('${r}')">${Icons.getHTML(iconStr)} ${s.name}</div>`;
        }).join('');
    }

    function selectSermon(religionId) {
        if (!chapelFamily) return;
        const isCorrect = religionId === chapelFamily.religion.id;
        
        if (isCorrect) {
            const sermons = DATA.sermons[religionId].correct;
            const sermon = sermons[Math.floor(Math.random() * sermons.length)].replace(/\{name\}/g, chapelFamily.deceasedName);

            Families.updateSatisfaction(chapelFamily.id, 15, 'Correct ceremony');
            Engine.addReputation(3, 'Beautiful ceremony');
            Audio8Bit.SFX.success();

            Dialogue.show(I18n.T('chapel.ivan_speaks'), sermon, [
                { text: I18n.T('chapel.correct'), action: () => {
                    chapelRetry = false;
                    offerViolinMusic(chapelFamily, true);
                }}
            ]);
        } else {
            const sermons = DATA.sermons.wrong;
            const sermonKey = sermons[Math.floor(Math.random() * sermons.length)];
            const sermon = I18n.T(sermonKey).replace(/\{name\}/g, chapelFamily.deceasedName);

            Families.updateSatisfaction(chapelFamily.id, -25, 'Wrong religion ceremony!');
            Engine.addReputation(-10, 'Wrong ceremony type!'); // -10 points penalty
            Audio8Bit.SFX.fail();

            const choices = [];
            if (!chapelRetry) {
                choices.push({ text: I18n.T('chapel.retry'), action: () => {
                    chapelRetry = true;
                    startSermon();
                }});
            }
            
            choices.push({ text: I18n.T('chapel.wrong'), action: () => {
                chapelRetry = false;
                offerViolinMusic(chapelFamily, false);
            }});

            Dialogue.show(I18n.T('chapel.ivan_speaks'), sermon, choices);
        }
    }

    function offerViolinMusic(family, wasCorrectSermon) {
        // 50% chance for the offer to even appear
        if (Math.random() < 0.5) {
            finishChapel(family);
            return;
        }

        const familyAccepts = Math.random() < 0.65;
        const randomTextIndex = Math.floor(Math.random() * 5) + 1;

        Dialogue.show(
            I18n.T('chapel.violin_offer_title'),
            I18n.T(`chapel.violin_offer_text_${randomTextIndex}`),
            [
                { text: I18n.T('chapel.violin_offer_yes'), action: () => {
                    if (familyAccepts) {
                        Engine.addMoney(40, I18n.T('chapel.violin_income'));
                        Families.updateSatisfaction(family.id, 10, 'Beautiful violin music');
                        Engine.addReputation(1, 'Violin accompaniment');
                        if (!family.services.includes('violin')) family.services.push('violin');

                        const quotes = [
                            I18n.T('chapel.aida_quote_1'), I18n.T('chapel.aida_quote_2'),
                            I18n.T('chapel.aida_quote_3'), I18n.T('chapel.aida_quote_4'),
                            I18n.T('chapel.aida_quote_5')
                        ];
                        const quote = quotes[Math.floor(Math.random() * quotes.length)];
                        
                        Dialogue.show(I18n.T('chapel.violin_accept_title'), quote, [
                            { text: I18n.T('ov.dismiss'), action: () => finishChapel(family) }
                        ]);
                    } else {
                        const rejections = [
                            I18n.T('chapel.violin_reject_1'), I18n.T('chapel.violin_reject_2'), I18n.T('chapel.violin_reject_3')
                        ];
                        const rejection = rejections[Math.floor(Math.random() * rejections.length)];
                        Dialogue.show(I18n.T('chapel.violin_decline_title'), rejection, [
                            { text: I18n.T('ov.dismiss'), action: () => finishChapel(family) }
                        ]);
                    }
                }},
                { text: I18n.T('chapel.violin_offer_no'), action: () => finishChapel(family) }
            ]
        );
    }

    function finishChapel(family) {
        if (!family) return;
        family.chapelDone = true;
        if (!family.services.includes('chapel')) family.services.push('chapel');
        document.getElementById('chapel-sermon-select').style.display = 'none';
        checkServiceComplete(family);
        updateChapelBadge();
        if (typeof Main !== 'undefined') Main.showScreen('hub');
    }

    function updateChapelBadge() {
        const s = Engine.getState();
        const pending = s.families.filter(f => f.active && f.embalmed && f.wantsChapel && !f.chapelDone && (f.wantsViewing || f.cooldownDone));
        if (pending.length > 0) {
            Engine.Notifications.addBadge('chapel', true);
        } else {
            Engine.Notifications.clearBadge('chapel');
        }
    }

    // ===== OFFICE =====
    function showOffice() {
        activeRoom = 'office';
        const s = Engine.getState();
        const list = document.getElementById('upgrades-list');
        list.innerHTML = DATA.upgrades.map(u => {
            const owned = s.upgrades.includes(u.id) && !u.repeatable;
            const canBuy = s.level >= u.level && s.money >= u.cost && !owned;
            const locked = s.level < u.level;
            const maxed = u.repeatable && u.id === 'embalm_train' && s.embalmTrainCount >= (u.maxRepeats || 5);
            return `<div class="upgrade-card ${owned ? 'owned' : ''} ${locked ? 'locked' : ''}">
                <div class="upgrade-icon">${Icons.getHTML(u.icon)}</div>
                <div class="upgrade-info">
                    <div class="upgrade-name">${u.name} ${owned ? '✓' : ''} ${maxed ? '(MAX)' : ''}</div>
                    <div class="upgrade-desc">${u.desc}</div>
                    ${locked ? `<div class="upgrade-desc">${I18n.T('eng.need_level', u.level)}</div>` : ''}
                    ${u.repeatable ? `<div class="upgrade-desc">${I18n.T('off.trained', s.embalmTrainCount, u.maxRepeats || 5)}</div>` : ''}
                </div>
                <div>
                    <div class="upgrade-price">$${u.cost}</div>
                    ${!owned && !locked && !maxed ? `<button class="upgrade-buy" onclick="Rooms.buyUpgrade('${u.id}')">BUY</button>` : ''}
                </div>
            </div>`;
        }).join('');
    }

    function buyUpgradeUI(id) {
        if (Engine.buyUpgrade(id)) showOffice();
    }

    // ===== SERVICE COMPLETION CHECK =====
    function checkServiceComplete(family) {
        if (!family.active) return;
        const needsViewing = family.wantsViewing && !family.viewed;
        const needsCooldown = !family.wantsViewing && !family.cooldownDone;
        const needsChapel = family.wantsChapel && Engine.hasUpgrade('chapel') && !family.chapelDone;
        const needsCremation = family.wantsCremation && Engine.hasUpgrade('crematorium') && !family.cremated;

        if (needsCremation && family.embalmed && (family.viewed || family.cooldownDone) && !family.cremationWaitingNotified) {
            Engine.showToast(I18n.T('crema.waiting_toast', family.deceasedName), 'warning');
            family.cremationWaitingNotified = true;
            Engine.Notifications.addBadge('crematorium');
        }

        if (needsChapel && family.embalmed && (family.viewed || family.cooldownDone) && !family.chapelWaitingNotified) {
            Engine.showToast(I18n.T('chapel.waiting_toast', family.deceasedName), 'warning');
            family.chapelWaitingNotified = true;
            Engine.Notifications.addBadge('chapel');
        }

        if (!needsViewing && !needsCooldown && !needsChapel && !needsCremation && family.embalmed) {
            if (!family.waitingForTransport) {
                family.waitingForTransport = true;
                Engine.showToast(I18n.T('rec.services_complete', family.deceasedName), 'success');
                Engine.Notifications.addBadge('reception');
                Engine.Notifications.addBadge('phone');
                
                Engine.save();
            }
        }
    }

    return {
        updateActiveRoom, initReception,
        showReception, showEmbalming, showCafeteria, showCrematorium, showViewing, showChapel, showOffice,
        serveOrder, handleAlcohol, doCremation, startSermon, selectSermon,
        buyUpgrade: buyUpgradeUI, checkServiceComplete,
        get activeRoom() { return activeRoom; },
        set activeRoom(v) { activeRoom = v; }
    };
})();
