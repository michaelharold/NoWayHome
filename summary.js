// Final summary page logic
document.addEventListener('DOMContentLoaded', function() {
    // Check authentication
    if (!NoWayHome.currentUser) {
        window.location.href = 'index.html';
        return;
    }

    initSummary();
});

function initSummary() {
    // Get all user data
    const originalFlight = NoWayHome.getUserData('originalFlight');
    const surpriseReturn = NoWayHome.getUserData('surpriseReturn');
    const toTicket = NoWayHome.getUserData('toTicket');
    const movieTicket = NoWayHome.getUserData('movieTicket');
    const toTicketBooked = NoWayHome.getUserData('toTicketBooked');
    const surpriseAccepted = NoWayHome.getUserData('surpriseAccepted');

    // Build timeline
    buildJourneyTimeline(originalFlight, toTicket, movieTicket, surpriseReturn, toTicketBooked, surpriseAccepted);
    
    // Calculate stats
    calculateJourneyStats(originalFlight, toTicket, surpriseReturn, toTicketBooked);
    
    // Setup action buttons
    setupActionButtons();
    
    // Add final touches
    addFinalTouches();
}

function buildJourneyTimeline(originalFlight, toTicket, movieTicket, surpriseReturn, toTicketBooked, surpriseAccepted) {
    // Original Flight
    const originalSection = document.querySelector('#originalFlight .flight-summary');
    if (originalFlight) {
        originalSection.innerHTML = `
            <div class="flight-details">
                <strong>${originalFlight.flightNumber}</strong> - ${originalFlight.from} → ${originalFlight.to}<br>
                <small>📅 ${NoWayHome.formatDate(originalFlight.date)} at ${originalFlight.time}</small><br>
                <small>💰 ${originalFlight.price} for ${originalFlight.passengers} passenger(s)</small>
            </div>
        `;
    }

    // TO Ticket (if booked)
    const toSection = document.querySelector('#toTicket');
    if (toTicketBooked && toTicket) {
        toSection.querySelector('.flight-summary').innerHTML = `
            <div class="flight-details">
                <strong>${toTicket.flightNumber}</strong> - ${toTicket.from} → ${toTicket.to}<br>
                <small>📅 ${NoWayHome.formatDate(toTicket.date)} at ${toTicket.time}</small><br>
                <small>💰 ${toTicket.price} for ${toTicket.passengers} passenger(s)</small>
            </div>
        `;
    } else {
        toSection.style.display = 'none';
    }

    // Movie Night (if TO ticket was booked)
    const movieSection = document.querySelector('#movieNight');
    if (toTicketBooked && movieTicket) {
        movieSection.querySelector('.movie-summary').innerHTML = `
            <div class="movie-details">
                <strong>"${movieTicket.title}"</strong> (${movieTicket.genre})<br>
                <small>📅 ${NoWayHome.formatDate(movieTicket.date)} at ${movieTicket.time}</small><br>
                <small>📍 ${movieTicket.location}</small><br>
                <small>🎟️ ${movieTicket.tickets} tickets included</small>
            </div>
        `;
    } else {
        movieSection.style.display = 'none';
    }

    // Surprise Return
    const returnSection = document.querySelector('#surpriseReturn');
    if (surpriseAccepted && surpriseReturn) {
        returnSection.querySelector('.flight-summary').innerHTML = `
            <div class="flight-details">
                <strong>${surpriseReturn.flightNumber}</strong> - ${surpriseReturn.from} → ${surpriseReturn.to}<br>
                <small>📅 ${NoWayHome.formatDate(surpriseReturn.date)} at ${surpriseReturn.time}</small><br>
                <small>💰 ${surpriseReturn.price} for ${surpriseReturn.passengers} passenger(s)</small><br>
                <small>✨ <em>Surprise destination from your wishlist!</em></small>
            </div>
        `;
    } else {
        returnSection.querySelector('.timeline-content h4').textContent = 'Regular Return';
        returnSection.querySelector('.timeline-content p').textContent = 'Standard return flight';
        returnSection.querySelector('.flight-summary').innerHTML = `
            <div class="flight-details">
                <small>You chose the conventional route back home 🏠</small>
            </div>
        `;
    }
}

function calculateJourneyStats(originalFlight, toTicket, surpriseReturn, toTicketBooked) {
    let totalFlights = 1; // Original flight
    let totalDestinations = new Set([originalFlight.from, originalFlight.to]);
    let totalCost = parseInt(originalFlight.price.replace('$', ''));
    let totalDays = 16; // Base trip duration

    if (toTicketBooked && toTicket) {
        totalFlights += 1;
        totalDestinations.add(toTicket.to);
        totalCost += parseInt(toTicket.price.replace('$', ''));
    }

    if (surpriseReturn) {
        totalFlights += 1;
        totalDestinations.add(surpriseReturn.from);
        totalCost += parseInt(surpriseReturn.price.replace('$', ''));
    }

    // Update stats with animation
    setTimeout(() => animateCounter('totalFlights', totalFlights), 500);
    setTimeout(() => animateCounter('totalDestinations', totalDestinations.size), 700);
    setTimeout(() => animateCounter('totalDays', totalDays), 900);
    setTimeout(() => animateCounter('totalCost', totalCost, '$'), 1100);
}

function animateCounter(elementId, targetValue, prefix = '') {
    const element = document.getElementById(elementId);
    const duration = 2000;
    const startTime = performance.now();
    const startValue = 0;

    function updateCounter(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        // Easing function for smooth animation
        const easeOutQuart = 1 - Math.pow(1 - progress, 4);
        const currentValue = Math.floor(startValue + (targetValue - startValue) * easeOutQuart);
        
        element.textContent = prefix + currentValue;
        
        if (progress < 1) {
            requestAnimationFrame(updateCounter);
        }
    }
    
    requestAnimationFrame(updateCounter);
}

function setupActionButtons() {
    // Download Itinerary
    document.getElementById('downloadItinerary').addEventListener('click', function() {
        generateItinerary();
    });

    // Share Journey
    document.getElementById('shareJourney').addEventListener('click', function() {
        shareJourney();
    });

    // Book Another Adventure
    document.getElementById('bookAnother').addEventListener('click', function() {
        bookAnother();
    });
}

function generateItinerary() {
    const userData = NoWayHome.currentUser;
    const originalFlight = NoWayHome.getUserData('originalFlight');
    const toTicket = NoWayHome.getUserData('toTicket');
    const movieTicket = NoWayHome.getUserData('movieTicket');
    const surpriseReturn = NoWayHome.getUserData('surpriseReturn');
    
    let itinerary = `
🎭 NO WAY HOME - YOUR ADVENTURE ITINERARY
═══════════════════════════════════════════

👤 Traveler: ${userData.email.split('@')[0]}
🏠 Home Country: ${userData.homeCountry}
🎬 Movie Preference: ${userData.movieGenre}
📅 Trip Generated: ${new Date().toLocaleDateString()}

✈️ FLIGHT DETAILS
──────────────────
`;

    if (originalFlight) {
        itinerary += `
📍 Original Flight: ${originalFlight.flightNumber}
   ${originalFlight.from} → ${originalFlight.to}
   📅 ${NoWayHome.formatDate(originalFlight.date)} at ${originalFlight.time}
   💰 ${originalFlight.price}
`;
    }

    if (toTicket && NoWayHome.getUserData('toTicketBooked')) {
        itinerary += `
📍 TO Ticket: ${toTicket.flightNumber}
   ${toTicket.from} → ${toTicket.to}
   📅 ${NoWayHome.formatDate(toTicket.date)} at ${toTicket.time}
   💰 ${toTicket.price}
`;
    }

    if (surpriseReturn && NoWayHome.getUserData('surpriseAccepted')) {
        itinerary += `
📍 Surprise Return: ${surpriseReturn.flightNumber}
   ${surpriseReturn.from} → ${surpriseReturn.to}
   📅 ${NoWayHome.formatDate(surpriseReturn.date)} at ${surpriseReturn.time}
   💰 ${surpriseReturn.price}
   ✨ SURPRISE DESTINATION!
`;
    }

    if (movieTicket) {
        itinerary += `
🎬 MOVIE NIGHT
──────────────
📍 "${movieTicket.title}" (${movieTicket.genre})
   📅 ${NoWayHome.formatDate(movieTicket.date)} at ${movieTicket.time}
   🏢 ${movieTicket.location}
   🎟️ ${movieTicket.tickets} tickets
`;
    }

    itinerary += `
💫 FINAL THOUGHTS
─────────────────
You planned a normal trip... we gave you DESTINY! 🌟

"Not all those who wander are lost... but some are beautifully confused." 🧭

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Generated by No Way Home ✈️ - Where chaos meets adventure!
`;

    // Create downloadable file
    const blob = new Blob([itinerary], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `NoWayHome_Itinerary_${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    // Show success message
    NoWayHome.showSuccess('Itinerary downloaded! 📄 Safe travels!');
}

function shareJourney() {
    const shareText = `🎭 I just planned a "normal" trip with No Way Home... and ended up with an EPIC adventure! From surprise destinations to movie nights, this is how travel should be! ✈️🎪 #NoWayHome #AdventureTravel #TravelChaos`;
    
    if (navigator.share) {
        navigator.share({
            title: 'My No Way Home Adventure!',
            text: shareText,
            url: window.location.origin
        });
    } else {
        // Fallback - copy to clipboard
        navigator.clipboard.writeText(shareText).then(() => {
            NoWayHome.showSuccess('Story copied to clipboard! Share it with the world! 🌍');
        }).catch(() => {
            // Manual copy fallback
            const textArea = document.createElement('textarea');
            textArea.value = shareText;
            document.body.appendChild(textArea);
            textArea.select();
            document.execCommand('copy');
            document.body.removeChild(textArea);
            NoWayHome.showSuccess('Story copied to clipboard! Share it with the world! 🌍');
        });
    }
}

function bookAnother() {
    // Show confirmation dialog
    const confirmed = confirm('Ready for another adventure? This will reset your current journey! 🎪');
    
    if (confirmed) {
        // Clear all booking data but keep profile
        const currentUser = NoWayHome.currentUser;
        const keysToKeep = ['email', 'password', 'createdAt', 'profileComplete', 'homeCountry', 'movieGenre', 'wishlistDestinations', 'favoriteFoods'];
        
        const cleanUser = {};
        keysToKeep.forEach(key => {
            if (currentUser[key]) {
                cleanUser[key] = currentUser[key];
            }
        });
        
        localStorage.setItem('nwh_user', JSON.stringify(cleanUser));
        
        // Dramatic exit
        document.body.style.transition = 'all 0.5s ease-out';
        document.body.style.transform = 'scale(0.95) rotateY(5deg)';
        document.body.style.opacity = '0.8';
        
        setTimeout(() => {
            window.location.href = 'flight-booking.html';
        }, 500);
    }
}

function addFinalTouches() {
    // Animate timeline items on scroll
    const timelineItems = document.querySelectorAll('.timeline-item');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.style.animation = 'slideInUp 0.6s ease-out both';
                }, index * 200);
            }
        });
    });

    timelineItems.forEach(item => observer.observe(item));

    // Add floating elements for ambiance
    setTimeout(() => {
        createFloatingElements();
    }, 2000);
    
    // Add final confetti after everything loads
    setTimeout(() => {
        createCelebrationConfetti();
    }, 3000);
}

function createFloatingElements() {
    const emojis = ['✈️', '🌍', '🎭', '⭐', '🎪', '🌟'];
    
    for (let i = 0; i < 6; i++) {
        setTimeout(() => {
            const emoji = document.createElement('div');
            emoji.textContent = NoWayHome.getRandomElement(emojis);
            emoji.style.cssText = `
                position: fixed;
                font-size: 1.5rem;
                pointer-events: none;
                z-index: 100;
                animation: floatAround 15s infinite linear;
                left: ${Math.random() * 100}vw;
                top: ${Math.random() * 100}vh;
                opacity: 0.3;
            `;
            
            document.body.appendChild(emoji);
            
            // Remove after animation
            setTimeout(() => {
                if (emoji.parentNode) {
                    emoji.remove();
                }
            }, 15000);
        }, i * 2000);
    }
}

function createCelebrationConfetti() {
    const colors = ['#3b82f6', '#10b981', '#f97316', '#ef4444', '#8b5cf6', '#06b6d4'];
    
    for (let i = 0; i < 30; i++) {
        setTimeout(() => {
            const confetti = document.createElement('div');
            confetti.style.cssText = `
                position: fixed;
                width: 8px;
                height: 8px;
                background: ${NoWayHome.getRandomElement(colors)};
                left: ${Math.random() * 100}vw;
                top: -10px;
                border-radius: 50%;
                animation: gentleFall ${Math.random() * 5 + 3}s linear forwards;
                z-index: 50;
                pointer-events: none;
            `;
            
            document.body.appendChild(confetti);
            
            setTimeout(() => {
                if (confetti.parentNode) {
                    confetti.remove();
                }
            }, 8000);
        }, i * 100);
    }
}

// Add CSS animations
document.addEventListener('DOMContentLoaded', function() {
    const style = document.createElement('style');
    style.textContent = `
        @keyframes floatAround {
            0% { transform: translate(0, 0) rotate(0deg); }
            25% { transform: translate(100px, -100px) rotate(90deg); }
            50% { transform: translate(-100px, -200px) rotate(180deg); }
            75% { transform: translate(-200px, -100px) rotate(270deg); }
            100% { transform: translate(0, 0) rotate(360deg); }
        }
        
        @keyframes gentleFall {
            to {
                transform: translateY(100vh) rotate(360deg);
                opacity: 0;
            }
        }
        
        .stat-card:hover .stat-number {
            transform: scale(1.1);
            transition: transform 0.3s ease;
        }
        
        .timeline-item:hover .timeline-icon {
            transform: scale(1.2) rotate(10deg);
            transition: all 0.3s ease;
        }
    `;
    document.head.appendChild(style);
});