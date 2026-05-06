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

        const family = {
            id: nextId++,
            deceasedName: `${firstName} ${lastName}`,
            firstName, lastName, age, sex,
            religion, mood, cause,
            wantsCremation, wantsViewing, wantsChapel,
            budget,
            active: true,
            arrived: false,
            embalmed: false,
            embalmQuality: null, // null, 'catastrophic','bad','mediocre','good','excellent'
            viewed: false,
            chapelDone: false,
            cremated: false,
            rating: null,
            services: [],
            totalCharged: 0,
            satisfaction: 70,
            cooldownDone: false,
            notes: []
        };
        return family;
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

        const repChange = rating - 5; // 5 is neutral
        Engine.addReputation(repChange, `${f.deceasedName}'s family rated you ${rating}/10`, true);
        Engine.addXP(100 + rating * 20);
        Engine.getState().stats.familiesServed++;

        // Charge for services
        let total = DATA.serviceBasePrices.basic;
        if (f.services.includes('cremation')) total += DATA.serviceBasePrices.cremation;
        if (f.services.includes('chapel')) total += DATA.serviceBasePrices.chapelService;
        if (f.wantsCremation && !Engine.hasUpgrade('hearse')) {
            // If burial (no cremation) they need a hearse
        }
        if (!f.wantsCremation && !Engine.hasUpgrade('hearse')) {
            total -= DATA.serviceBasePrices.hearseRental; // hearse rental cost
            Engine.addMoney(-DATA.serviceBasePrices.hearseRental, 'External hearse rental', true);
            const quote = DATA.hearseDriverQuotes[Math.floor(Math.random() * DATA.hearseDriverQuotes.length)];
            // Engine.showToast(`🚗 Hearse driver: ${quote}`, ''); // Suppress toast here too
        }
        
        Engine.addMoney(total, `Service for ${f.deceasedName}`, true);
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

        document.getElementById('comp-title').textContent = `☠ ${f.deceasedName} — ${I18n.T('ov.summary_departed')}`;
        document.getElementById('comp-body').innerHTML = `
            <div class="comp-row"><span class="comp-label">${I18n.T('ov.summary_rating')}</span><span class="comp-stars">${stars} (${rating}/10)</span></div>
            <div class="comp-row"><span class="comp-label">${I18n.T('ov.summary_satisfaction')}</span><span class="comp-value">${f.satisfaction}%</span></div>
            <div class="comp-row"><span class="comp-label">${I18n.T('ov.summary_transport')}</span><span class="comp-value">${transport}</span></div>
            <div class="comp-row"><span class="comp-label">${I18n.T('ov.summary_services')}</span><span class="comp-value" style="font-size:14px;font-family:var(--font-vt)">${services || I18n.T('ov.summary_basic')}</span></div>
            <div class="comp-row"><span class="comp-label">${I18n.T('ov.summary_earned')}</span><span class="comp-value">$${total}</span></div>
            <div class="comp-row"><span class="comp-label">${I18n.T('ov.summary_reputation')}</span><span class="comp-value">${repChange >= 0 ? '+' : ''}${repChange} REP</span></div>
        `;
        document.getElementById('completion-overlay').style.display = 'flex';
        document.getElementById('btn-comp-dismiss').onclick = () => {
            document.getElementById('completion-overlay').style.display = 'none';
        };

        updateFamiliesLog();
    }

    function updateSatisfaction(id, amount, reason) {
        const f = getById(id);
        if (!f) return;
        f.satisfaction = Math.max(0, Math.min(100, f.satisfaction + amount));
        if (reason) f.notes.push(reason);
    }

    function updateFamiliesLog() {
        const list = document.getElementById('families-list');
        if (!list) return;
        const families = Engine.getState().families;
        if (families.length === 0) {
            list.innerHTML = `<p class="dim-text">${I18n.T('ov.no_families')}</p>`;
            return;
        }
        list.innerHTML = families.slice(-3).reverse().map(f => `
            <div class="family-card">
                <div class="family-name">${Icons.getHTML(f.mood.icon)} ${f.deceasedName}</div>
                <div class="family-details">
                    ${I18n.T('dlg.age')} ${f.age} | ${I18n.T('dlg.' + f.sex)} | ${Icons.getHTML(f.religion.icon)} ${f.religion.name}<br>
                    ${I18n.T('dlg.cause')} ${f.cause}<br>
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
        `).join('');
    }

    return { generate, getActive, getById, addFamily, completeFamily, updateSatisfaction, updateFamiliesLog };
})();
