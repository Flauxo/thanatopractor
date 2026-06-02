const HearseGame = (() => {
    let overlay = null;
    let canvas = null;
    let ctx = null;
    let gameLoopId;
    let lastTime = 0;
    let onGameComplete = null;

    let imgBg = new Image();
    let imgCar = new Image();
    let imgExplosion = new Image();
    let imgDedo = new Image();
    
    // --- Audio Engine ---
    const AudioEngine = (() => {
        let actx = null;
        let masterGain = null;
        let isPlaying = false;
        let loopTimeout = null;
        let beatCount = 0;

        function init() {
            if(actx) return;
            const AudioContext = window.AudioContext || window.webkitAudioContext;
            actx = new AudioContext();
            masterGain = actx.createGain();
            masterGain.gain.value = 0.5;
            masterGain.connect(actx.destination);
        }

        function playTone(freq, type, duration, vol=0.3) {
            if(!actx) return;
            const osc = actx.createOscillator();
            const gain = actx.createGain();
            osc.type = type;
            const t = actx.currentTime;
            osc.frequency.setValueAtTime(freq, t);
            gain.gain.setValueAtTime(vol, t);
            gain.gain.exponentialRampToValueAtTime(0.01, t + duration);
            osc.connect(gain);
            gain.connect(masterGain);
            osc.start(t);
            osc.stop(t + duration);
        }

        function playNoise(duration, vol=0.3) {
            if(!actx) return;
            const bufferSize = actx.sampleRate * duration;
            const buffer = actx.createBuffer(1, bufferSize, actx.sampleRate);
            const data = buffer.getChannelData(0);
            for(let i=0; i<bufferSize; i++) data[i] = Math.random() * 2 - 1;
            const noise = actx.createBufferSource();
            noise.buffer = buffer;
            const filter = actx.createBiquadFilter();
            filter.type = 'lowpass';
            filter.frequency.value = 800;
            const gain = actx.createGain();
            const t = actx.currentTime;
            gain.gain.setValueAtTime(vol, t);
            gain.gain.exponentialRampToValueAtTime(0.01, t + duration);
            noise.connect(filter);
            filter.connect(gain);
            gain.connect(masterGain);
            noise.start(t);
            noise.stop(t + duration);
        }

        function playPuff(duration, vol=0.5) {
            if(!actx) return;
            const bufferSize = actx.sampleRate * duration;
            const buffer = actx.createBuffer(1, bufferSize, actx.sampleRate);
            const data = buffer.getChannelData(0);
            for(let i=0; i<bufferSize; i++) data[i] = Math.random() * 2 - 1;
            const noise = actx.createBufferSource();
            noise.buffer = buffer;
            const filter = actx.createBiquadFilter();
            filter.type = 'bandpass';
            filter.frequency.value = 3500;
            const gain = actx.createGain();
            const t = actx.currentTime;
            gain.gain.setValueAtTime(vol, t);
            gain.gain.setValueAtTime(vol, t + duration - 0.01);
            gain.gain.linearRampToValueAtTime(0.01, t + duration);
            noise.connect(filter);
            filter.connect(gain);
            gain.connect(masterGain);
            noise.start(t);
            noise.stop(t + duration);
        }

        const bpm = 180; 
        const beatLen = 60 / bpm;
        const progression = [
            [55.00, 69.30, 82.41, 69.30], [55.00, 69.30, 82.41, 69.30], 
            [73.42, 92.50, 110.00, 92.50], [55.00, 69.30, 82.41, 69.30], 
            [82.41, 103.83, 123.47, 103.83], [73.42, 92.50, 110.00, 92.50], 
            [55.00, 69.30, 82.41, 69.30], [55.00, 69.30, 82.41, 69.30]  
        ];

        const melodyPattern = new Array(32).fill(null);
        melodyPattern[0]  = { n: 440.00, d: 1.5 }; 
        melodyPattern[3]  = { n: 523.25, d: 1.0 }; 
        melodyPattern[4]  = { n: 587.33, d: 1.5 }; 
        melodyPattern[7]  = { n: 523.25, d: 1.0 }; 
        melodyPattern[8]  = { n: 659.25, d: 3.0 }; 
        melodyPattern[16] = { n: 440.00, d: 1.5 }; 
        melodyPattern[19] = { n: 523.25, d: 1.0 }; 
        melodyPattern[20] = { n: 783.99, d: 1.5 }; 
        melodyPattern[23] = { n: 659.25, d: 3.0 }; 

        function scheduleBluesBeat() {
            if(!isPlaying) return;
            const totalBeats = 32;
            const currentTotalBeat = beatCount % totalBeats;
            const bar = Math.floor(currentTotalBeat / 4);
            const beatInBar = currentTotalBeat % 4;
            
            const bassNote = progression[bar][beatInBar];
            playTone(bassNote, 'square', beatLen, 0.4);
            
            if(beatInBar === 0 || beatInBar === 2) playTone(60, 'square', 0.1, 0.4); 
            if(beatInBar === 1 || beatInBar === 3) playNoise(0.1, 0.4); 
            playNoise(0.05, 0.1); 
            
            const melodyNote = melodyPattern[currentTotalBeat];
            if(melodyNote) {
                playTone(melodyNote.n, 'sawtooth', beatLen * melodyNote.d, 0.25);
            }
            
            beatCount++;
            loopTimeout = setTimeout(scheduleBluesBeat, beatLen * 1000);
        }

        return {
            init,
            startMusic: () => {
                if(isPlaying) return;
                init();
                if(actx.state === 'suspended') actx.resume();
                isPlaying = true;
                beatCount = 0;
                scheduleBluesBeat();
            },
            stopMusic: () => {
                isPlaying = false;
                clearTimeout(loopTimeout);
            },
            SFX: {
                shoot: () => playTone(880, 'sawtooth', 0.3, 0.6), // Más fuerte y largo
                hit: () => playNoise(0.2, 0.5),
                crash: () => {
                    playNoise(0.5, 0.6);
                    playTone(100, 'sawtooth', 0.5, 0.5);
                },
                pickup: () => {
                    playTone(880, 'sine', 0.1, 0.4);
                    setTimeout(() => playTone(1760, 'sine', 0.15, 0.4), 100);
                },
                wind: () => playPuff(0.06, 0.6),
                fatalCrash: () => {
                    init();
                    playNoise(1.5, 1.0); // Explosión enorme
                    playTone(80, 'sawtooth', 1.5, 0.8);
                    // Melodía menor descendente a la vez que el crash
                    setTimeout(() => {
                        playTone(523.25, 'square', 0.4, 0.5); // C5
                        setTimeout(() => playTone(466.16, 'square', 0.4, 0.5), 400); // Bb4
                        setTimeout(() => playTone(415.30, 'square', 0.4, 0.5), 800); // Ab4
                        setTimeout(() => playTone(392.00, 'square', 0.4, 0.5), 1200); // G4
                        setTimeout(() => playTone(349.23, 'square', 1.0, 0.5), 1600); // F4 larga
                    }, 0);
                }
            }
        };
    })();

    const stars = Array.from({length: 15}, () => ({
        x: Math.random() < 0.5 ? Math.random() * 0.3 : 0.7 + Math.random() * 0.3, 
        y: Math.random() * 0.4, 
        blinkOffset: Math.random() * 1000,
        blinkSpeed: Math.random() * 0.5 + 0.5
    }));

    const GameState = {
        isRunning: false,
        speed: 1200, 
        lineOffset: 0,
        playerLane: 0, 
        targetLane: 0,
        lives: 3,
        crosses: 5,
        crossesSpawned: 0,
        distanceLeft: 4800, // 60 segundos
        entities: [],
        projectiles: [],
        shakeAmount: 0,
        explosions: [],
        hideFinger: false,
        keys: { left: false, right: false }
    };

    const horizonY = 220; 

    function takeDamage() {
        GameState.lives--;
        GameState.shakeAmount = 25;
        AudioEngine.SFX.crash();
        if(GameState.lives <= 0) {
            gameOver(false);
        }
    }

    function gameOver(success) {
        GameState.isRunning = false;
        AudioEngine.stopMusic();
        
        if(!success) {
            AudioEngine.SFX.fatalCrash();
        }
        
        // Retrasar cierre si hay música de final
        setTimeout(() => {
            document.body.removeChild(overlay);
            document.removeEventListener('keydown', keydownHandler);
            if (typeof Audio8Bit !== 'undefined') {
                Audio8Bit.resume();
            }
            if (typeof Engine !== 'undefined') Engine.restoreSpeed(); // Resume simulation
            if(onGameComplete) onGameComplete(success);
        }, success ? 500 : 2000); // 2s de pantalla roja
    }

    function zToY(z, H) {
        const scale = 500 / (z + 500); 
        return horizonY + (H - horizonY) * scale;
    }

    function update(dt) {
        GameState.lineOffset -= GameState.speed * dt;
        if(GameState.lineOffset < 0) GameState.lineOffset += 400;
        
        GameState.distanceLeft -= (GameState.speed/15) * dt;
        if(GameState.distanceLeft <= 0) {
            gameOver(true); // Win
            return;
        }
        
        GameState.playerLane += (GameState.targetLane - GameState.playerLane) * 15 * dt;
        
        if(Math.random() < 0.020) {
            let proposedLane = Math.floor(Math.random() * 3) - 1;
            
            let occupiedLanes = new Set();
            GameState.entities.forEach(e => {
                if (e.active && e.z > 6500) { 
                    occupiedLanes.add(e.lane);
                }
            });
            
            // Avoid creating a wall
            if (!(occupiedLanes.size === 2 && !occupiedLanes.has(proposedLane))) {
                let entityType = Math.floor(Math.random() * 3);
                if (GameState.crossesSpawned < 5 && Math.random() < 0.15) {
                    entityType = 'cross';
                    GameState.crossesSpawned++;
                }
                GameState.entities.push({
                    lane: proposedLane,
                    z: 8000,
                    type: entityType, 
                    active: true
                });
            }
        }
        
        GameState.entities.forEach(e => {
            if(!e.active) return;
            e.z -= (GameState.speed * 1.5) * dt; 
            
            if(e.z < 800 && e.z > 300 && Math.abs(e.lane - Math.round(GameState.playerLane)) < 0.5) {
                if (e.type === 'cross') {
                    GameState.crosses++;
                    AudioEngine.SFX.pickup();
                    e.active = false;
                } else {
                    GameState.explosions.push({ isPlayer: true, lane: e.lane, time: 0 });
                    takeDamage();
                    e.active = false;
                }
            }
            if(e.z < 0) e.active = false;
        });
        
        GameState.projectiles.forEach((p) => {
            p.z += 6000 * dt; 
            if(p.z > 8000) p.active = false;
            
            GameState.entities.forEach(e => {
                if(e.active && p.active && Math.abs(e.lane - p.lane) < 0.5) {
                    if(Math.abs(e.z - p.z) < 1000) {
                        if (e.type !== 'cross') {
                            AudioEngine.SFX.hit();
                            GameState.explosions.push({ lane: e.lane, z: e.z, time: 0 });
                            e.active = false;
                            p.active = false;
                        }
                    }
                }
            });
        });
        
        GameState.entities = GameState.entities.filter(e => e.active);
        GameState.projectiles = GameState.projectiles.filter(p => p.active);
        
        GameState.explosions.forEach(exp => {
            exp.time += dt;
            if (exp.z !== undefined) exp.z -= (GameState.speed * 1.5) * dt;
        });
        GameState.explosions = GameState.explosions.filter(exp => exp.time < 0.5);

        if(GameState.shakeAmount > 0) GameState.shakeAmount *= 0.9;
    }

    function drawEnemyCar(ctx, cx, cy, scale, type) {
        const w = 130 * scale;
        const h = (type === 2 ? 115 : 95) * scale; 
        const x = cx - w/2;
        const y = cy - h;

        ctx.save();
        if (type === 0) { 
            ctx.fillStyle = '#1a1a2e'; ctx.fillRect(x, y + h*0.3, w, h*0.7);
            ctx.fillStyle = '#10101b'; ctx.fillRect(x + w*0.1, y, w*0.8, h*0.4);
            ctx.fillStyle = '#050505'; ctx.fillRect(x + w*0.15, y + h*0.1, w*0.7, h*0.2);
        } else if (type === 1) { 
            ctx.fillStyle = '#e0e0e0'; ctx.fillRect(x, y + h*0.4, w, h*0.6);
            ctx.fillStyle = '#b0b0b0'; ctx.fillRect(x + w*0.15, y + h*0.1, w*0.7, h*0.3);
            ctx.fillStyle = '#111111'; ctx.fillRect(x + w*0.2, y + h*0.15, w*0.6, h*0.15);
            ctx.fillStyle = '#cc0000'; ctx.fillRect(cx - w*0.1, y, w*0.2, h);
        } else { 
            ctx.fillStyle = '#3e4a2e'; ctx.fillRect(x, y + h*0.2, w, h*0.8);
            ctx.fillStyle = '#2c361e'; ctx.fillRect(x + w*0.05, y, w*0.9, h*0.4);
            ctx.fillStyle = '#000000'; ctx.fillRect(x + w*0.1, y + h*0.05, w*0.8, h*0.25);
            ctx.fillStyle = '#6e3b2e'; ctx.fillRect(x, y + h*0.5, w*0.2, h*0.3);
            ctx.fillRect(x + w*0.7, y + h*0.8, w*0.3, h*0.2);
        }

        ctx.fillStyle = '#ff0000';
        ctx.fillRect(x + w*0.05, y + h*0.5, w*0.15, h*0.15);
        ctx.fillRect(x + w*0.8, y + h*0.5, w*0.15, h*0.15);
        ctx.fillStyle = '#333';
        ctx.fillRect(x - w*0.02, y + h*0.8, w*1.04, h*0.15);
        ctx.restore();
    }

    function draw() {
        const W = canvas.width;
        const H = canvas.height;
        
        let shakeX = (Math.random()-0.5)*GameState.shakeAmount;
        let shakeY = (Math.random()-0.5)*GameState.shakeAmount;
        
        ctx.save();
        ctx.translate(shakeX, shakeY);
        
        ctx.drawImage(imgBg, 0, 0, W, H);

        stars.forEach(s => {
            const time = performance.now();
            const blink = Math.sin((time + s.blinkOffset) * 0.005 * s.blinkSpeed);
            if(blink > 0.95) {
                ctx.fillStyle = '#ffffff';
                ctx.fillRect(s.x * W, s.y * horizonY, 3, 3);
            } else {
                ctx.fillStyle = 'rgba(255,255,255,0.4)';
                ctx.fillRect(s.x * W, s.y * horizonY, 1.5, 1.5);
            }
        });
        
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 4;
        for(let z = GameState.lineOffset; z < 8000; z += 400) {
            const y1 = zToY(z, H);
            const y2 = zToY(z + 200, H);
            const scale1 = 500 / (z + 500);
            const scale2 = 500 / (z + 200 + 500);
            
            ctx.beginPath(); ctx.moveTo(W/2 - 140 * scale1, y1); ctx.lineTo(W/2 - 140 * scale2, y2); ctx.stroke();
            ctx.beginPath(); ctx.moveTo(W/2 + 140 * scale1, y1); ctx.lineTo(W/2 + 140 * scale2, y2); ctx.stroke();
        }
        
        GameState.entities.forEach(e => {
            const scale = 500 / (e.z + 500);
            const y = zToY(e.z, H);
            const laneOffset = e.lane * 300 * scale;
            
            if (e.type === 'cross') {
                const cx = W/2 + laneOffset;
                ctx.fillStyle = '#ffd700';
                ctx.shadowColor = '#ffd700';
                ctx.shadowBlur = 10;
                const vw = 16 * scale; const vh = 50 * scale; const hw = 40 * scale; const hh = 12 * scale;
                const floatY = y - 30 * scale + Math.sin(performance.now() * 0.005) * 10 * scale;
                ctx.fillRect(cx - vw/2, floatY - vh, vw, vh);
                ctx.fillRect(cx - hw/2, floatY - vh*0.7, hw, hh);
                ctx.shadowBlur = 0;
            } else {
                drawEnemyCar(ctx, W/2 + laneOffset, y, scale, e.type);
            }
        });
        
        GameState.projectiles.forEach(p => {
            const scale = 500 / (p.z + 500);
            const y = zToY(p.z, H);
            const laneOffset = p.lane * 300 * scale;
            ctx.fillStyle = '#ffd700';
            const vw = 16 * scale; const vh = 50 * scale; const hw = 40 * scale; const hh = 12 * scale;
            ctx.fillRect(W/2 + laneOffset - vw/2, y - vh, vw, vh);
            ctx.fillRect(W/2 + laneOffset - hw/2, y - vh*0.7, hw, hh);
        });
        
        const carY = H * 0.72; 
        const maxLaneOffset = 135; 
        const cx = W/2 + (GameState.playerLane * maxLaneOffset);
        const drawW = 140;
        const drawH = (imgCar.height / imgCar.width) * drawW; 
        const rotationAngle = -GameState.playerLane * (10 * Math.PI / 180);
        
        ctx.save();
        ctx.fillStyle = 'rgba(0,0,0,0.5)';
        ctx.beginPath(); ctx.ellipse(cx, carY, drawW*0.4, drawH*0.1, 0, 0, Math.PI*2); ctx.fill();
        ctx.translate(cx, carY - drawH/2);
        ctx.rotate(rotationAngle);
        ctx.drawImage(imgCar, -drawW/2, -drawH/2, drawW, drawH);
        ctx.restore();
        
        const dashRatio = 0.24; 
        const dashY = H * (1 - dashRatio);
        ctx.save();
        ctx.drawImage(imgBg, 
            0, imgBg.height * (1 - dashRatio), imgBg.width, imgBg.height * dashRatio, 
            0, dashY, W, H - dashY 
        );
        ctx.restore();
        
        ctx.restore(); 
        
        if (GameState.keys.left) {
            const grd = ctx.createRadialGradient(W * 0.28, H * 0.94, 10, W * 0.28, H * 0.94, 50);
            grd.addColorStop(0, 'rgba(255, 255, 255, 0.4)');
            grd.addColorStop(1, 'rgba(255, 255, 255, 0)');
            ctx.fillStyle = grd;
            ctx.beginPath(); ctx.arc(W * 0.28, H * 0.94, 50, 0, Math.PI*2); ctx.fill();
        }
        if (GameState.keys.right) {
            const grd = ctx.createRadialGradient(W * 0.72, H * 0.94, 10, W * 0.72, H * 0.94, 50);
            grd.addColorStop(0, 'rgba(255, 255, 255, 0.4)');
            grd.addColorStop(1, 'rgba(255, 255, 255, 0)');
            ctx.fillStyle = grd;
            ctx.beginPath(); ctx.arc(W * 0.72, H * 0.94, 50, 0, Math.PI*2); ctx.fill();
        }

        GameState.explosions.forEach(exp => {
            let x, y, scale = 1;
            if (exp.isPlayer) {
                x = W/2 + exp.lane * 135;
                y = H * 0.65;
            } else {
                scale = 500 / (exp.z + 500);
                y = zToY(exp.z, H);
                x = W/2 + exp.lane * 300 * scale;
            }
            const size = 120 * scale * (1 + exp.time * 2);
            ctx.globalAlpha = Math.max(0, 1 - exp.time * 2);
            ctx.drawImage(imgExplosion, x - size/2, y - size/2, size, size);
            ctx.globalAlpha = 1.0;
        });

        const grd = ctx.createLinearGradient(0, 0, 0, 90);
        grd.addColorStop(0, "rgba(0,0,0,0.8)");
        grd.addColorStop(1, "rgba(0,0,0,0)");
        ctx.fillStyle = grd;
        ctx.fillRect(0, 0, W, 90);
        
        if (!GameState.hideFinger) {
            const fingerY = H - 275 + Math.sin(performance.now() * 0.01) * 15;
            const fingerX = W - 92;
            ctx.drawImage(imgDedo, fingerX, fingerY, 40, 40);
        }
        
        function drawText(text, x, y, color, align='left', size=12) {
            ctx.textAlign = align;
            ctx.font = `${size}px "Press Start 2P", monospace`;
            ctx.textBaseline = 'top';
            ctx.lineWidth = size > 16 ? 6 : 4;
            ctx.strokeStyle = '#000';
            ctx.strokeText(text, x, y);
            ctx.fillStyle = color;
            ctx.fillText(text, x, y);
        }
        
        drawText('VIDAS:', 20, 20, '#ffffff');
        drawText('DISTANCIA AL CEMENTERIO:', W - 20, 20, '#ffffff', 'right');
        
        let hx = 20;
        for(let i=0; i<3; i++) {
            if(i < GameState.lives) {
                ctx.fillStyle = '#ff6eb4';
                ctx.fillRect(hx+4, 45, 8, 4); ctx.fillRect(hx+16, 45, 8, 4);
                ctx.fillRect(hx, 49, 28, 12);
                ctx.fillRect(hx+4, 61, 20, 4); ctx.fillRect(hx+8, 65, 12, 4); ctx.fillRect(hx+12, 69, 4, 4);
            } else {
                ctx.fillStyle = 'rgba(51,51,51,0.5)';
                ctx.fillRect(hx, 49, 28, 12); ctx.fillRect(hx+12, 69, 4, 4);
            }
            hx += 40;
        }
        
        const dStr = (Math.max(0, GameState.distanceLeft) / 1000).toFixed(1);
        drawText(`${dStr} KM`, W - 20, 45, '#ff6eb4', 'right');
        
        const ammoX = 30;
        const ammoY = H - 145; 
        ctx.fillStyle = '#ffd700';
        ctx.shadowColor = '#000';
        ctx.shadowBlur = 4;
        ctx.fillRect(ammoX, ammoY, 10, 30); 
        ctx.fillRect(ammoX - 8, ammoY + 8, 26, 8); 
        ctx.shadowBlur = 0; 
        drawText(`x ${GameState.crosses}`, ammoX + 30, ammoY + 22, '#ffd700', 'left', 14);
        
        if(!GameState.isRunning && GameState.lives <= 0) {
            ctx.fillStyle = 'rgba(255, 0, 0, 0.4)';
            ctx.fillRect(0, 0, W, H);
        }
    }

    function render(time) {
        if(!lastTime) lastTime = time;
        const dt = (time - lastTime) / 1000;
        lastTime = time;
        
        if(GameState.isRunning) {
            update(dt);
            draw();
            requestAnimationFrame(render);
        } else if (GameState.lives <= 0) {
            draw(); // draw the red death screen one last time
        }
    }

    function move(dir) {
        if(!GameState.isRunning) return;
        let newLane = GameState.targetLane + dir;
        if(newLane >= -1 && newLane <= 1) {
            GameState.targetLane = newLane;
            AudioEngine.SFX.wind();
            // Removed click sound for moving so it doesn't mask the music or crashes
        }
    }
    function fire() {
        if(!GameState.isRunning || GameState.crosses <= 0) return;
        GameState.crosses--;
        GameState.hideFinger = true;
        AudioEngine.SFX.shoot();
        GameState.projectiles.push({
            lane: Math.round(GameState.playerLane),
            z: 500,
            active: true
        });
    }

    const keydownHandler = (e) => {
        if(e.key === 'ArrowLeft' || e.key === 'a') { move(-1); GameState.keys.left = true; }
        if(e.key === 'ArrowRight' || e.key === 'd') { move(1); GameState.keys.right = true; }
        if(e.key === ' ') { e.preventDefault(); fire(); GameState.hideFinger = true; }
    };

    const keyupHandler = (e) => {
        if(e.key === 'ArrowLeft' || e.key === 'a') GameState.keys.left = false;
        if(e.key === 'ArrowRight' || e.key === 'd') GameState.keys.right = false;
    };

    function start(callback) {
        onGameComplete = callback;
        
        // Reset state
        GameState.isRunning = false;
        GameState.playerLane = 0;
        GameState.targetLane = 0;
        GameState.lineOffset = 0;
        GameState.lives = 3;
        GameState.crosses = 5;
        GameState.crossesSpawned = 0;
        GameState.distanceLeft = 4800;
        GameState.entities = [];
        GameState.projectiles = [];
        GameState.shakeAmount = 0;
        GameState.explosions = [];
        GameState.hideFinger = false;
        GameState.keys = { left: false, right: false };

        overlay = document.createElement('div');
        overlay.style.position = 'fixed';
        overlay.style.top = '0'; overlay.style.left = '0';
        overlay.style.width = '100%'; overlay.style.height = '100%';
        overlay.style.backgroundColor = '#000';
        overlay.style.zIndex = '99999';
        overlay.style.display = 'flex';
        overlay.style.justifyContent = 'center';
        overlay.style.alignItems = 'center';
        
        const container = document.createElement('div');
        container.style.position = 'relative';
        container.style.width = '100%';
        container.style.maxWidth = '500px';
        container.style.height = '100%';
        container.style.maxHeight = '900px';
        
        canvas = document.createElement('canvas');
        canvas.width = 500;
        canvas.height = 900;
        canvas.style.width = '100%';
        canvas.style.height = '100%';
        canvas.style.imageRendering = 'pixelated';
        ctx = canvas.getContext('2d');
        
        const startScreen = document.createElement('div');
        startScreen.style.position = 'absolute';
        startScreen.style.top = '0'; startScreen.style.left = '0'; startScreen.style.right = '0'; startScreen.style.bottom = '0';
        startScreen.style.background = 'rgba(0,0,0,0.9)';
        startScreen.style.display = 'flex';
        startScreen.style.flexDirection = 'column';
        startScreen.style.justifyContent = 'center';
        startScreen.style.alignItems = 'center';
        startScreen.style.color = 'white';
        startScreen.style.fontFamily = '"Press Start 2P", monospace';
        
        const h2 = document.createElement('h2');
        h2.style.fontSize = '18px';
        h2.style.textAlign = 'center';
        h2.innerText = "CARGANDO ASSETS...";
        const btn = document.createElement('button');
        btn.innerText = "EMPEZAR CARRERA";
        btn.className = 'action-btn';
        btn.style.display = 'none';
        btn.style.width = 'fit-content';
        btn.style.margin = '20px auto 0';
        
        startScreen.appendChild(h2);
        startScreen.appendChild(btn);
        
        container.appendChild(canvas);
        container.appendChild(startScreen);
        overlay.appendChild(container);
        document.body.appendChild(overlay);
        
        let loaded = 0;
        const check = () => {
            loaded++;
            if(loaded >= 4) {
                h2.innerText = "MARTA'S BLUES RUN";
                btn.style.display = 'block';
            }
        };
        imgBg.onload = check;
        imgCar.onload = check;
        imgExplosion.onload = check;
        imgDedo.onload = check;
        imgBg.src = 'assets/mockup.jpg'; 
        imgCar.src = 'assets/coche.png';
        imgExplosion.src = 'assets/explosion.png';
        imgDedo.src = 'assets/dedo.png';
        
        btn.onclick = () => {
            startScreen.style.display = 'none';
            if (typeof Audio8Bit !== 'undefined') {
                Audio8Bit.suspend();
            }
            if (typeof Engine !== 'undefined') Engine.setSpeed(0); // Pause simulation
            AudioEngine.init();
            AudioEngine.startMusic();
            GameState.isRunning = true;
            lastTime = performance.now();
            requestAnimationFrame(render);
        };
        
        document.addEventListener('keydown', keydownHandler);
        document.addEventListener('keyup', keyupHandler);
        
        const handleTouchDown = (e) => {
            const rect = canvas.getBoundingClientRect();
            const clientX = e.touches ? e.touches[0].clientX : e.clientX;
            const clientY = e.touches ? e.touches[0].clientY : e.clientY;
            const x = (clientX - rect.left) * (canvas.width / rect.width);
            const y = (clientY - rect.top) * (canvas.height / rect.height);
            const W = canvas.width;
            const H = canvas.height;
            
            if (y > H * 0.88) {
                if (x < W / 2) { move(-1); GameState.keys.left = true; }
                else { move(1); GameState.keys.right = true; }
            } else if (y > H * 0.75 && x > W * 0.75) {
                fire(); 
            }
        };

        const handleTouchUp = () => {
            GameState.keys.left = false;
            GameState.keys.right = false;
        };

        canvas.addEventListener('mousedown', handleTouchDown);
        canvas.addEventListener('mouseup', handleTouchUp);
        canvas.addEventListener('mouseleave', handleTouchUp);
        canvas.addEventListener('touchstart', (e) => { e.preventDefault(); handleTouchDown(e); }, {passive: false});
        canvas.addEventListener('touchend', (e) => { e.preventDefault(); handleTouchUp(); }, {passive: false});
    }

    return {
        start: start
    };
})();
