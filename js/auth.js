// Authentication Manager for Mental Health AI
// Handles all Supabase authentication operations

class AuthManager {
    constructor() {
        this.supabase = null;
        this.currentUser = null;
        this.initSupabase();
        this.setupAuthStateListener();
    }

    // Initialize Supabase client
    initSupabase() {
        // Replace these with your actual Supabase project URL and anon key
        const SUPABASE_URL = process.env.SUPABASE_URL || 'your_supabase_url_here';
        const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY || 'your_supabase_anon_key_here';
        
        if (SUPABASE_URL === 'your_supabase_url_here' || SUPABASE_ANON_KEY === 'your_supabase_anon_key_here') {
            console.warn('Supabase configuration not found. Please set SUPABASE_URL and SUPABASE_ANON_KEY environment variables.');
            return;
        }

        try {
            this.supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
            console.log('Supabase client initialized successfully');
        } catch (error) {
            console.error('Failed to initialize Supabase client:', error);
        }
    }

    // Setup authentication state listener
    setupAuthStateListener() {
        if (!this.supabase) return;

        this.supabase.auth.onAuthStateChange((event, session) => {
            console.log('Auth state changed:', event, session);
            
            if (session) {
                this.currentUser = session.user;
                this.handleAuthSuccess(session.user);
            } else {
                this.currentUser = null;
                this.handleAuthLogout();
            }
        });
    }

    // Handle successful authentication
    handleAuthSuccess(user) {
        // Store user info in localStorage
        localStorage.setItem('mental_health_user', JSON.stringify({
            id: user.id,
            email: user.email,
            name: user.user_metadata?.full_name || user.email.split('@')[0],
            avatar: user.user_metadata?.avatar_url || null,
            loginTime: new Date().toISOString()
        }));

        // Redirect to dashboard or return to previous page
        const returnUrl = new URLSearchParams(window.location.search).get('returnUrl') || '../dashboard.html';
        
        // Check if we're on an auth page
        if (window.location.pathname.includes('/auth/')) {
            window.location.href = returnUrl;
        }
    }

    // Handle logout
    handleAuthLogout() {
        localStorage.removeItem('mental_health_user');
        
        // If on a protected page, redirect to login
        if (this.isProtectedPage()) {
            window.location.href = '../auth/login.html?returnUrl=' + encodeURIComponent(window.location.pathname);
        }
    }

    // Check if current page requires authentication
    isProtectedPage() {
        const protectedPaths = ['/dashboard', '/profile', '/settings', '/chat-history'];
        return protectedPaths.some(path => window.location.pathname.includes(path));
    }

    // Initialize signup functionality
    initSignup() {
        const form = document.getElementById('signup-form');
        const togglePassword = document.getElementById('toggle-password');
        const googleSignup = document.getElementById('google-signup');

        if (form) {
            form.addEventListener('submit', (e) => this.handleSignup(e));
        }

        if (togglePassword) {
            togglePassword.addEventListener('click', () => this.togglePasswordVisibility('password'));
        }

        if (googleSignup) {
            googleSignup.addEventListener('click', () => this.handleGoogleAuth('signup'));
        }

        // Form validation
        this.setupFormValidation('signup');
    }

    // Initialize login functionality
    initLogin() {
        const form = document.getElementById('login-form');
        const togglePassword = document.getElementById('toggle-password');
        const googleLogin = document.getElementById('google-login');

        if (form) {
            form.addEventListener('submit', (e) => this.handleLogin(e));
        }

        if (togglePassword) {
            togglePassword.addEventListener('click', () => this.togglePasswordVisibility('password'));
        }

        if (googleLogin) {
            googleLogin.addEventListener('click', () => this.handleGoogleAuth('login'));
        }

        // Check if user is already logged in
        this.checkExistingSession();
    }

    // Initialize forgot password functionality
    initForgotPassword() {
        const form = document.getElementById('reset-form');
        const resendBtn = document.getElementById('resend-btn');

        if (form) {
            form.addEventListener('submit', (e) => this.handleForgotPassword(e));
        }

        if (resendBtn) {
            resendBtn.addEventListener('click', () => this.resendResetEmail());
        }
    }

    // Handle user signup
    async handleSignup(event) {
        event.preventDefault();
        
        if (!this.supabase) {
            this.showError('Authentication service is not available. Please try again later.');
            return;
        }

        const formData = new FormData(event.target);
        const data = {
            fullName: formData.get('fullName'),
            email: formData.get('email'),
            password: formData.get('password'),
            confirmPassword: formData.get('confirmPassword'),
            ageVerification: formData.get('ageVerification'),
            termsAgreement: formData.get('termsAgreement')
        };

        // Validate form data
        if (!this.validateSignupData(data)) {
            return;
        }

        this.setLoading('signup', true);

        try {
            const { data: authData, error } = await this.supabase.auth.signUp({
                email: data.email,
                password: data.password,
                options: {
                    data: {
                        full_name: data.fullName,
                        age_verified: true,
                        terms_accepted: true,
                        signup_date: new Date().toISOString()
                    }
                }
            });

            if (error) {
                throw error;
            }

            // Show success message
            this.showSuccess('অ্যাকাউন্ট তৈরি সফল হয়েছে! আপনার ইমেইল চেক করে নিশ্চিত করুন।');
            
            // Store user profile data
            if (authData.user) {
                await this.createUserProfile(authData.user, data.fullName);
            }

        } catch (error) {
            console.error('Signup error:', error);
            this.showError(this.getErrorMessage(error));
        } finally {
            this.setLoading('signup', false);
        }
    }

    // Handle user login
    async handleLogin(event) {
        event.preventDefault();
        
        if (!this.supabase) {
            this.showError('Authentication service is not available. Please try again later.');
            return;
        }

        const formData = new FormData(event.target);
        const email = formData.get('email');
        const password = formData.get('password');
        const rememberMe = formData.get('rememberMe');

        if (!email || !password) {
            this.showError('ইমেইল এবং পাসওয়ার্ড প্রয়োজন।');
            return;
        }

        this.setLoading('login', true);

        try {
            const { data, error } = await this.supabase.auth.signInWithPassword({
                email: email,
                password: password
            });

            if (error) {
                throw error;
            }

            // Handle remember me
            if (rememberMe) {
                localStorage.setItem('remember_me', 'true');
            }

            this.showSuccess('সফলভাবে লগইন হয়েছে!');
            
            // User will be redirected by the auth state listener

        } catch (error) {
            console.error('Login error:', error);
            this.showError(this.getErrorMessage(error));
        } finally {
            this.setLoading('login', false);
        }
    }

    // Handle forgot password
    async handleForgotPassword(event) {
        event.preventDefault();
        
        if (!this.supabase) {
            this.showError('Authentication service is not available. Please try again later.');
            return;
        }

        const formData = new FormData(event.target);
        const email = formData.get('email');

        if (!email) {
            this.showError('ইমেইল ঠিকানা প্রয়োজন।');
            return;
        }

        this.setLoading('reset', true);

        try {
            const { error } = await this.supabase.auth.resetPasswordForEmail(email, {
                redirectTo: `${window.location.origin}/auth/reset-password.html`
            });

            if (error) {
                throw error;
            }

            // Show success step
            document.getElementById('email-step').classList.add('hidden');
            document.getElementById('success-step').classList.remove('hidden');
            
            // Store email for resend functionality
            this.resetEmail = email;

        } catch (error) {
            console.error('Reset password error:', error);
            this.showError(this.getErrorMessage(error));
        } finally {
            this.setLoading('reset', false);
        }
    }

    // Handle Google authentication
    async handleGoogleAuth(type) {
        if (!this.supabase) {
            this.showError('Authentication service is not available. Please try again later.');
            return;
        }

        try {
            const { data, error } = await this.supabase.auth.signInWithOAuth({
                provider: 'google',
                options: {
                    redirectTo: `${window.location.origin}/auth/callback.html`
                }
            });

            if (error) {
                throw error;
            }

        } catch (error) {
            console.error('Google auth error:', error);
            this.showError('Google দিয়ে লগইনে সমস্যা হয়েছে। আবার চেষ্টা করুন।');
        }
    }

    // Resend reset email
    async resendResetEmail() {
        if (!this.resetEmail) return;
        
        const event = { preventDefault: () => {} };
        const form = document.getElementById('reset-form');
        form.email.value = this.resetEmail;
        
        await this.handleForgotPassword(event);
    }

    // Create user profile in database
    async createUserProfile(user, fullName) {
        try {
            const { error } = await this.supabase
                .from('user_profiles')
                .insert([
                    {
                        id: user.id,
                        email: user.email,
                        full_name: fullName,
                        created_at: new Date().toISOString(),
                        updated_at: new Date().toISOString()
                    }
                ]);

            if (error && error.code !== '23505') { // Ignore duplicate key error
                console.error('Profile creation error:', error);
            }
        } catch (error) {
            console.error('Failed to create user profile:', error);
        }
    }

    // Validate signup data
    validateSignupData(data) {
        if (!data.fullName || data.fullName.trim().length < 2) {
            this.showError('পূর্ণ নাম কমপক্ষে ২ অক্ষরের হতে হবে।');
            return false;
        }

        if (!this.isValidEmail(data.email)) {
            this.showError('সঠিক ইমেইল ঠিকানা দিন।');
            return false;
        }

        if (data.password.length < 6) {
            this.showError('পাসওয়ার্ড কমপক্ষে ৬ অক্ষরের হতে হবে।');
            return false;
        }

        if (data.password !== data.confirmPassword) {
            this.showError('পাসওয়ার্ড মিলছে না।');
            return false;
        }

        if (!data.ageVerification) {
            this.showError('বয়স নিশ্চিতকরণ প্রয়োজন।');
            return false;
        }

        if (!data.termsAgreement) {
            this.showError('শর্তাবলী স্বীকার করা প্রয়োজন।');
            return false;
        }

        return true;
    }

    // Setup form validation
    setupFormValidation(type) {
        const form = document.getElementById(`${type}-form`);
        if (!form) return;

        const inputs = form.querySelectorAll('input[required]');
        inputs.forEach(input => {
            input.addEventListener('blur', () => this.validateField(input));
            input.addEventListener('input', () => this.clearFieldError(input));
        });

        // Password confirmation validation
        if (type === 'signup') {
            const password = form.querySelector('#password');
            const confirmPassword = form.querySelector('#confirm-password');
            
            if (password && confirmPassword) {
                confirmPassword.addEventListener('input', () => {
                    if (confirmPassword.value && password.value !== confirmPassword.value) {
                        this.setFieldError(confirmPassword, 'পাসওয়ার্ড মিলছে না');
                    } else {
                        this.clearFieldError(confirmPassword);
                    }
                });
            }
        }
    }

    // Validate individual field
    validateField(field) {
        const value = field.value.trim();
        
        if (field.type === 'email' && value && !this.isValidEmail(value)) {
            this.setFieldError(field, 'সঠিক ইমেইল ঠিকানা দিন');
            return false;
        }
        
        if (field.type === 'password' && value && value.length < 6) {
            this.setFieldError(field, 'কমপক্ষে ৬ অক্ষর প্রয়োজন');
            return false;
        }
        
        if (field.required && !value) {
            this.setFieldError(field, 'এই ফিল্ড প্রয়োজন');
            return false;
        }
        
        this.clearFieldError(field);
        return true;
    }

    // Set field error
    setFieldError(field, message) {
        field.classList.add('border-red-500');
        const errorDiv = field.parentNode.querySelector('.field-error');
        if (errorDiv) {
            errorDiv.textContent = message;
        } else {
            const error = document.createElement('div');
            error.className = 'field-error text-red-500 text-sm mt-1';
            error.textContent = message;
            field.parentNode.appendChild(error);
        }
    }

    // Clear field error
    clearFieldError(field) {
        field.classList.remove('border-red-500');
        const errorDiv = field.parentNode.querySelector('.field-error');
        if (errorDiv) {
            errorDiv.remove();
        }
    }

    // Check existing session
    async checkExistingSession() {
        if (!this.supabase) return;

        try {
            const { data: { session } } = await this.supabase.auth.getSession();
            if (session) {
                // User is already logged in, redirect to dashboard
                const returnUrl = new URLSearchParams(window.location.search).get('returnUrl') || '../dashboard.html';
                window.location.href = returnUrl;
            }
        } catch (error) {
            console.error('Session check error:', error);
        }
    }

    // Logout user
    async logout() {
        if (!this.supabase) return;

        try {
            const { error } = await this.supabase.auth.signOut();
            if (error) {
                console.error('Logout error:', error);
            }
        } catch (error) {
            console.error('Logout error:', error);
        }
    }

    // Get current user
    getCurrentUser() {
        const userStr = localStorage.getItem('mental_health_user');
        return userStr ? JSON.parse(userStr) : null;
    }

    // Check if user is authenticated
    isAuthenticated() {
        return !!this.getCurrentUser();
    }

    // Utility functions
    isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    togglePasswordVisibility(fieldId) {
        const field = document.getElementById(fieldId);
        const button = document.getElementById('toggle-password');
        
        if (field.type === 'password') {
            field.type = 'text';
            button.textContent = '🙈';
        } else {
            field.type = 'password';
            button.textContent = '👁️';
        }
    }

    setLoading(type, isLoading) {
        const btn = document.getElementById(`${type}-btn`);
        const btnText = document.getElementById(`${type}-btn-text`);
        const loader = document.getElementById(`${type}-loader`);
        
        if (btn) btn.disabled = isLoading;
        if (btnText) btnText.style.display = isLoading ? 'none' : 'inline';
        if (loader) loader.style.display = isLoading ? 'inline-block' : 'none';
    }

    showError(message) {
        const errorDiv = document.getElementById('error-message');
        const errorText = document.getElementById('error-text');
        
        if (errorDiv && errorText) {
            errorText.textContent = message;
            errorDiv.classList.remove('hidden');
            
            // Hide success message if shown
            const successDiv = document.getElementById('success-message');
            if (successDiv) {
                successDiv.classList.add('hidden');
            }
            
            // Auto-hide after 5 seconds
            setTimeout(() => {
                errorDiv.classList.add('hidden');
            }, 5000);
        }
    }

    showSuccess(message) {
        const successDiv = document.getElementById('success-message');
        const successText = document.getElementById('success-text');
        
        if (successDiv && successText) {
            successText.textContent = message;
            successDiv.classList.remove('hidden');
            
            // Hide error message if shown
            const errorDiv = document.getElementById('error-message');
            if (errorDiv) {
                errorDiv.classList.add('hidden');
            }
            
            // Auto-hide after 3 seconds
            setTimeout(() => {
                successDiv.classList.add('hidden');
            }, 3000);
        }
    }

    getErrorMessage(error) {
        const errorMessages = {
            'Invalid login credentials': 'ভুল ইমেইল বা পাসওয়ার্ড।',
            'Email not confirmed': 'আপনার ইমেইল নিশ্চিত করুন।',
            'User already registered': 'এই ইমেইল ইতিমধ্যে নিবন্ধিত।',
            'Password should be at least 6 characters': 'পাসওয়ার্ড কমপক্ষে ৬ অক্ষরের হতে হবে।',
            'Invalid email': 'সঠিক ইমেইল ঠিকানা দিন।',
            'Network error': 'ইন্টারনেট সংযোগ চেক করুন।'
        };
        
        return errorMessages[error.message] || error.message || 'একটি সমস্যা হয়েছে। আবার চেষ্টা করুন।';
    }
}

// Initialize AuthManager globally
window.AuthManager = new AuthManager();

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AuthManager;
}
