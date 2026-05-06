/* ===== THANATOPRACTOR - Main Game Controller ===== */
window.Main = (() => {
    let currentScreen = 'title';

    function showScreen(name) {
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
    }

    function updateHubSchedule() {
        const sched = Engine.getState().schedule;
        const list = document.getElementById('schedule-list');
        if (!list) return;
        if (sched.length === 0) {
            list.innerHTML = `<p class="dim-text">${I18n.T('hub.no_appointments')}</p>`;
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
                const icon = s.rejected ? '✘' : (s.triggered ? '✓' : '⏳');
                const cls = s.rejected ? 'rejected' : (s.triggered ? 'completed' : '');
                return `<div class="schedule-item ${cls}"><span>${h}:${m.toString().padStart(2, '0')}</span><span>${s.desc}</span><span>${icon}</span></div>`;
            }).join('');
        }
    }

    function initGame() {
        // Init UI Icons
        if (typeof Icons !== 'undefined') {
            Icons.initDOM();
        }

        // Set initial language and trigger swap events
        I18n.setLanguage(I18n.getLanguage());

        // ===== SPLASH SCREEN LOGIC =====
        const splash = document.getElementById('splash-screen');
        if (splash) {
            const hint = document.createElement('p');
            hint.className = 'vt-text dim';
            hint.style.position = 'absolute';
            hint.style.bottom = '40px';
            hint.style.width = '100%';
            hint.style.textAlign = 'center';
            hint.textContent = I18n.T('spl.click_to_enter');
            splash.appendChild(hint);

            const startSplash = () => {
                document.removeEventListener('click', startSplash);
                hint.style.display = 'none';
                
                if (typeof Audio8Bit !== 'undefined') {
                    Audio8Bit.init();
                    Audio8Bit.SFX.bell();
                    Audio8Bit.SFX.grave();
                }
                
                setTimeout(() => {
                    const lid = document.getElementById('grave-lid');
                    if (lid) lid.classList.add('open');
                }, 1200);

                setTimeout(() => {
                    splash.style.transition = 'opacity 1s ease-in-out';
                    splash.style.opacity = '0';
                    setTimeout(() => {
                        splash.style.display = 'none';
                        showScreen('title');
                    }, 1000);
                }, 4000);
            };
            document.addEventListener('click', startSplash);
        }

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
            Audio8Bit.init();
            Audio8Bit.SFX.click();
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
            Audio8Bit.SFX.success();
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

        // ===== AUTO SAVE =====
        setInterval(() => {
            if (currentScreen !== 'title' && currentScreen !== 'name' && currentScreen !== 'gameover') {
                Engine.save();
            }
        }, 15000);
    }

    function resetHub() {
        document.querySelectorAll('.nav-btn').forEach(nav => {
            if (nav.id === 'nav-reception') return; // Reception is always open
            nav.classList.add('locked');
            const lock = nav.querySelector('.nav-lock');
            if (lock) lock.style.display = 'flex';
        });
    }

    function startGameplay() {
        const s = Engine.getState();

        // Unlock owned rooms
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

        // Start music
        Audio8Bit.playTrack('midnightDig');

        // Cycle music tracks every 3 minutes
        setInterval(() => {
            if (Audio8Bit.initialized && !Audio8Bit.muted) {
                Audio8Bit.nextTrack();
            }
        }, 60000);

        // Welcome toast
        Engine.showToast(I18n.T('hub.welcome', s.playerName), '');
    }

    // Init on load
    document.addEventListener('DOMContentLoaded', initGame);

    return { showScreen, updateHubSchedule, get currentScreen() { return currentScreen; } };
})();
