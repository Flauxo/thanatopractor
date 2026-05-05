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
            list.innerHTML = '<p class="dim-text">No appointments yet...</p>';
        } else {
            list.innerHTML = sched.map(s => {
                const h = Math.floor(s.time / 60), m = s.time % 60;
                return `<div class="schedule-item"><span>${h}:${m.toString().padStart(2, '0')}</span><span>${s.desc}</span><span>${s.triggered ? '✓' : '⏳'}</span></div>`;
            }).join('');
        }
    }

    function initGame() {
        // Init UI Icons
        if (typeof Icons !== 'undefined') {
            Icons.initDOM();
        }

        // ===== TITLE SCREEN =====
        if (Engine.hasSave()) {
            document.getElementById('btn-continue').style.display = 'block';
        }

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

        document.getElementById('btn-credits').onclick = () => {
            document.getElementById('credits-overlay').style.display = 'flex';
        };
        document.getElementById('btn-close-credits').onclick = () => {
            document.getElementById('credits-overlay').style.display = 'none';
        };

        // ===== NAME SCREEN =====
        const nameInput = document.getElementById('player-name-input');
        const flavors = [
            '"Every great mortician started somewhere."',
            '"Death is just the beginning... of your career."',
            '"Your mother must be so proud."',
            '"Hopefully you spell it right on the tombstones."',
            '"The dead can\'t judge your name. The living will."'
        ];
        nameInput.oninput = () => {
            document.getElementById('name-flavor').textContent = flavors[Math.floor(Math.random() * flavors.length)];
            Audio8Bit.SFX.typing();
        };

        document.getElementById('btn-start-game').onclick = () => {
            const name = nameInput.value.trim();
            if (!name) {
                Engine.showToast('Enter a name! Even the dead have names.', 'warning');
                return;
            }
            Audio8Bit.SFX.success();
            Engine.resetState();
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
                    Engine.showToast('🔒 Buy this room in the Office!', 'warning');
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
        document.getElementById('btn-pause').onclick = () => { Engine.setSpeed(0); Audio8Bit.SFX.click(); Audio8Bit.updateSpeed(); };
        document.getElementById('btn-play').onclick = () => { Engine.setSpeed(1); Audio8Bit.SFX.click(); Audio8Bit.updateSpeed(); };
        document.getElementById('btn-fast').onclick = () => { Engine.setSpeed(1.5); Audio8Bit.SFX.click(); Audio8Bit.updateSpeed(); };

        // ===== AUDIO TOGGLE =====
        const audioToggle = document.getElementById('audio-toggle');
        audioToggle.innerHTML = Icons.getHTML('speaker'); // init icon
        audioToggle.onclick = () => {
            Audio8Bit.init();
            const muted = Audio8Bit.toggleMute();
            audioToggle.innerHTML = Icons.getHTML(muted ? 'speaker_off' : 'speaker');
        };

        // ===== GAME OVER =====
        document.getElementById('btn-restart').onclick = () => {
            localStorage.removeItem('thanatopractor_save');
            Engine.resetState();
            showScreen('title');
        };

        // ===== AUTO SAVE =====
        setInterval(() => {
            if (currentScreen !== 'title' && currentScreen !== 'name' && currentScreen !== 'gameover') {
                Engine.save();
            }
        }, 15000);
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
        Engine.showToast(`☠ Welcome, ${s.playerName}. The dead await.`, '');
    }

    // Init on load
    document.addEventListener('DOMContentLoaded', initGame);

    return { showScreen, get currentScreen() { return currentScreen; } };
})();
