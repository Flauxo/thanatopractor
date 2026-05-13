/* ===== THANATOPRACTOR - Dialogue System ===== */
const Dialogue = (() => {
    let queue = [];
    let currentCallback = null;
    let isShowing = false;

    function shuffle(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }

    function show(speaker, text, choices, onClose, options = {}) {
        isShowing = true;
        const overlay = document.getElementById('dialogue-overlay');
        const speakerEl = document.getElementById('dlg-speaker');
        const textEl = document.getElementById('dlg-text');
        const choicesEl = document.getElementById('dlg-choices');
        const reaperImg = document.getElementById('dlg-reaper');
        const box = document.querySelector('.dialogue-box');
        const satContainer = document.getElementById('dlg-satisfaction-container');

        speakerEl.textContent = speaker;
        textEl.innerHTML = text;
        choicesEl.innerHTML = '';

        if (options.showReaper) {
            reaperImg.src = options.imgSrc || 'assets/ui/Masterpj.png';
            reaperImg.style.display = 'block';
            box.classList.add('reaper-active');
        } else {
            reaperImg.style.display = 'none';
            box.classList.remove('reaper-active');
        }

        // Satisfaction Bar
        if (options.showSatBar) {
            satContainer.style.display = 'block';
            const fill = document.getElementById('dlg-sat-fill');
            const val = document.getElementById('dlg-sat-value');
            const sat = options.currentSat || 50;
            fill.style.width = `${sat}%`;
            val.textContent = `${sat}%`;
        } else {
            satContainer.style.display = 'none';
        }

        if (choices && choices.length) {
            choices.forEach((choice, i) => {
                const btn = document.createElement('button');
                btn.className = 'dialogue-choice';
                btn.textContent = `${i + 1}. ${choice.text}`;
                btn.onclick = () => {
                    Audio8Bit.SFX.click();
                    overlay.style.display = 'none';
                    isShowing = false;
                    if (choice.action) choice.action();
                    if (choice.rep) Engine.addReputation(choice.rep, I18n.T('eng.dialogue_choice'));
                    if (choice.money) Engine.addMoney(choice.money, I18n.T('eng.dialogue_choice'));
                    if (onClose) onClose(i);
                    if (!isShowing) processQueue();
                };
                choicesEl.appendChild(btn);
            });
        } else {
            // Simple OK button
            const btn = document.createElement('button');
            btn.className = 'dialogue-choice';
            btn.textContent = I18n.T('eng.ok');
            btn.onclick = () => {
                Audio8Bit.SFX.click();
                overlay.style.display = 'none';
                isShowing = false;
                if (onClose) onClose(-1);
                if (!isShowing) processQueue();
            };
            choicesEl.appendChild(btn);
        }

        overlay.style.display = 'flex';
        Engine.setSpeed(0); // Pause during dialogue
    }

    function enqueue(speaker, text, choices, onClose, options = {}) {
        queue.push({ speaker, text, choices, onClose, options });
        if (!isShowing) processQueue();
    }

    function processQueue() {
        if (queue.length === 0) {
            isShowing = false;
            Engine.setSpeed(1); 
            return;
        }
        const d = queue.shift();
        show(d.speaker, d.text, d.choices, d.onClose, d.options);
    }

    // ===== INTERVIEW MINI-GAME =====
    function startInterview(family) {
        const state = Engine.getState();
        let satisfaction = 50;
        let steps = 3 + Math.floor(Math.random() * 3); // 3-5 steps
        let currentStep = 0;

        // Interview Rotation Logic: Ensure we use all scenarios before repeating
        if (!state.interviewPool || state.interviewPool.length < steps) {
            state.interviewPool = [...DATA.interviewScenarios].map(s => s.id);
            // Shuffle
            state.interviewPool.sort(() => 0.5 - Math.random());
        }

        let selectedScenarios = [];
        for (let i = 0; i < steps; i++) {
            const id = state.interviewPool.pop();
            const scenario = DATA.interviewScenarios.find(s => s.id === id);
            selectedScenarios.push(scenario);
        }

        const portraitOptions = { showReaper: true, imgSrc: `assets/ui/fam0${family.photoIndex}.png` };

        function nextStep() {
            if (currentStep >= steps) {
                finishInterview(family, satisfaction);
                return;
            }

            const scenario = selectedScenarios[currentStep];
            currentStep++;

            const choices = scenario.choices.map(c => {
                let text = c.text;
                if (c.roll) {
                    const skills = I18n.T('dlg.skills') || ['Habilidad'];
                    const randomSkill = skills[Math.floor(Math.random() * skills.length)];
                    text += ` (${I18n.T('dlg.roll_check')} ${randomSkill} +${c.roll})`;
                }
                return {
                    text: text,
                    action: () => {
                        if (c.roll) {
                            // Randomize DC slightly (+/- 3)
                            const randomDC = Math.max(5, Math.min(20, c.roll + (Math.floor(Math.random() * 7) - 3)));
                            Engine.rollD20(0, (roll, total) => {
                                const success = total >= randomDC;
                                const result = success ? c.success : c.fail;
                                satisfaction = Math.max(0, Math.min(100, satisfaction + result.sat));
                                enqueue(I18n.T('dlg.interview_title'), result.text, null, nextStep, { 
                                    ...portraitOptions, 
                                    showSatBar: true, 
                                    currentSat: satisfaction 
                                });
                            });
                        } else {
                            satisfaction = Math.max(0, Math.min(100, satisfaction + (c.sat || 0)));
                            nextStep();
                        }
                    }
                };
            });

            shuffle(choices);

            enqueue(I18n.T('dlg.interview_title'), scenario.text, choices, null, { 
                ...portraitOptions, 
                showSatBar: true, 
                currentSat: satisfaction 
            });
        }

        nextStep();
    }

    function finishInterview(family, finalSat) {
        family.interviewSatisfaction = finalSat;
        const portraitOptions = { showReaper: true, imgSrc: `assets/ui/fam0${family.photoIndex}.png` };
        
        let pool = [];
        if (finalSat < 30) pool = I18n.T('dlg.sat_low');
        else if (finalSat < 60) pool = I18n.T('dlg.sat_med');
        else if (finalSat < 90) pool = I18n.T('dlg.sat_high');
        else pool = I18n.T('dlg.sat_perfect');

        const resultText = Array.isArray(pool) ? pool[Math.floor(Math.random() * pool.length)] : pool;
        const satBonusText = finalSat >= 90 ? `<br><span style="color:var(--success)">+ ${I18n.T('ov.summary_sat_bonus')}!</span>` : '';

        const summary = `${I18n.T('dlg.interview_completed')}<br><br><strong>${I18n.T('view.mood')}: ${finalSat}%</strong>${satBonusText}<br>${resultText}`;
        
        enqueue(I18n.T('dlg.interview_title'), summary, null, () => {
            showRegistrationSummary(family);
        }, portraitOptions);
    }

    function showRegistrationSummary(family) {
        const portraitOptions = { showReaper: true, imgSrc: `assets/ui/fam0${family.photoIndex}.png` };
        const serviceInfo = `
            <strong>${I18n.T('dlg.deceased')}</strong> ${family.deceasedName}<br>
            <strong>${I18n.T('dlg.age')}</strong> ${family.age} | <strong>${I18n.T('dlg.sex')}</strong> ${I18n.T('dlg.' + family.sex)}<br>
            <strong>${I18n.T('dlg.religion')}</strong> ${family.religion.icon} ${family.religion.name}<br>
            <strong>${I18n.T('dlg.cause')}</strong> ${family.cause}<br>
            <strong>${I18n.T('dlg.service')}</strong> ${family.wantsCremation ? I18n.T('dlg.cremation') : I18n.T('dlg.burial')}<br>
            ${family.wantsViewing ? I18n.T('dlg.viewing_req') : ''}<br>
            ${family.wantsChapel ? I18n.T('dlg.chapel_req') : ''}
        `;
        
        show(I18n.T('dlg.family_registered'), serviceInfo, [
            { text: I18n.T('dlg.understood'), action: () => {
                family.arrived = true;
                // Satisfaction impact
                const bonus = Math.floor((family.interviewSatisfaction - 50) / 2);
                Families.updateSatisfaction(family.id, bonus, 'Family Interview');
                
                Engine.Notifications.addBadge('embalming');
                Families.updateFamiliesLog();
                Engine.save();
                if (window.Main && window.Main.showScreen) {
                    setTimeout(() => window.Main.showScreen('hub'), 100);
                }
            }}
        ], null, portraitOptions);
    }

    // ===== ARRIVAL SEQUENCE =====
    function playArrivalSequence(family) {
        const moodDialogues = DATA.arrivalDialogues[family.mood.id];
        const dialogue = moodDialogues[Math.floor(Math.random() * moodDialogues.length)];

        const relations = ['father', 'mother', 'uncle', 'aunt', 'grandmother', 'grandfather', 'cousin', 'spouse', 'friend'];
        const relation = relations[Math.floor(Math.random() * relations.length)];
        
        let text = dialogue.textKey ? I18n.T(dialogue.textKey) : dialogue.text;
        text = text.replace(/\{name\}/g, family.deceasedName).replace(/\{relation\}/g, relation);

        const choices = dialogue.choices.map(c => {
            let choiceText = (c.textKey ? I18n.T(c.textKey) : c.text).replace(/\{name\}/g, family.deceasedName);
            if (c.roll || c.dc) {
                choiceText += ` (${I18n.T('dlg.roll_check')})`;
            }
            return {
                text: choiceText,
                rep: c.rep,
                money: c.money,
                action: () => {
                    if (c.roll || c.dc) {
                        const targetDC = Math.max(5, Math.min(20, (c.roll || c.dc) + (Math.floor(Math.random() * 7) - 3)));
                        Engine.rollD20(0, (roll, total) => {
                            const success = total >= targetDC;
                            if (success) {
                                if (c.success) {
                                    if (c.success.rep) Families.updateSatisfaction(family.id, c.success.rep * 5, 'Good first impression');
                                    if (c.success.money) Engine.addMoney(c.success.money, 'Dialogue success');
                                    Engine.showToast(c.success.text || 'Success!', 'success');
                                } else {
                                    Families.updateSatisfaction(family.id, 10, 'Good first impression');
                                }
                            } else {
                                if (c.fail) {
                                    if (c.fail.rep) Families.updateSatisfaction(family.id, c.fail.rep * 5, 'Bad first impression');
                                    Engine.showToast(c.fail.text || 'Failure...', 'danger');
                                } else {
                                    Families.updateSatisfaction(family.id, -10, 'Bad first impression');
                                }
                            }
                        });
                    } else {
                        if (c.rep) Families.updateSatisfaction(family.id, c.rep * 5, c.rep > 0 ? 'Good first impression' : 'Bad first impression');
                    }
                }
            };
        });

        shuffle(choices);

        const moodName = I18n.T(`mood.${family.mood.id}.name`) || family.mood.name;
        const moodDesc = I18n.T(`mood.${family.mood.id}.desc`) || family.mood.desc;

        enqueue(`${family.mood.icon} ${I18n.T('dlg.family_title', family.deceasedName)}`, text, choices, () => {
            startInterview(family);
        }, { showReaper: true, imgSrc: `assets/ui/fam0${family.photoIndex}.png` });
    }

    return { show, enqueue, playArrivalSequence };
})();
