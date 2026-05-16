/* ===== THANATOPRACTOR - Audio Engine (Web Audio API) ===== */
const Audio8Bit = (() => {
    let ctx = null;
    let masterGain = null;
    let musicGainA = null;
    let musicGainB = null;
    let sfxGain = null;
    let activeGain = 'A';
    let currentGainNode = null;
    let currentTrackName = null;
    let musicPlaying = false;
    let muted = false;
    let initialized = false;
    let currentMultiplier = 1.10;
    let trackOscillators = [];
    let trackTimeout = null;
    let ambienceNodes = null;

    function init() {
        if (initialized) return;
        try {
            ctx = new (window.AudioContext || window.webkitAudioContext)();
            masterGain = ctx.createGain();
            masterGain.gain.value = 0.7;
            masterGain.connect(ctx.destination);
            
            musicGainA = ctx.createGain();
            musicGainA.gain.value = 0.45;
            musicGainA.connect(masterGain);
            
            musicGainB = ctx.createGain();
            musicGainB.gain.value = 0;
            musicGainB.connect(masterGain);
            
            currentGainNode = musicGainA;
            sfxGain = ctx.createGain();
            sfxGain.gain.value = 0.5;
            sfxGain.connect(masterGain);

            if (ctx.state === 'suspended') ctx.resume();
            initialized = true;
            console.log("Audio8Bit Initialized");
        } catch (e) {
            console.error("Audio init failed", e);
        }
    }

    function playNote(freq, duration, type, gainNode, startTime, vol) {
        if (!ctx) return;
        const osc = ctx.createOscillator();
        const g = ctx.createGain();
        osc.type = type || 'square';
        osc.frequency.setValueAtTime(freq, startTime);
        g.gain.setValueAtTime((vol || 0.3), startTime);
        g.gain.exponentialRampToValueAtTime(0.001, startTime + duration);
        osc.connect(g);
        g.connect(gainNode || sfxGain);
        osc.start(startTime);
        osc.stop(startTime + duration);
    }

    const SFX = {
        click() { if (ctx) playNote(800, 0.05, 'square', sfxGain, ctx.currentTime, 0.2); },
        success() {
            if (!ctx) return;
            const t = ctx.currentTime;
            playNote(523, 0.1, 'square', sfxGain, t, 0.3);
            playNote(659, 0.1, 'square', sfxGain, t + 0.1, 0.3);
            playNote(784, 0.15, 'square', sfxGain, t + 0.2, 0.3);
        },
        victory() {
            if (!ctx) return;
            const t = ctx.currentTime;
            playNote(523.25, 0.1, 'square', sfxGain, t, 0.2);
            playNote(659.25, 0.1, 'square', sfxGain, t + 0.1, 0.2);
            playNote(783.99, 0.1, 'square', sfxGain, t + 0.2, 0.2);
            playNote(1046.50, 0.4, 'square', sfxGain, t + 0.3, 0.4);
            playNote(261.63, 0.8, 'sawtooth', sfxGain, t, 0.3);
            playNote(392.00, 0.8, 'sawtooth', sfxGain, t + 0.3, 0.3);
        },
        success() {
            if (!ctx) return;
            const t = ctx.currentTime;
            playNote(523.25, 0.1, 'square', sfxGain, t, 0.2);
            playNote(659.25, 0.1, 'square', sfxGain, t + 0.1, 0.2);
            playNote(783.99, 0.2, 'square', sfxGain, t + 0.2, 0.3);
        },
        fail() {
            if (!ctx) return;
            const t = ctx.currentTime;
            playNote(300, 0.15, 'sawtooth', sfxGain, t, 0.3);
            playNote(200, 0.25, 'sawtooth', sfxGain, t + 0.15, 0.3);
        },
        typing() { if (ctx) playNote(600 + Math.random() * 200, 0.03, 'square', sfxGain, ctx.currentTime, 0.1); },
        splashEntry() {
            if (!ctx) return;
            const t = ctx.currentTime;
            // Sinister ascending arpeggio: minor chord ascent
            const sinisterNotes = [130.8, 155.6, 185.0, 220.0, 261.6, 311.1, 370.0, 440.0, 523.3, 622.3, 740.0, 880.0];
            sinisterNotes.forEach((freq, i) => {
                const noteT = t + i * (2.0 / sinisterNotes.length);
                const osc = ctx.createOscillator();
                const g = ctx.createGain();
                osc.type = i % 2 === 0 ? 'square' : 'sawtooth';
                osc.frequency.setValueAtTime(freq, noteT);
                g.gain.setValueAtTime(0.0, noteT);
                g.gain.linearRampToValueAtTime(0.18, noteT + 0.05);
                g.gain.exponentialRampToValueAtTime(0.001, noteT + 0.3);
                osc.connect(g); g.connect(sfxGain);
                osc.start(noteT); osc.stop(noteT + 0.35);
            });
            // Low drone underneath
            const drone = ctx.createOscillator();
            const droneGain = ctx.createGain();
            drone.type = 'sine';
            drone.frequency.setValueAtTime(55, t);
            drone.frequency.exponentialRampToValueAtTime(110, t + 2.0);
            droneGain.gain.setValueAtTime(0, t);
            droneGain.gain.linearRampToValueAtTime(0.12, t + 0.3);
            droneGain.gain.linearRampToValueAtTime(0, t + 2.0);
            drone.connect(droneGain); droneGain.connect(sfxGain);
            drone.start(t); drone.stop(t + 2.0);
        },
        notification() {
            if (!ctx) return;
            const t = ctx.currentTime;
            playNote(880, 0.1, 'square', sfxGain, t, 0.2);
            playNote(1320, 0.1, 'square', sfxGain, t + 0.1, 0.15);
        },
        money() {
            if (!ctx) return;
            const t = ctx.currentTime;
            playNote(987, 0.05, 'square', sfxGain, t, 0.2);
            playNote(1318, 0.1, 'square', sfxGain, t + 0.05, 0.2);
        },
        levelUp() {
            if (!ctx) return;
            const t = ctx.currentTime;
            const notes = [261.6, 329.6, 392, 523.3, 659.3, 784, 1046.5];
            notes.forEach((f, i) => playNote(f, 0.2, 'square', sfxGain, t + i * 0.1, 0.25));
        },
        diceRoll() {
            if (!ctx) return;
            const t = ctx.currentTime;
            for(let i=0; i<5; i++) playNote(200 + Math.random()*400, 0.05, 'sawtooth', sfxGain, t + i*0.05, 0.1);
        },
        diceResult(success) {
            if (!ctx) return;
            if (success) SFX.success(); else SFX.fail();
        },
        fire() {
            if (!ctx) return;
            const t = ctx.currentTime;
            for(let i=0; i<10; i++) playNote(50 + Math.random()*100, 0.1, 'sawtooth', sfxGain, t + i*0.05, 0.2);
        },
        bell() {
            if (!ctx) return;
            const t = ctx.currentTime;
            playNote(987, 0.2, 'sine', sfxGain, t, 0.4);
            playNote(987, 0.5, 'sine', sfxGain, t + 0.05, 0.2);
        },
        gameOver() {
            if (!ctx) return;
            const t = ctx.currentTime;
            playNote(220, 0.5, 'sawtooth', sfxGain, t, 0.3);
            playNote(164.8, 0.5, 'sawtooth', sfxGain, t + 0.4, 0.3);
            playNote(110, 1.0, 'sawtooth', sfxGain, t + 0.8, 0.4);
        },
        newspaperSpin() {
            if (!ctx) return;
            const t = ctx.currentTime;
            const spinDuration = 1.5;

            // 1. WIND SPINNING FASTER AND FASTER
            const bufferSize = ctx.sampleRate * 2; // 2 seconds buffer
            const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
            const data = buffer.getChannelData(0);
            for (let i = 0; i < bufferSize; i++) data[i] = Math.random() * 2 - 1;

            const noise = ctx.createBufferSource();
            noise.buffer = buffer;
            noise.loop = true;

            const filter = ctx.createBiquadFilter();
            filter.type = 'bandpass';
            filter.frequency.setValueAtTime(600, t);
            filter.Q.setValueAtTime(3.0, t);

            // LFO to modulate filter frequency (creates the spinning whoosh)
            const lfo = ctx.createOscillator();
            lfo.type = 'sine';
            lfo.frequency.setValueAtTime(2, t); // Starts at 2 spins/sec
            lfo.frequency.exponentialRampToValueAtTime(16, t + spinDuration); // Ramps to 16 spins/sec

            const lfoGain = ctx.createGain();
            lfoGain.gain.setValueAtTime(400, t); // Frequency modulation depth ±400Hz

            lfo.connect(lfoGain);
            lfoGain.connect(filter.frequency);

            const noiseGain = ctx.createGain();
            noiseGain.gain.setValueAtTime(0.01, t);
            noiseGain.gain.exponentialRampToValueAtTime(0.35, t + spinDuration); // Swells up
            noiseGain.gain.linearRampToValueAtTime(0.001, t + spinDuration + 0.05); // Quick cut when it hits

            noise.connect(filter);
            filter.connect(noiseGain);
            noiseGain.connect(sfxGain);

            noise.start(t);
            lfo.start(t);
            noise.stop(t + spinDuration + 0.1);
            lfo.stop(t + spinDuration + 0.1);

            // 2. BOOM WITH ECHO AT t + spinDuration (1.5s)
            const boomT = t + spinDuration;

            // Create Echo / Delay network for the BOOM
            const delay = ctx.createDelay();
            delay.delayTime.value = 0.25; // 250ms echo
            const feedback = ctx.createGain();
            feedback.gain.value = 0.4; // Echo decay

            delay.connect(feedback);
            feedback.connect(delay);
            delay.connect(sfxGain);

            // Boom Sub-Oscillator
            const boomOsc = ctx.createOscillator();
            boomOsc.type = 'sine';
            boomOsc.frequency.setValueAtTime(180, boomT);
            boomOsc.frequency.exponentialRampToValueAtTime(30, boomT + 0.6);

            const boomGain = ctx.createGain();
            boomGain.gain.setValueAtTime(0, boomT);
            boomGain.gain.linearRampToValueAtTime(0.6, boomT + 0.02); // Punchy attack
            boomGain.gain.exponentialRampToValueAtTime(0.001, boomT + 0.7);

            boomOsc.connect(boomGain);
            boomGain.connect(sfxGain);
            boomGain.connect(delay); // Send to echo

            boomOsc.start(boomT);
            boomOsc.stop(boomT + 0.75);

            // Boom Impact Noise (for the "slap/hit" of the paper landing)
            const hitNoise = ctx.createBufferSource();
            hitNoise.buffer = buffer; // reuse white noise buffer
            const hitFilter = ctx.createBiquadFilter();
            hitFilter.type = 'lowpass';
            hitFilter.frequency.setValueAtTime(800, boomT);
            hitFilter.frequency.exponentialRampToValueAtTime(100, boomT + 0.4);

            const hitGain = ctx.createGain();
            hitGain.gain.setValueAtTime(0, boomT);
            hitGain.gain.linearRampToValueAtTime(0.4, boomT + 0.01);
            hitGain.gain.exponentialRampToValueAtTime(0.001, boomT + 0.4);

            hitNoise.connect(hitFilter);
            hitFilter.connect(hitGain);
            hitGain.connect(sfxGain);
            hitGain.connect(delay); // Send to echo

            hitNoise.start(boomT);
            hitNoise.stop(boomT + 0.45);
        }
    };

    function fadeOut(duration = 1.0) {
        if (!ctx || !currentGainNode) return;
        const t = ctx.currentTime;
        if (currentGainNode.gain.value < 0.01) return;
        currentGainNode.gain.cancelScheduledValues(t);
        currentGainNode.gain.setValueAtTime(currentGainNode.gain.value, t);
        currentGainNode.gain.linearRampToValueAtTime(0, t + duration);

        if (ambienceNodes && ambienceNodes.gainNode) {
            ambienceNodes.gainNode.gain.cancelScheduledValues(t);
            ambienceNodes.gainNode.gain.setValueAtTime(ambienceNodes.gainNode.gain.value, t);
            ambienceNodes.gainNode.gain.linearRampToValueAtTime(0, t + duration);
        }
    }

    function fadeIn(duration = 1.0) {
        if (!ctx || !currentGainNode) return;
        const t = ctx.currentTime;
        if (currentGainNode.gain.value > 0.4) return;
        currentGainNode.gain.cancelScheduledValues(t);
        currentGainNode.gain.setValueAtTime(currentGainNode.gain.value, t);
        currentGainNode.gain.linearRampToValueAtTime(0.45, t + duration);

        if (ambienceNodes && ambienceNodes.gainNode) {
            ambienceNodes.gainNode.gain.cancelScheduledValues(t);
            ambienceNodes.gainNode.gain.setValueAtTime(ambienceNodes.gainNode.gain.value, t);
            ambienceNodes.gainNode.gain.linearRampToValueAtTime(0.03, t + duration);
        }
    }

    function startAmbience() {
        if (!initialized) init();
        if (!ctx || ambienceNodes) return;
        
        try {
            if (ctx.state === 'suspended') ctx.resume();
            
            const bufferSize = 2 * ctx.sampleRate;
            const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
            const output = noiseBuffer.getChannelData(0);
            for (let i = 0; i < bufferSize; i++) output[i] = Math.random() * 2 - 1;

            const whiteNoise = ctx.createBufferSource();
            whiteNoise.buffer = noiseBuffer;
            whiteNoise.loop = true;

            const filter = ctx.createBiquadFilter();
            filter.type = 'lowpass';
            filter.frequency.value = 500;

            const gainNode = ctx.createGain();
            gainNode.gain.value = 0.03;

            const lfo = ctx.createOscillator();
            lfo.type = 'sine';
            lfo.frequency.value = 0.2;
            const lfoGain = ctx.createGain();
            lfoGain.gain.value = 0.02;
            lfo.connect(lfoGain);
            lfoGain.connect(gainNode.gain);

            whiteNoise.connect(filter);
            filter.connect(gainNode);
            gainNode.connect(masterGain);

            whiteNoise.start();
            lfo.start();
            ambienceNodes = { whiteNoise, lfo, gainNode };
            console.log("Ambience Started");
        } catch (e) { console.error("Ambience start failed", e); }
    }

    function stopAmbience() {
        console.log("Stopping Ambience...");
        if (ambienceNodes) {
            const nodes = ambienceNodes;
            ambienceNodes = null;
            try {
                if (nodes.gainNode) nodes.gainNode.gain.setValueAtTime(0, ctx.currentTime);
                if (nodes.whiteNoise) nodes.whiteNoise.stop();
                if (nodes.lfo) nodes.lfo.stop();
                console.log("Ambience Stopped Successfully");
            } catch (e) { console.warn("Ambience stop error", e); }
        } else {
            console.log("No ambience nodes to stop");
        }
    }

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
                { n: 'F1', d: 1 }, { n: 'F1', d: 1 }, { n: 'E1', d: 1 }, { n: 'E1', d: 1 },
                { n: 'D1', d: 1 }, { n: 'C1', d: 1 }, { n: 'B0', d: 1 }, { n: 'E1', d: 1 },
                { n: 'A1', d: 4 }
            ],
            drums: []
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
                { n: 'E1', d: 2 }, { n: 'G1', d: 2 }, { n: 'A1', d: 2 }, { n: 'B0', d: 2 },
                { n: 'E1', d: 2 }, { n: 'D1', d: 2 }, { n: 'B0', d: 4 },
                { n: 'E1', d: 2 }, { n: 'G1', d: 2 }, { n: 'A1', d: 2 }, { n: 'D2', d: 2 },
                { n: 'C1', d: 2 }, { n: 'B0', d: 2 }, { n: 'E1', d: 4 },
                { n: 'A1', d: 2 }, { n: 'B1', d: 2 }, { n: 'C2', d: 2 }, { n: 'G1', d: 2 },
                { n: 'B1', d: 4 }
            ],
            drums: [
                { d: 1, c: ['k','h'] }, { d: 1, c: ['h'] }, { d: 1, c: ['s','h'] }, { d: 1, c: ['h'] },
                { d: 1, c: ['k','h'] }, { d: 1, c: ['h'] }, { d: 1, c: ['s','h'] }, { d: 1, c: ['h'] },
                { d: 1, c: ['k','h'] }, { d: 1, c: ['h'] }, { d: 1, c: ['s','h'] }, { d: 1, c: ['h'] },
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
                { n: 'C2', d: 2 }, { n: 'B1', d: 2 }, { n: 'A1', d: 2 }, { n: 'G1', d: 4 }
            ],
            drums: []
        }
    };

    const NOTE_FREQS = {
        'R':0,'C1':32.7,'D1':36.7,'E1':41.2,'F1':43.7,'G1':49,'A1':55,'B1':61.7,
        'C2':65.4,'D2':73.4,'E2':82.4,'F2':87.3,'G2':98,'A2':110,'B2':123.5,
        'C3':130.8,'D3':146.8,'E3':164.8,'F3':174.6,'G3':196,'A3':220,'B3':246.9,
        'C4':261.6,'D4':293.7,'E4':329.6,'F4':349.2,'G4':392,'A4':440,'B4':493.9,
        'C5':523.3,'D5':587.3,'E5':659.3, 'F5':698.5, 'G5':784.0, 'A5':880.0, 'B0':30.9, 'A0':27.5
    };

    function playTrack(name) {
        if (!initialized) init();
        if (!ctx) return;
        if (ctx.state === 'suspended' && !document.hidden) ctx.resume();

        if (currentTrackName === name && musicPlaying) return;
        
        console.log("Playing Track:", name);
        const fadeTime = 1.0;
        const t = ctx.currentTime;
        
        if (currentGainNode) {
            currentGainNode.gain.cancelScheduledValues(t);
            currentGainNode.gain.linearRampToValueAtTime(0, t + fadeTime);
        }

        activeGain = activeGain === 'A' ? 'B' : 'A';
        const newNode = activeGain === 'A' ? musicGainA : musicGainB;
        
        trackOscillators = trackOscillators.filter(item => {
            // Stop oscillators for the node we are about to use OR ones that finished naturally
            const isFinished = ctx.currentTime > item.endTime;
            if (item.node === newNode || isFinished) {
                try { item.osc.stop(); } catch(e) {}
                return false;
            }
            return true;
        });

        currentGainNode = newNode;
        currentGainNode.gain.cancelScheduledValues(t);
        currentGainNode.gain.setValueAtTime(0, t);
        currentGainNode.gain.linearRampToValueAtTime(0.45, t + fadeTime);

        if (trackTimeout) clearTimeout(trackTimeout);
        currentTrackName = name;
        musicPlaying = true;
        scheduleTrack(name, currentGainNode);
    }

    function scheduleTrack(name, gainNode, startTime = null) {
        if (!musicPlaying || !ctx || currentTrackName !== name) return;
        const track = TRACKS[name];
        if (!track) return;
        
        const s = (typeof Engine !== 'undefined') ? Engine.getState().speed : 1;
        let speedMultiplier = 1;
        
        // Use the current multiplier if s=0 to maintain tempo during pause
        if (s === 0) {
            speedMultiplier = currentMultiplier; 
        } else {
            if (s > 1) speedMultiplier = 1.54; 
            else speedMultiplier = s * 1.10;
        }

        const beatDur = 60 / (track.bpm * speedMultiplier);
        
        // Start from where we left off or current time
        let currentTime = startTime;
        if (currentTime !== null && currentTime < ctx.currentTime) {
            currentTime = ctx.currentTime + 0.05; // We fell behind, catch up to now
        } else if (currentTime === null) {
            currentTime = ctx.currentTime + 0.1;
        }

        const isFirstChunk = (startTime === null || Math.abs(startTime - ctx.currentTime) < 0.15);
        
        // Schedule a larger chunk (8 beats) for better stability and fewer timeouts
        const chunkBeats = 8; 
        
        // We need to know which beat index we are on.
        // For simplicity in this 8-bit engine, we'll store the progress in the track state or pass it.
        if (startTime === null) {
            gainNode.trackBeatOffset = 0;
        }
        
        const totalTrackBeats = Math.max(
            track.notes ? track.notes.reduce((sum, note) => sum + note.d, 0) : 0,
            track.bass ? track.bass.reduce((sum, note) => sum + note.d, 0) : 0,
            track.drums ? track.drums.reduce((sum, step) => sum + step.d, 0) : 0
        ) || 1;
        
        let chunkStart = gainNode.trackBeatOffset || 0;
        let chunkEnd = chunkStart + chunkBeats;

        // Schedule Melody
        let melodyBeat = 0;
        if (track.notes) {
            track.notes.forEach(note => {
                const dur = note.d * beatDur;
                let k = Math.floor((chunkStart - melodyBeat - note.d) / totalTrackBeats);
                if (k < 0) k = 0;
                let baseBeat = melodyBeat + k * totalTrackBeats;

                for (let b = baseBeat; b < chunkEnd; b += totalTrackBeats) {
                    const startsInChunk = b >= chunkStart && b < chunkEnd;
                    const overlapsStart = isFirstChunk && b < chunkStart && b + note.d > chunkStart;
                    
                    if (startsInChunk || overlapsStart) {
                        const freq = NOTE_FREQS[note.n];
                        if (freq > 0) {
                            const noteStart = currentTime + (b - chunkStart) * beatDur;
                            const noteEnd = noteStart + dur;
                            const actualStart = Math.max(currentTime, noteStart);
                            if (noteEnd > actualStart) {
                                try {
                                    const osc = ctx.createOscillator();
                                    const g = ctx.createGain();
                                    osc.type = 'square';
                                    osc.frequency.setValueAtTime(freq, actualStart);
                                    g.gain.setValueAtTime(0.12, actualStart);
                                    g.gain.exponentialRampToValueAtTime(0.001, Math.max(actualStart, noteEnd - dur * 0.1));
                                    osc.connect(g); g.connect(gainNode);
                                    osc.start(actualStart); osc.stop(noteEnd);
                                    trackOscillators.push({ osc, node: gainNode, startTime: actualStart, endTime: noteEnd });
                                } catch(e) {}
                            }
                        }
                    }
                }
                melodyBeat += note.d;
            });
        }

        // Bass
        let bassBeat = 0;
        if (track.bass) {
            track.bass.forEach(note => {
                const dur = note.d * beatDur;
                let k = Math.floor((chunkStart - bassBeat - note.d) / totalTrackBeats);
                if (k < 0) k = 0;
                let baseBeat = bassBeat + k * totalTrackBeats;

                for (let b = baseBeat; b < chunkEnd; b += totalTrackBeats) {
                    const startsInChunk = b >= chunkStart && b < chunkEnd;
                    const overlapsStart = isFirstChunk && b < chunkStart && b + note.d > chunkStart;
                    
                    if (startsInChunk || overlapsStart) {
                        const freq = NOTE_FREQS[note.n];
                        if (freq > 0) {
                            const noteStart = currentTime + (b - chunkStart) * beatDur;
                            const noteEnd = noteStart + dur;
                            const actualStart = Math.max(currentTime, noteStart);
                            if (noteEnd > actualStart) {
                                try {
                                    const osc = ctx.createOscillator();
                                    const g = ctx.createGain();
                                    osc.type = 'triangle';
                                    osc.frequency.setValueAtTime(freq, actualStart);
                                    g.gain.setValueAtTime(0.18, actualStart);
                                    g.gain.exponentialRampToValueAtTime(0.001, Math.max(actualStart, noteEnd - dur * 0.1));
                                    osc.connect(g); g.connect(gainNode);
                                    osc.start(actualStart); osc.stop(noteEnd);
                                    trackOscillators.push({ osc, node: gainNode, startTime: actualStart, endTime: noteEnd });
                                } catch(e) {}
                            }
                        }
                    }
                }
                bassBeat += note.d;
            });
        }

        // Drums
        let drumBeat = 0;
        if (track.drums) {
            track.drums.forEach(step => {
                let k = Math.floor((chunkStart - drumBeat - step.d) / totalTrackBeats);
                if (k < 0) k = 0;
                let baseBeat = drumBeat + k * totalTrackBeats;

                for (let b = baseBeat; b < chunkEnd; b += totalTrackBeats) {
                    const startsInChunk = b >= chunkStart && b < chunkEnd;
                    const overlapsStart = isFirstChunk && b < chunkStart && b + step.d > chunkStart;
                    
                    if (startsInChunk || overlapsStart) {
                        const noteStart = currentTime + (b - chunkStart) * beatDur;
                        const actualStart = Math.max(currentTime, noteStart);
                        step.c.forEach(type => playDrumInternal(type, actualStart, gainNode));
                    }
                }
                drumBeat += step.d;
            });
        }

        const chunkDur = chunkBeats * beatDur;
        
        gainNode.currentChunk = {
            startBeat: chunkStart,
            endBeat: chunkEnd,
            startTime: currentTime,
            endTime: currentTime + chunkDur,
            beatDur: beatDur
        };

        // Update offset for next chunk
        gainNode.trackBeatOffset = chunkEnd;
        
        // Schedule next chunk safely before this one ends (500ms lookahead)
        trackTimeout = setTimeout(() => {
            if (currentTrackName === name && musicPlaying) {
                scheduleTrack(name, gainNode, currentTime + chunkDur);
            }
        }, Math.max(10, (chunkDur * 1000) - 500));
    }

    function playDrumInternal(type, start, gainNode) {
        if (!ctx) return;
        
        // Simple 8-bit drum synthesis
        if (type === 'k') { // Kick
            const osc = ctx.createOscillator();
            const g = ctx.createGain();
            osc.frequency.setValueAtTime(150, start);
            osc.frequency.exponentialRampToValueAtTime(0.01, start + 0.12);
            g.gain.setValueAtTime(0.15, start);
            g.gain.exponentialRampToValueAtTime(0.01, start + 0.12);
            osc.connect(g); g.connect(gainNode || masterGain);
            osc.start(start); osc.stop(start + 0.12);
            trackOscillators.push({ osc, node: gainNode, startTime: start, endTime: start + 0.12 });
        } else if (type === 's' || type === 'h') { // Snare or Hi-hat (noise-based)
            const bufferSize = ctx.sampleRate * 0.1;
            const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
            const data = buffer.getChannelData(0);
            for (let i = 0; i < bufferSize; i++) data[i] = Math.random() * 2 - 1;

            const noise = ctx.createBufferSource();
            noise.buffer = buffer;
            const filter = ctx.createBiquadFilter();
            const g = ctx.createGain();

            if (type === 's') {
                filter.type = 'highpass';
                filter.frequency.setValueAtTime(1000, start);
                g.gain.setValueAtTime(0.08, start);
                g.gain.exponentialRampToValueAtTime(0.01, start + 0.1);
            } else {
                filter.type = 'highpass';
                filter.frequency.setValueAtTime(5000, start);
                g.gain.setValueAtTime(0.04, start);
                g.gain.exponentialRampToValueAtTime(0.01, start + 0.05);
            }
            noise.connect(filter); filter.connect(g); g.connect(gainNode || masterGain);
            noise.start(start); noise.stop(start + 0.1);
            trackOscillators.push({ osc: noise, node: gainNode, startTime: start, endTime: start + 0.1 });
        }
    }

    function stopMusic() {
        if (!ctx || !currentGainNode) return;
        const t = ctx.currentTime;
        currentGainNode.gain.cancelScheduledValues(t);
        currentGainNode.gain.linearRampToValueAtTime(0, t + 0.5);
        musicPlaying = false;
        if (trackTimeout) clearTimeout(trackTimeout);
    }

    return {
        init, SFX, playTrack, stopMusic, fadeIn, fadeOut, startAmbience, stopAmbience,
        nextTrack() {
            const names = Object.keys(TRACKS);
            const idx = names.indexOf(currentTrackName);
            playTrack(names[(idx + 1) % names.length]);
        },
        updateSpeed() { 
            if (!musicPlaying || !currentGainNode) return;
            const s = (typeof Engine !== 'undefined') ? Engine.getState().speed : 1;
            
            // If the game is paused (speed 0), we don't update the multiplier.
            // This ensures the music stays at the "active" speed during menus.
            if (s === 0) return; 
            
            let newMult = 1.10;
            if (s > 1) newMult = 1.54;
            else if (s > 0) newMult = s * 1.10;

            if (currentMultiplier === newMult) return;
            currentMultiplier = newMult;

            const t = ctx.currentTime;
            const chunk = currentGainNode.currentChunk;
            let currentBeat = currentGainNode.trackBeatOffset || 0;

            if (chunk && t >= chunk.startTime && t <= chunk.endTime) {
                const progress = (t - chunk.startTime) / (chunk.endTime - chunk.startTime);
                currentBeat = chunk.startBeat + progress * (chunk.endBeat - chunk.startBeat);
            }

            // Stop future oscillators immediately
            trackOscillators.forEach(item => {
                if (item.node === currentGainNode && item.endTime > t) {
                    try { item.osc.stop(t); } catch(e) {}
                }
            });
            trackOscillators = trackOscillators.filter(item => item.node !== currentGainNode || item.endTime <= t);

            if (trackTimeout) clearTimeout(trackTimeout);

            // Reschedule from exact sub-beat position
            currentGainNode.trackBeatOffset = currentBeat;
            scheduleTrack(currentTrackName, currentGainNode, t);
        },
        suspend() { if (ctx && ctx.state === 'running') ctx.suspend(); },
        resume() { if (ctx && ctx.state === 'suspended') ctx.resume(); },
        get initialized() { return initialized; },
        get muted() { return muted; },
        toggleMute() {
            if (!initialized) init();
            muted = !muted;
            if (masterGain) {
                const t = ctx.currentTime;
                masterGain.gain.cancelScheduledValues(t);
                masterGain.gain.linearRampToValueAtTime(muted ? 0 : 0.7, t + 0.1);
            }
            return muted;
        }
    };
})();
window.Audio8Bit = Audio8Bit;
