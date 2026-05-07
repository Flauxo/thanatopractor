/* ===== THANATOPRACTOR - Cafeteria Mini-Games ===== */
const CafeGames = (() => {
    let activeGame = null;
    let onCompleteCallback = null;
    let gameLoop = null;

    function init() {
        const closeBtn = document.getElementById('btn-cafe-game-close');
        if (closeBtn) {
            closeBtn.className = 'action-btn pink-btn';
            closeBtn.style.width = '200px';
            closeBtn.onclick = () => {
                document.getElementById('cafe-game-overlay').style.display = 'none';
                if (onCompleteCallback) onCompleteCallback();
                onCompleteCallback = null;
            };
        }
    }

    function start(item, callback) {
        onCompleteCallback = callback;
        activeGame = null;
        const overlay = document.getElementById('cafe-game-overlay');
        const title = document.getElementById('cafe-game-title');
        const container = document.getElementById('cafe-game-container');
        const controls = document.getElementById('cafe-game-controls');
        const feedback = document.getElementById('cafe-game-feedback');
        const closeBtn = document.getElementById('btn-cafe-game-close');

        overlay.style.display = 'flex';
        closeBtn.style.display = 'none';
        feedback.textContent = '';
        controls.innerHTML = '';
        container.innerHTML = '';
        
        const itemName = item.type === 'alcohol' ? 'ALCOHOL' : item.item.item.toUpperCase();
        title.textContent = `PREPARING ${itemName}`;

        if (item.type === 'alcohol' || item.item.item === 'Coffee') {
            startPourGame(item);
        } else if (item.item.item === 'Tea') {
            startSteepGame(item);
        } else if (item.item.item === 'Sandwich') {
            startAssemblyGame(item);
        } else if (item.item.item === 'Soul Cake') {
            startGridGame(item);
        }
    }

    // --- POURING GAME (Coffee/Alcohol) ---
    function startPourGame(item) {
        const container = document.getElementById('cafe-game-container');
        const controls = document.getElementById('cafe-game-controls');
        const feedback = document.getElementById('cafe-game-feedback');
        
        container.innerHTML = `
            <div class="pour-wrapper">
                <div class="pour-meter">
                    <div class="pour-target"></div>
                    <div class="pour-fill" id="pour-fill"></div>
                </div>
            </div>
        `;
        
        const btn = document.createElement('button');
        btn.className = 'action-btn pink-btn';
        btn.style.width = '140px';
        btn.textContent = 'POUR';
        controls.appendChild(btn);

        let filling = false;
        let level = 0;

        const stopPour = (status) => {
            filling = false;
            clearInterval(gameLoop);
            if (activeGame) return;
            activeGame = 'done';
            
            let result = '';
            let quality = 0;
            
            if (status === 'spilled') {
                result = 'SPILLED! A mess...';
                quality = -1;
            } else {
                if (level >= 70 && level <= 88) {
                    result = 'PERFECT POUR!';
                    quality = 2;
                    Audio8Bit.SFX.success();
                } else if (level > 40) {
                    result = 'GOOD ENOUGH.';
                    quality = 1;
                } else {
                    result = 'TOO LITTLE...';
                    quality = 0;
                }
            }
            
            feedback.textContent = result;
            finishGame(quality);
        };

        btn.onmousedown = btn.ontouchstart = () => {
            if (activeGame) return;
            filling = true;
            gameLoop = setInterval(() => {
                if (filling) {
                    level += 0.8;
                    document.getElementById('pour-fill').style.height = level + '%';
                    if (level >= 100) stopPour('spilled');
                }
            }, 20);
        };

        btn.onmouseup = btn.ontouchend = () => {
            if (filling) stopPour();
        };
    }

    // --- STEEPING GAME (Tea) ---
    function startSteepGame(item) {
        const container = document.getElementById('cafe-game-container');
        const controls = document.getElementById('cafe-game-controls');
        const feedback = document.getElementById('cafe-game-feedback');

        container.innerHTML = `
            <div class="steep-ui">
                <div class="tea-cup"></div>
                <div class="steep-zone"></div>
                <div class="tea-bag-sprite" id="tea-bag"></div>
            </div>
        `;

        const btn = document.createElement('button');
        btn.className = 'action-btn pink-btn';
        btn.style.width = '140px';
        btn.textContent = 'STEEP!';
        controls.appendChild(btn);

        let hits = 0;
        let pos = 0;
        let speed = 2.5;
        let dir = 1;
        let gameRunning = true;

        function animate() {
            if (!gameRunning) return;
            pos += speed * dir;
            if (pos > 140 || pos < 0) dir *= -1;
            const el = document.getElementById('tea-bag');
            if (el) el.style.top = pos + 'px';
            requestAnimationFrame(animate);
        }
        animate();

        btn.onclick = () => {
            if (!gameRunning) return;
            if (pos > 100) {
                hits++;
                Audio8Bit.SFX.success();
                feedback.textContent = `STEEPS: ${hits} / 3`;
                if (hits >= 3) {
                    gameRunning = false;
                    feedback.textContent = 'PERFECT BREW!';
                    finishGame(2);
                }
            } else {
                feedback.textContent = 'MISSED!';
                Audio8Bit.SFX.click();
            }
        };
    }

    // --- ASSEMBLY GAME (Sandwich) ---
    function startAssemblyGame(item) {
        const container = document.getElementById('cafe-game-container');
        const controls = document.getElementById('cafe-game-controls');
        const feedback = document.getElementById('cafe-game-feedback');

        const recipe = ['bread', 'ham', 'cheese', 'lettuce', 'bread'];
        let currentStep = 0;

        container.innerHTML = `
            <div class="recipe-display">
                ${recipe.map((r, i) => `<div class="recipe-step" id="step-${i}">${Icons.getHTML(r === 'bread' ? 'sandwich' : r === 'ham' ? 'skull' : r === 'cheese' ? 'money' : 'flowers')}</div>`).join('')}
            </div>
        `;
        Icons.initDOM();

        const ingredients = [
            { id: 'bread', icon: 'sandwich' },
            { id: 'ham', icon: 'skull' },
            { id: 'cheese', icon: 'money' },
            { id: 'lettuce', icon: 'flowers' }
        ];

        controls.innerHTML = `<div class="ingredient-buttons"></div>`;
        const btnContainer = controls.querySelector('.ingredient-buttons');

        ingredients.forEach(ing => {
            const btn = document.createElement('button');
            btn.className = 'ing-btn action-btn';
            btn.style.width = '64px';
            btn.style.height = '64px';
            btn.style.padding = '5px';
            btn.innerHTML = Icons.getHTML(ing.icon);
            btn.onclick = () => {
                if (activeGame) return;
                if (recipe[currentStep] === ing.id) {
                    document.getElementById(`step-${currentStep}`).classList.add('done');
                    currentStep++;
                    Audio8Bit.SFX.click();
                    if (currentStep < recipe.length) {
                        document.querySelectorAll('.recipe-step').forEach(el => el.classList.remove('active'));
                        document.getElementById(`step-${currentStep}`).classList.add('active');
                    } else {
                        feedback.textContent = 'DELICIOUS!';
                        finishGame(2);
                    }
                } else {
                    feedback.textContent = 'WRONG ORDER!';
                    Audio8Bit.SFX.click();
                    currentStep = 0;
                    document.querySelectorAll('.recipe-step').forEach(el => {
                        el.classList.remove('done');
                        el.classList.remove('active');
                    });
                    document.getElementById('step-0').classList.add('active');
                }
            };
            btnContainer.appendChild(btn);
        });
        Icons.initDOM();

        document.getElementById('step-0').classList.add('active');
    }

    // --- GRID GAME (Soul Cake) ---
    function startGridGame(item) {
        const container = document.getElementById('cafe-game-container');
        const feedback = document.getElementById('cafe-game-feedback');

        container.innerHTML = `
            <div class="soul-grid">
                ${Array(9).fill(0).map((_, i) => `<div class="soul-cell" id="cell-${i}"></div>`).join('')}
            </div>
        `;

        const sequence = [];
        for(let i=0; i<4; i++) sequence.push(Math.floor(Math.random() * 9));

        let userIndex = 0;
        let isShowingSequence = true;

        async function playSequence() {
            feedback.textContent = 'WATCH...';
            for (let id of sequence) {
                const cell = document.getElementById(`cell-${id}`);
                if (!cell) return;
                cell.classList.add('flash');
                Audio8Bit.SFX.typing();
                await new Promise(r => setTimeout(r, 500));
                cell.classList.remove('flash');
                await new Promise(r => setTimeout(r, 200));
            }
            isShowingSequence = false;
            feedback.textContent = 'YOUR TURN!';
        }

        playSequence();

        document.querySelectorAll('.soul-cell').forEach((cell, i) => {
            cell.onclick = () => {
                if (isShowingSequence || activeGame) return;
                if (sequence[userIndex] === i) {
                    cell.classList.add('flash');
                    setTimeout(() => cell.classList.remove('flash'), 200);
                    Audio8Bit.SFX.click();
                    userIndex++;
                    if (userIndex === sequence.length) {
                        feedback.textContent = 'BEAUTIFUL!';
                        finishGame(2);
                    }
                } else {
                    feedback.textContent = 'OUIJA SAYS NO!';
                    cell.classList.add('wrong');
                    setTimeout(() => cell.classList.remove('wrong'), 400);
                    Audio8Bit.SFX.click();
                    userIndex = 0;
                }
            };
        });
    }

    function finishGame(quality) {
        activeGame = 'done';
        document.getElementById('btn-cafe-game-close').style.display = 'inline-block';
        const currentCallback = onCompleteCallback;
        onCompleteCallback = () => {
            if (currentCallback) currentCallback(quality);
        };
    }

    return { init, start };
})();
