/* ===== THANATOPRACTOR - Dialogue System ===== */
const Dialogue = (() => {
    let queue = [];
    let currentCallback = null;

    function show(speaker, text, choices, onClose) {
        const overlay = document.getElementById('dialogue-overlay');
        const speakerEl = document.getElementById('dlg-speaker');
        const textEl = document.getElementById('dlg-text');
        const choicesEl = document.getElementById('dlg-choices');

        speakerEl.textContent = speaker;
        textEl.innerHTML = text;
        choicesEl.innerHTML = '';

        if (choices && choices.length) {
            choices.forEach((choice, i) => {
                const btn = document.createElement('button');
                btn.className = 'dialogue-choice';
                btn.textContent = `${i + 1}. ${choice.text}`;
                btn.onclick = () => {
                    Audio8Bit.SFX.click();
                    overlay.style.display = 'none';
                    if (choice.action) choice.action();
                    if (choice.rep) Engine.addReputation(choice.rep, 'Dialogue choice');
                    if (choice.money) Engine.addMoney(choice.money, 'Dialogue choice');
                    if (onClose) onClose(i);
                    processQueue();
                };
                choicesEl.appendChild(btn);
            });
        } else {
            // Simple OK button
            const btn = document.createElement('button');
            btn.className = 'dialogue-choice';
            btn.textContent = 'OK';
            btn.onclick = () => {
                Audio8Bit.SFX.click();
                overlay.style.display = 'none';
                if (onClose) onClose(-1);
                processQueue();
            };
            choicesEl.appendChild(btn);
        }

        overlay.style.display = 'flex';
        Engine.setSpeed(0); // Pause during dialogue
    }

    function enqueue(speaker, text, choices, onClose) {
        queue.push({ speaker, text, choices, onClose });
        if (queue.length === 1) processQueue();
    }

    function processQueue() {
        if (queue.length === 0) {
            Engine.setSpeed(1); // Resume after all dialogues
            return;
        }
        const d = queue.shift();
        show(d.speaker, d.text, d.choices, d.onClose);
    }

    // ===== ARRIVAL SEQUENCE =====
    function playArrivalSequence(family) {
        const s = Engine.getState();
        const intro = DATA.arrivalIntros[Math.floor(Math.random() * DATA.arrivalIntros.length)];
        const moodDialogues = DATA.arrivalDialogues[family.mood.id];
        const dialogue = moodDialogues[Math.floor(Math.random() * moodDialogues.length)];

        // Replace {name} with deceased name, {relation} with random relation
        const relations = ['father', 'mother', 'uncle', 'aunt', 'grandmother', 'grandfather', 'cousin', 'spouse', 'friend'];
        const relation = relations[Math.floor(Math.random() * relations.length)];
        const text = dialogue.text.replace(/\{name\}/g, family.deceasedName).replace(/\{relation\}/g, relation);

        const choices = dialogue.choices.map(c => ({
            text: c.text.replace(/\{name\}/g, family.deceasedName),
            rep: c.rep,
            money: c.money,
            action: () => {
                if (c.rep) Families.updateSatisfaction(family.id, c.rep * 5, c.rep > 0 ? 'Good first impression' : 'Bad first impression');
            }
        }));

        // Show intro first, then dialogue
        enqueue(`${family.mood.icon} NEW ARRIVAL`, `${intro}\n\n${family.mood.desc}`, null, () => {});
        enqueue(`${family.mood.icon} ${family.deceasedName}'s Family`, text, choices, () => {
            // After dialogue, show service summary
            const serviceInfo = `
                <strong>Deceased:</strong> ${family.deceasedName}<br>
                <strong>Age:</strong> ${family.age} | <strong>Sex:</strong> ${family.sex}<br>
                <strong>Religion:</strong> ${family.religion.icon} ${family.religion.name}<br>
                <strong>Cause:</strong> ${family.cause}<br>
                <strong>Service:</strong> ${family.wantsCremation ? '🔥 Cremation' : '⚰️ Burial'}<br>
                ${family.wantsViewing ? '👁️ Viewing requested' : ''}<br>
                ${family.wantsChapel ? '⛪ Chapel service requested' : ''}
            `;
            show('📋 FAMILY REGISTERED', serviceInfo, [
                { text: 'UNDERSTOOD, PROCEED', action: () => {
                    family.arrived = true;
                    Engine.Notifications.addBadge('embalming');
                    Engine.showToast(`🧪 ${family.deceasedName} needs embalming!`, '');
                    Families.updateFamiliesLog();
                    Engine.save();
                    if (window.Main && window.Main.showScreen) {
                        setTimeout(() => window.Main.showScreen('hub'), 100);
                    }
                }}
            ]);
        });
    }

    return { show, enqueue, playArrivalSequence };
})();
