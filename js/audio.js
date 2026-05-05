/* ===== THANATOPRACTOR - Audio Engine (Web Audio API) ===== */
const Audio8Bit = (() => {
    let ctx = null;
    let masterGain = null;
    let musicGainA = null;
    let musicGainB = null;
    let sfxGain = null;
    let activeGain = null;
    let currentGainNode = null;
    let currentTrackName = null;
    let musicPlaying = false;
    let muted = false;
    let initialized = false;
    let trackOscillators = [];
    let trackTimeout = null;

    function init() {
        if (initialized) return;
        ctx = new (window.AudioContext || window.webkitAudioContext)();
        masterGain = ctx.createGain();
        masterGain.gain.value = 0.4;
        masterGain.connect(ctx.destination);
        
        musicGainA = ctx.createGain();
        musicGainA.gain.value = 0.25;
        musicGainA.connect(masterGain);
        
        musicGainB = ctx.createGain();
        musicGainB.gain.value = 0;
        musicGainB.connect(masterGain);
        
        currentGainNode = musicGainA;
        activeGain = 'A';

        sfxGain = ctx.createGain();
        sfxGain.gain.value = 0.5;
        sfxGain.connect(masterGain);
        initialized = true;

        // Mute when tab is hidden, restore when visible
        document.addEventListener('visibilitychange', () => {
            if (!ctx || !masterGain) return;
            if (document.hidden) {
                masterGain.gain.setTargetAtTime(0, ctx.currentTime, 0.1);
            } else if (!muted) {
                masterGain.gain.setTargetAtTime(0.4, ctx.currentTime, 0.3);
            }
        });
    }

    function playNote(freq, duration, type, gainNode, startTime, vol) {
        if (!ctx) return;
        const osc = ctx.createOscillator();
        const g = ctx.createGain();
        osc.type = type || 'square';
        osc.frequency.value = freq;
        g.gain.setValueAtTime((vol || 0.3), startTime);
        g.gain.exponentialRampToValueAtTime(0.001, startTime + duration);
        osc.connect(g);
        g.connect(gainNode || sfxGain);
        osc.start(startTime);
        osc.stop(startTime + duration);
    }

    function playDrum(type, t) {
        if (!ctx) return;
        if (type === 'k') { // Kick
            const osc = ctx.createOscillator();
            const g = ctx.createGain();
            osc.frequency.setValueAtTime(150, t);
            osc.frequency.exponentialRampToValueAtTime(0.01, t + 0.1);
            g.gain.setValueAtTime(0.6, t);
            g.gain.exponentialRampToValueAtTime(0.01, t + 0.1);
            osc.connect(g); g.connect(currentGainNode);
            osc.start(t); osc.stop(t + 0.1);
        } else if (type === 's') { // Snare
            playNote(800 + Math.random()*200, 0.1, 'square', currentGainNode, t, 0.2);
            playNote(200, 0.1, 'sawtooth', currentGainNode, t, 0.2);
        } else if (type === 'h') { // Hihat
            playNote(1200 + Math.random()*200, 0.03, 'square', currentGainNode, t, 0.05);
        }
    }

    // ===== SFX =====
    const SFX = {
        click() {
            if (!ctx) return;
            const t = ctx.currentTime;
            playNote(800, 0.05, 'square', sfxGain, t, 0.2);
        },
        success() {
            if (!ctx) return;
            const t = ctx.currentTime;
            playNote(523, 0.1, 'square', sfxGain, t, 0.3);
            playNote(659, 0.1, 'square', sfxGain, t + 0.1, 0.3);
            playNote(784, 0.15, 'square', sfxGain, t + 0.2, 0.3);
        },
        fail() {
            if (!ctx) return;
            const t = ctx.currentTime;
            playNote(300, 0.15, 'sawtooth', sfxGain, t, 0.3);
            playNote(200, 0.25, 'sawtooth', sfxGain, t + 0.15, 0.3);
        },
        notification() {
            if (!ctx) return;
            const t = ctx.currentTime;
            playNote(880, 0.08, 'square', sfxGain, t, 0.2);
            playNote(1100, 0.08, 'square', sfxGain, t + 0.1, 0.2);
        },
        diceRoll() {
            if (!ctx) return;
            const t = ctx.currentTime;
            for (let i = 0; i < 8; i++) {
                playNote(200 + Math.random() * 600, 0.05, 'square', sfxGain, t + i * 0.06, 0.15);
            }
        },
        diceResult(good) {
            if (!ctx) return;
            const t = ctx.currentTime;
            if (good) {
                playNote(523, 0.1, 'square', sfxGain, t, 0.3);
                playNote(659, 0.1, 'square', sfxGain, t + 0.1, 0.3);
                playNote(784, 0.1, 'square', sfxGain, t + 0.2, 0.3);
                playNote(1047, 0.2, 'square', sfxGain, t + 0.3, 0.3);
            } else {
                playNote(400, 0.15, 'sawtooth', sfxGain, t, 0.3);
                playNote(350, 0.15, 'sawtooth', sfxGain, t + 0.15, 0.3);
                playNote(250, 0.3, 'sawtooth', sfxGain, t + 0.3, 0.3);
            }
        },
        money() {
            if (!ctx) return;
            const t = ctx.currentTime;
            playNote(1200, 0.05, 'square', sfxGain, t, 0.2);
            playNote(1500, 0.08, 'square', sfxGain, t + 0.06, 0.2);
        },
        bell() {
            if (!ctx) return;
            const t = ctx.currentTime;
            playNote(1400, 0.3, 'sine', sfxGain, t, 0.2);
            playNote(1800, 0.2, 'sine', sfxGain, t + 0.15, 0.15);
        },
        fire() {
            if (!ctx) return;
            const t = ctx.currentTime;
            for (let i = 0; i < 5; i++) {
                playNote(80 + Math.random() * 120, 0.1, 'sawtooth', sfxGain, t + i * 0.08, 0.1);
            }
        },
        gameOver() {
            if (!ctx) return;
            const t = ctx.currentTime;
            playNote(440, 0.3, 'square', sfxGain, t, 0.3);
            playNote(415, 0.3, 'square', sfxGain, t + 0.35, 0.3);
            playNote(392, 0.3, 'square', sfxGain, t + 0.7, 0.3);
            playNote(349, 0.5, 'sawtooth', sfxGain, t + 1.05, 0.4);
        },
        typing() {
            if (!ctx) return;
            playNote(600 + Math.random() * 200, 0.03, 'square', sfxGain, ctx.currentTime, 0.1);
        }
    };

    // ===== MUSIC TRACKS =====
    // 3 ambient chiptune tracks: eerie, melancholic, mysterious
    const TRACKS = {
        midnightDig: {
            bpm: 135,
            notes: [
                { n: 'A4', d: 0.5 }, { n: 'A4', d: 0.5 }, { n: 'C5', d: 1 }, { n: 'A4', d: 0.5 }, { n: 'G4', d: 0.5 }, { n: 'E4', d: 1 },
                { n: 'D4', d: 1 }, { n: 'E4', d: 1 }, { n: 'G4', d: 1 }, { n: 'E4', d: 1 },
                { n: 'A4', d: 0.5 }, { n: 'A4', d: 0.5 }, { n: 'D5', d: 1 }, { n: 'C5', d: 1 }, { n: 'A4', d: 1 },
                { n: 'G4', d: 0.5 }, { n: 'E4', d: 0.5 }, { n: 'G4', d: 1 }, { n: 'A4', d: 2 },
                { n: 'E5', d: 1 }, { n: 'D5', d: 1 }, { n: 'C5', d: 1 }, { n: 'A4', d: 1 },
                { n: 'G4', d: 1 }, { n: 'E4', d: 1 }, { n: 'D4', d: 1 }, { n: 'C4', d: 1 },
                { n: 'A4', d: 0.5 }, { n: 'C5', d: 0.5 }, { n: 'E5', d: 1 }, { n: 'D5', d: 1 }, { n: 'C5', d: 1 },
                { n: 'A4', d: 2 }, { n: 'R', d: 1 }, { n: 'G4', d: 1 }
            ],
            bass: [
                { n: 'A1', d: 1 }, { n: 'G1', d: 1 }, { n: 'F1', d: 1 }, { n: 'E1', d: 1 },
                { n: 'A1', d: 1 }, { n: 'C2', d: 1 }, { n: 'D2', d: 1 }, { n: 'E2', d: 1 },
                { n: 'A1', d: 1 }, { n: 'G1', d: 1 }, { n: 'F1', d: 1 }, { n: 'E1', d: 1 },
                { n: 'D1', d: 1 }, { n: 'C1', d: 1 }, { n: 'B0', d: 1 }, { n: 'A0', d: 1 },
                { n: 'A1', d: 1 }, { n: 'A1', d: 1 }, { n: 'G1', d: 1 }, { n: 'G1', d: 1 },
                { n: 'F1', d: 1 }, { n: 'F1', d: 1 }, { n: 'E1', d: 2 }
            ],
            drums: [
                { d: 1, c: ['k','h'] }, { d: 1, c: ['s','h'] }, { d: 1, c: ['k','h'] }, { d: 1, c: ['s','h'] },
                { d: 1, c: ['k','h'] }, { d: 1, c: ['s','h'] }, { d: 1, c: ['k','h'] }, { d: 1, c: ['s','h'] },
                { d: 1, c: ['k','h'] }, { d: 1, c: ['s','h'] }, { d: 1, c: ['k','h'] }, { d: 1, c: ['s','h'] },
                { d: 1, c: ['k','h'] }, { d: 1, c: ['s','h'] }, { d: 1, c: ['k','h'] }, { d: 1, c: ['s','h'] },
                { d: 1, c: ['k','h'] }, { d: 1, c: ['s','h'] }, { d: 1, c: ['k','h'] }, { d: 1, c: ['s','h'] },
                { d: 1, c: ['k','h'] }, { d: 1, c: ['s','h'] }, { d: 1, c: ['k','h'] }, { d: 1, c: ['s','h'] },
                { d: 1, c: ['k','h'] }, { d: 1, c: ['s','h'] }, { d: 1, c: ['k','h'] }, { d: 1, c: ['s','h'] }
            ]
        },
        eternalRest: {
            bpm: 110,
            notes: [
                { n: 'E4', d: 1 }, { n: 'G4', d: 0.5 }, { n: 'A4', d: 0.5 }, { n: 'B4', d: 1 }, { n: 'A4', d: 1 },
                { n: 'G4', d: 0.5 }, { n: 'E4', d: 0.5 }, { n: 'D4', d: 1 }, { n: 'E4', d: 2 },
                { n: 'E4', d: 1 }, { n: 'G4', d: 0.5 }, { n: 'A4', d: 0.5 }, { n: 'B4', d: 1 }, { n: 'D5', d: 1 },
                { n: 'B4', d: 0.5 }, { n: 'A4', d: 0.5 }, { n: 'G4', d: 1 }, { n: 'E4', d: 2 },
                { n: 'A4', d: 1 }, { n: 'B4', d: 1 }, { n: 'C5', d: 1 }, { n: 'B4', d: 1 },
                { n: 'A4', d: 1 }, { n: 'G4', d: 1 }, { n: 'F4', d: 1 }, { n: 'E4', d: 1 },
                { n: 'D4', d: 1 }, { n: 'C4', d: 1 }, { n: 'B3', d: 1 }, { n: 'A3', d: 1 },
                { n: 'E4', d: 1 }, { n: 'F4', d: 1 }, { n: 'G4', d: 1 }, { n: 'A4', d: 1 },
                { n: 'B4', d: 1 }, { n: 'C5', d: 1 }, { n: 'D5', d: 1 }, { n: 'E5', d: 1 },
                { n: 'B4', d: 2 }, { n: 'A4', d: 2 }, { n: 'G4', d: 4 }
            ],
            bass: [
                { n: 'E2', d: 1 }, { n: 'G2', d: 1 }, { n: 'A2', d: 1 }, { n: 'B1', d: 1 },
                { n: 'E2', d: 1 }, { n: 'D2', d: 1 }, { n: 'B1', d: 2 },
                { n: 'E2', d: 1 }, { n: 'G2', d: 1 }, { n: 'A2', d: 1 }, { n: 'D3', d: 1 },
                { n: 'C2', d: 1 }, { n: 'B1', d: 1 }, { n: 'E2', d: 2 },
                { n: 'A2', d: 1 }, { n: 'B2', d: 1 }, { n: 'C3', d: 1 }, { n: 'G2', d: 1 },
                { n: 'F2', d: 1 }, { n: 'E2', d: 1 }, { n: 'D2', d: 1 }, { n: 'C2', d: 1 },
                { n: 'E2', d: 1 }, { n: 'F2', d: 1 }, { n: 'G2', d: 1 }, { n: 'A2', d: 1 },
                { n: 'B2', d: 4 }
            ],
            drums: [
                { d: 1, c: ['k','h'] }, { d: 1, c: ['h'] }, { d: 1, c: ['s','h'] }, { d: 1, c: ['h'] },
                { d: 1, c: ['k','h'] }, { d: 1, c: ['h'] }, { d: 1, c: ['s','h'] }, { d: 1, c: ['h'] },
                { d: 1, c: ['k','h'] }, { d: 1, c: ['h'] }, { d: 1, c: ['s','h'] }, { d: 1, c: ['h'] },
                { d: 1, c: ['k','h'] }, { d: 1, c: ['h'] }, { d: 1, c: ['s','h'] }, { d: 1, c: ['h'] },
                { d: 1, c: ['k','h'] }, { d: 1, c: ['h'] }, { d: 1, c: ['s','h'] }, { d: 1, c: ['h'] },
                { d: 1, c: ['k','h'] }, { d: 1, c: ['h'] }, { d: 1, c: ['s','h'] }, { d: 1, c: ['h'] },
                { d: 1, c: ['k','h'] }, { d: 1, c: ['h'] }, { d: 1, c: ['s','h'] }, { d: 1, c: ['h'] },
                { d: 1, c: ['k','h'] }, { d: 1, c: ['h'] }, { d: 1, c: ['s','h'] }, { d: 1, c: ['h'] }
            ]
        },
        coffinShuffle: {
            bpm: 115,
            notes: [
                { n: 'C5', d: 1 }, { n: 'G4', d: 1 }, { n: 'C5', d: 1 }, { n: 'G4', d: 1 },
                { n: 'E5', d: 1 }, { n: 'D5', d: 1 }, { n: 'C5', d: 1 }, { n: 'G4', d: 1 },
                { n: 'A4', d: 0.5 }, { n: 'B4', d: 0.5 }, { n: 'C5', d: 1 }, { n: 'G4', d: 1 }, { n: 'A4', d: 1 },
                { n: 'F4', d: 1 }, { n: 'G4', d: 1 }, { n: 'E4', d: 1 }, { n: 'D4', d: 1 },
                { n: 'C4', d: 1 }, { n: 'E4', d: 1 }, { n: 'G4', d: 1 }, { n: 'C5', d: 2 },
                { n: 'C5', d: 0.5 }, { n: 'D5', d: 0.5 }, { n: 'E5', d: 1 }, { n: 'F5', d: 1 }, { n: 'G5', d: 2 }
            ],
            bass: [
                { n: 'C2', d: 1 }, { n: 'E2', d: 1 }, { n: 'G2', d: 1 }, { n: 'B1', d: 1 },
                { n: 'C2', d: 1 }, { n: 'E2', d: 1 }, { n: 'G2', d: 1 }, { n: 'B1', d: 1 },
                { n: 'F1', d: 1 }, { n: 'A1', d: 1 }, { n: 'C2', d: 1 }, { n: 'E2', d: 1 },
                { n: 'G1', d: 1 }, { n: 'B1', d: 1 }, { n: 'D2', d: 1 }, { n: 'F2', d: 1 },
                { n: 'C2', d: 4 }, { n: 'G1', d: 4 }
            ],
            drums: [
                { d: 1, c: ['k','h'] }, { d: 1, c: ['s','h'] }, { d: 1, c: ['k','h'] }, { d: 1, c: ['s','h'] },
                { d: 1, c: ['k','h'] }, { d: 1, c: ['s','h'] }, { d: 1, c: ['k','h'] }, { d: 1, c: ['s','h'] },
                { d: 1, c: ['k','h'] }, { d: 1, c: ['s','h'] }, { d: 1, c: ['k','h'] }, { d: 1, c: ['s','h'] },
                { d: 1, c: ['k','h'] }, { d: 1, c: ['s','h'] }, { d: 1, c: ['k','h'] }, { d: 1, c: ['s','h'] },
                { d: 1, c: ['k','h'] }, { d: 1, c: ['s','h'] }, { d: 1, c: ['k','h'] }, { d: 1, c: ['s','h'] }
            ]
        }
    };

    const NOTE_FREQS = {
        'R':0,'C1':32.7,'D1':36.7,'E1':41.2,'F1':43.7,'G1':49,'A1':55,'Bb1':58.3,'B1':61.7,
        'C2':65.4,'D2':73.4,'E2':82.4,'F2':87.3,'G2':98,'A2':110,'Bb2':116.5,'B2':123.5,
        'C3':130.8,'D3':146.8,'E3':164.8,'F3':174.6,'G3':196,'A3':220,'Bb3':233.1,'B3':246.9,
        'C4':261.6,'D4':293.7,'E4':329.6,'F4':349.2,'G4':392,'A4':440,'Bb4':466.2,'B4':493.9,
        'C5':523.3,'D5':587.3,'E5':659.3, 'F5':698.5, 'G5':784.0, 'A5':880.0, 'B0':30.9, 'A0':27.5
    };



    function stopMusic() {
        trackOscillators.forEach(o => { try { o.stop(); } catch(e){} });
        trackOscillators = [];
        if (trackTimeout) clearTimeout(trackTimeout);
        musicPlaying = false;
    }

    function playTrack(name) {
        if (!ctx || !initialized) return;
        
        const fadeTime = 1.5; // seconds for crossfade
        const t = ctx.currentTime;
        
        // Fade out current node
        if (currentGainNode) {
            currentGainNode.gain.linearRampToValueAtTime(0, t + fadeTime);
        }

        // Switch to the other gain node for the new track
        activeGain = activeGain === 'A' ? 'B' : 'A';
        currentGainNode = activeGain === 'A' ? musicGainA : musicGainB;
        
        // Prepare new gain node
        currentGainNode.gain.cancelScheduledValues(t);
        currentGainNode.gain.setValueAtTime(0, t);
        currentGainNode.gain.linearRampToValueAtTime(0.25, t + fadeTime);

        // Reset tracking
        if (trackTimeout) clearTimeout(trackTimeout);
        trackOscillators = [];
        
        currentTrackName = name;
        musicPlaying = true;
        scheduleTrack(name, currentGainNode);
    }

    function scheduleTrack(name, gainNode) {
        if (!musicPlaying || !ctx || currentTrackName !== name) return;
        const track = TRACKS[name];
        if (!track) return;
        const speedMultiplier = (typeof Engine !== 'undefined') ? Math.max(1, Engine.getState().speed) : 1;
        const beatDur = 60 / (track.bpm * speedMultiplier);
        let t = ctx.currentTime + 0.1;

        // Melody
        track.notes.forEach(note => {
            const freq = NOTE_FREQS[note.n];
            const dur = note.d * beatDur;
            if (freq > 0) {
                const osc = ctx.createOscillator();
                const g = ctx.createGain();
                osc.type = 'square';
                osc.frequency.value = freq;
                g.gain.setValueAtTime(0.15, t);
                g.gain.exponentialRampToValueAtTime(0.001, t + dur * 0.9);
                osc.connect(g); g.connect(gainNode);
                osc.start(t); osc.stop(t + dur);
                trackOscillators.push(osc);
            }
            t += dur;
        });
        const melodyEnd = t;

        // Bass
        let tb = ctx.currentTime + 0.1;
        track.bass.forEach(note => {
            const freq = NOTE_FREQS[note.n];
            const dur = note.d * beatDur;
            if (freq > 0) {
                const osc = ctx.createOscillator();
                const g = ctx.createGain();
                osc.type = 'triangle';
                osc.frequency.value = freq;
                g.gain.setValueAtTime(0.25, tb);
                g.gain.exponentialRampToValueAtTime(0.001, tb + dur * 0.9);
                osc.connect(g); g.connect(gainNode);
                osc.start(tb); osc.stop(tb + dur);
                trackOscillators.push(osc);
            }
            tb += dur;
        });

        // Drums
        let td = ctx.currentTime + 0.1;
        track.drums.forEach(step => {
            const dur = step.d * beatDur;
            step.c.forEach(type => {
                if (type === 'k') {
                    const osc = ctx.createOscillator();
                    const g = ctx.createGain();
                    osc.frequency.setValueAtTime(150, td);
                    osc.frequency.exponentialRampToValueAtTime(0.01, td + 0.1);
                    g.gain.setValueAtTime(0.6, td);
                    g.gain.exponentialRampToValueAtTime(0.01, td + 0.1);
                    osc.connect(g); g.connect(gainNode);
                    osc.start(td); osc.stop(td + 0.1);
                } else if (type === 's') {
                    const osc1 = ctx.createOscillator(); const g1 = ctx.createGain();
                    osc1.frequency.value = 800 + Math.random()*200;
                    g1.gain.setValueAtTime(0.2, td); g1.gain.exponentialRampToValueAtTime(0.001, td + 0.1);
                    osc1.connect(g1); g1.connect(gainNode);
                    osc1.start(td); osc1.stop(td + 0.1);
                } else if (type === 'h') {
                    const osc = ctx.createOscillator(); const g = ctx.createGain();
                    osc.frequency.value = 1200 + Math.random()*200;
                    g.gain.setValueAtTime(0.05, td); g.gain.exponentialRampToValueAtTime(0.001, td + 0.03);
                    osc.connect(g); g.connect(gainNode);
                    osc.start(td); osc.stop(td + 0.03);
                }
            });
            td += dur;
        });

        // Loop
        const totalDur = (Math.max(t, tb, td) - ctx.currentTime);
        trackTimeout = setTimeout(() => {
            if (currentTrackName === name && musicPlaying) scheduleTrack(name, gainNode);
        }, totalDur * 1000 - 100);
    }

    function nextTrack() {
        const names = Object.keys(TRACKS);
        const idx = names.indexOf(currentTrackName);
        const next = names[(idx + 1) % names.length];
        playTrack(next);
    }

    function toggleMute() {
        if (!ctx) return;
        muted = !muted;
        masterGain.gain.value = muted ? 0 : 0.4;
        return muted;
    }

    function updateSpeed() {
        if (musicPlaying && currentTrackName) {
            playTrack(currentTrackName);
        }
    }

    return {
        init, SFX, playTrack, stopMusic, nextTrack, toggleMute, updateSpeed,
        get muted() { return muted; },
        get initialized() { return initialized; }
    };
})();
