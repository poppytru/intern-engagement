// Check and unlock engagement cards based on current date
function checkUnlockDates() {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const engagementCards = document.querySelectorAll('.engagement-card');
    
    engagementCards.forEach(card => {
        const unlockDateStr = card.getAttribute('data-unlock-date');
        const unlockDate = new Date(unlockDateStr);
        unlockDate.setHours(0, 0, 0, 0);
        
        if (today >= unlockDate) {
            card.classList.remove('locked');
            card.classList.add('unlocked');
            
            const lockIcon = card.querySelector('.lock-icon');
            lockIcon.textContent = '🎮';
            
            const button = card.querySelector('.engagement-btn');
            button.textContent = 'Start Challenge';
            button.disabled = false;
            
            button.addEventListener('click', () => {
                startEngagement(card);
            });
        }
    });
}

// Start engagement challenge
function startEngagement(card) {
    const challengeTitle = card.querySelector('h3').textContent;
    alert(`Starting ${challengeTitle}! This would launch the engagement activity.`);
    // In a real implementation, this would navigate to the challenge page or open a modal
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    checkUnlockDates();
    
    // Check for unlocks every hour
    setInterval(checkUnlockDates, 3600000);
});

// Add smooth scrolling for better UX
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});
