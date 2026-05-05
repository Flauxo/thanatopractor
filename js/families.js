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
        
        // Only ask for services the player actually has
        const wantsCremation = typeof Engine !== 'undefined' && Engine.hasUpgrade('crematorium') ? Math.random() > 0.5 : false;
        const wantsViewing = Math.random() > 0.3; // Base viewing room is unlocked
        const wantsChapel = typeof Engine !== 'undefined' && Engine.hasUpgrade('chapel') ? Math.random() > 0.4 : false;
        
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
        Engine.addReputation(repChange, `${f.deceasedName}'s family rated you ${rating}/10`);
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
            Engine.addMoney(-DATA.serviceBasePrices.hearseRental, 'External hearse rental');
            const quote = DATA.hearseDriverQuotes[Math.floor(Math.random() * DATA.hearseDriverQuotes.length)];
            Engine.showToast(`🚗 Hearse driver: ${quote}`, '');
        }
        
        Engine.addMoney(total, `Service for ${f.deceasedName}`);
        f.totalCharged = total;
        Engine.save();

        Engine.showToast(`📋 Service complete for ${f.deceasedName}. Rating: ${'⭐'.repeat(Math.max(1, Math.round(rating/2)))}`, rating >= 6 ? 'success' : 'warning');
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
            list.innerHTML = '<p class="dim-text">No families yet. Death takes a day off?</p>';
            return;
        }
        list.innerHTML = families.slice().reverse().map(f => `
            <div class="family-card">
                <div class="family-name">${Icons.getHTML(f.mood.icon)} ${f.deceasedName}</div>
                <div class="family-details">
                    Age ${f.age} | ${f.sex} | ${Icons.getHTML(f.religion.icon)} ${f.religion.name}<br>
                    Cause: ${f.cause}<br>
                    ${f.wantsCremation ? Icons.getHTML('crematorium') + ' Cremation' : Icons.getHTML('coffin') + ' Burial'} 
                    ${f.wantsViewing ? '| ' + Icons.getHTML('viewing') + ' Viewing' : ''} 
                    ${f.wantsChapel ? '| ' + Icons.getHTML('chapel') + ' Chapel' : ''}
                </div>
                ${f.rating !== null ? `<div class="family-rating">${Icons.getHTML('star').repeat(Math.max(1, Math.round(f.rating/2)))} (${f.rating}/10) — $${f.totalCharged}</div>` : ''}
                <span class="family-status ${f.active ? (f.waitingForTransport ? 'warning' : 'active') : 'completed'}">
                    ${f.active ? (f.waitingForTransport ? '● WAITING FOR HEARSE' : '● ACTIVE') : '✓ COMPLETED'}
                </span>
                ${f.notes.length ? `<div class="family-details" style="margin-top:4px;font-size:14px;">${f.notes.join(' | ')}</div>` : ''}
            </div>
        `).join('');
    }

    return { generate, getActive, getById, addFamily, completeFamily, updateSatisfaction, updateFamiliesLog };
})();
