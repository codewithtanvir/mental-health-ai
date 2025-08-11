// Mental Health AI - Main JavaScript
class MentalHealthApp {
    constructor() {
        this.API_KEY = null;
        this.API_URL = '';
        this.chatHistory = [];
        this.isLoading = false;
        this.currentUser = null;
        this.supabase = null;
        
        // Initialize async
        this.initializeAsync();
    }

    // Async initialization
    async initializeAsync() {
        try {
            // Initialize config manager first
            await window.configManager.initialize();
            
            // Get API key asynchronously
            this.API_KEY = await this.getAPIKey();
            if (this.API_KEY) {
                this.API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-05-20:generateContent?key=${this.API_KEY}`;
            }
        } catch (error) {
            console.error('Failed to get API key:', error);
        }
        
        // Continue with regular initialization
        this.initializeSupabase();
        this.initializeElements();
        this.bindEvents();
        this.initializeApp();
    }

    // Initialize Supabase client
    initializeSupabase() {
        try {
            // Use actual Supabase credentials
            const SUPABASE_URL = 'https://brecotrpmeiwktcffdws.supabase.co';
            const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJyZWNvdHJwbWVpd2t0Y2ZmZHdzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ4NzM1MzcsImV4cCI6MjA3MDQ0OTUzN30.eixsq-rJ5JGDihhA1DVKPaXnycFnNRoUvER0HMnlnqI';
            
            if (typeof window.supabase !== 'undefined') {
                this.supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
                this.checkAuthStatus();
                console.log('Supabase client initialized successfully');
            }
        } catch (error) {
            console.error('Failed to initialize Supabase:', error);
        }
    }

    // Check if user is authenticated
    async checkAuthStatus() {
        if (!this.supabase) return;

        try {
            const { data: { user } } = await this.supabase.auth.getUser();
            this.currentUser = user;
            this.updateChatInterface();
            
            // Listen for auth state changes
            this.supabase.auth.onAuthStateChange((event, session) => {
                this.currentUser = session?.user || null;
                this.updateChatInterface();
            });
        } catch (error) {
            console.error('Auth check error:', error);
        }
    }

    // Update chat interface based on authentication status
    updateChatInterface() {
        const loginRequired = document.getElementById('chat-login-required');
        const chatInterface = document.getElementById('chat-interface');
        const chatQuickAccess = document.getElementById('chat-quick-access');
        const userNameEl = document.getElementById('user-name');

        if (this.currentUser) {
            // User is logged in - show quick access to chat page
            if (loginRequired) loginRequired.classList.add('hidden');
            if (chatQuickAccess) chatQuickAccess.classList.remove('hidden');
            if (chatInterface) chatInterface.classList.add('hidden'); // Hide embedded chat
            
            // Display user name
            if (userNameEl) {
                const userName = this.currentUser.user_metadata?.full_name || 
                                this.currentUser.email?.split('@')[0] || 'ব্যবহারকারী';
                userNameEl.textContent = userName;
            }
            
        } else {
            // User is not logged in - show login prompt
            if (loginRequired) loginRequired.classList.remove('hidden');
            if (chatQuickAccess) chatQuickAccess.classList.add('hidden');
            if (chatInterface) chatInterface.classList.add('hidden');
        }
    }

    // Get API key from configuration manager
    async getAPIKey() {
        try {
            return await window.configManager.getAPIKey();
        } catch (error) {
            console.error('Failed to get API key:', error);
            return '';
        }
    }

    // Initialize DOM elements
    initializeElements() {
        this.chatDisplay = document.getElementById('chat-display');
        this.chatInput = document.getElementById('chat-input');
        this.sendBtn = document.getElementById('send-btn');
        this.sendBtnText = document.getElementById('send-btn-text');
        this.chatLoader = document.getElementById('chat-loader');
        this.header = document.querySelector('header');
    }

    // Bind event listeners
    bindEvents() {
        // Chat functionality
        if (this.sendBtn) {
            this.sendBtn.addEventListener('click', () => this.handleSendMessage());
        }
        
        if (this.chatInput) {
            this.chatInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    this.handleSendMessage();
                }
            });
        }

        // Smooth scrolling for navigation links
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', (e) => {
                e.preventDefault();
                const target = document.querySelector(anchor.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });

        // Header scroll effect
        window.addEventListener('scroll', () => this.handleScroll());

        // Mobile menu toggle (if you add one later)
        this.setupMobileMenu();
    }

    // Initialize the application
    initializeApp() {
        this.displayWelcomeMessage();
        this.setupAccessibility();
        this.setupErrorHandling();
    }

    // Display welcome message in chat
    displayWelcomeMessage() {
        if (this.chatDisplay) {
            const welcomeMessage = "হ্যালো! আমি জেমিনি, আপনার মানসিক স্বাস্থ্য সহকারী। আজ আপনার কেমন লাগছে? আপনি নির্দ্বিধায় আপনার মনের কথা বলতে পারেন।";
            this.addMessage(welcomeMessage, 'ai');
        }
    }

    // Handle scroll events
    handleScroll() {
        if (this.header) {
            if (window.scrollY > 100) {
                this.header.classList.add('scrolled');
            } else {
                this.header.classList.remove('scrolled');
            }
        }
    }

    // Setup mobile menu functionality
    setupMobileMenu() {
        // This can be expanded when adding a mobile hamburger menu
        const mobileMenuToggle = document.getElementById('mobile-menu-toggle');
        const mobileMenu = document.getElementById('mobile-menu');
        
        if (mobileMenuToggle && mobileMenu) {
            mobileMenuToggle.addEventListener('click', () => {
                mobileMenu.classList.toggle('hidden');
            });
        }
    }

    // Setup accessibility features
    setupAccessibility() {
        // Add ARIA labels and roles where needed
        if (this.chatDisplay) {
            this.chatDisplay.setAttribute('role', 'log');
            this.chatDisplay.setAttribute('aria-live', 'polite');
            this.chatDisplay.setAttribute('aria-label', 'চ্যাট কথোপকথন');
        }

        if (this.chatInput) {
            this.chatInput.setAttribute('aria-label', 'আপনার বার্তা টাইপ করুন');
        }
    }

    // Setup global error handling
    setupErrorHandling() {
        window.addEventListener('error', (event) => {
            console.error('Global error:', event.error);
            this.showErrorMessage('একটি অপ্রত্যাশিত সমস্যা হয়েছে। পেজ রিফ্রেশ করে আবার চেষ্টা করুন।');
        });

        window.addEventListener('unhandledrejection', (event) => {
            console.error('Unhandled promise rejection:', event.reason);
            this.showErrorMessage('সংযোগে সমস্যা হয়েছে। আবার চেষ্টা করুন।');
        });
    }

    // Show error message to user
    showErrorMessage(message) {
        if (this.chatDisplay) {
            this.addMessage(message, 'ai');
        } else {
            // Fallback for errors outside chat
            const errorDiv = document.createElement('div');
            errorDiv.className = 'emergency-notice';
            errorDiv.innerHTML = `<p>${message}</p>`;
            document.body.prepend(errorDiv);
            
            setTimeout(() => {
                errorDiv.remove();
            }, 5000);
        }
    }

    // Show and hide loading states
    showLoader(loader, btnText) {
        if (loader) loader.classList.remove('hidden');
        if (btnText) btnText.classList.add('hidden');
    }

    hideLoader(loader, btnText) {
        if (loader) loader.classList.add('hidden');
        if (btnText) btnText.classList.remove('hidden');
    }

    // Add message to chat display
    addMessage(message, sender, isHTML = false) {
        if (!this.chatDisplay) return;

        const bubble = document.createElement('div');
        bubble.classList.add('chat-bubble', `chat-bubble-${sender}`);
        
        const text = document.createElement('p');
        text.classList.add('text-sm');
        
        if (isHTML) {
            text.innerHTML = message;
        } else {
            text.innerHTML = this.formatMessage(message);
        }
        
        bubble.appendChild(text);
        this.chatDisplay.appendChild(bubble);
        
        // Scroll to bottom
        this.chatDisplay.scrollTop = this.chatDisplay.scrollHeight;
        
        // Announce to screen readers
        this.announceMessage(message, sender);
    }

    // Format message text
    formatMessage(message) {
        return message
            .replace(/\n/g, '<br>')
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
            .replace(/\*(.*?)\*/g, '<em>$1</em>');
    }

    // Announce message for screen readers
    announceMessage(message, sender) {
        const announcement = sender === 'user' ? 'আপনি বলেছেন: ' : 'জেমিনি বলেছে: ';
        const ariaLive = document.createElement('div');
        ariaLive.setAttribute('aria-live', 'assertive');
        ariaLive.setAttribute('aria-atomic', 'true');
        ariaLive.className = 'sr-only';
        ariaLive.textContent = announcement + message;
        
        document.body.appendChild(ariaLive);
        setTimeout(() => {
            document.body.removeChild(ariaLive);
        }, 1000);
    }

    // Call Gemini API
    async callGeminiAPI(prompt, history = []) {
        // Ensure we have an API key
        if (!this.API_KEY) {
            this.API_KEY = await this.getAPIKey();
            if (this.API_KEY) {
                this.API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-05-20:generateContent?key=${this.API_KEY}`;
            }
        }
        
        if (!this.API_KEY || this.API_KEY.trim() === '') {
            throw new Error('API key not configured. Please add GEMINI_API_KEY to your .env file.');
        }

        const systemPrompt = `You are a friendly and empathetic mental health assistant for Bangladeshi people, especially students. Your name is Gemini (জেমিনি). You should:

1. Respond in Bengali language
2. Be supportive, empathetic, and understanding
3. Keep your answers concise but helpful (2-3 sentences usually)
4. Use simple, easy-to-understand language
5. Never provide medical advice or diagnosis
6. If someone seems in deep distress, gently suggest they talk to a professional
7. Be culturally sensitive to Bangladeshi context
8. Encourage positive coping mechanisms
9. If asked about serious mental health issues, refer to the resources section of the website

Current user message: ${prompt}`;

        const payload = {
            contents: [
                { role: "user", parts: [{ text: systemPrompt }] },
                ...history,
                { role: "user", parts: [{ text: prompt }] }
            ],
            generationConfig: {
                temperature: 0.8,
                topP: 0.9,
                topK: 40,
                maxOutputTokens: 1024,
            },
            safetySettings: [
                { category: 'HARM_CATEGORY_HARASSMENT', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
                { category: 'HARM_CATEGORY_HATE_SPEECH', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
                { category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
                { category: 'HARM_CATEGORY_DANGEROUS_CONTENT', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
            ],
        };

        try {
            const response = await fetch(this.API_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload)
            });

            if (!response.ok) {
                throw new Error(`API Error: ${response.status} ${response.statusText}`);
            }

            const data = await response.json();

            if (data.candidates && data.candidates.length > 0 && data.candidates[0].content.parts[0].text) {
                return data.candidates[0].content.parts[0].text;
            } else {
                throw new Error('Invalid response from API');
            }
        } catch (error) {
            console.error("Gemini API call failed:", error);
            
            // Return appropriate error message based on error type
            if (error.message.includes('API Key')) {
                return "দুঃখিত, এই মুহূর্তে এআই সেবা উপলব্ধ নেই। অনুগ্রহ করে পরে আবার চেষ্টা করুন।";
            } else if (error.message.includes('Network')) {
                return "ইন্টারনেট সংযোগ পরীক্ষা করে আবার চেষ্টা করুন।";
            } else {
                return "দুঃখিত, একটি সমস্যা হয়েছে। আবার চেষ্টা করুন।";
            }
        }
    }

    // Handle sending a message
    async handleSendMessage() {
        if (this.isLoading || !this.currentUser) return;

        const userMessage = this.chatInput.value.trim();
        if (!userMessage) return;

        // Validate message length
        if (userMessage.length > 1000) {
            this.showErrorMessage('বার্তা খুব বড়। অনুগ্রহ করে ছোট করে লিখুন।');
            return;
        }

        // Add user message to chat
        this.addMessage(userMessage, 'user');
        this.chatInput.value = '';
        
        // Set loading state
        this.isLoading = true;
        this.showLoader(this.chatLoader, this.sendBtnText);
        this.sendBtn.disabled = true;

        try {
            // Add to chat history
            this.chatHistory.push({ role: "user", parts: [{ text: userMessage }] });
            
            // Get AI response
            const aiMessage = await this.callGeminiAPI(userMessage, this.chatHistory);
            
            // Add AI message to chat
            this.addMessage(aiMessage, 'ai');
            
            // Add to chat history
            this.chatHistory.push({ role: "model", parts: [{ text: aiMessage }] });
            
            // Save to database
            await this.saveChatMessage(userMessage, aiMessage);
            
            // Limit chat history to last 10 exchanges to avoid token limits
            if (this.chatHistory.length > 20) {
                this.chatHistory = this.chatHistory.slice(-20);
            }
            
        } catch (error) {
            console.error('Error in handleSendMessage:', error);
            this.addMessage('দুঃখিত, একটি সমস্যা হয়েছে। অনুগ্রহ করে আবার চেষ্টা করুন।', 'ai');
        } finally {
            // Reset loading state
            this.isLoading = false;
            this.hideLoader(this.chatLoader, this.sendBtnText);
            this.sendBtn.disabled = false;
            this.chatInput.focus();
        }
    }

    // Save chat message to database
    async saveChatMessage(userMessage, aiResponse) {
        if (!this.supabase || !this.currentUser) return;

        try {
            const { error } = await this.supabase
                .from('chat_messages')
                .insert([
                    {
                        user_id: this.currentUser.id,
                        message: userMessage,
                        response: aiResponse,
                        session_id: this.generateSessionId(),
                        created_at: new Date().toISOString()
                    }
                ]);

            if (error) {
                console.error('Error saving chat message:', error);
            }
        } catch (error) {
            console.error('Database save error:', error);
        }
    }

    // Generate or get session ID
    generateSessionId() {
        if (!this.sessionId) {
            this.sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        }
        return this.sessionId;
    }

    // Logout functionality
    async logout() {
        if (!this.supabase) return;

        try {
            const { error } = await this.supabase.auth.signOut();
            if (error) {
                console.error('Logout error:', error);
            } else {
                this.currentUser = null;
                this.sessionId = null;
                this.chatHistory = [];
                this.updateChatInterface(false);
                
                // Clear chat messages
                const chatMessages = document.getElementById('chat-messages');
                if (chatMessages) {
                    chatMessages.innerHTML = '';
                }
                
                // Show success message
                alert('সফলভাবে লগআউট হয়েছে');
            }
        } catch (error) {
            console.error('Logout error:', error);
        }
    }

    // Utility method to get current timestamp
    getCurrentTimestamp() {
        return new Date().toLocaleString('bn-BD', {
            timeZone: 'Asia/Dhaka',
            hour12: true
        });
    }

    // Method to clear chat history
    clearChatHistory() {
        this.chatHistory = [];
        if (this.chatDisplay) {
            this.chatDisplay.innerHTML = '';
            this.displayWelcomeMessage();
        }
    }

    // Method to export chat history
    exportChatHistory() {
        const chatData = {
            timestamp: this.getCurrentTimestamp(),
            messages: this.chatHistory
        };
        
        const dataStr = JSON.stringify(chatData, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        
        const url = URL.createObjectURL(dataBlob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `chat-history-${Date.now()}.json`;
        link.click();
        
        URL.revokeObjectURL(url);
    }

    // Method to reset API key (for troubleshooting)
    async resetAPIKey() {
        localStorage.removeItem('gemini_api_key');
        this.API_KEY = await this.getAPIKey();
        if (this.API_KEY) {
            this.API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-05-20:generateContent?key=${this.API_KEY}`;
        }
        return this.API_KEY;
    }
}

// Utility functions for the rest of the site
class Utils {
    // Smooth scroll to element
    static scrollToElement(selector, offset = 0) {
        const element = document.querySelector(selector);
        if (element) {
            const elementPosition = element.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - offset;

            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
        }
    }

    // Debounce function
    static debounce(func, wait, immediate) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                timeout = null;
                if (!immediate) func(...args);
            };
            const callNow = immediate && !timeout;
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
            if (callNow) func(...args);
        };
    }

    // Throttle function
    static throttle(func, limit) {
        let lastFunc;
        let lastRan;
        return function (...args) {
            if (!lastRan) {
                func(...args);
                lastRan = Date.now();
            } else {
                clearTimeout(lastFunc);
                lastFunc = setTimeout(() => {
                    if ((Date.now() - lastRan) >= limit) {
                        func(...args);
                        lastRan = Date.now();
                    }
                }, limit - (Date.now() - lastRan));
            }
        };
    }

    // Check if element is in viewport
    static isInViewport(element) {
        const rect = element.getBoundingClientRect();
        return (
            rect.top >= 0 &&
            rect.left >= 0 &&
            rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
            rect.right <= (window.innerWidth || document.documentElement.clientWidth)
        );
    }

    // Animate elements on scroll
    static animateOnScroll() {
        const elements = document.querySelectorAll('.animate-on-scroll');
        elements.forEach(element => {
            if (Utils.isInViewport(element)) {
                element.classList.add('animated');
            }
        });
    }
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Initialize main app
    const app = new MentalHealthApp();
    
    // Setup scroll animations
    const throttledAnimateOnScroll = Utils.throttle(Utils.animateOnScroll, 100);
    window.addEventListener('scroll', throttledAnimateOnScroll);
    
    // Initial animation check
    Utils.animateOnScroll();
    
    // Make app globally accessible for debugging
    window.mentalHealthApp = app;
});

// Global logout function for onclick handler
function logout() {
    if (window.mentalHealthApp) {
        window.mentalHealthApp.logout();
    }
}

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { MentalHealthApp, Utils };
}
