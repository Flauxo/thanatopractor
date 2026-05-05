/* ===== THANATOPRACTOR - Room Logic ===== */
const Rooms = (() => {
    let activeRoom = null;

    function updateActiveRoom() {
        if (activeRoom === 'crematorium') updateCrematorium();
    }

    // ===== RECEPTION =====
    function initReception() {
        document.getElementById('btn-new-arrival').onclick = () => {
            const s = Engine.getState();
            if ((s.pendingArrivals || 0) <= 0) {
                Engine.showToast('No families are waiting right now.', 'warning');
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
            Dialogue.show('📞 PHONE MENU', 'Who would you like to call today?', [
                { text: 'Job Interview ($50)', action: () => {
                    const s = Engine.getState();
                    if (s.money < 50) { Engine.showToast('Not enough money!', 'danger'); return; }
                    Engine.addMoney(-50, 'Job Interview Call');
                    Engine.showToast('You called a candidate. They heard screaming in the background and hung up.', 'warning');
                }},
                { text: 'Order Hearse ($150)', action: () => {
                    const s = Engine.getState();
                    if (s.money < 150) { Engine.showToast('Not enough money!', 'danger'); return; }
                    
                    const waitingFams = s.families.filter(f => f.active && f.waitingForTransport);
                    if (waitingFams.length === 0) {
                        if (s.money < 150) { Engine.showToast('Not enough money!', 'danger'); return; }
                        Engine.addMoney(-150, 'Ordered Hearse');
                        Engine.showToast('Hearse ordered. The driver says he\'ll be there "eventually".', 'success');
                        return;
                    }
                    
                    const cost = waitingFams.length * 150;
                    if (s.money < cost) { Engine.showToast(`Need $${cost} for ${waitingFams.length} hearses!`, 'danger'); return; }
                    
                    Engine.addMoney(-cost, `Ordered ${waitingFams.length} Hearse Transfer(s)`);
                    waitingFams.forEach(f => {
                        f.transportOrdered = true;
                        s.schedule.push({
                            time: s.time + 60,
                            type: 'hearse_arrival',
                            familyId: f.id,
                            desc: `Hearse is picking up ${f.deceasedName}'s family.`,
                            triggered: false
                        });
                    });
                    Engine.showToast(`Hearses ordered. They will arrive in 1 hour to take ${waitingFams.length} families.`, 'success');
                    Engine.Notifications.clearBadge('phone');
                }},
                { text: 'Order Flowers ($50)', action: () => {
                    const s = Engine.getState();
                    if (s.money < 50) { Engine.showToast('Not enough money!', 'danger'); return; }
                    Engine.addMoney(-50, 'Ordered Flowers');
                    Engine.showToast('Fresh flowers delivered! The viewing room smells slightly less like formaldehyde.', 'success');
                    // Give a small rep boost
                    Engine.addReputation(2, 'Beautiful fresh flowers');
                }},
                { text: 'Nevermind', action: () => {} }
            ]);
        };
        document.getElementById('btn-paperwork').onclick = () => {
            Audio8Bit.SFX.click();
            Engine.Notifications.clearBadge('paperwork');
            const s = Engine.getState();
            if (!s.activePaperwork) {
                Engine.showToast('📝 No paperwork right now. Enjoy the quiet.', '');
                return;
            }

            const task = s.activePaperwork;
            Dialogue.show('📝 PAPERWORK', `${task.text}\n\nDifficulty (DC): ${task.dc}`, [
                { text: 'Roll D20', action: () => {
                    Engine.rollD20(0, (roll, total, result) => {
                        if (total >= task.dc) {
                            Engine.addMoney(task.reward, 'Paperwork success');
                            Engine.showToast(`Success! You earned $${task.reward}.`, 'success');
                        } else {
                            Engine.addMoney(task.penalty, 'Paperwork failed');
                            Engine.showToast(`Failure! You lost $${Math.abs(task.penalty)}.`, 'danger');
                        }
                        s.activePaperwork = null;
                        document.getElementById('btn-paperwork').style.opacity = '1';
                        Engine.Notifications.clearBadge('paperwork');
                        Engine.Notifications.clearBadge('reception');
                    });
                }},
                { text: DATA.paperworkExcuses[Math.floor(Math.random() * DATA.paperworkExcuses.length)] + ' (Decline)', action: () => {
                    // Dismiss the paperwork task completely
                    s.activePaperwork = null;
                    Engine.Notifications.clearBadge('reception');
                    Engine.Notifications.clearBadge('paperwork');
                    document.getElementById('btn-paperwork').style.opacity = '1';
                    Engine.showToast('📝 Paperwork discarded.', '');
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
            list.innerHTML = '<p class="dim-text">No appointments today</p>';
        } else {
            list.innerHTML = sched.slice().sort((a, b) => a.time - b.time).map(s => {
                const h = Math.floor(s.time / 60), m = s.time % 60;
                return `<div class="schedule-item"><span>${h}:${m.toString().padStart(2,'0')}</span><span>${s.desc}</span><span>${s.triggered ? '✓' : '⏳'}</span></div>`;
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
            document.getElementById('embalm-status').textContent = 'No body to prepare';
            document.getElementById('btn-embalm-roll').style.display = 'none';
            resetEmbalmTasks();
            return;
        }

        embalmTarget = active[0];
        document.getElementById('embalm-status').textContent = `Preparing: ${embalmTarget.deceasedName}`;

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
                    Engine.showToast('⚠️ Not enough chemicals!', 'warning');
                    return;
                }
                if (task === 'dress' && s.supplies.outfits < 1) {
                    Engine.showToast('⚠️ No outfits left!', 'warning');
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
            rollBtn.textContent = `🎲 FINISH & ROLL ${penalty < 0 ? `(${penalty} Penalty)` : '(No Penalty)'}`;
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
                    catastrophic: `💀 Oh no. ${embalmTarget.deceasedName} looks like a haunted wax figure. This will NOT end well.`,
                    bad: `😬 ${embalmTarget.deceasedName} looks... off. Like they're judging you from beyond.`,
                    mediocre: `😐 ${embalmTarget.deceasedName} looks acceptable. Not great, not terrible. Like a 3.6.`,
                    good: `👍 ${embalmTarget.deceasedName} looks peaceful. Good job!`,
                    excellent: `✨ ${embalmTarget.deceasedName} looks better dead than most people alive. Masterwork!`
                };
                Engine.showToast(msgs[quality], quality === 'good' || quality === 'excellent' ? 'success' : 'warning');
                Families.updateSatisfaction(embalmTarget.id, quality === 'excellent' ? 20 : quality === 'good' ? 10 : quality === 'mediocre' ? 0 : quality === 'bad' ? -15 : -30, `Embalming: ${quality}`);

                if (embalmTarget.wantsViewing) {
                    Engine.Notifications.addBadge('viewing');
                } else {
                    const s = Engine.getState();
                    s.schedule.push({
                        time: s.time + 60,
                        type: 'cooldown_done',
                        familyId: embalmTarget.id,
                        desc: (embalmTarget.wantsCremation && Engine.hasUpgrade('crematorium')) 
                                ? `${embalmTarget.deceasedName} is ready for cremation.`
                                : `Family of ${embalmTarget.deceasedName} arrived for pick-up.`,
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
                    Engine.showToast(`🧪 ${remaining[0].deceasedName} still needs embalming!`, '');
                }
            });
        };
    }

    // ===== SUPPLIES SHOP =====
    const SUPPLY_BASE = {
        formaldehyde: { label: 'Formaldehyde', base: 18, unit: 'vials', key: 'formaldehyde' },
        humectant:    { label: 'Humectant',    base: 14, unit: 'jars',  key: 'humectant' },
        dye:          { label: 'Cosmetic Dye', base: 10, unit: 'tubes', key: 'dye' },
        outfits:      { label: 'Burial Outfit',base: 55, unit: 'sets',  key: 'outfits' }
    };

    function openSuppliesShop() {
        const s = Engine.getState();
        const overlay = document.getElementById('supplies-overlay');

        // Generate fluctuating prices fresh each visit
        const prices = {};
        let marketMood = '';
        const roll = Math.random();
        if (roll < 0.15) { marketMood = '📉 Supplier clearance! Prices low.'; }
        else if (roll < 0.6) { marketMood = '📦 Normal market conditions.'; }
        else if (roll < 0.85) { marketMood = '📈 High demand. Prices elevated.'; }
        else { marketMood = '💀 Critical shortage. Prices through the roof!'; }

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
                        <div class="shop-item-name">${item.label}<br><span class="shop-item-stock">In stock: ${stock} ${item.unit}</span></div>
                        <div class="shop-item-price ${cls}">$${prices[key]}/ea</div>
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
            if (total === 0) { Engine.showToast('Select at least one item!', 'warning'); return; }
            if (s.money < total) { Engine.showToast(`Not enough money! Need $${total}.`, 'danger'); return; }

            Engine.addMoney(-total, 'Supply purchase');
            Object.keys(SUPPLY_BASE).forEach(k => { s.supplies[k] += quantities[k]; });
            overlay.style.display = 'none';
            showEmbalming();
            Engine.showToast('📦 Supplies delivered!', 'success');
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
            orderList.innerHTML = '<p class="dim-text">No active orders right now.</p>';
            return;
        }

        orderList.innerHTML = s.cafeOrders.map((o, i) => {
            const iconHTML = o.type === 'alcohol' ? Icons.getHTML('🍺') : Icons.getHTML(o.item.icon);
            if (o.served) return `<div class="action-btn" style="opacity:0.4">${iconHTML} ${o.type === 'alcohol' ? 'Alcohol request' : o.item.item} — ✓ Served</div>`;
            if (o.type === 'alcohol') {
                return `<div class="action-btn" style="border-color:var(--warning)" onclick="Rooms.handleAlcohol(${i})">${iconHTML} Alcohol Request</div>`;
            }
            return `<div class="action-btn" onclick="Rooms.serveOrder(${i})">${iconHTML} ${o.item.item} — $${o.item.price}</div>`;
        }).join('');

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
        Dialogue.show('🍺 ALCOHOL REQUEST', DATA.cafeAlcoholRequests[Math.floor(Math.random() * DATA.cafeAlcoholRequests.length)],
            DATA.cafeAlcoholChoices.map(c => ({
                text: c.text,
                action: () => {
                    if (c.rep) Engine.addReputation(c.rep, c.rep > 0 ? 'Handled alcohol request well' : 'Served alcohol illegally');
                    if (c.money) Engine.addMoney(c.money, 'Alcohol-related');
                    if (c.satisfaction) Families.updateSatisfaction(order.familyId, c.satisfaction, c.satisfaction > 0 ? 'Got what they wanted' : 'Denied alcohol');
                    order.served = true;
                    showCafeteria();
                }
            }))
        );
    }

    function updateCafeSatisfaction() {
        const s = Engine.getState();
        const served = s.cafeOrders.filter(o => o.served).length;
        const total = cafeOrders.length || 1;
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
            if (s.money < 50) { Engine.showToast('Not enough money for fuel!', 'danger'); return; }
            if (s.cremaFuel >= 10) { Engine.showToast('Fuel tank is full!', 'warning'); return; }
            Engine.addMoney(-50, 'Crematorium fuel');
            s.cremaFuel = Math.min(10, s.cremaFuel + 2);
            Audio8Bit.SFX.fire();
            updateCrematorium();
        };

        document.getElementById('btn-ignite').onclick = () => {
            const s = Engine.getState();
            if (s.cremaFuel <= 0) { Engine.showToast('Add fuel first!', 'warning'); return; }
            if (s.cremaIgnited) { Engine.showToast('Already burning!', 'warning'); return; }
            s.cremaIgnited = true;
            Audio8Bit.SFX.fire();
            Engine.showToast('🔥 Crematorium ignited! Temperature rising...', '');
            updateCrematorium();
        };

        // Schedule list
        const schedList = document.getElementById('crema-schedule-list');
        const active = Families.getActive().filter(f => f.embalmed && f.wantsCremation && !f.cremated && (f.wantsViewing || f.cooldownDone));
        if (active.length === 0) {
            schedList.innerHTML = '<p class="dim-text">No cremations scheduled</p>';
        } else {
            schedList.innerHTML = active.map(f => {
                const ready = Engine.getState().cremaTemp >= 750;
                return `<div class="schedule-item">
                    <span>${f.deceasedName}</span>
                    <span>${ready ? '<button class="action-btn pink-btn" style="padding:4px 8px;width:auto" onclick="Rooms.doCremation(${f.id})">CREMATE</button>' : '⏳ Need 800°C'}</span>
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

        const eff = s.cremaTemp >= 780 && s.cremaTemp <= 820 ? 'Perfect!' : s.cremaTemp >= 600 ? 'Heating...' : s.cremaTemp > 100 ? 'Warming up' : '—';
        document.getElementById('crema-efficiency').textContent = eff;
    }

    function doCremation(familyId) {
        const f = Families.getById(familyId);
        const s = Engine.getState();
        if (!f || f.cremated) return;

        let msg, satChange;
        if (s.cremaTemp >= 780 && s.cremaTemp <= 850) {
            msg = `✨ Perfect cremation! ${f.deceasedName}'s ashes are clean and pure. The family will be pleased.`;
            satChange = 15;
        } else if (s.cremaTemp >= 700) {
            msg = `👍 Decent cremation. Some larger fragments remain, but overall acceptable.`;
            satChange = 5;
        } else if (s.cremaTemp >= 500) {
            msg = `😬 Medium rare. The ashes are... chunky. The family got some unexpected "souvenirs."`;
            satChange = -15;
        } else {
            msg = `🔥 The body is barely singed. These "ashes" are basically jerky. This is a disaster.`;
            satChange = -30;
        }

        f.cremated = true;
        f.services.push('cremation');
        Families.updateSatisfaction(familyId, satChange, `Cremation at ${Math.round(s.cremaTemp)}°C`);
        Engine.showToast(msg, satChange > 0 ? 'success' : 'danger');
        Audio8Bit.SFX.fire();

        // Check if service complete
        checkServiceComplete(f);
        showCrematorium();
    }

    // ===== VIEWING ROOM =====
    let viewingFamily = null;

    function showViewing() {
        activeRoom = 'viewing';
        Engine.Notifications.clearBadge('viewing');
        const active = Families.getActive().filter(f => f.embalmed && f.wantsViewing && !f.viewed);

        if (active.length === 0) {
            document.getElementById('view-request-list').innerHTML = '<p class="dim-text">No active viewing</p>';
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
            Engine.showToast('💧 Water served. Small gestures matter.', 'success');
            updateViewingMood();
            btnWater.style.display = 'none';
        };
        btnTemp.onclick = () => {
            if (Engine.hasUpgrade('ac_system')) {
                Families.updateSatisfaction(viewingFamily.id, 5, 'Temperature adjusted');
                Engine.showToast('❄️ Temperature adjusted. Much better.', 'success');
                btnTemp.style.display = 'none';
            } else {
                Engine.showToast('⚠️ No A/C system! Buy it in Upgrades.', 'warning');
                Families.updateSatisfaction(viewingFamily.id, -5, 'No A/C');
            }
            updateViewingMood();
        };
        btnFirstAid.onclick = () => {
            if (Engine.hasUpgrade('firstaid')) {
                Audio8Bit.SFX.success();
                Families.updateSatisfaction(viewingFamily.id, 10, 'First aid administered');
                Engine.showToast('🩹 First aid administered. Crisis averted!', 'success');
                btnFirstAid.style.display = 'none';
            } else {
                Engine.showToast('⚠️ No First Aid Kit! Someone is still on the floor!', 'danger');
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

        Dialogue.show(`👁️ VIEWING — ${viewingFamily.deceasedName}`, reaction, [
            { text: q === 'bad' || q === 'catastrophic' ? 'I... I\'m so sorry.' : 'I\'m glad you could say goodbye.', action: () => {
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
            document.getElementById('chapel-service-info').innerHTML = '<p class="dim-text">No service scheduled</p>';
            document.getElementById('chapel-sermon-select').style.display = 'none';
            return;
        }

        chapelFamily = active[0];
        document.getElementById('chapel-service-info').innerHTML = `
            <div>Ceremony for: <strong>${chapelFamily.deceasedName}</strong></div>
            <div>Religion: ${Icons.getHTML(chapelFamily.religion.icon)} ${chapelFamily.religion.name}</div>
            <div style="margin-top:8px"><button class="action-btn pink-btn" onclick="Rooms.startSermon()"><span class="custom-icon" data-icon="music"></span> BEGIN CEREMONY</button></div>
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

        Dialogue.show('🎤 IVAN SPEAKS', sermon, [
            { text: isCorrect ? 'Beautiful ceremony, Ivan.' : 'Oh no...', action: () => {
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
                    ${locked ? `<div class="upgrade-desc">Requires Level ${u.level}</div>` : ''}
                    ${u.repeatable ? `<div class="upgrade-desc">Trained: ${s.embalmTrainCount}/${u.maxRepeats || 5}</div>` : ''}
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
            Engine.showToast(`🔥 La familia ${family.deceasedName} está esperando la cremación.`, 'warning');
            family.cremationWaitingNotified = true;
            Engine.Notifications.addBadge('crematorium');
        }

        if (!needsViewing && !needsCooldown && !needsChapel && !needsCremation && family.embalmed) {
            if (!family.waitingForTransport) {
                family.waitingForTransport = true;
                Engine.showToast(`All services for ${family.deceasedName} are complete. Go to Reception and call a hearse for transfer.`, 'success');
                Engine.Notifications.addBadge('reception');
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
