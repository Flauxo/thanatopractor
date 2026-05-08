/* ===== THANATOPRACTOR - Main Game Controller ===== */
window.Main = (() => {
    let currentScreen = 'title';

    function showScreen(name) {
        // Block screen change if a dialogue or critical overlay is open
        if (isOverlayOpen()) return;

        document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
        const screen = document.getElementById(`${name}-screen`);
        if (screen) {
            screen.classList.add('active');
            currentScreen = name;
        }

        // Show/hide buttons on title screen
        if (name === 'title') {
            const state = Engine.getState();
            const hasActiveGame = state && state.playerName && state.playerName !== '';
            
            const btnSave = document.getElementById('btn-save-game');
            const btnResume = document.getElementById('btn-resume-game');
            const btnNew = document.getElementById('btn-new-game');
            const btnContinue = document.getElementById('btn-continue');

            if (btnSave) btnSave.style.display = hasActiveGame ? 'block' : 'none';
            if (btnResume) btnResume.style.display = hasActiveGame ? 'block' : 'none';
            if (btnNew) btnNew.style.display = hasActiveGame ? 'none' : 'block';
            if (btnContinue) btnContinue.style.display = (!hasActiveGame && Engine.hasSave()) ? 'block' : 'none';
        }

        // Start menu ambience on relevant screens
        if (['title', 'name', 'welcome'].includes(name)) {
            if (typeof Audio8Bit !== 'undefined' && Audio8Bit.initialized) {
                Audio8Bit.startAmbience();
            }
        }

        // Init room when shown
        switch (name) {
            case 'reception': Rooms.showReception(); break;
            case 'embalming': Rooms.showEmbalming(); break;
            case 'cafeteria': Rooms.showCafeteria(); break;
            case 'crematorium': Rooms.showCrematorium(); break;
            case 'viewing': Rooms.showViewing(); break;
            case 'chapel': Rooms.showChapel(); break;
            case 'office': Rooms.showOffice(); break;
            case 'families': Families.updateFamiliesLog(); break;
            case 'hub': {
                Rooms.activeRoom = null;
                updateHubSchedule();
                break;
            }
        }

        // Handle Global Back Button Visibility & Destination
        const globalBack = document.getElementById('btn-global-back');
        if (globalBack) {
            // Hide on hub, title, splash, name, welcome, gameover
            const hideOn = ['hub', 'title', 'splash', 'name', 'welcome', 'gameover'];
            if (hideOn.includes(name)) {
                globalBack.style.display = 'none';
            } else {
                globalBack.style.display = 'flex';
                // Destination: All rooms go to Hub
                globalBack.dataset.back = 'hub';
            }
        }
    }

    function updateHubSchedule() {
        const sched = Engine.getState().schedule;
        const list = document.getElementById('schedule-list');
        if (!list) return;
        if (sched.length === 0) {
            list.innerHTML = `<p class="dim-text" data-i18n="hub.no_scheduled">No tasks scheduled</p>`;
            if (typeof I18n !== 'undefined') I18n.updateDOM(list);
            return;
        }

        const safeTime = t => (t && typeof t === 'string') ? t : (t ? String(t) : '');
        const sorted = [...sched].sort((a, b) => safeTime(a.time).localeCompare(safeTime(b.time)));
        const pending = sorted.filter(s => !s.triggered);
        let completed = sorted.filter(s => s.triggered);
        completed = completed.slice(-3);
        const finalSched = [...pending, ...completed].sort((a, b) => safeTime(a.time).localeCompare(safeTime(b.time)));

        list.innerHTML = '';
        finalSched.forEach(item => {
            const div = document.createElement('div');
            div.className = `schedule-item ${item.triggered ? 'completed' : ''}`;
            const icon = item.triggered ? '✓' : '⏳';
            const name = item.family ? item.family.name : '';
            div.innerHTML = `<span class="time">${item.time}</span><span class="type">${item.type}</span><span class="family">${name}</span><span>${icon}</span>`;
            list.appendChild(div);
        });
    }

    function initGame() {
        // ===== SPLASH SCREEN LOGIC (Immediate) =====
        const splash = document.getElementById('splash-screen');
        if (splash) {
            const loadingText = splash.querySelector('.loading-text');
            const progressContainer = splash.querySelector('.splash-progress-container');
            const progressBar = document.getElementById('splash-progress');

            // Phrases logic
            if (loadingText) {
                loadingText.style.display = 'block';
                let phrases = ["Cargando..."];
                try {
                    const list = I18n.T('splash.loading_list');
                    if (Array.isArray(list)) phrases = [...list].sort(() => Math.random() - 0.5);
                } catch(e) {}

                let phraseIdx = 0;
                const updatePhrase = () => {
                    if (phrases[phraseIdx]) {
                        loadingText.textContent = phrases[phraseIdx];
                        phraseIdx = (phraseIdx + 1) % phrases.length;
                    }
                };
                updatePhrase();
                const phraseInt = setInterval(updatePhrase, 800);
                setTimeout(() => clearInterval(phraseInt), 4000);
            }

            // Progress Bar logic
            if (progressBar) {
                if (progressContainer) progressContainer.style.display = 'block';
                const startTime = Date.now();
                const duration = 5000;
                let currentProgress = 0;

                const progressInt = setInterval(() => {
                    const elapsed = Date.now() - startTime;
                    if (elapsed >= duration) {
                        progressBar.style.width = '100%';
                        clearInterval(progressInt);
                        return;
                    }
                    if (Math.random() > 0.4) {
                        currentProgress = Math.min(95, currentProgress + (Math.random() * 10));
                        const timeFactor = elapsed / duration;
                        if (currentProgress < timeFactor * 70) currentProgress += 5;
                    }
                    progressBar.style.width = currentProgress + '%';
                }, 100);
            }

            // Tombstone animation
            setTimeout(() => {
                const lid = document.getElementById('grave-lid');
                if (lid) lid.classList.add('open');
            }, 800);

            // Transition to button after 5 seconds
            setTimeout(() => {
                if (loadingText) loadingText.style.display = 'none';
                if (progressContainer) progressContainer.style.display = 'none';
                
                const btnEnter = document.getElementById('btn-enter-game');
                if (btnEnter) {
                    btnEnter.style.display = 'block';
                    btnEnter.textContent = I18n.T('splash.enter');
                    btnEnter.onclick = () => {
                        btnEnter.disabled = true;
                        btnEnter.style.opacity = '0.6';
                        
                        // Audio initialization (Safe now because of user gesture)
                        if (typeof Audio8Bit !== 'undefined') {
                            Audio8Bit.init();
                            Audio8Bit.SFX.splashEntry();
                            // Start ambience immediately
                            Audio8Bit.startAmbience();
                        }

                        splash.style.transition = 'opacity 1s ease-in-out';
                        splash.style.opacity = '0';
                        setTimeout(() => {
                            splash.style.display = 'none';
                            showScreen('title');
                        }, 1000);
                    };
                }
            }, 5000);
        }

        // Init UI Icons
        if (typeof Icons !== 'undefined') {
            Icons.initDOM();
        }

        // Set initial language and trigger swap events
        I18n.setLanguage(I18n.getLanguage());

        // ===== TITLE SCREEN =====
        if (Engine.hasSave()) {
            document.getElementById('btn-continue').style.display = 'block';
        }

        document.getElementById('btn-resume-game').onclick = () => {
            Audio8Bit.SFX.click();
            showScreen('hub');
        };

        document.getElementById('btn-new-game').onclick = () => {
            Audio8Bit.init();
            Audio8Bit.SFX.click();
            showScreen('name');
        };

        document.getElementById('btn-continue').onclick = () => {
            Audio8Bit.init();
            Audio8Bit.SFX.click();
            if (Engine.load()) {
                startGameplay();
            }
        };

        // Language selector
        function updateLangButtons() {
            const current = I18n.getLanguage();
            document.querySelectorAll('.lang-btn').forEach(btn => {
                btn.classList.toggle('active', btn.dataset.lang === current);
            });
        }
        updateLangButtons();

        document.querySelectorAll('.lang-btn').forEach(btn => {
            btn.onclick = (e) => {
                const l = e.currentTarget.dataset.lang;
                Audio8Bit.SFX.click();
                I18n.setLanguage(l);
                updateLangButtons();
                // Update dynamic text
                if (typeof Rooms !== 'undefined' && Rooms.updateActiveRoom) Rooms.updateActiveRoom();
                Engine.updateHUD();
            };
        });

        document.getElementById('btn-credits').onclick = () => {
            if (typeof Audio8Bit !== 'undefined') {
                Audio8Bit.init();
                Audio8Bit.startAmbience();
                Audio8Bit.SFX.click();
            }
            document.getElementById('credits-overlay').style.display = 'flex';
        };
        document.getElementById('btn-close-credits').onclick = () => {
            Audio8Bit.SFX.click();
            document.getElementById('credits-overlay').style.display = 'none';
        };

        // ===== NAME SCREEN =====
        const nameInput = document.getElementById('player-name-input');
        nameInput.oninput = () => {
            const flavors = [
                I18n.T('name.f1'), I18n.T('name.f2'), I18n.T('name.f3'), I18n.T('name.f4'), I18n.T('name.f5')
            ];
            document.getElementById('name-flavor').textContent = flavors[Math.floor(Math.random() * flavors.length)];
            Audio8Bit.SFX.typing();
        };

        document.getElementById('btn-start-game').onclick = () => {
            const name = nameInput.value.trim();
            if (!name) {
                Engine.showToast(I18n.T('name.error'), 'warning');
                return;
            }
            Audio8Bit.SFX.success();
            localStorage.removeItem('thanatopractor_save');
            Engine.resetState();
            Families.reset();
            resetHub();
            Engine.getState().playerName = name;
            showScreen('welcome');
        };

        document.getElementById('btn-accept-terms').onclick = () => {
            try { if (window.Audio8Bit) window.Audio8Bit.SFX.success(); } catch(e){}
            startGameplay();
        };

        // ===== HUB NAV =====
        document.querySelectorAll('.nav-btn').forEach(btn => {
            btn.onclick = () => {
                if (btn.classList.contains('locked')) {
                    Engine.showToast(I18n.T('hub.locked'), 'warning');
                    return;
                }
                Audio8Bit.SFX.click();
                const room = btn.dataset.room;
                showScreen(room);
            };
        });

        // ===== BACK BUTTONS =====
        document.querySelectorAll('.back-btn').forEach(btn => {
            btn.onclick = () => {
                Audio8Bit.SFX.click();
                showScreen(btn.dataset.back || 'hub');
            };
        });

        // ===== TIME CONTROLS =====
        document.getElementById('btn-pause').onclick = () => { Engine.setSpeed(0); Audio8Bit.SFX.click(); };
        document.getElementById('btn-play').onclick = () => { Engine.setSpeed(1); Audio8Bit.SFX.click(); };
        document.getElementById('btn-fast').onclick = () => { Engine.setSpeed(2); Audio8Bit.SFX.click(); };

        // ===== AUDIO TOGGLE =====
        const audioToggle = document.getElementById('audio-toggle');
        audioToggle.innerHTML = Icons.getHTML('speaker'); // init icon
        audioToggle.onclick = () => {
            Audio8Bit.init();
            const muted = Audio8Bit.toggleMute();
            audioToggle.innerHTML = Icons.getHTML(muted ? 'speaker_off' : 'speaker');
        };

        // ===== MAIN MENU TOGGLE =====
        document.getElementById('btn-main-menu').onclick = () => {
            Audio8Bit.SFX.click();
            showScreen('title');
        };

        // ===== GLOBAL BACK BUTTON =====
        const globalBack = document.getElementById('btn-global-back');
        if (globalBack) {
            globalBack.innerHTML = Icons.getHTML('back');
            globalBack.onclick = () => {
                Audio8Bit.SFX.click();
                showScreen(globalBack.dataset.back || 'hub');
            };
        }

        // ===== SAVE / EXIT =====
        document.getElementById('btn-save-game').onclick = () => {
            Engine.save();
            Audio8Bit.SFX.success();
            Engine.showToast(I18n.T('ov.saved'), 'success');
        };

        // ===== GAME OVER =====
        document.getElementById('btn-restart').onclick = () => {
            localStorage.removeItem('thanatopractor_save');
            Engine.resetState();
            Families.reset();
            resetHub();
            showScreen('title');
        };

        // ===== MANUAL AUDIO SKIP =====
        const btnSkip = document.getElementById('btn-skip-track');
        if (btnSkip) {
            btnSkip.onclick = () => {
                if (window.Audio8Bit) {
                    window.Audio8Bit.stopAmbience();
                    window.Audio8Bit.nextTrack();
                    Audio8Bit.SFX.click();
                }
            };
        }

        // ===== AUTO SAVE =====
        setInterval(() => {
            if (currentScreen !== 'title' && currentScreen !== 'name' && currentScreen !== 'gameover') {
                Engine.save();
            }
        }, 15000);
    }

    function resetHub() {
        const lockedByDefault = ['nav-chapel', 'nav-crematorium', 'nav-cafeteria'];
        document.querySelectorAll('.nav-btn').forEach(nav => {
            if (lockedByDefault.includes(nav.id)) {
                nav.classList.add('locked');
                const lock = nav.querySelector('.nav-lock');
                if (lock) lock.style.display = 'flex';
            } else {
                nav.classList.remove('locked');
                const lock = nav.querySelector('.nav-lock');
                if (lock) lock.style.display = 'none';
            }
        });
    }

    function startGameplay() {
        try {
            console.log("Executing startGameplay...");
            const s = Engine.getState();

            s.upgrades.forEach(id => {
                const upg = DATA.upgrades.find(u => u.id === id);
                if (upg && upg.room) {
                    const nav = document.getElementById(`nav-${upg.room}`);
                    if (nav) {
                        nav.classList.remove('locked');
                        const lock = nav.querySelector('.nav-lock');
                        if (lock) lock.style.display = 'none';
                    }
                }
            });

            Rooms.initReception();
            Engine.updateHUD();
            Engine.generateDailySchedule();
            Engine.startTime();
            showScreen('hub');

            if (window.Audio8Bit) {
                console.log("Attempting to transition audio...");
                window.Audio8Bit.stopAmbience();
                window.Audio8Bit.playTrack('midnightDig');
            }

            setInterval(() => {
                if (window.Audio8Bit && window.Audio8Bit.initialized && !window.Audio8Bit.muted) {
                    window.Audio8Bit.nextTrack();
                }
            }, 60000);

            Engine.showToast(I18n.T('hub.welcome', s.playerName), '');
        } catch (fatalError) {
            console.error("FATAL ERROR IN STARTGAMEPLAY:", fatalError);
            alert("Error: " + fatalError.message);
        }
    }

    // Init on load
    document.addEventListener('DOMContentLoaded', initGame);

    function isOverlayOpen() {
        const overlays = ['dialogue-overlay', 'dice-overlay', 'completion-overlay', 'supplies-overlay', 'credits-overlay'];
        return overlays.some(id => {
            const el = document.getElementById(id);
            return el && (el.style.display === 'flex' || el.style.display === 'block');
        });
    }

    return { showScreen, updateHubSchedule, get currentScreen() { return currentScreen; }, isOverlayOpen };
})();
