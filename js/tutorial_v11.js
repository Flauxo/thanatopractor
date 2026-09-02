/* ===== THANATOPRACTOR - Tutorial System ===== */
const Tutorial = (() => {
    let overlayEl = null;
    let highlightBox = null;
    let tooltipBox = null;
    let currentStep = 0;
    let isRunning = false;
    let currentSequence = null;
    let onCompleteCallback = null;

    const initialSequence = [
        {
            target: '#hud-time-container',
            titleKey: 'tut.step1_title',
            bodyKey: 'tut.step1_body',
            btnKey: 'tut.next'
        },
        {
            target: '#hub-schedule',
            titleKey: 'tut.step2_title',
            bodyKey: 'tut.step2_body',
            btnKey: 'tut.next'
        },
        {
            target: '#hud-rep-container',
            titleKey: 'tut.step3_title',
            bodyKey: 'tut.step3_body',
            btnKey: 'tut.next'
        },
        {
            target: '#hud-money-container',
            titleKey: 'tut.step4_title',
            bodyKey: 'tut.step4_body',
            btnKey: 'tut.got_it'
        }
    ];

    const interviewSequence = [
        {
            target: '#dlg-speaker',
            titleKey: 'tut.interview_title',
            bodyKey: 'tut.interview_body',
            btnKey: 'tut.got_it'
        }
    ];

    function createOverlay() {
        if (overlayEl) return;

        overlayEl = document.createElement('div');
        overlayEl.id = 'tutorial-overlay';
        overlayEl.className = 'tutorial-overlay';
        overlayEl.style.display = 'none';

        highlightBox = document.createElement('div');
        highlightBox.className = 'tutorial-highlight-box';

        tooltipBox = document.createElement('div');
        tooltipBox.className = 'tutorial-tooltip';
        tooltipBox.innerHTML = `
            <div class="tut-header" id="tut-title"></div>
            <div class="tut-body" id="tut-body"></div>
            <div class="tut-footer">
                <button id="btn-tut-next" class="pixel-btn pink-btn"></button>
            </div>
        `;

        overlayEl.appendChild(highlightBox);
        overlayEl.appendChild(tooltipBox);
        document.body.appendChild(overlayEl);

        document.getElementById('btn-tut-next').onclick = () => {
            if (typeof Audio8Bit !== 'undefined' && Audio8Bit.SFX) Audio8Bit.SFX.click();
            nextStep();
        };

        window.addEventListener('resize', () => {
            if (isRunning && currentSequence && currentSequence[currentStep]) {
                positionHighlightAndTooltip(currentSequence[currentStep]);
            }
        });
    }

    function positionHighlightAndTooltip(stepData) {
        if (!overlayEl || !highlightBox || !tooltipBox) return;

        const targetEl = document.querySelector(stepData.target);
        if (!targetEl) {
            console.warn('[Tutorial] Target element not found:', stepData.target);
            highlightBox.style.display = 'none';
            tooltipBox.style.top = '50%';
            tooltipBox.style.left = '50%';
            tooltipBox.style.transform = 'translate(-50%, -50%)';
            return;
        }

        const rect = targetEl.getBoundingClientRect();
        const padding = 6;

        // Highlight box position
        highlightBox.style.display = 'block';
        highlightBox.style.top = `${Math.max(0, rect.top - padding)}px`;
        highlightBox.style.left = `${Math.max(0, rect.left - padding)}px`;
        highlightBox.style.width = `${rect.width + padding * 2}px`;
        highlightBox.style.height = `${rect.height + padding * 2}px`;

        // Tooltip box position
        tooltipBox.style.transform = 'none';
        const winW = window.innerWidth;
        const winH = window.innerHeight;
        const ttW = Math.min(320, winW - 32);
        tooltipBox.style.width = `${ttW}px`;

        // Measure tooltip height
        const ttH = tooltipBox.offsetHeight || 160;

        let left = (rect.left + rect.width / 2) - (ttW / 2);
        left = Math.max(16, Math.min(winW - ttW - 16, left));

        let top = rect.bottom + 12;
        if (top + ttH > winH - 16) {
            top = Math.max(16, rect.top - ttH - 12);
        }

        tooltipBox.style.top = `${top}px`;
        tooltipBox.style.left = `${left}px`;
    }

    function showStep() {
        if (!currentSequence || currentStep >= currentSequence.length) {
            finishTutorial();
            return;
        }

        const step = currentSequence[currentStep];
        document.getElementById('tut-title').textContent = I18n.T(step.titleKey);
        document.getElementById('tut-body').textContent = I18n.T(step.bodyKey);
        document.getElementById('btn-tut-next').textContent = I18n.T(step.btnKey);

        // Force browser layout update to get correct dimensions
        setTimeout(() => {
            positionHighlightAndTooltip(step);
        }, 30);
    }

    function nextStep() {
        currentStep++;
        if (currentStep < currentSequence.length) {
            showStep();
        } else {
            finishTutorial();
        }
    }

    function startInitialTutorial(onComplete) {
        const state = typeof Engine !== 'undefined' ? Engine.getState() : null;
        if (!state || state.initialTutorialDone) {
            if (onComplete) onComplete();
            return;
        }

        createOverlay();
        isRunning = true;
        currentSequence = initialSequence;
        currentStep = 0;
        onCompleteCallback = onComplete;

        overlayEl.style.display = 'block';
        Engine.setSpeed(0); // Pause game clock during tutorial
        showStep();
    }

    function startInterviewTutorial(onComplete) {
        const state = typeof Engine !== 'undefined' ? Engine.getState() : null;
        if (!state || state.interviewTutorialDone) {
            if (onComplete) onComplete();
            return;
        }

        createOverlay();
        isRunning = true;
        currentSequence = interviewSequence;
        currentStep = 0;
        onCompleteCallback = onComplete;

        overlayEl.style.display = 'block';
        showStep();
    }

    function finishTutorial() {
        const wasRunning = isRunning;
        isRunning = false;
        if (overlayEl) overlayEl.style.display = 'none';

        const state = typeof Engine !== 'undefined' ? Engine.getState() : null;
        if (state) {
            if (currentSequence === initialSequence) {
                state.initialTutorialDone = true;
                Engine.save();
                Engine.restoreSpeed();
            } else if (currentSequence === interviewSequence) {
                state.interviewTutorialDone = true;
                Engine.save();
            }
        }

        const cb = onCompleteCallback;
        onCompleteCallback = null;
        currentSequence = null;
        if (cb) cb();
    }

    return {
        startInitialTutorial,
        startInterviewTutorial,
        get isRunning() { return isRunning; }
    };
})();
