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
        const abortBtn = document.getElementById('btn-cafe-game-abort');
        if (abortBtn) {
            abortBtn.onclick = () => {
                document.getElementById('cafe-game-overlay').style.display = 'none';
                // Abort doesn't trigger success
                onCompleteCallback = null;
                activeGame = 'done';
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
        const tutorial = document.getElementById('cafe-game-tutorial');

        overlay.style.display = 'flex';
        closeBtn.style.display = 'none';
        document.getElementById('cafe-abort-container').style.display = 'flex';
        feedback.textContent = '';
        controls.innerHTML = '';
        container.innerHTML = '';
        tutorial.textContent = '';
        
        const state = Engine.getState();
        const isSpanish = (typeof Main !== 'undefined' && Main.getLang && Main.getLang() === 'es') || (document.documentElement.lang === 'es');

        let itemName = item.type === 'alcohol' ? 'ALCOHOL' : item.item.item.toUpperCase();
        if (item.item && item.item.item === 'Coffee') itemName = I18n.T('cafe.coffee');
        else if (item.item && item.item.item === 'Tea') itemName = I18n.T('cafe.tea');
        else if (item.item && item.item.item === 'Sandwich') itemName = I18n.T('cafe.sandwich');
        else if (item.item && item.item.item === 'Soul Cake') itemName = I18n.T('cafe.soul_cake');
        
        title.textContent = I18n.T('cafe.preparing').replace('{0}', itemName);

        state.cafeTutorials = state.cafeTutorials || {};

        let gameType = '';
        const itemKey = (item.item && item.item.item) ? item.item.item.toLowerCase() : '';
        const isCoffee = itemKey.includes('coffee') || itemKey.includes('café');
        const isTea = itemKey.includes('tea') || itemKey.includes('té');
        const isSandwich = itemKey.includes('sandwich') || itemKey.includes('sándwich');
        const isCake = itemKey.includes('cake') || itemKey.includes('pastel');

        if (item.type === 'alcohol' || isCoffee) gameType = 'pour';
        else if (isTea) gameType = 'steep';
        else if (isSandwich) gameType = 'assemble';
        else if (isCake) gameType = 'decorate';

        if (gameType === '') {
            console.error("Unknown game type for item:", item);
            overlay.style.display = 'none';
            if (callback) callback(1); // Auto-success if broken
            return;
        }

        if (!state.cafeTutorials[gameType]) {
            tutorial.textContent = I18n.T(`cafe.tut_${gameType}`);
            state.cafeTutorials[gameType] = true;
        }

        if (gameType === 'pour') startPourGame(item);
        else if (gameType === 'steep') startSteepGame(item);
        else if (gameType === 'assemble') startAssemblyGame(item);
        else if (gameType === 'decorate') startGridGame(item);
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
        btn.textContent = I18n.T('cafe.pour');
        controls.appendChild(btn);

        let filling = false;
        let level = 0;

        // Dynamic target range based on level
        const s = Engine.getState();
        const pLevel = s.level || 1;
        const baseWidth = 18;
        const reduction = Math.min(12, (pLevel - 1) * 0.6); // Range gets smaller
        const currentWidth = baseWidth - reduction;
        
        const targetMid = 79;
        const targetMin = targetMid - (currentWidth / 2);
        const targetMax = targetMid + (currentWidth / 2);

        // Apply to visual target
        const targetEl = container.querySelector('.pour-target');
        if (targetEl) {
            targetEl.style.height = currentWidth + '%';
            targetEl.style.bottom = targetMin + '%';
        }

        const stopPour = (status) => {
            filling = false;
            clearInterval(gameLoop);
            if (activeGame) return;
            activeGame = 'done';
            
            let result = '';
            let quality = 0;
            
            if (status === 'spilled') {
                result = I18n.T('cafe.fb_spilled');
                quality = -1;
            } else {
                if (level >= targetMin && level <= targetMax) {
                    result = I18n.T('cafe.fb_perfect');
                    quality = 2;
                    Audio8Bit.SFX.success();
                } else if (level > targetMin - 30) {
                    result = I18n.T('cafe.fb_good');
                    quality = 1;
                } else {
                    result = I18n.T('cafe.fb_little');
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
            if (filling) {
                btn.style.display = 'none';
                document.getElementById('cafe-abort-container').style.display = 'none';
                stopPour();
            }
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
        btn.style.width = '160px';
        btn.textContent = I18n.T('cafe.steep');
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
                feedback.textContent = I18n.T('cafe.fb_steeps').replace('{0}', hits);
                if (hits >= 3) {
                    gameRunning = false;
                    feedback.textContent = I18n.T('cafe.fb_perfect_brew');
                    finishGame(2);
                }
            } else {
                feedback.textContent = I18n.T('cafe.fb_missed');
                Audio8Bit.SFX.click();
            }
        };
    }

    // --- ASSEMBLY GAME (Sandwich) ---
    function startAssemblyGame(item) {
        const container = document.getElementById('cafe-game-container');
        const controls = document.getElementById('cafe-game-controls');
        const feedback = document.getElementById('cafe-game-feedback');

        // Recipe: Bread, Tomato, Cheese, Pickle, Bread
        const recipe = ['bread', 'tomato', 'cheese', 'pickle', 'bread'];
        let currentStep = 0;

        container.innerHTML = `
            <div class="recipe-display">
                ${recipe.map((r, i) => `<div class="recipe-step" id="step-${i}">${Icons.getHTML(r === 'bread' ? 'sandwich' : r)}</div>`).join('')}
            </div>
        `;
        Icons.initDOM();

        const ingredients = [
            { id: 'bread', icon: 'sandwich' },
            { id: 'tomato', icon: 'tomato' },
            { id: 'cheese', icon: 'cheese' },
            { id: 'pickle', icon: 'pickle' }
        ];

        controls.innerHTML = `<div class="ingredient-buttons" style="display:flex; gap:8px; justify-content:center;"></div>`;
        const btnContainer = controls.querySelector('.ingredient-buttons');

        function renderButtons() {
            btnContainer.innerHTML = '';
            // Robust shuffle
            const shuffled = [...ingredients];
            for (let i = shuffled.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
            }
            shuffled.forEach(ing => {
                const btn = document.createElement('button');
                btn.className = 'ing-btn action-btn';
                btn.style.width = '48px';
                btn.style.height = '48px';
                btn.style.padding = '4px';
                btn.innerHTML = Icons.getHTML(ing.icon);
                btn.onclick = () => {
                    if (recipe[currentStep] === ing.id) {
                        document.getElementById(`step-${currentStep}`).classList.add('done');
                        currentStep++;
                        Audio8Bit.SFX.success();
                        if (currentStep >= recipe.length) {
                            feedback.textContent = I18n.T('cafe.fb_delicious');
                            finishGame(3);
                        } else {
                            renderButtons(); // Shuffle on every correct click
                        }
                    } else {
                        feedback.textContent = I18n.T('cafe.fb_wrong');
                        Audio8Bit.SFX.click();
                        renderButtons(); // Shuffle on mistake
                    }
                };
                btnContainer.appendChild(btn);
            });
            Icons.initDOM();
        }

        renderButtons();
        document.getElementById('step-0').classList.add('active');
    }

    // --- GRID GAME (Soul Cake) ---
    function startGridGame(item) {
        const container = document.getElementById('cafe-game-container');
        const feedback = document.getElementById('cafe-game-feedback');

        const gridIcons = ['sandwich', 'tomato', 'pickle', 'knife', 'ketchup', 'sandwich', 'tomato', 'pickle', 'knife'];

        container.innerHTML = `
            <div class="soul-grid">
                ${gridIcons.map((icon, i) => `<div class="soul-cell" id="cell-${i}">${Icons.getHTML(icon)}</div>`).join('')}
            </div>
        `;
        Icons.initDOM();

        const sequence = [];
        for(let i=0; i<4; i++) sequence.push(Math.floor(Math.random() * 9));

        let userIndex = 0;
        let isShowingSequence = true;

        async function playSequence() {
            feedback.textContent = I18n.T('cafe.watch') || 'WATCH...';
            isShowingSequence = true;
            for (let id of sequence) {
                const cell = document.getElementById(`cell-${id}`);
                if (!cell) return;
                cell.classList.add('flash');
                Audio8Bit.SFX.typing();
                await new Promise(r => setTimeout(r, 600));
                cell.classList.remove('flash');
                await new Promise(r => setTimeout(r, 200));
            }
            isShowingSequence = false;
            feedback.textContent = I18n.T('cafe.your_turn') || 'YOUR TURN!';
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
                        feedback.textContent = I18n.T('cafe.fb_beautiful');
                        finishGame(2);
                    }
                } else {
                    feedback.textContent = I18n.T('cafe.fb_ouija');
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
        document.getElementById('cafe-abort-container').style.display = 'none';
        document.getElementById('btn-cafe-game-close').style.display = 'inline-block';
        const currentCallback = onCompleteCallback;
        onCompleteCallback = () => {
            if (currentCallback) currentCallback(quality);
        };
    }

    return { init, start };
})();
