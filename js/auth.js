// Authentication Manager for Mental Health AI
// Handles all Supabase authentication operations with robust error handling

class AuthManager {
    constructor() {
        this.supabase = null;
        this.currentUser = null;
        this.retryCount = 0;
        this.maxRetries = 3;
        this.isInitialized = false;
        
        this.initializeWithRetry();
    }

    // Initialize with retry mechanism
    async initializeWithRetry() {
        while (this.retryCount < this.maxRetries && !this.isInitialized) {
            try {
                await this.initSupabase();
                this.setupAuthStateListener();
                this.isInitialized = true;
                console.log('✅ AuthManager initialized successfully');
                break;
            } catch (error) {
                this.retryCount++;
                console.error(`❌ AuthManager initialization attempt ${this.retryCount} failed:`, error);
                
                if (this.retryCount < this.maxRetries) {
                    console.log(`⏳ Retrying in ${this.retryCount * 1000}ms...`);
                    await new Promise(resolve => setTimeout(resolve, this.retryCount * 1000));
                } else {
                    console.error('💥 AuthManager initialization failed after all retries');
                    this.showError('সিস্টেম ইনিশিয়ালাইজেশন ব্যর্থ। পেজ রিফ্রেশ করুন।');
                }
            }
        }
    }

    // Initialize Supabase client with validation
    async initSupabase() {
        // Multiple fallback sources for configuration
        let config = null;
        
        try {
            // Try to load from config manager first
            if (window.configManager) {
                await window.configManager.initialize();
                config = window.configManager.getSupabaseConfig();
                console.log('📝 Config loaded from ConfigManager');
            }
        } catch (error) {
            console.warn('⚠️ ConfigManager failed, using fallback');
        }

        // Fallback configuration
        if (!config || !config.url || !config.anonKey) {
            config = {
                url: 'https://brecotrpmeiwktcffdws.supabase.co',
                anonKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJyZWNvdHJwbWVpd2t0Y2ZmZHdzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ4NzM1MzcsImV4cCI6MjA3MDQ0OTUzN30.eixsq-rJ5JGDihhA1DVKPaXnycFnNRoUvER0HMnlnqI'
            };
            console.log('📝 Using fallback configuration');
        }

        // Validate configuration
        if (!config.url || !config.anonKey) {
            throw new Error('Invalid Supabase configuration');
        }

        // Wait for Supabase to be available
        let supabaseLoadAttempts = 0;
        while (!window.supabase && supabaseLoadAttempts < 50) {
            await new Promise(resolve => setTimeout(resolve, 100));
            supabaseLoadAttempts++;
        }

        if (!window.supabase) {
            throw new Error('Supabase library not loaded');
        }

        // Initialize client
        this.supabase = window.supabase.createClient(config.url, config.anonKey);
        
        // Test connection
        const { error: testError } = await this.supabase.auth.getSession();
        if (testError && testError.message.includes('Invalid JWT')) {
            console.warn('⚠️ Invalid JWT in session, clearing...');
            await this.supabase.auth.signOut();
        }
        
        console.log('🔗 Supabase client initialized and tested');
    }

    // Get the appropriate base URL for redirects
    getBaseUrl() {
        // Check if we're in production (Vercel)
        if (window.location.hostname.includes('vercel.app')) {
            return window.location.origin;
        }
        // Check if we're on localhost
        if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
            return window.location.origin;
        }
        // Default fallback
        return window.location.origin;
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
    async handleAuthSuccess(user) {
        // Store user info in localStorage
        localStorage.setItem('mental_health_user', JSON.stringify({
            id: user.id,
            email: user.email,
            name: user.user_metadata?.full_name || user.email.split('@')[0],
            avatar: user.user_metadata?.avatar_url || null,
            loginTime: new Date().toISOString()
        }));

        // Check if user is admin and redirect accordingly
        const isAdmin = await this.checkAdminRole(user.id);
        const urlParams = new URLSearchParams(window.location.search);
        const redirect = urlParams.get('redirect');
        
        console.log('Admin check result:', isAdmin, 'for user:', user.id);
        
        let returnUrl;
        if (redirect === 'admin' && isAdmin) {
            returnUrl = '/admin/dashboard.html';
        } else if (isAdmin && !redirect) {
            returnUrl = '/admin/dashboard.html';
        } else {
            returnUrl = urlParams.get('returnUrl') || '/chat.html';
        }
        
        console.log('Redirecting to:', returnUrl);
        
        // Check if we're on an auth page
        if (window.location.pathname.includes('/auth/')) {
            // Use absolute path from root
            const baseUrl = window.location.origin;
            window.location.href = baseUrl + returnUrl;
        }
    }

    // Handle logout
    handleAuthLogout() {
        localStorage.removeItem('mental_health_user');
        
        // If on a protected page, redirect to login
        if (this.isProtectedPage()) {
            const baseUrl = window.location.origin;
            const currentPath = window.location.pathname;
            window.location.href = `${baseUrl}/auth/login.html?returnUrl=${encodeURIComponent(currentPath)}`;
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
            fullName: formData.get('fullName')?.trim(),
            email: formData.get('email')?.trim(),
            password: formData.get('password'),
            confirmPassword: formData.get('confirmPassword'),
            ageVerification: formData.get('ageVerification') === 'on',
            termsAgreement: formData.get('termsAgreement') === 'on'
        };

        console.log('Form data collected:', data);

        // Validate form data
        if (!this.validateSignupData(data)) {
            this.setLoading('signup', false);
            return;
        }

        // Additional validation
        if (!data.email || !data.password || !data.fullName) {
            this.showError('সকল ক্ষেত্র পূরণ করুন।');
            this.setLoading('signup', false);
            return;
        }

        this.setLoading('signup', true);
        console.log('Attempting signup with data:', { email: data.email, fullName: data.fullName });

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
                    },
                    emailRedirectTo: this.getBaseUrl() + '/auth/callback.html'
                }
            });

            console.log('Signup response:', authData, error);

            if (error) {
                throw error;
            }

            if (authData.user && !authData.session) {
                // User created but email confirmation required
                this.showSuccess('অ্যাকাউন্ট তৈরি সফল হয়েছে! আপনার ইমেইল চেক করে লিংকে ক্লিক করুন।');
            } else {
                // User created and logged in immediately
                this.showSuccess('অ্যাকাউন্ট তৈরি সফল হয়েছে! স্বাগতম!');
            }
            
            // Note: User profile is automatically created by database trigger

        } catch (error) {
            console.error('Signup error:', error);
            
            // More specific error handling
            if (error.message.includes('User already registered')) {
                this.showError('এই ইমেইল ইতিমধ্যে নিবন্ধিত। লগইন করার চেষ্টা করুন।');
            } else if (error.message.includes('Invalid email')) {
                this.showError('সঠিক ইমেইল ঠিকানা দিন।');
            } else if (error.message.includes('Password')) {
                this.showError('পাসওয়ার্ড কমপক্ষে ৬ অক্ষরের হতে হবে।');
            } else {
                this.showError(this.getErrorMessage(error));
            }
        } finally {
            this.setLoading('signup', false);
        }
    }

    // Handle user login
    async handleLogin(event) {
        event.preventDefault();
        
        console.log('🔐 Starting login process...');
        
        // Ensure auth manager is initialized
        if (!this.isInitialized || !this.supabase) {
            console.log('⏳ Auth manager not ready, attempting to initialize...');
            await this.initializeWithRetry();
            
            if (!this.isInitialized || !this.supabase) {
                this.showError('লগইন সিস্টেম প্রস্তুত নয়। পেজ রিফ্রেশ করুন।');
                return;
            }
        }

        const formData = new FormData(event.target);
        const email = formData.get('email')?.trim().toLowerCase();
        const password = formData.get('password');
        const rememberMe = formData.get('rememberMe');

        // Enhanced validation
        if (!email || !password) {
            this.showError('ইমেইল এবং পাসওয়ার্ড প্রয়োজন।');
            return;
        }

        if (!this.isValidEmail(email)) {
            this.showError('সঠিক ইমেইল ঠিকানা প্রদান করুন।');
            return;
        }

        if (password.length < 6) {
            this.showError('পাসওয়ার্ড কমপক্ষে ৬ অক্ষরের হতে হবে।');
            return;
        }

        this.setLoading('login', true);

        try {
            console.log('🚀 Attempting login for:', email);

            // Enhanced login with retry mechanism
            let loginAttempt = 0;
            let loginSuccess = false;
            let lastError = null;

            while (loginAttempt < 3 && !loginSuccess) {
                try {
                    const { data, error } = await this.supabase.auth.signInWithPassword({
                        email: email,
                        password: password
                    });

                    if (error) {
                        throw error;
                    }

                    loginSuccess = true;
                    console.log('✅ Login successful');

                    // Handle remember me
                    if (rememberMe) {
                        localStorage.setItem('remember_me', 'true');
                        localStorage.setItem('remember_email', email);
                    } else {
                        localStorage.removeItem('remember_me');
                        localStorage.removeItem('remember_email');
                    }

                    this.showSuccess('সফলভাবে লগইন হয়েছে!');
                    
                    // User will be redirected by the auth state listener
                    // Add small delay to ensure state change is processed
                    setTimeout(() => {
                        if (window.location.pathname.includes('/auth/login')) {
                            // Fallback redirect if auth state listener doesn't work
                            console.log('🔄 Fallback redirect triggered');
                            window.location.href = '../chat.html';
                        }
                    }, 2000);

                } catch (attemptError) {
                    loginAttempt++;
                    lastError = attemptError;
                    
                    if (loginAttempt < 3) {
                        console.log(`⚠️ Login attempt ${loginAttempt} failed, retrying...`);
                        await new Promise(resolve => setTimeout(resolve, 1000));
                    }
                }
            }

            if (!loginSuccess) {
                throw lastError;
            }

        } catch (error) {
            console.error('❌ Login error:', error);
            
            // Enhanced error handling with specific messages
            let errorMessage = 'লগইন ব্যর্থ হয়েছে।';
            
            if (error.message.includes('Invalid login credentials')) {
                errorMessage = 'ভুল ইমেইল বা পাসওয়ার্ড। আবার চেষ্টা করুন।';
            } else if (error.message.includes('Email not confirmed')) {
                errorMessage = 'আপনার ইমেইল যাচাই করুন। ইমেইলে পাঠানো লিংকে ক্লিক করুন।';
            } else if (error.message.includes('Too many requests')) {
                errorMessage = 'অনেক চেষ্টা হয়েছে। ৫ মিনিট পর আবার চেষ্টা করুন।';
            } else if (error.message.includes('Network')) {
                errorMessage = 'নেটওয়ার্ক সমস্যা। ইন্টারনেট সংযোগ চেক করুন।';
            } else {
                errorMessage = this.getErrorMessage(error);
            }
            
            this.showError(errorMessage);
            
            // Clear password field on error
            const passwordField = document.querySelector('input[name="password"]');
            if (passwordField) {
                passwordField.value = '';
                passwordField.focus();
            }
            
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
                redirectTo: `${this.getBaseUrl()}/auth/reset-password.html`
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
                    redirectTo: `${this.getBaseUrl()}/auth/callback.html`
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
                        role: 'user',
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

    // Check if user has admin role
    async checkAdminRole(userId) {
        if (!this.supabase) {
            console.log('❌ Supabase not initialized');
            return false;
        }
        
        try {
            console.log('🔍 Checking admin role for user:', userId);
            
            const { data, error } = await this.supabase
                .from('user_profiles')
                .select('role')
                .eq('id', userId)
                .single();
            
            console.log('📊 Database query result:', { data, error });
            
            const isAdmin = !error && data?.role === 'admin';
            console.log('👤 User is admin:', isAdmin, '| Role:', data?.role);
            
            return isAdmin;
        } catch (error) {
            console.error('❌ Error checking admin role:', error);
            return false;
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
                // User is already logged in, redirect to main page with chat
                const returnUrl = new URLSearchParams(window.location.search).get('returnUrl') || '../chat.html';
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
            'Email not confirmed': 'আপনার ইমেইল নিশ্চিত করুন। ইমেইলে পাঠানো লিংকে ক্লিক করুন।',
            'User already registered': 'এই ইমেইল ইতিমধ্যে নিবন্ধিত। লগইন করার চেষ্টা করুন।',
            'Password should be at least 6 characters': 'পাসওয়ার্ড কমপক্ষে ৬ অক্ষরের হতে হবে।',
            'Invalid email': 'সঠিক ইমেইল ঠিকানা দিন।',
            'Network error': 'ইন্টারনেট সংযোগ চেক করুন।',
            'Signup is disabled': 'নতুন নিবন্ধন বর্তমানে বন্ধ আছে।',
            'Email rate limit exceeded': 'অনেক চেষ্টা হয়েছে। ৫ মিনিট পর আবার চেষ্টা করুন।',
            'Invalid email format': 'সঠিক ইমেইল ঠিকানা দিন।',
            'Too many requests': 'অনেক চেষ্টা হয়েছে। কিছুক্ষণ পর আবার চেষ্টা করুন।',
            'timeout': 'সংযোগে বিলম্ব হচ্ছে। আবার চেষ্টা করুন।',
            'offline': 'ইন্টারনেট সংযোগ নেই। সংযোগ চেক করুন।'
        };
        
        // Check for specific error patterns
        const message = error.message || '';
        
        // Network related errors
        if (message.includes('fetch') || message.includes('network') || message.includes('NetworkError')) {
            return 'ইন্টারনেট সংযোগে সমস্যা। সংযোগ চেক করুন।';
        }
        
        // Timeout errors
        if (message.includes('timeout') || message.includes('AbortError')) {
            return 'সংযোগে বিলম্ব হচ্ছে। আবার চেষ্টা করুন।';
        }
        
        // Rate limiting
        if (message.includes('rate limit') || message.includes('too many requests')) {
            return 'অনেক চেষ্টা হয়েছে। ৫ মিনিট পর আবার চেষ্টা করুন।';
        }
        
        // Authentication errors
        if (message.includes('already registered') || message.includes('already been registered')) {
            return 'এই ইমেইল ইতিমধ্যে নিবন্ধিত। লগইন করার চেষ্টা করুন।';
        }
        
        if (message.includes('Invalid login credentials') || message.includes('invalid credentials')) {
            return 'ভুল ইমেইল বা পাসওয়ার্ড। আবার চেষ্টা করুন।';
        }
        
        if (message.includes('Email not confirmed') || message.includes('not confirmed')) {
            return 'আপনার ইমেইল যাচাই করুন। ইমেইলে পাঠানো লিংকে ক্লিক করুন।';
        }
        
        // Email format errors
        if (message.includes('Invalid email') || message.includes('invalid email format')) {
            return 'সঠিক ইমেইল ঠিকানা দিন।';
        }
        
        // Password errors
        if (message.includes('Password') && message.includes('6')) {
            return 'পাসওয়ার্ড কমপক্ষে ৬ অক্ষরের হতে হবে।';
        }
        
        // Database/Server errors
        if (message.includes('500') || message.includes('server error')) {
            return 'সার্ভারে সমস্যা। কিছুক্ষণ পর আবার চেষ্টা করুন।';
        }
        
        // Fallback to mapped message or generic error
        return errorMessages[message] || message || 'একটি সমস্যা হয়েছে। আবার চেষ্টা করুন।';
    }
}

// Initialize AuthManager globally
window.AuthManager = new AuthManager();

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AuthManager;
}
