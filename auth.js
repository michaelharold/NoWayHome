// Authentication logic
document.addEventListener('DOMContentLoaded', function() {
    // If user is already logged in, redirect to appropriate page
    const userData = localStorage.getItem('nwh_user');
    if (userData) {
        const user = JSON.parse(userData);
        if (user.profileComplete) {
            window.location.href = 'flight-booking.html';
        } else {
            window.location.href = 'profile-setup.html';
        }
        return;
    }

    // Form switching
    const showSignupBtn = document.getElementById('showSignup');
    const showLoginBtn = document.getElementById('showLogin');
    const loginForm = document.getElementById('login-form');
    const signupForm = document.getElementById('signup-form');

    showSignupBtn?.addEventListener('click', (e) => {
        e.preventDefault();
        loginForm.classList.remove('active');
        signupForm.classList.add('active');
    });

    showLoginBtn?.addEventListener('click', (e) => {
        e.preventDefault();
        signupForm.classList.remove('active');
        loginForm.classList.add('active');
    });

    // Login form handler
    document.getElementById('loginForm')?.addEventListener('submit', function(e) {
        e.preventDefault();
        handleLogin();
    });

    // Signup form handler
    document.getElementById('signupForm')?.addEventListener('submit', function(e) {
        e.preventDefault();
        handleSignup();
    });

    function handleLogin() {
        const email = document.getElementById('loginEmail').value;
        const password = document.getElementById('loginPassword').value;
        const submitBtn = document.querySelector('#loginForm button[type="submit"]');

        // Basic validation
        if (!NoWayHome.validateEmail(email)) {
            NoWayHome.showError('Please enter a valid email address! 📧');
            return;
        }

        if (password.length < 6) {
            NoWayHome.showError('Password must be at least 6 characters! 🔐');
            return;
        }

        NoWayHome.setLoading(submitBtn, true);

        // Simulate API call
        setTimeout(() => {
            // Check if user exists in localStorage
            const existingUsers = JSON.parse(localStorage.getItem('nwh_users') || '{}');
            const userKey = email.toLowerCase();
            
            if (existingUsers[userKey] && existingUsers[userKey].password === password) {
                // Login successful
                const userData = existingUsers[userKey];
                localStorage.setItem('nwh_user', JSON.stringify(userData));
                
                NoWayHome.showSuccess('Welcome back! Redirecting to your adventure... 🚀');
                
                setTimeout(() => {
                    if (userData.profileComplete) {
                        window.location.href = 'flight-booking.html';
                    } else {
                        window.location.href = 'profile-setup.html';
                    }
                }, 1500);
            } else {
                NoWayHome.showError('Invalid email or password! Try again or create an account 🤔');
                NoWayHome.setLoading(submitBtn, false);
            }
        }, 1000);
    }

    function handleSignup() {
        const email = document.getElementById('signupEmail').value;
        const password = document.getElementById('signupPassword').value;
        const confirmPassword = document.getElementById('confirmPassword').value;
        const submitBtn = document.querySelector('#signupForm button[type="submit"]');

        // Validation
        if (!NoWayHome.validateEmail(email)) {
            NoWayHome.showError('Please enter a valid email address! 📧');
            return;
        }

        if (password.length < 6) {
            NoWayHome.showError('Password must be at least 6 characters! 🔐');
            return;
        }

        if (password !== confirmPassword) {
            NoWayHome.showError('Passwords do not match! 🔒');
            return;
        }

        NoWayHome.setLoading(submitBtn, true);

        // Simulate API call
        setTimeout(() => {
            // Check if user already exists
            const existingUsers = JSON.parse(localStorage.getItem('nwh_users') || '{}');
            const userKey = email.toLowerCase();
            
            if (existingUsers[userKey]) {
                NoWayHome.showError('Account already exists! Try logging in instead 👀');
                NoWayHome.setLoading(submitBtn, false);
                return;
            }

            // Create new user
            const userData = {
                email: email,
                password: password,
                createdAt: new Date().toISOString(),
                profileComplete: false
            };

            // Save to users database
            existingUsers[userKey] = userData;
            localStorage.setItem('nwh_users', JSON.stringify(existingUsers));
            
            // Set current user
            localStorage.setItem('nwh_user', JSON.stringify(userData));
            
            NoWayHome.showSuccess('Account created! Welcome to the chaos! 🎉');
            
            setTimeout(() => {
                window.location.href = 'profile-setup.html';
            }, 1500);
        }, 1000);
    }

    // Add some flair to the authentication page
    addAuthPageAnimations();
});

function addAuthPageAnimations() {
    // Animate the header on load
    const header = document.querySelector('.auth-header');
    if (header) {
        header.style.animation = 'slideInUp 0.8s ease-out';
    }

    // Add typing effect to the tagline
    const tagline = document.querySelector('.auth-header p');
    if (tagline) {
        const text = tagline.textContent;
        tagline.textContent = '';
        tagline.style.borderRight = '2px solid rgba(255,255,255,0.7)';
        
        let i = 0;
        const typeInterval = setInterval(() => {
            if (i < text.length) {
                tagline.textContent += text.charAt(i);
                i++;
            } else {
                clearInterval(typeInterval);
                setTimeout(() => {
                    tagline.style.borderRight = 'none';
                }, 500);
            }
        }, 50);
    }

    // Add hover effects to form inputs
    const inputs = document.querySelectorAll('input');
    inputs.forEach(input => {
        input.addEventListener('focus', function() {
            this.parentElement.style.transform = 'translateY(-2px)';
        });
        
        input.addEventListener('blur', function() {
            this.parentElement.style.transform = 'translateY(0)';
        });
    });
}