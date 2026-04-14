// ===== Challenge unlock / close logic =====
function updateChallenges() {
    const now = new Date();
    document.querySelectorAll('.challenge-card').forEach(card => {
        const unlock = new Date(card.dataset.unlock);
        const close  = new Date(card.dataset.close);
        const link   = card.dataset.link || null;
        const isCrossword = card.dataset.crossword === 'true';
        const lockIcon  = card.querySelector('.lock-icon');
        const statusTxt = card.querySelector('.status-text');
        const btn       = card.querySelector('.challenge-btn');

        if (now < unlock) {
            // Still locked
            card.classList.remove('open', 'closed-challenge');
            lockIcon.textContent = '🔒';
            statusTxt.textContent = 'Locked';
            btn.textContent = 'Coming soon';
            btn.className = 'challenge-btn disabled';
            btn.removeAttribute('href');
            btn.setAttribute('aria-disabled', 'true');
        } else if (now >= unlock && now < close) {
            // Open
            card.classList.add('open');
            card.classList.remove('closed-challenge');
            lockIcon.textContent = '🎮';
            statusTxt.textContent = 'Open now';

            if (isCrossword) {
                btn.textContent = 'Play crossword';
                btn.className = 'challenge-btn active';
                btn.removeAttribute('href');
                btn.removeAttribute('aria-disabled');
                btn.style.cursor = 'pointer';
                btn.onclick = () => openCrosswordModal(link);
            } else if (link) {
                btn.textContent = 'Start challenge';
                btn.className = 'challenge-btn active';
                btn.href = link;
                btn.target = '_blank';
                btn.rel = 'noopener';
                btn.removeAttribute('aria-disabled');
            } else {
                // Monday — no link yet
                btn.textContent = 'Link coming soon';
                btn.className = 'challenge-btn disabled';
                btn.setAttribute('aria-disabled', 'true');
            }
        } else {
            // Closed
            card.classList.remove('open');
            card.classList.add('closed-challenge');
            lockIcon.textContent = '⏰';
            statusTxt.textContent = 'Closed';
            btn.textContent = 'Challenge ended';
            btn.className = 'challenge-btn closed-btn';
            btn.removeAttribute('href');
            btn.setAttribute('aria-disabled', 'true');
        }
    });
}

// ===== Crossword =====
const crosswordData = {
    size: { rows: 13, cols: 13 },
    // Grid: '.' = white cell, '#' = black cell
    grid: [
        '.', '.', '.', '#', '#', '#', '#', '#', '#', '#', '#', '#', '#',
        '#', '#', '.', '#', '#', '.', '#', '#', '#', '#', '#', '#', '#',
        '#', '#', '.', '#', '.', '.', '.', '#', '#', '#', '#', '#', '#',
        '#', '#', '.', '#', '.', '#', '.', '#', '#', '#', '#', '#', '#',
        '.', '.', '.', '.', '.', '.', '.', '.', '.', '#', '#', '#', '#',
        '#', '#', '.', '#', '.', '#', '#', '#', '#', '#', '#', '#', '#',
        '#', '#', '.', '#', '.', '#', '#', '#', '.', '#', '.', '.', '#',
        '#', '#', '#', '#', '.', '#', '.', '#', '.', '#', '#', '#', '#',
        '#', '#', '#', '.', '.', '.', '.', '.', '.', '.', '#', '#', '#',
        '#', '#', '#', '#', '#', '#', '#', '#', '.', '#', '#', '#', '#',
        '#', '.', '#', '#', '#', '#', '#', '#', '.', '#', '#', '#', '#',
        '#', '.', '.', '.', '.', '.', '.', '#', '.', '#', '#', '#', '#',
        '#', '#', '#', '#', '#', '#', '#', '#', '.', '#', '#', '#', '#',
    ],
    numbers: {
        0: 1, 1: 2, 2: 3,
        5: 5,
        16: 6, 17: 7, 18: 8, 19: 9,
        30: 10,
        52: 4,
        58: 11, 60: 12,
        70: 14,
        81: 13,
        88: 15,
        92: 16,
        105: 17,
        114: 18,
    ],
    clues: {
        across: [
            { num: 1, text: '"Success and Scale Bring Broad ____"' },
            { num: 4, text: 'Intern ____ Partner. Main POC to facilitate week 1 onboarding plan for field interns' },
            { num: 6, text: '"Are ____, A Lot"' },
            { num: 7, text: 'Challenge decisions and advocate clearly.' },
            { num: 11, text: 'Employee-Led Groups' },
            { num: 15, text: 'Original name of Amazon' },
            { num: 16, text: "One of Amazon's Subsidiaries" },
            { num: 17, text: 'Discontinued 3D smartphone developed by Amazon' },
            { num: 18, text: 'AUTA Crossword — Powered by PuzzleMe™' },
        ],
        down: [
            { num: 2, text: '"Insist of the Highest ____"' },
            { num: 3, text: 'Takes the lead, accepts responsibility, and makes decisions' },
            { num: 5, text: "One of Amazon's AI Workspaces" },
            { num: 8, text: 'Voluntary overtime' },
            { num: 9, text: 'Amazon started out as an online ____' },
            { num: 10, text: '"I\'ll ____ back once I know more"' },
            { num: 12, text: 'Page for all events' },
            { num: 13, text: 'Relocation Vendor' },
            { num: 14, text: 'Shared understanding' },
        ]
    }
};

function openCrosswordModal(submitLink) {
    const modal = document.getElementById('crosswordModal');
    modal.hidden = false;
    document.body.style.overflow = 'hidden';

    const submitBtn = document.getElementById('crosswordSubmitLink');
    submitBtn.href = submitLink || '#';

    renderCrossword();
}

function closeCrosswordModal() {
    const modal = document.getElementById('crosswordModal');
    modal.hidden = true;
    document.body.style.overflow = '';
}

function renderCrossword() {
    const container = document.getElementById('crosswordContainer');
    const cluesDiv  = document.getElementById('crosswordClues');
    const { size, grid, numbers, clues } = crosswordData;

    // Build grid
    let html = `<div class="crossword-wrapper">`;
    html += `<div class="crossword-grid" style="grid-template-columns: repeat(${size.cols}, 36px);">`;
    for (let i = 0; i < grid.length; i++) {
        const isBlack = grid[i] === '#';
        const num = numbers[i];
        if (isBlack) {
            html += `<div class="cell black"></div>`;
        } else {
            html += `<div class="cell">`;
            if (num !== undefined) html += `<span class="cell-number">${num}</span>`;
            html += `<input type="text" maxlength="1" aria-label="Cell ${i}">`;
            html += `</div>`;
        }
    }
    html += `</div>`;

    // Build clues
    html += `<div class="clues-panel">`;
    html += `<h4>Across</h4><ol>`;
    clues.across.forEach(c => { html += `<li value="${c.num}">${c.text}</li>`; });
    html += `</ol><h4>Down</h4><ol>`;
    clues.down.forEach(c => { html += `<li value="${c.num}">${c.text}</li>`; });
    html += `</ol></div></div>`;

    container.innerHTML = html;

    // Auto-advance on input
    const inputs = container.querySelectorAll('input');
    inputs.forEach((inp, idx) => {
        inp.addEventListener('input', () => {
            if (inp.value && idx < inputs.length - 1) inputs[idx + 1].focus();
        });
    });
}

// Modal close handlers
document.querySelector('.modal-close')?.addEventListener('click', closeCrosswordModal);
document.getElementById('crosswordModal')?.addEventListener('click', e => {
    if (e.target === e.currentTarget) closeCrosswordModal();
});
document.addEventListener('keydown', e => {
    if (e.key === 'Escape') closeCrosswordModal();
});

// ===== Init =====
document.addEventListener('DOMContentLoaded', () => {
    updateChallenges();
    // Re-check every 5 minutes
    setInterval(updateChallenges, 300000);
});
