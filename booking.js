// Flight booking logic
document.addEventListener('DOMContentLoaded', function() {
    // Check authentication
    if (!NoWayHome.currentUser) {
        window.location.href = 'index.html';
        return;
    }

    // Check if profile is complete
    if (!NoWayHome.currentUser.profileComplete) {
        window.location.href = 'profile-setup.html';
        return;
    }

    initFlightBooking();
});

function initFlightBooking() {
    const form = document.getElementById('flightBookingForm');
    const resultsSection = document.getElementById('flightResults');
    const flightsList = document.getElementById('flightsList');

    form.addEventListener('submit', function(e) {
        e.preventDefault();
        handleFlightSearch();
    });

    function handleFlightSearch() {
        const fromLocation = document.getElementById('fromLocation').value;
        const toLocation = document.getElementById('toLocation').value;
        const departureDate = document.getElementById('departureDate').value;
        const passengers = document.getElementById('passengers').value;
        const submitBtn = form.querySelector('button[type="submit"]');

        // Validation
        if (!fromLocation || !toLocation || !departureDate) {
            NoWayHome.showError('Please fill in all flight details! ✈️');
            return;
        }

        if (fromLocation === toLocation) {
            NoWayHome.showError('You can\'t fly to the same place you\'re already at! 🤔');
            return;
        }

        const selectedDate = new Date(departureDate);
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        if (selectedDate < today) {
            NoWayHome.showError('Time travel not available yet! Please select a future date 🕐');
            return;
        }

        NoWayHome.setLoading(submitBtn, true);

        // Generate mock flight results
        setTimeout(() => {
            const flights = generateFlightResults(fromLocation, toLocation, departureDate, passengers);
            displayFlightResults(flights);
            NoWayHome.setLoading(submitBtn, false);
            
            // Scroll to results
            resultsSection.scrollIntoView({ behavior: 'smooth' });
        }, 2000);
    }

    function generateFlightResults(from, to, date, passengers) {
        const flights = [];
        const basePrice = Math.floor(Math.random() * 400) + 200;
        
        // Generate 3-4 flight options
        for (let i = 0; i < Math.floor(Math.random() * 2) + 3; i++) {
            const hours = 6 + Math.floor(Math.random() * 12);
            const minutes = Math.floor(Math.random() * 60);
            const price = basePrice + (Math.floor(Math.random() * 200) - 100);
            const totalPrice = price * parseInt(passengers);
            
            flights.push({
                id: `flight_${i}`,
                flightNumber: NoWayHome.generateFlightNumber(),
                from: from,
                to: to,
                date: date,
                time: `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`,
                duration: `${Math.floor(Math.random() * 8) + 2}h ${Math.floor(Math.random() * 60)}m`,
                price: totalPrice,
                airline: getAirlineName(),
                passengers: passengers,
                stops: Math.random() > 0.7 ? '1 stop' : 'Direct'
            });
        }
        
        return flights.sort((a, b) => a.price - b.price);
    }

    function getAirlineName() {
        const airlines = [
            'Destiny Airlines',
            'Chaos Airways',
            'Serendipity Express',
            'Adventure Air',
            'Mystery Wings',
            'Wanderlust Airlines'
        ];
        return NoWayHome.getRandomElement(airlines);
    }

    function displayFlightResults(flights) {
        NoWayHome.showElement(resultsSection);
        
        flightsList.innerHTML = flights.map(flight => `
            <div class="flight-card" data-flight-id="${flight.id}" onclick="selectFlight('${flight.id}')">
                <div class="flight-header">
                    <div class="flight-route">
                        <strong>${flight.from}</strong> → <strong>${flight.to}</strong>
                    </div>
                    <div class="flight-price">$${flight.price}</div>
                </div>
                <div class="flight-details">
                    <div class="flight-detail">
                        <strong>✈️ ${flight.flightNumber}</strong><br>
                        <small>${flight.airline}</small>
                    </div>
                    <div class="flight-detail">
                        <strong>🕐 ${flight.time}</strong><br>
                        <small>${flight.duration}</small>
                    </div>
                    <div class="flight-detail">
                        <strong>📍 ${flight.stops}</strong><br>
                        <small>${flight.passengers} passenger(s)</small>
                    </div>
                </div>
                <div style="text-align: center; margin-top: 16px;">
                    <button class="btn btn-primary" onclick="event.stopPropagation(); selectFlight('${flight.id}')">
                        Book This Flight! 🎫
                    </button>
                </div>
            </div>
        `).join('');
        
        // Store flights for selection
        window.currentFlights = flights;
    }
}

// Flight selection handler
window.selectFlight = function(flightId) {
    const flights = window.currentFlights;
    const selectedFlight = flights.find(f => f.id === flightId);
    
    if (!selectedFlight) return;
    
    // Save the original flight booking
    NoWayHome.saveUserData('originalFlight', selectedFlight);
    
    // Show booking confirmation with dramatic effect
    const flightCard = document.querySelector(`[data-flight-id="${flightId}"]`);
    flightCard.style.transform = 'scale(1.05)';
    flightCard.style.border = '3px solid #10b981';
    flightCard.style.background = 'linear-gradient(135deg, #ecfdf5, #f0fdf4)';
    
    setTimeout(() => {
        // Create dramatic booking message
        const bookingMessage = document.createElement('div');
        bookingMessage.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: white;
            padding: 40px;
            border-radius: 20px;
            box-shadow: 0 20px 60px rgba(0,0,0,0.3);
            z-index: 1000;
            text-align: center;
            max-width: 400px;
            animation: slideInUp 0.5s ease-out;
        `;
        
        bookingMessage.innerHTML = `
            <h3>🎉 Flight Booked!</h3>
            <p>Flight ${selectedFlight.flightNumber} is confirmed!</p>
            <p style="color: #6b7280; margin: 16px 0;">But wait... we have something special planned for your return... 😈</p>
            <button class="btn btn-primary" onclick="proceedToSurprise()" style="margin-top: 16px;">
                What's the Surprise? 🎪
            </button>
        `;
        
        // Add backdrop
        const backdrop = document.createElement('div');
        backdrop.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0,0,0,0.5);
            z-index: 999;
        `;
        
        document.body.appendChild(backdrop);
        document.body.appendChild(bookingMessage);
        
        // Prevent scrolling
        document.body.style.overflow = 'hidden';
        
    }, 500);
};

window.proceedToSurprise = function() {
    // Clean up the modal
    document.body.style.overflow = 'auto';
    const modal = document.querySelector('[style*="z-index: 1000"]');
    const backdrop = document.querySelector('[style*="z-index: 999"]');
    if (modal) modal.remove();
    if (backdrop) backdrop.remove();
    
    // Redirect to surprise page with dramatic effect
    document.body.style.transition = 'opacity 0.5s ease-out';
    document.body.style.opacity = '0';
    
    setTimeout(() => {
        window.location.href = 'surprise-return.html';
    }, 500);
};

// Add some booking page enhancements
document.addEventListener('DOMContentLoaded', function() {
    // Add location-based suggestions
    const fromSelect = document.getElementById('fromLocation');
    const toSelect = document.getElementById('toLocation');
    
    if (fromSelect && toSelect) {
        fromSelect.addEventListener('change', function() {
            // Add a subtle animation to the 'to' field
            toSelect.style.transform = 'scale(1.02)';
            setTimeout(() => {
                toSelect.style.transform = 'scale(1)';
            }, 200);
        });
    }
    
    // Add date picker enhancements
    const dateInput = document.getElementById('departureDate');
    if (dateInput) {
        dateInput.addEventListener('change', function() {
            const selectedDate = new Date(this.value);
            const dayOfWeek = selectedDate.toLocaleDateString('en-US', { weekday: 'long' });
            
            // Show a small tooltip with the day
            let tooltip = document.querySelector('.date-tooltip');
            if (!tooltip) {
                tooltip = document.createElement('div');
                tooltip.className = 'date-tooltip';
                tooltip.style.cssText = `
                    position: absolute;
                    background: #3b82f6;
                    color: white;
                    padding: 4px 8px;
                    border-radius: 4px;
                    font-size: 0.8rem;
                    margin-top: 4px;
                    animation: slideInUp 0.3s ease-out;
                `;
                this.parentElement.appendChild(tooltip);
            }
            
            tooltip.textContent = `Flying on a ${dayOfWeek}! ✈️`;
            
            setTimeout(() => {
                if (tooltip.parentNode) {
                    tooltip.remove();
                }
            }, 3000);
        });
    }
});