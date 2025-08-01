// Profile setup logic
document.addEventListener('DOMContentLoaded', function() {
    // Check if user is authenticated
    if (!NoWayHome.currentUser) {
        window.location.href = 'index.html';
        return;
    }

    // If profile is already complete, redirect to booking
    if (NoWayHome.currentUser.profileComplete) {
        window.location.href = 'flight-booking.html';
        return;
    }

    initProfileSetup();
});

function initProfileSetup() {
    const form = document.getElementById('profileForm');
    const progressFill = document.querySelector('.progress-fill');
    
    // Animate progress bar on load
    setTimeout(() => {
        progressFill.style.width = '25%';
    }, 500);

    // Update progress as user fills form
    const requiredFields = form.querySelectorAll('[required]');
    
    requiredFields.forEach(field => {
        field.addEventListener('input', updateProgress);
        field.addEventListener('change', updateProgress);
    });

    function updateProgress() {
        const filledFields = Array.from(requiredFields).filter(field => {
            if (field.type === 'select-one') {
                return field.value !== '';
            }
            return field.value.trim() !== '';
        });
        
        const progress = (filledFields.length / requiredFields.length) * 100;
        progressFill.style.width = `${progress}%`;
        
        // Add some visual feedback
        if (progress === 100) {
            progressFill.style.background = 'linear-gradient(90deg, #10b981, #059669)';
            setTimeout(() => {
                document.querySelector('.progress-bar').style.boxShadow = '0 0 20px rgba(16, 185, 129, 0.3)';
            }, 300);
        }
    }

    // Form submission
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        handleProfileSubmit();
    });
}

function handleProfileSubmit() {
    const form = document.getElementById('profileForm');
    const submitBtn = form.querySelector('button[type="submit"]');
    const formData = new FormData(form);
    
    // Validate form
    const homeCountry = document.getElementById('homeCountry').value;
    const movieGenre = document.getElementById('movieGenre').value;
    const wishlistDestinations = document.getElementById('wishlistDestinations').value.trim();
    const favoriteFoods = document.getElementById('favoriteFoods').value.trim();

    if (!homeCountry) {
        NoWayHome.showError('Please select your home country! 🏠');
        return;
    }

    if (!movieGenre) {
        NoWayHome.showError('Please select your movie preference! 🎬');
        return;
    }

    if (!wishlistDestinations) {
        NoWayHome.showError('Please enter your dream destinations! 🌍');
        return;
    }

    if (!favoriteFoods) {
        NoWayHome.showError('Please tell us about your favorite foods! 🍕');
        return;
    }

    // Parse wishlist destinations
    const destinations = wishlistDestinations.split(',').map(dest => dest.trim()).filter(dest => dest.length > 0);
    
    if (destinations.length < 3) {
        NoWayHome.showError('Please enter at least 3 dream destinations! We need options for surprises 😉');
        return;
    }

    NoWayHome.setLoading(submitBtn, true);

    // Simulate processing
    setTimeout(() => {
        // Save profile data
        const profileData = {
            homeCountry,
            movieGenre,
            wishlistDestinations: destinations,
            favoriteFoods: favoriteFoods.split(',').map(food => food.trim()).filter(food => food.length > 0),
            profileComplete: true,
            completedAt: new Date().toISOString()
        };

        // Update user data
        Object.assign(NoWayHome.currentUser, profileData);
        
        // Save to localStorage
        localStorage.setItem('nwh_user', JSON.stringify(NoWayHome.currentUser));
        
        // Also update the users database
        const existingUsers = JSON.parse(localStorage.getItem('nwh_users') || '{}');
        const userKey = NoWayHome.currentUser.email.toLowerCase();
        if (existingUsers[userKey]) {
            Object.assign(existingUsers[userKey], profileData);
            localStorage.setItem('nwh_users', JSON.stringify(existingUsers));
        }

        NoWayHome.showSuccess('Profile saved! Let the adventure begin! 🚀');
        
        // Animate completion
        const progressFill = document.querySelector('.progress-fill');
        progressFill.style.width = '100%';
        progressFill.style.background = 'linear-gradient(90deg, #10b981, #059669)';
        
        setTimeout(() => {
            window.location.href = 'flight-booking.html';
        }, 2000);
    }, 1500);
}

// Add some interactive elements to make the form more engaging
document.addEventListener('DOMContentLoaded', function() {
    // Add emoji reactions to form sections
    const sections = document.querySelectorAll('.form-section');
    
    sections.forEach((section, index) => {
        const heading = section.querySelector('h3');
        if (heading) {
            heading.addEventListener('click', function() {
                // Add a little bounce animation
                section.style.transform = 'scale(1.02)';
                setTimeout(() => {
                    section.style.transform = 'scale(1)';
                }, 200);
            });
        }
        
        // Animate sections on scroll
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.animation = `slideInUp 0.6s ease-out ${index * 0.1}s both`;
                }
            });
        });
        
        observer.observe(section);
    });

    // Add destination suggestions
    const wishlistInput = document.getElementById('wishlistDestinations');
    if (wishlistInput) {
        const destinations = NoWayHome.getMockDestinations();
        
        wishlistInput.addEventListener('focus', function() {
            if (!this.value) {
                const suggestions = NoWayHome.getRandomElement([
                    'Paris, Tokyo, Bali',
                    'New York, London, Rome',
                    'Bangkok, Barcelona, Amsterdam',
                    'Iceland, Sydney, Rio'
                ]);
                this.placeholder = `Try: ${suggestions}...`;
            }
        });
        
        wishlistInput.addEventListener('blur', function() {
            this.placeholder = 'Paris, Tokyo, Bali, New York, Iceland... (separate with commas)';
        });
    }

    // Add food suggestions
    const foodsInput = document.getElementById('favoriteFoods');
    if (foodsInput) {
        foodsInput.addEventListener('focus', function() {
            if (!this.value) {
                const suggestions = NoWayHome.getRandomElement([
                    'Pizza, Sushi, Tacos',
                    'Ice cream, Street food, BBQ',
                    'Pasta, Ramen, Burgers',
                    'Chocolate, Coffee, Seafood'
                ]);
                this.placeholder = `Try: ${suggestions}...`;
            }
        });
        
        foodsInput.addEventListener('blur', function() {
            this.placeholder = 'Pizza, Sushi, Tacos, Ice cream, Street food...';
        });
    }
});