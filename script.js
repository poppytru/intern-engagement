// ===== Challenge unlock / close logic =====
function updateChallenges() {
    const now = new Date();
    document.querySelectorAll('.challenge-card').forEach(card => {
        const unlock = new Date(card.dataset.unlock);
        const close  = new Date(card.dataset.close);
        const link   = card.dataset.link || null;
        const link2  = card.dataset.link2 || null;
        const isCrossword = card.dataset.crossword === 'true';
        const isHackathon = card.dataset.hackathon === 'true';
        const lockIcon  = card.querySelector('.lock-icon');
        const statusTxt = card.querySelector('.status-text');
        const btn       = card.querySelector('.challenge-btn');

        // Remove any previously injected extra link
        const existingExtra = card.querySelector('.extra-link');
        if (existingExtra) existingExtra.remove();

        if (now < unlock) {
            // Locked
            card.classList.remove('open', 'closed-challenge');
            lockIcon.textContent = '🔒';
            statusTxt.textContent = 'Locked';
            btn.textContent = 'Coming soon';
            btn.className = 'challenge-btn disabled';
            btn.removeAttribute('href');
            btn.setAttribute('aria-disabled', 'true');
            btn.onclick = null;
        } else if (now >= unlock && now < close) {
            // Open
            card.classList.add('open');
            card.classList.remove('closed-challenge');
            lockIcon.textContent = '🎮';
            statusTxt.textContent = 'Open now';

            if (isCrossword) {
                btn.textContent = 'Play crossword';
                btn.className = 'challenge-btn active';
                btn.href = 'crossword.html';
                btn.removeAttribute('aria-disabled');
                btn.onclick = null;
            } else if (isHackathon && link) {
                btn.textContent = 'Go to Hackathon';
                btn.className = 'challenge-btn active';
                btn.href = link;
                btn.target = '_blank';
                btn.rel = 'noopener';
                btn.removeAttribute('aria-disabled');
                btn.onclick = null;
                // Add optional permission link
                if (link2) {
                    const extra = document.createElement('a');
                    extra.href = link2;
                    extra.target = '_blank';
                    extra.rel = 'noopener';
                    extra.className = 'challenge-btn active extra-link';
                    extra.textContent = 'Grant AUTA permission';
                    extra.style.marginTop = '8px';
                    extra.style.background = '#232F3E';
                    extra.style.fontSize = '14px';
                    btn.after(extra);
                }
            } else if (link) {
                btn.textContent = 'Start challenge';
                btn.className = 'challenge-btn active';
                btn.href = link;
                btn.target = '_blank';
                btn.rel = 'noopener';
                btn.removeAttribute('aria-disabled');
                btn.onclick = null;
            } else {
                btn.textContent = 'Link coming soon';
                btn.className = 'challenge-btn disabled';
                btn.setAttribute('aria-disabled', 'true');
                btn.onclick = null;
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
            btn.onclick = null;
        }
    });
}

// ===== Init =====
document.addEventListener('DOMContentLoaded', () => {
    updateChallenges();
    setInterval(updateChallenges, 300000);
});
