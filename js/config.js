/**
 * Configuration Management for Mental Health AI
 * Handles environment variables and API keys
 */

class ConfigManager {
    constructor() {
        this.config = {};
        this.isInitialized = false;
    }

    /**
     * Initialize configuration
     * For frontend apps, we'll use a combination of:
     * 1. Build-time environment variables (if using build tools)
     * 2. Runtime configuration files
     * 3. User-provided API keys (stored in localStorage)
     */
    async initialize() {
        if (this.isInitialized) return this.config;

        try {
            // Try to load from config.json first (if exists)
            await this.loadFromConfigFile();
        } catch (error) {
            console.log('No config.json found, using environment variables');
        }

        // Load from environment variables (if available)
        this.loadFromEnvironment();

        // Load user-specific settings
        this.loadUserSettings();

        this.isInitialized = true;
        return this.config;
    }

    /**
     * Load configuration from config.json file
     */
    async loadFromConfigFile() {
        try {
            // First try to load from Vercel API endpoint
            let response = await fetch('/api/env');
            if (response.ok) {
                const envData = await response.json();
                this.config = { ...this.config, ...envData };
                console.log('✅ Loaded configuration from Vercel API');
                return;
            }
        } catch (error) {
            console.log('Vercel API not available, trying local sources...');
        }

        try {
            // Try to load from env.json (served by development server)
            let response = await fetch('./env.json');
            if (response.ok) {
                const envData = await response.json();
                this.config = { ...this.config, ...envData };
                console.log('✅ Loaded configuration from development server');
                return;
            }
        } catch (error) {
            // Development server not available, try config.json
        }

        try {
            // Fallback to static config.json
            const response = await fetch('./config.json');
            if (response.ok) {
                const configData = await response.json();
                this.config = { ...this.config, ...configData };
                console.log('✅ Loaded configuration from config.json');
            }
        } catch (error) {
            console.log('ℹ️ No configuration file available, using defaults');
        }
    }

    /**
     * Load from environment variables (for build-time injection)
     */
    loadFromEnvironment() {
        // These would be injected at build time by tools like Vite, Webpack, etc.
        const envConfig = {
            GEMINI_API_KEY: this.getEnvVar('GEMINI_API_KEY'),
            SUPABASE_URL: this.getEnvVar('SUPABASE_URL'),
            SUPABASE_ANON_KEY: this.getEnvVar('SUPABASE_ANON_KEY'),
            NODE_ENV: this.getEnvVar('NODE_ENV', 'development'),
            ENABLE_CHAT: this.getEnvVar('ENABLE_CHAT', 'true') === 'true',
            ENABLE_ANALYTICS: this.getEnvVar('ENABLE_ANALYTICS', 'false') === 'true'
        };

        // Only include defined values
        Object.keys(envConfig).forEach(key => {
            if (envConfig[key] !== undefined && envConfig[key] !== null) {
                this.config[key] = envConfig[key];
            }
        });
    }

    /**
     * Load user-specific settings from localStorage
     */
    loadUserSettings() {
        // User-provided API key takes precedence
        const userApiKey = localStorage.getItem('gemini_api_key');
        if (userApiKey) {
            this.config.GEMINI_API_KEY = userApiKey;
        }

        // Other user preferences
        const userPrefs = localStorage.getItem('user_preferences');
        if (userPrefs) {
            try {
                const prefs = JSON.parse(userPrefs);
                this.config.userPreferences = prefs;
            } catch (error) {
                console.error('Failed to parse user preferences:', error);
            }
        }
    }

    /**
     * Get environment variable (works with build-time injection)
     */
    getEnvVar(name, defaultValue = undefined) {
        // For Vite: import.meta.env.VITE_VARIABLE_NAME
        // For Webpack: process.env.VARIABLE_NAME
        // For direct access: window.ENV (if injected)
        
        if (typeof window !== 'undefined' && window.ENV && window.ENV[name]) {
            return window.ENV[name];
        }
        
        if (typeof process !== 'undefined' && process.env && process.env[name]) {
            return process.env[name];
        }
        
        // Check for Vite environment variables (import.meta.env)
        try {
            if (typeof window !== 'undefined' && window.import && window.import.meta && window.import.meta.env) {
                const viteVar = window.import.meta.env[`VITE_${name}`];
                if (viteVar) return viteVar;
            }
        } catch (e) {
            // import.meta not available
        }
        
        return defaultValue;
    }

    /**
     * Get API key with fallback to user input
     */
    async getAPIKey() {
        await this.initialize();

        let apiKey = this.config.GEMINI_API_KEY;

        // If no API key found and we're in development, don't prompt - just return empty
        if (!apiKey || apiKey.trim() === '') {
            console.warn('⚠️ No Gemini API key found in environment variables');
            console.log('💡 Please add GEMINI_API_KEY to your .env file');
            return '';
        }

        return apiKey;
    }

    /**
     * Prompt user for API key
     */
    async promptForAPIKey() {
        return new Promise((resolve) => {
            const modal = this.createAPIKeyModal();
            document.body.appendChild(modal);

            const form = modal.querySelector('#api-key-form');
            const input = modal.querySelector('#api-key-input');
            const closeBtn = modal.querySelector('#close-modal');

            form.addEventListener('submit', (e) => {
                e.preventDefault();
                const apiKey = input.value.trim();
                if (apiKey) {
                    localStorage.setItem('gemini_api_key', apiKey);
                    this.config.GEMINI_API_KEY = apiKey;
                    modal.remove();
                    resolve(apiKey);
                }
            });

            closeBtn.addEventListener('click', () => {
                modal.remove();
                resolve('');
            });

            // Focus on input
            setTimeout(() => input.focus(), 100);
        });
    }

    /**
     * Create API key input modal
     */
    createAPIKeyModal() {
        const modal = document.createElement('div');
        modal.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50';
        modal.innerHTML = `
            <div class="bg-white rounded-lg p-6 max-w-md w-full mx-4">
                <div class="flex justify-between items-center mb-4">
                    <h3 class="text-lg font-semibold text-gray-800">Gemini API Key প্রয়োজন</h3>
                    <button id="close-modal" class="text-gray-400 hover:text-gray-600">
                        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                        </svg>
                    </button>
                </div>
                
                <div class="mb-4">
                    <p class="text-sm text-gray-600 mb-3">
                        AI চ্যাটবট ব্যবহার করার জন্য Gemini API Key প্রয়োজন:
                    </p>
                    <ol class="text-sm text-gray-600 space-y-1 mb-4">
                        <li>1. <a href="https://aistudio.google.com/app/apikey" target="_blank" class="text-blue-600 underline">এই লিঙ্কে</a> যান</li>
                        <li>2. "Create API Key" বাটনে ক্লিক করুন</li>
                        <li>3. API Key কপি করুন</li>
                        <li>4. নিচে পেস্ট করুন</li>
                    </ol>
                </div>

                <form id="api-key-form">
                    <div class="mb-4">
                        <label for="api-key-input" class="block text-sm font-medium text-gray-700 mb-2">
                            API Key:
                        </label>
                        <input 
                            type="password" 
                            id="api-key-input" 
                            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="AIzaSy..."
                            required
                        >
                    </div>
                    
                    <div class="mb-4">
                        <div class="flex items-center">
                            <input type="checkbox" id="save-key" class="mr-2" checked>
                            <label for="save-key" class="text-sm text-gray-600">
                                API Key ব্রাউজারে সংরক্ষণ করুন (নিরাপদ)
                            </label>
                        </div>
                    </div>

                    <div class="flex space-x-3">
                        <button 
                            type="submit" 
                            class="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
                        >
                            সংরক্ষণ করুন
                        </button>
                        <button 
                            type="button" 
                            id="close-modal" 
                            class="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                        >
                            বাতিল
                        </button>
                    </div>
                </form>

                <div class="mt-4 text-xs text-gray-500">
                    <p>🔒 আপনার API Key শুধুমাত্র আপনার ব্রাউজারে সংরক্ষিত হবে এবং কোথাও পাঠানো হবে না।</p>
                </div>
            </div>
        `;
        return modal;
    }

    /**
     * Get configuration value
     */
    get(key, defaultValue = undefined) {
        return this.config[key] || defaultValue;
    }

    /**
     * Set configuration value
     */
    set(key, value) {
        this.config[key] = value;
    }

    /**
     * Reset API key (force user to re-enter)
     */
    resetAPIKey() {
        localStorage.removeItem('gemini_api_key');
        delete this.config.GEMINI_API_KEY;
        return this.getAPIKey();
    }

    /**
     * Check if API key is configured
     */
    hasAPIKey() {
        return !!(this.config.GEMINI_API_KEY && this.config.GEMINI_API_KEY.trim());
    }

    /**
     * Get Supabase configuration
     */
    getSupabaseConfig() {
        return {
            url: this.config.SUPABASE_URL || 'https://brecotrpmeiwktcffdws.supabase.co',
            anonKey: this.config.SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJyZWNvdHJwbWVpd2t0Y2ZmZHdzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ4NzM1MzcsImV4cCI6MjA3MDQ0OTUzN30.eixsq-rJ5JGDihhA1DVKPaXnycFnNRoUvER0HMnlnqI'
        };
    }
}

// Create global instance
window.configManager = new ConfigManager();

// Helper function for easier access
window.getConfig = (key, defaultValue) => window.configManager.get(key, defaultValue);
window.setConfig = (key, value) => window.configManager.set(key, value);
window.resetAPIKey = () => window.configManager.resetAPIKey();

// Load Supabase configuration function for admin login
window.loadSupabaseConfig = async () => {
    await window.configManager.initialize();
    const supabaseConfig = window.configManager.getSupabaseConfig();
    return {
        supabaseUrl: supabaseConfig.url,
        supabaseAnonKey: supabaseConfig.anonKey
    };
};
