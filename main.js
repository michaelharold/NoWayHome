// Utility functions and shared logic
class NoWayHome {
    constructor() {
        this.currentUser = null;
        this.init();
    }

    init() {
        // Check authentication on page load
        this.checkAuth();
        // Set minimum date for date inputs
        this.setMinDate();
        // Add logout functionality if logout button exists
        this.initLogout();
    }

    // Authentication utilities
    checkAuth() {
        const userData = localStorage.getItem('nwh_user');
        if (userData) {
            this.currentUser = JSON.parse(userData);
            this.updateUserGreeting();
        } else if (!this.isAuthPage()) {
            // Redirect to login if not authenticated and not on auth page
            window.location.href = 'index.html';
        }
    }

    isAuthPage() {
        return window.location.pathname.includes('index.html') || 
               window.location.pathname === '/' ||
               window.location.pathname === '';
    }

    updateUserGreeting() {
        const greetingElement = document.getElementById('userGreeting');
        if (greetingElement && this.currentUser) {
            const email = this.currentUser.email;
            const name = email.split('@')[0];
            greetingElement.textContent = `Hello, ${name}! 👋`;
        }
    }

    initLogout() {
        const logoutBtn = document.getElementById('logoutBtn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', () => this.logout());
        }
    }

    logout() {
        localStorage.clear();
        window.location.href = 'index.html';
    }

    // Date utilities
    setMinDate() {
        const dateInputs = document.querySelectorAll('input[type="date"]');
        const today = new Date().toISOString().split('T')[0];
        dateInputs.forEach(input => {
            input.min = today;
        });
    }

    formatDate(date) {
        return new Date(date).toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    }

    addDays(date, days) {
        const result = new Date(date);
        result.setDate(result.getDate() + days);
        return result;
    }

    // Storage utilities
    saveUserData(key, data) {
        if (this.currentUser) {
            this.currentUser[key] = data;
            localStorage.setItem('nwh_user', JSON.stringify(this.currentUser));
        }
    }

    getUserData(key) {
        if (this.currentUser) {
            return this.currentUser[key];
        }
        return null;
    }

    // Animation utilities
    showElement(element, delay = 0) {
        setTimeout(() => {
            element.classList.remove('hidden');
            element.style.animation = 'slideInUp 0.5s ease-out';
        }, delay);
    }

    hideElement(element) {
        element.classList.add('hidden');
    }

    // Random utilities
    getRandomElement(array) {
        return array[Math.floor(Math.random() * array.length)];
    }

    generateFlightNumber() {
        const airlines = ['NWH', 'DEST', 'CHAOS', 'SURP', 'FATE'];
        const airline = this.getRandomElement(airlines);
        const number = Math.floor(Math.random() * 9000) + 1000;
        return `${airline}${number}`;
    }

    generatePrice(min = 200, max = 800) {
        const price = Math.floor(Math.random() * (max - min + 1)) + min;
        return `$${price}`;
    }

    // Form validation utilities
    validateEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }

    showError(message) {
        // Create or update error message
        let errorDiv = document.querySelector('.error-message');
        if (!errorDiv) {
            errorDiv = document.createElement('div');
            errorDiv.className = 'error-message';
            errorDiv.style.cssText = `
                background: #fef2f2;
                color: #dc2626;
                padding: 12px 16px;
                border-radius: 8px;
                margin: 16px 0;
                border-left: 4px solid #dc2626;
                animation: slideInUp 0.3s ease-out;
            `;
            document.querySelector('form').prepend(errorDiv);
        }
        errorDiv.textContent = message;
        
        // Auto-hide after 5 seconds
        setTimeout(() => {
            if (errorDiv.parentNode) {
                errorDiv.remove();
            }
        }, 5000);
    }

    showSuccess(message) {
        // Create success message
        const successDiv = document.createElement('div');
        successDiv.className = 'success-message';
        successDiv.style.cssText = `
            background: #f0fdf4;
            color: #166534;
            padding: 12px 16px;
            border-radius: 8px;
            margin: 16px 0;
            border-left: 4px solid #10b981;
            animation: slideInUp 0.3s ease-out;
        `;
        successDiv.textContent = message;
        document.querySelector('form').prepend(successDiv);
        
        // Auto-hide after 3 seconds
        setTimeout(() => {
            if (successDiv.parentNode) {
                successDiv.remove();
            }
        }, 3000);
    }

    // Loading states
    setLoading(button, isLoading = true) {
        if (isLoading) {
            button.disabled = true;
            button.originalText = button.textContent;
            button.textContent = 'Loading... ⏳';
        } else {
            button.disabled = false;
            button.textContent = button.originalText || button.textContent;
        }
    }

    // Mock data generators
    getMockDestinations() {
        return [
            'Paris, France 🇫🇷',
            'Tokyo, Japan 🇯🇵',
            'Bali, Indonesia 🇮🇩',
            'New York, USA 🇺🇸',
            'Iceland 🇮🇸',
            'Barcelona, Spain 🇪🇸',
            'Rome, Italy 🇮🇹',
            'Amsterdam, Netherlands 🇳🇱',
            'Bangkok, Thailand 🇹🇭',
            'Rio de Janeiro, Brazil 🇧🇷',
            'Cape Town, South Africa 🇿🇦',
            'Istanbul, Turkey 🇹🇷',
            'Mumbai, India 🇮🇳',
            'Seoul, South Korea 🇰🇷',
            'Mexico City, Mexico 🇲🇽',
            'Sydney, Australia 🇦🇺',
            'London, UK 🇬🇧',
            'Dubai, UAE 🇦🇪',
            'Singapore 🇸🇬',
            'Cairo, Egypt 🇪🇬'
        ];
    }

    getMoviesByGenre(genre) {
        const movies = {
            'Action': ['Mission Impossible: Chaos Edition', 'Fast & Furious: Lost Highway', 'John Wick: Hotel Nowhere'],
            'Comedy': ['The Hangover: Part Unknown', 'Airplane Mode', 'Lost in Translation: Literally'],
            'Drama': ['The Terminal: Extended Stay', 'Cast Away: Urban Edition', 'Lost Highway'],
            'Horror': ['The Descent: Airport Edition', 'Final Destination: Flight Delayed', 'The Mist: Baggage Claim'],
            'Romance': ['Lost in Paris', 'The Holiday: Unplanned', 'Before Sunset: Wrong Terminal'],
            'Sci-Fi': ['Arrival: Departure Lounge', 'Interstellar: Domestic Flight', 'The Martian: Layover'],
            'Mystery': ['The Departed: Gate Unknown', 'Gone Girl: Missing Luggage', 'The Prestige: Ticket Switch'],
            'Documentary': ['Nomadland: Real Stories', 'Free Solo: Airport Edition', 'Won\'t You Be My Neighbor?: Fellow Traveler']
        };
        return this.getRandomElement(movies[genre] || movies['Comedy']);
    }

    // Smooth redirect with loading
    redirect(url, delay = 1000) {
        setTimeout(() => {
            window.location.href = url;
        }, delay);
    }
}

// Initialize the app
const app = new NoWayHome();

// Export for use in other scripts
window.NoWayHome = app;