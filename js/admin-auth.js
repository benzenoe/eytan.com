// Admin Authentication System with Backend API

// API Configuration
const API_URL = localStorage.getItem('API_URL') || 'https://eytan-com-blog-backend-production.up.railway.app/api';

// Check if user is authenticated
async function isAuthenticated() {
    try {
        const response = await fetch(`${API_URL}/auth/status`, {
            method: 'GET',
            credentials: 'include' // Important: send session cookies
        });

        if (response.ok) {
            const data = await response.json();
            return data.authenticated === true;
        }

        return false;
    } catch (error) {
        console.error('Auth check error:', error);
        return false;
    }
}

// Login function
async function login(password) {
    try {
        const response = await fetch(`${API_URL}/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include', // Important: send session cookies
            body: JSON.stringify({ password })
        });

        if (response.ok) {
            const data = await response.json();
            return data.success === true;
        }

        // Check if it's a rate limit error
        if (response.status === 429) {
            const data = await response.json();
            alert(data.message || 'Too many login attempts. Please try again later.');
        }

        return false;
    } catch (error) {
        console.error('Login error:', error);
        alert('Failed to connect to server. Please check your connection and try again.');
        return false;
    }
}

// Logout function
async function logout() {
    try {
        await fetch(`${API_URL}/auth/logout`, {
            method: 'POST',
            credentials: 'include'
        });
    } catch (error) {
        console.error('Logout error:', error);
    }

    // Redirect to login
    window.location.reload();
}

// Show login form
function showLoginForm() {
    document.body.innerHTML = `
        <style>
            .login-container {
                display: flex;
                align-items: center;
                justify-content: center;
                min-height: 100vh;
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            }

            .login-box {
                background: white;
                padding: 3rem;
                border-radius: 15px;
                box-shadow: 0 10px 40px rgba(0,0,0,0.2);
                max-width: 400px;
                width: 90%;
            }

            .login-box h1 {
                margin: 0 0 0.5rem 0;
                color: #667eea;
                font-size: 2rem;
            }

            .login-box p {
                color: #6c757d;
                margin: 0 0 2rem 0;
            }

            .login-form {
                display: flex;
                flex-direction: column;
                gap: 1rem;
            }

            .form-group {
                display: flex;
                flex-direction: column;
                gap: 0.5rem;
            }

            .form-group label {
                font-weight: 600;
                color: #333;
            }

            .form-group input {
                padding: 0.75rem;
                border: 2px solid #e9ecef;
                border-radius: 8px;
                font-size: 1rem;
                transition: border-color 0.3s ease;
            }

            .form-group input:focus {
                outline: none;
                border-color: #667eea;
            }

            .login-btn {
                padding: 0.75rem;
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: white;
                border: none;
                border-radius: 8px;
                font-size: 1rem;
                font-weight: 600;
                cursor: pointer;
                transition: transform 0.2s ease;
            }

            .login-btn:hover {
                transform: translateY(-2px);
            }

            .login-btn:active {
                transform: translateY(0);
            }

            .error-message {
                color: #dc3545;
                font-size: 0.9rem;
                margin-top: 0.5rem;
                display: none;
            }

            .error-message.show {
                display: block;
            }

            .back-link {
                text-align: center;
                margin-top: 1.5rem;
            }

            .back-link a {
                color: #667eea;
                text-decoration: none;
            }

            .back-link a:hover {
                text-decoration: underline;
            }
        </style>

        <div class="login-container">
            <div class="login-box">
                <h1>🔐 Admin Login</h1>
                <p>Enter password to access blog admin</p>

                <form class="login-form" id="login-form">
                    <div class="form-group">
                        <label for="password">Password</label>
                        <input
                            type="password"
                            id="password"
                            placeholder="Enter your password"
                            autocomplete="current-password"
                            required
                        >
                    </div>

                    <div class="error-message" id="error-message">
                        Incorrect password. Please try again.
                    </div>

                    <button type="submit" class="login-btn">Login</button>
                </form>

                <div class="back-link">
                    <a href="index.html">← Back to Home</a>
                </div>
            </div>
        </div>
    `;

    // Handle login form submission
    document.getElementById('login-form').addEventListener('submit', async function(e) {
        e.preventDefault();

        const password = document.getElementById('password').value;
        const errorMessage = document.getElementById('error-message');
        const loginBtn = document.querySelector('.login-btn');

        // Disable button during login
        loginBtn.disabled = true;
        loginBtn.textContent = 'Logging in...';

        const success = await login(password);

        if (success) {
            // Reload page to show admin interface
            window.location.reload();
        } else {
            // Show error message
            errorMessage.classList.add('show');
            loginBtn.disabled = false;
            loginBtn.textContent = 'Login';
            document.getElementById('password').value = '';
            document.getElementById('password').focus();
        }
    });

    // Focus password field
    document.getElementById('password').focus();
}

// Initialize authentication check
async function initAuth() {
    const authenticated = await isAuthenticated();

    if (!authenticated) {
        showLoginForm();
        return false;
    }
    return true;
}

// Export functions for use in admin.js
window.adminAuth = {
    init: initAuth,
    logout: logout,
    isAuthenticated: isAuthenticated,
    setApiUrl: (url) => {
        localStorage.setItem('API_URL', url);
        window.location.reload();
    },
    getApiUrl: () => API_URL
};
