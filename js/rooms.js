/* ===== THANATOPRACTOR - Room Logic ===== */
const Rooms = (() => {
    let activeRoom = null;

    function updateActiveRoom() {
        if (activeRoom === 'crematorium') updateCrematorium();
        if (activeRoom === 'cafeteria') showCafeteria();
    }

    // ===== RECEPTION =====
    function initReception() {
        document.getElementById('btn-new-arrival').onclick = () => {
            const s = Engine.getState();
            if ((s.pendingArrivals || 0) <= 0) {
                Engine.showToast(I18n.T('rec.no_waiting'), 'warning');
                return;
            }
            s.pendingArrivals--;
            Audio8Bit.SFX.bell();
            const family = Families.generate();
            Families.addFamily(family);
            s.activeFamilyId = family.id;
            Dialogue.playArrivalSequence(family);
            Engine.Notifications.clearBadge('arrival');
        };
        document.getElementById('btn-phone-call').onclick = () => {
            Audio8Bit.SFX.click();
            Engine.Notifications.clearBadge('phone');
            const s = Engine.getState();
            
            const phoneChoices = [
                { text: I18n.T('rec.job_interview'), action: () => {
                    if (s.money < 50) { Engine.showToast(I18n.T('eng.not_enough'), 'danger'); return; }
                    Engine.addMoney(-50, 'Job Interview Call');
                    Engine.showToast(I18n.T('rec.job_result'), 'warning');
                }},
                { text: I18n.T('rec.order_hearse'), action: () => {
                    if (s.money < 150) { Engine.showToast(I18n.T('eng.not_enough'), 'danger'); return; }
                    
                    const waitingFams = s.families.filter(f => f.active && f.waitingForTransport && !f.transportOrdered);
                    if (waitingFams.length === 0) {
                        Engine.addMoney(-150, 'Ordered Hearse');
                        Engine.showToast(I18n.T('rec.hearse_ordered'), 'success');
                        return;
                    }
                    
                    const cost = waitingFams.length * 150;
                    if (s.money < cost) { Engine.showToast(I18n.T('rec.need_money_hearse', cost, waitingFams.length), 'danger'); return; }
                    
                    Engine.addMoney(-cost, `Ordered ${waitingFams.length} Hearse Transfer(s)`);
                    waitingFams.forEach(f => {
                        f.transportOrdered = true;
                        const task = s.schedule.find(t => t.type === 'transport_ready' && t.familyId === f.id);
                        if (task) task.desc = `${I18n.T('rec.car_ordered', f.deceasedName)}`;
                        
                        s.schedule.push({
                            time: Math.round(s.time + 60),
                            type: 'hearse_arrival',
                            familyId: f.id,
                            desc: I18n.T('rec.hearse_picking', f.deceasedName),
                            triggered: false
                        });
                    });
                    Engine.Notifications.clearBadge('reception');
                    Engine.showToast(I18n.T('rec.hearse_multi'), 'success');
                }},
                { text: I18n.T('rec.order_flowers'), action: () => {
                    if (s.money < 50) { Engine.showToast(I18n.T('eng.not_enough'), 'danger'); return; }
                    Engine.addMoney(-50, 'Ordered Flowers');
                    Engine.showToast(I18n.T('rec.flowers_result'), 'success');
                    Engine.addReputation(2, 'Beautiful fresh flowers');
                }},
                { text: I18n.T('rec.nevermind'), action: () => {} }
            ];

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
                            // Permanent Hearse - Standard behavior (1h wait + cooldown)
                            f.transportOrdered = true;
                            s.personalHearseCooldown = s.time + 120; // 2 hour cooldown

                            const task = s.schedule.find(t => t.type === 'transport_ready' && t.familyId === f.id);
                            if (task) task.desc = I18n.T('rec.personal_enroute', f.deceasedName);
                            
                            s.schedule.push({
                                time: Math.round(s.time + 60),
                                type: 'hearse_arrival',
                                familyId: f.id,
                                desc: I18n.T('rec.personal_pickup', f.deceasedName),
                                triggered: false
                            });
                            Engine.showToast(I18n.T('rec.car_dispatched', f.deceasedName), 'success');
                        } else {
                            // Niece's Car - IMMEDIATE & SINGLE USE
                            s.temporaryHearseAvailable = false;
                            Families.completeFamily(f.id);
                            Engine.showToast(I18n.T('rec.niece_arrived', f.deceasedName), 'success');
                        }

                        Engine.Notifications.clearBadge('reception');
                    }
                });
            }

            Dialogue.show(I18n.T('rec.phone_title'), I18n.T('rec.phone_subtitle'), phoneChoices);
        };
        document.getElementById('btn-paperwork').onclick = () => {
            Audio8Bit.SFX.click();
            Engine.Notifications.clearBadge('paperwork');
            const s = Engine.getState();
            if (!s.activePaperwork) {
                Engine.showToast(I18n.T('rec.no_paperwork'), '');
                return;
            }

            const task = s.activePaperwork;
            Dialogue.show(I18n.T('rec.pw_title'), `${task.text}\n\n${I18n.T('rec.pw_dc', task.dc)}`, [
                { text: I18n.T('rec.pw_roll'), action: () => {
                    Engine.rollD20(0, (roll, total, result) => {
                        if (total >= task.dc) {
                            Engine.addMoney(task.reward, 'Paperwork success');
                            if (task.repReward) Engine.addReputation(task.repReward, 'Paperwork success');
                            Engine.showToast(I18n.T('rec.pw_success', task.reward), 'success');
                            
                            // Check if this was the niece's car paperwork
                            if (task.text.includes('sobrina') || task.text.includes('niece')) {
                                s.temporaryHearseAvailable = true;
                                Engine.showToast(I18n.T('rec.niece_desc'), 'success');
                            }
                        } else {
                            Engine.addMoney(task.penalty, 'Paperwork failed');
                            if (task.repPenalty) Engine.addReputation(task.repPenalty, 'Paperwork failed');
                            Engine.showToast(I18n.T('rec.pw_fail', Math.abs(task.penalty)), 'danger');
                        }
                        s.activePaperwork = null;
                        document.getElementById('btn-paperwork').style.opacity = '1';
                        Engine.Notifications.clearBadge('paperwork');
                        Engine.Notifications.clearBadge('reception');
                    });
                }},
                { text: DATA.paperworkExcuses[Math.floor(Math.random() * DATA.paperworkExcuses.length)] + ` ${I18n.T('rec.pw_decline')}`, action: () => {
                    // Dismiss the paperwork task completely
                    s.activePaperwork = null;
                    Engine.Notifications.clearBadge('reception');
                    Engine.Notifications.clearBadge('paperwork');
                    document.getElementById('btn-paperwork').style.opacity = '1';
                    Engine.showToast(I18n.T('rec.pw_discarded'), '');
                }}
            ]);
        };
        document.getElementById('btn-upgrades-shortcut').onclick = () => {
            Audio8Bit.SFX.click();
            Main.showScreen('office');
        };
    }

    function showReception() {
        activeRoom = 'reception';
        Engine.Notifications.clearBadge('reception');
        const list = document.getElementById('appointment-list');
        const sched = Engine.getState().schedule;
        if (sched.length === 0) {
            list.innerHTML = `<p class="dim-text">${I18n.T('rec.no_appointments')}</p>`;
        } else {
            // Sort: Future tasks first (earliest to latest), then Past tasks (latest to earliest)
            const sorted = sched.slice().sort((a, b) => {
                if (a.triggered !== b.triggered) return a.triggered ? 1 : -1;
                return a.triggered ? b.time - a.time : a.time - b.time;
            });
            // Only show up to 3 completed tasks
            let completedCount = 0;
            const filtered = sorted.filter(s => {
                if (s.triggered) {
                    completedCount++;
                    return completedCount <= 3;
                }
                return true;
            });
            list.innerHTML = filtered.map(s => {
                const t = Math.round(s.time), h = Math.floor(t / 60), m = t % 60;
                return `<div class="schedule-item${s.triggered ? ' completed' : ''}"><span>${h}:${m.toString().padStart(2,'0')}</span><span>${s.desc}</span><span>${s.triggered ? '✓' : '⏳'}</span></div>`;
            }).join('');
        }
    }

    // ===== EMBALMING =====
    let embalmTarget = null;
    let embalmTasks = { clean: false, treat: false, dress: false, prepare: false };

    function showEmbalming() {
        activeRoom = 'embalming';
        Engine.Notifications.clearBadge('embalming');
        const s = Engine.getState();
        const active = Families.getActive().filter(f => f.arrived && !f.embalmed);

        if (active.length === 0) {
            document.getElementById('embalm-status').textContent = I18n.T('emb.no_body');
            document.getElementById('btn-embalm-roll').style.display = 'none';
            resetEmbalmTasks();
            return;
        }

        embalmTarget = active[0];
        document.getElementById('embalm-status').textContent = I18n.T('emb.preparing', embalmTarget.deceasedName);

        // Update supplies display
        document.getElementById('supply-formal').textContent = s.supplies.formaldehyde;
        document.getElementById('supply-humect').textContent = s.supplies.humectant;
        document.getElementById('supply-dye').textContent = s.supplies.dye;
        document.getElementById('supply-outfits').textContent = s.supplies.outfits;

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
            rollBtn.textContent = I18n.T('emb.finish', penalty < 0 ? `(${penalty} Penalty)` : '(No Penalty)');
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
                    catastrophic: I18n.T('emb.catastrophic'),
                    bad: I18n.T('emb.bad'),
                    mediocre: I18n.T('emb.mediocre'),
                    good: I18n.T('emb.good'),
                    excellent: I18n.T('emb.excellent')
                };
                Engine.showToast(msgs[quality], quality === 'good' || quality === 'excellent' ? 'success' : 'warning');
                Dialogue.show(I18n.T('emb.quality_title', I18n.T('dice.' + quality)), msgs[quality], [
                    { text: I18n.T('ov.dismiss'), action: () => showEmbalming() }
                ]);
                Families.updateSatisfaction(embalmTarget.id, quality === 'excellent' ? 20 : quality === 'good' ? 10 : quality === 'mediocre' ? 0 : quality === 'bad' ? -15 : -30, `Embalming: ${quality}`);

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
    const SUPPLY_BASE = {
        formaldehyde: { label: I18n.T('shop.formaldehyde'), base: 18, unit: I18n.T('shop.vials'), key: 'formaldehyde' },
        humectant:    { label: I18n.T('shop.humectant'),    base: 14, unit: I18n.T('shop.jars'),  key: 'humectant' },
        dye:          { label: I18n.T('shop.dye'),          base: 10, unit: I18n.T('shop.tubes'), key: 'dye' },
        outfits:      { label: I18n.T('shop.outfit'),       base: 55, unit: I18n.T('shop.sets'),  key: 'outfits' }
    };

    function openSuppliesShop() {
        const s = Engine.getState();
        const overlay = document.getElementById('supplies-overlay');

        // Generate fluctuating prices fresh each visit
        const prices = {};
        let marketMood = '';
        const roll = Math.random();
        if (roll < 0.15) { marketMood = I18n.T('shop.mood_clearance'); }
        else if (roll < 0.6) { marketMood = I18n.T('shop.mood_normal'); }
        else if (roll < 0.85) { marketMood = I18n.T('shop.mood_high'); }
        else { marketMood = I18n.T('shop.mood_shortage'); }

        document.getElementById('shop-subtitle').textContent = marketMood;

        const quantities = {};
        Object.keys(SUPPLY_BASE).forEach(key => {
            const item = SUPPLY_BASE[key];
            // Price multiplier: 0.5x to 5x depending on market
            let mult;
            if (roll < 0.15)      mult = 0.4 + Math.random() * 0.4;   // 0.4–0.8x cheap
            else if (roll < 0.6)  mult = 0.8 + Math.random() * 0.6;   // 0.8–1.4x normal
            else if (roll < 0.85) mult = 1.5 + Math.random() * 1.5;   // 1.5–3x expensive
            else                  mult = 3.0 + Math.random() * 2.5;   // 3–5.5x extortionate

            prices[key] = Math.ceil(item.base * mult);
            quantities[key] = 0;
        });

        function priceClass(key) {
            const ratio = prices[key] / SUPPLY_BASE[key].base;
            if (ratio < 0.8) return 'price-cheap';
            if (ratio < 1.5) return 'price-normal';
            if (ratio < 3.0) return 'price-expensive';
            return 'price-extortionate';
        }

        function renderShop() {
            let total = 0;
            Object.keys(SUPPLY_BASE).forEach(k => total += prices[k] * quantities[k]);
            document.getElementById('shop-total').textContent = total;

            document.getElementById('shop-items').innerHTML = Object.keys(SUPPLY_BASE).map(key => {
                const item = SUPPLY_BASE[key];
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
            const total = Object.keys(SUPPLY_BASE).reduce((sum, k) => sum + prices[k] * quantities[k], 0);
            if (total === 0) { Engine.showToast(I18n.T('shop.select_item'), 'warning'); return; }
            if (s.money < total) { Engine.showToast(I18n.T('shop.no_money', total), 'danger'); return; }

            Engine.addMoney(-total, 'Supply purchase');
            
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
    }

    function serveOrder(idx) {
        const s = Engine.getState();
        const order = s.cafeOrders[idx];
        if (!order || order.served) return;
        order.served = true;
        Engine.addMoney(order.item.price, `Sold ${order.item.item}`);
        Families.updateSatisfaction(order.familyId, 3, 'Cafeteria service');
        Audio8Bit.SFX.success();
        showCafeteria();
    }

    function handleAlcohol(idx) {
        const s = Engine.getState();
        const order = s.cafeOrders[idx];
        if (!order || order.served) return;
        Dialogue.show(I18n.T('cafe.alcohol_title'), DATA.cafeAlcoholRequests[Math.floor(Math.random() * DATA.cafeAlcoholRequests.length)],
            DATA.cafeAlcoholChoices.map(c => ({
                text: c.text,
                action: () => {
                    if (c.rep) Engine.addReputation(c.rep, c.rep > 0 ? 'Handled alcohol request well' : 'Served alcohol illegally');
                    if (c.money) Engine.addMoney(c.money, 'Alcohol-related');
                    if (c.satisfaction) Families.updateSatisfaction(order.familyId, c.satisfaction, c.satisfaction > 0 ? 'Got what they wanted' : 'Denied alcohol');
                    
                    // Secret inspector logic: if rep is negative, it's alcohol
                    if (c.rep < 0) {
                        s.alcoholServedToday++;
                        if (s.alcoholServedToday >= 3) {
                            // CLOSE CAFETERIA
                            s.upgrades = s.upgrades.filter(u => u !== 'cafeteria');
                            s.cafeOrders = [];
                            s.alcoholServedToday = 0;
                            Dialogue.show(I18n.T('cafe.inspector_title'), I18n.T('cafe.inspector_msg'), [
                                { text: I18n.T('cafe.inspector_ok'), action: () => {
                                    Main.showScreen('hub');
                                    // Lock the nav again
                                    const nav = document.getElementById('nav-cafeteria');
                                    if (nav) {
                                        nav.classList.add('locked');
                                        const lock = nav.querySelector('.nav-lock');
                                        if (lock) lock.style.display = 'block';
                                    }
                                }}
                            ]);
                            return;
                        }
                    }
                    
                    order.served = true;
                    showCafeteria();
                }
            }))
        );
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
            if (s.cremaFuel <= 0) { Engine.showToast(I18n.T('crema.add_fuel_first'), 'warning'); return; }
            if (s.cremaIgnited) { Engine.showToast(I18n.T('crema.already_burning'), 'warning'); return; }
            s.cremaIgnited = true;
            Audio8Bit.SFX.fire();
            Engine.showToast(I18n.T('crema.ignited'), '');
            updateCrematorium();
        };

        // Schedule list
        const schedList = document.getElementById('crema-schedule-list');
        const active = Families.getActive().filter(f => f.embalmed && f.wantsCremation && !f.cremated && (f.wantsViewing || f.cooldownDone));
        if (active.length === 0) {
            schedList.innerHTML = `<p class="dim-text">${I18n.T('crema.no_scheduled')}</p>`;
        } else {
            schedList.innerHTML = active.map(f => {
                const ready = Engine.getState().cremaTemp >= 800;
                const starting = f.cremationStarted;
                return `<div class="schedule-item">
                    <span>${f.deceasedName}</span>
                    <span>${starting ? I18n.T('crema.incinerating') : (ready ? `<button class="action-btn pink-btn" style="padding:4px 8px;width:auto" onclick="Rooms.doCremation(${f.id})">${I18n.T('crema.btn_cremate')}</button>` : I18n.T('crema.need_800'))}</span>
                </div>`;
            }).join('');
        }
    }

    function updateCrematorium() {
        const s = Engine.getState();
        document.getElementById('crema-temp').textContent = Math.round(s.cremaTemp) + '°C';
        document.getElementById('crema-temp').style.color = s.cremaTemp >= 780 ? 'var(--success)' : s.cremaTemp >= 500 ? 'var(--warning)' : 'var(--text-primary)';
        document.getElementById('crema-fuel').textContent = `${s.cremaFuel.toFixed(1)}/10`;
        document.getElementById('crema-fuel-fill').style.width = (s.cremaFuel / 10 * 100) + '%';
        const fireEl = document.getElementById('furnace-fire');
        fireEl.style.height = Math.min(100, (s.cremaTemp / 1000) * 100) + '%';

        const eff = s.cremaTemp >= 780 && s.cremaTemp <= 820 ? I18n.T('crema.eff_perfect') : s.cremaTemp >= 600 ? I18n.T('crema.eff_heating') : s.cremaTemp > 100 ? I18n.T('crema.eff_warming') : '—';
        document.getElementById('crema-efficiency').textContent = eff;
    }

    function doCremation(familyId) {
        const f = Families.getById(familyId);
        const s = Engine.getState();
        if (!f || f.cremated || f.cremationStarted) return;

        f.cremationStarted = true;
        Engine.showToast(I18n.T('crema.cremating', f.deceasedName), 'success');
        Audio8Bit.SFX.fire();

        s.schedule.push({
            time: Math.round(s.time + 60),
            type: 'cremation_done',
            familyId: f.id,
            desc: I18n.T('crema.done_desc', f.deceasedName),
            triggered: false,
            temp: s.cremaTemp
        });
        
        showCrematorium();
    }

    // ===== VIEWING ROOM =====
    let viewingFamily = null;

    function showViewing() {
        activeRoom = 'viewing';
        Engine.Notifications.clearBadge('viewing');
        const active = Families.getActive().filter(f => f.embalmed && f.wantsViewing && !f.viewed);

        if (active.length === 0) {
            document.getElementById('view-request-list').innerHTML = `<p class="dim-text">${I18n.T('view.no_active')}</p>`;
            document.getElementById('viewing-controls').style.display = 'none';
            return;
        }

        viewingFamily = active[0];
        document.getElementById('viewing-controls').style.display = 'block';
        document.getElementById('view-mood-fill').style.width = viewingFamily.satisfaction + '%';
        document.getElementById('view-mood-val').textContent = viewingFamily.satisfaction + '%';

        // Generate requests
        const requests = [];
        if (Math.random() > 0.3) requests.push(DATA.viewingRequests[0]); // see body
        if (Math.random() > 0.5) requests.push(DATA.viewingRequests[1]); // water
        if (Math.random() > 0.6) requests.push(DATA.viewingRequests[2]); // temperature
        if (Math.random() > 0.8) requests.push(DATA.viewingRequests[3]); // faint
        if (requests.length === 0) requests.push(DATA.viewingRequests[6]); // privacy

        document.getElementById('view-request-list').innerHTML = requests.map(r =>
            `<div class="action-btn" style="pointer-events:none">${Icons.getHTML(r.icon)} ${r.text.replace('{name}', viewingFamily.deceasedName)}</div>`
        ).join('');

        // Button handlers
        const btnBody = document.getElementById('btn-view-body');
        const btnWater = document.getElementById('btn-view-water');
        const btnTemp = document.getElementById('btn-view-temp');
        const btnFirstAid = document.getElementById('btn-view-firstaid');
        
        btnBody.style.display = 'inline-block';
        btnWater.style.display = 'inline-block';
        btnTemp.style.display = 'inline-block';
        btnFirstAid.style.display = 'inline-block';

        btnBody.onclick = () => { showBody(); btnBody.style.display = 'none'; };
        btnWater.onclick = () => {
            Audio8Bit.SFX.click();
            Families.updateSatisfaction(viewingFamily.id, 5, 'Brought water');
            Engine.showToast(I18n.T('view.water_served'), 'success');
            updateViewingMood();
            btnWater.style.display = 'none';
        };
        btnTemp.onclick = () => {
            if (Engine.hasUpgrade('ac_system')) {
                Families.updateSatisfaction(viewingFamily.id, 5, 'Temperature adjusted');
                Engine.showToast(I18n.T('view.temp_adjusted'), 'success');
                btnTemp.style.display = 'none';
            } else {
                Engine.showToast(I18n.T('view.no_ac'), 'warning');
                Families.updateSatisfaction(viewingFamily.id, -5, 'No A/C');
            }
            updateViewingMood();
        };
        btnFirstAid.onclick = () => {
            if (Engine.hasUpgrade('firstaid')) {
                Audio8Bit.SFX.success();
                Families.updateSatisfaction(viewingFamily.id, 10, 'First aid administered');
                Engine.showToast(I18n.T('view.firstaid_done'), 'success');
                btnFirstAid.style.display = 'none';
            } else {
                Engine.showToast(I18n.T('view.no_firstaid'), 'danger');
                Families.updateSatisfaction(viewingFamily.id, -10, 'No first aid available');
            }
            updateViewingMood();
        };
    }

    function showBody() {
        if (!viewingFamily) return;
        const q = viewingFamily.embalmQuality || 'mediocre';
        const reactions = DATA.viewingBodyReactions[q] || DATA.viewingBodyReactions.mediocre;
        const reaction = reactions[Math.floor(Math.random() * reactions.length)].replace('{name}', viewingFamily.deceasedName);

        const satMap = { excellent: 15, good: 8, mediocre: 0, bad: -20, catastrophic: -35 };
        Families.updateSatisfaction(viewingFamily.id, satMap[q], `Saw body (${q})`);

        Dialogue.show(I18n.T('view.body_title', viewingFamily.deceasedName), reaction, [
            { text: q === 'bad' || q === 'catastrophic' ? I18n.T('view.sorry') : I18n.T('view.glad_goodbye'), action: () => {
                viewingFamily.viewed = true;
                checkServiceComplete(viewingFamily);
                updateViewingMood();
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

    function showChapel() {
        activeRoom = 'chapel';
        Engine.Notifications.clearBadge('chapel');
        const ivanQuote = DATA.ivanQuotes[Math.floor(Math.random() * DATA.ivanQuotes.length)];
        document.getElementById('ivan-speech').textContent = ivanQuote;

        const active = Families.getActive().filter(f => f.embalmed && f.wantsChapel && !f.chapelDone && (f.wantsViewing || f.cooldownDone));
        if (active.length === 0) {
            document.getElementById('chapel-service-info').innerHTML = `<p class="dim-text">${I18n.T('chapel.no_service')}</p>`;
            document.getElementById('chapel-sermon-select').style.display = 'none';
            return;
        }

        chapelFamily = active[0];
        document.getElementById('chapel-service-info').innerHTML = `
            <div>${I18n.T('chapel.ceremony_for')} <strong>${chapelFamily.deceasedName}</strong></div>
            <div>${I18n.T('chapel.religion')} ${Icons.getHTML(chapelFamily.religion.icon)} ${chapelFamily.religion.name}</div>
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
        const sermons = isCorrect ? DATA.sermons[religionId].correct : DATA.sermons.wrong;
        const sermon = sermons[Math.floor(Math.random() * sermons.length)].replace(/\{name\}/g, chapelFamily.deceasedName);

        if (isCorrect) {
            Families.updateSatisfaction(chapelFamily.id, 15, 'Correct ceremony');
            Engine.addReputation(3, 'Beautiful ceremony');
            Audio8Bit.SFX.success();
        } else {
            Families.updateSatisfaction(chapelFamily.id, -25, 'Wrong religion ceremony!');
            Engine.addReputation(-5, 'Wrong ceremony type!');
            Audio8Bit.SFX.fail();
        }

        Dialogue.show(I18n.T('chapel.ivan_speaks'), sermon, [
            { text: isCorrect ? I18n.T('chapel.correct') : I18n.T('chapel.wrong'), action: () => {
                chapelFamily.chapelDone = true;
                chapelFamily.services.push('chapel');
                document.getElementById('chapel-sermon-select').style.display = 'none';
                checkServiceComplete(chapelFamily);
                showChapel();
            }}
        ]);
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

        if (!needsViewing && !needsCooldown && !needsChapel && !needsCremation && family.embalmed) {
            if (!family.waitingForTransport) {
                family.waitingForTransport = true;
                Engine.showToast(I18n.T('rec.services_complete', family.deceasedName), 'success');
                Engine.Notifications.addBadge('reception');
                
                Engine.getState().schedule.push({
                    time: Math.round(Engine.getState().time),
                    type: 'transport_ready',
                    familyId: family.id,
                    desc: I18n.T('rec.transfer_ready', family.deceasedName),
                    triggered: true
                });
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
