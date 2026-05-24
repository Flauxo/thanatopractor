/* ===== THANATOPRACTOR - Family Generation ===== */
const Families = (() => {
    let nextId = 1;

    function generate() {
        const sex = Math.random() > 0.5 ? 'male' : 'female';
        const names = DATA.firstNames[sex];
        const firstName = names[Math.floor(Math.random() * names.length)];
        const lastName = DATA.lastNames[Math.floor(Math.random() * DATA.lastNames.length)];
        const age = 23 + Math.floor(Math.random() * 77);
        const religion = DATA.religions[Math.floor(Math.random() * DATA.religions.length)];
        const mood = DATA.familyMoods[Math.floor(Math.random() * DATA.familyMoods.length)];
        const cause = DATA.deathCauses[Math.floor(Math.random() * DATA.deathCauses.length)];
        
        const religionIndex = DATA.religions.indexOf(religion);
        const moodIndex = DATA.familyMoods.indexOf(mood);
        const causeIndex = DATA.deathCauses.indexOf(cause);
        
        const s = typeof Engine !== 'undefined' ? Engine.getState() : null;
        
        // Only ask for services the player actually has
        let wantsCremation = s && s.upgrades.includes('crematorium') ? Math.random() < 0.5 : false;
        if (s && s.forcedCremation > 0) {
            wantsCremation = true;
            s.forcedCremation--;
        }
        const wantsViewing = Math.random() > 0.3; // Base viewing room is unlocked
        const wantsChapel = s && s.upgrades.includes('chapel') ? Math.random() > 0.4 : false;
        
        const budget = ['low','medium','high','unlimited'][Math.floor(Math.random() * 4)];

        const s = Engine.getState();
        const maxId = s.families.reduce((max, f) => Math.max(max, f.id || 0), 0);
        const family = {
            id: maxId + 1,
            deceasedName: `${firstName} ${lastName}`,
            firstName, lastName, age, sex,
            religion, mood, cause,
            religionIndex, moodIndex, causeIndex,
            wantsCremation, wantsViewing, wantsChapel,
            budget,
            active: true,
            arrived: false,
            embalmed: false,
            embalmQuality: null, // null, 'catastrophic','bad','mediocre','good','excellent'
            viewed: false,
            chapelDone: false,
            cremated: false,
            cremationStarted: false,
            rating: null,
            services: [],
            totalCharged: 0,
            satisfaction: 70,
            cooldownDone: false,
            photoIndex: Math.floor(Math.random() * 9) + 1,
            notes: []
        };
        return family;
    }

    function getLocalizedReligion(family) {
        if (!family) return null;
        if (family.religionIndex !== undefined && family.religionIndex >= 0 && family.religionIndex < DATA.religions.length) {
            return DATA.religions[family.religionIndex];
        }
        const relId = family.religion?.id || family.religion;
        return DATA.religions.find(r => r.id === relId) || family.religion;
    }

    function getLocalizedCause(family) {
        if (!family) return '';
        if (family.causeIndex !== undefined && family.causeIndex >= 0 && family.causeIndex < DATA.deathCauses.length) {
            return DATA.deathCauses[family.causeIndex];
        }
        // Fallback: search in DATA_ES / DATA_EN
        let idx = DATA.deathCauses.indexOf(family.cause);
        if (idx === -1 && typeof DATA_ES !== 'undefined' && DATA_ES) {
            idx = DATA_ES.deathCauses.indexOf(family.cause);
        }
        if (idx === -1 && typeof DATA_EN !== 'undefined' && DATA_EN) {
            idx = DATA_EN.deathCauses.indexOf(family.cause);
        }
        if (idx !== -1 && idx < DATA.deathCauses.length) {
            return DATA.deathCauses[idx];
        }
        return family.cause;
    }

    function getActive() {
        return Engine.getState().families.filter(f => f.active);
    }

    function getById(id) {
        return Engine.getState().families.find(f => f.id === id);
    }

    function addFamily(family) {
        Engine.getState().families.push(family);
        Engine.updateHUD();
    }

    function completeFamily(id) {
        const f = getById(id);
        if (!f) return;
        f.active = false;

        // Calculate rating based on satisfaction and services
        let rating = Math.round(f.satisfaction / 10);
        rating = Math.max(0, Math.min(10, rating));
        f.rating = rating;

        Engine.getState().stats.familiesServed++;
        if (Engine.getState().stats.familiesServed === 1) Engine.Notifications.unlockAchievement('first_client');

        // Charge for services
        let total = DATA.serviceBasePrices.basic;
        if (f.services.includes('cremation')) total += DATA.serviceBasePrices.cremation;
        if (f.services.includes('chapel')) total += DATA.serviceBasePrices.chapelService;
        if (f.wantsCremation && !Engine.hasUpgrade('hearse')) {
            // If burial (no cremation) they need a hearse
        }
        if (!f.wantsCremation && !Engine.hasUpgrade('hearse')) {
            total -= DATA.serviceBasePrices.hearseRental; // hearse rental cost
            Engine.addMoney(-DATA.serviceBasePrices.hearseRental, I18n.T('fam.hearse_rental'), true);
            const quote = DATA.hearseDriverQuotes[Math.floor(Math.random() * DATA.hearseDriverQuotes.length)];
        }
        
        f.totalCharged = total;
        Engine.save();

        // Show completion summary overlay
        const stars = '⭐'.repeat(Math.max(1, Math.round(rating / 2)));
        const transport = f.wantsCremation ? I18n.T('ov.summary_cremated_onsite') : I18n.T('ov.summary_hearse_transfer');
        const services = f.services.map(s => {
            if (s === 'embalming') return `✓ ${I18n.T('ov.summary_embalmed')}`;
            if (s === 'viewing') return `✓ ${I18n.T('ov.summary_viewing')}`;
            if (s === 'chapel') return `✓ ${I18n.T('ov.summary_chapel')}`;
            if (s === 'cremation') return `✓ ${I18n.T('ov.summary_cremated')}`;
            return `✓ ${s}`;
        }).filter(Boolean).join('<br>');

        const satBonus = f.satisfaction >= 90 ? 2 : 0;
        const repChange = (rating - 5) + satBonus;

        document.getElementById('comp-title').textContent = `☠ ${f.deceasedName} — ${I18n.T('ov.summary_departed')}`;
        document.getElementById('comp-body').innerHTML = `
            <div class="comp-row"><span class="comp-label">${I18n.T('ov.summary_rating')}</span><span class="comp-stars">${stars} (${rating}/10)</span></div>
            <div class="comp-row"><span class="comp-label">${I18n.T('ov.summary_satisfaction')}</span><span class="comp-value">${f.satisfaction}%</span></div>
            <div class="comp-row"><span class="comp-label">${I18n.T('ov.summary_transport')}</span><span class="comp-value">${transport}</span></div>
            <div class="comp-row"><span class="comp-label">${I18n.T('ov.summary_services')}</span><span class="comp-value" style="font-size:14px;font-family:var(--font-vt)">${services || I18n.T('ov.summary_basic')}</span></div>
            <div class="comp-row"><span class="comp-label">${I18n.T('ov.summary_earned')}</span><span class="comp-value">$${total}</span></div>
            ${satBonus > 0 ? `<div class="comp-row" style="color:var(--success)"><span class="comp-label">${I18n.T('ov.summary_sat_bonus')}</span><span class="comp-value">+${satBonus} REP</span></div>` : ''}
            <div class="comp-row"><span class="comp-label">${I18n.T('ov.summary_reputation')}</span><span class="comp-value">${repChange >= 0 ? '+' : ''}${repChange} REP</span></div>
        `;
        
        document.getElementById('completion-overlay').style.display = 'flex';
        document.getElementById('btn-comp-dismiss').onclick = () => {
            document.getElementById('completion-overlay').style.display = 'none';

            // Process rewards AFTER dismissal
            Engine.addReputation(repChange, I18n.T('fam.family_rating', f.deceasedName, rating), true);
            Engine.addXP(100 + rating * 20);
            Engine.addMoney(total, I18n.T('fam.service_for', f.deceasedName), true);
            
            updateFamiliesLog();
        };
    }

    function updateSatisfaction(id, amount, reason) {
        const f = getById(id);
        if (!f) return;
        f.satisfaction = Math.max(0, Math.min(100, f.satisfaction + amount));
        if (reason) f.notes.push(reason);
        // Show floating indicator anchored to the rep bar (always visible)
        if (amount !== 0 && typeof Engine !== 'undefined' && Engine.showFloatingIndicator) {
            const label = (amount > 0 ? '+' : '') + amount + ' SAT';
            Engine.showFloatingIndicator('hud-rep', label, amount > 0);
        }
    }

    function updateFamiliesLog() {
        const list = document.getElementById('families-list');
        if (!list) return;
        const families = Engine.getState().families;
        if (families.length === 0) {
            list.innerHTML = `<p class="dim-text">${I18n.T('ov.no_families')}</p>`;
            return;
        }
        list.innerHTML = families.slice(-3).reverse().map(f => {
            const rel = getLocalizedReligion(f);
            const cause = getLocalizedCause(f);
            return `
            <div class="family-card">
                <div class="family-name">${Icons.getHTML(f.mood.icon)} ${f.deceasedName}</div>
                <div class="family-details">
                    ${I18n.T('dlg.age')} ${f.age} | ${I18n.T('dlg.' + f.sex)} | ${Icons.getHTML(rel.icon)} ${rel.name}<br>
                    ${I18n.T('dlg.cause')} ${cause}<br>
                    ${f.wantsCremation ? Icons.getHTML('crematorium') + ' ' + I18n.T('dlg.cremation') : Icons.getHTML('coffin') + ' ' + I18n.T('dlg.burial')} 
                    ${f.wantsViewing ? '| ' + Icons.getHTML('viewing') + ' ' + I18n.T('dlg.viewing_req') : ''} 
                    ${f.wantsChapel ? '| ' + Icons.getHTML('chapel') + ' ' + I18n.T('dlg.chapel_req') : ''}
                </div>
                ${f.rating !== null ? `<div class="family-rating">${Icons.getHTML('star').repeat(Math.max(1, Math.round(f.rating/2)))} (${f.rating}/10) — $${f.totalCharged}</div>` : ''}
                <span class="family-status ${f.active ? (f.waitingForTransport ? 'warning' : 'active') : 'completed'}">
                    ${f.active ? (f.waitingForTransport ? I18n.T('ov.status_waiting') : I18n.T('ov.status_active')) : I18n.T('ov.status_completed')}
                </span>
                <div class="family-details" style="margin-top:4px; font-size:13px; color:var(--pink);">
                    ${f.services.length ? f.services.join(' • ') : I18n.T('ov.summary_basic')}
                </div>
                ${f.notes.length ? `<div class="family-details" style="margin-top:4px;font-size:12px;opacity:0.8;">${f.notes.join(' | ')}</div>` : ''}
            </div>
        `;
        }).join('');
    }

    function reset() {
        nextId = 1;
    }

    function getNextPending() {
        const s = Engine.getState();
        if ((s.pendingArrivals || 0) > 0) {
            s.pendingArrivals--;
            const fam = generate();
            addFamily(fam);
            return fam;
        }
        return null;
    }

    return {
        generate, getActive, getById, addFamily, completeFamily, updateSatisfaction, updateFamiliesLog, reset, getNextPending,
        getLocalizedReligion, getLocalizedCause
    };

})();
