// Dashboard Manager for Mental Health AI
// Handles dashboard functionality and user data management

class DashboardManager {
    constructor() {
        this.user = null;
        this.selectedMood = null;
        this.quotes = [
            { text: "প্রতিটি নতুন দিন একটি নতুন সুযোগ।", author: "অজানা" },
            { text: "আপনার মানসিক স্বাস্থ্য আপনার সবচেয়ে বড় সম্পদ।", author: "অজানা" },
            { text: "ছোট ছোট পদক্ষেপেই বড় পরিবর্তন আসে।", author: "লাও জু" },
            { text: "নিজের প্রতি দয়ালু হওয়া সাহসিকতার কাজ।", author: "ব্রেনে ব্রাউন" },
            { text: "আজকের কষ্ট আগামীর শক্তি।", author: "অজানা" },
            { text: "মন শান্ত রাখলে সমাধান সহজ হয়।", author: "বুদ্ধ" },
            { text: "প্রতিদিন নিজের জন্য কিছু সময় রাখুন।", author: "অজানা" }
        ];
    }

    // Initialize dashboard
    init() {
        this.loadUserData();
        this.setupEventListeners();
        this.loadDashboardData();
        this.displayDailyQuote();
        this.setupUserMenu();
        this.loadMoodData();
    }

    // Load current user data
    loadUserData() {
        if (window.AuthManager) {
            this.user = window.AuthManager.getCurrentUser();
            if (this.user) {
                this.displayUserInfo();
            }
        }
    }

    // Display user information
    displayUserInfo() {
        const userNameElement = document.getElementById('user-name');
        const welcomeNameElement = document.getElementById('welcome-name');
        const userAvatarElement = document.getElementById('user-avatar');

        if (userNameElement) {
            userNameElement.textContent = this.user.name;
        }

        if (welcomeNameElement) {
            welcomeNameElement.textContent = this.user.name;
        }

        if (userAvatarElement) {
            if (this.user.avatar) {
                userAvatarElement.src = this.user.avatar;
            } else {
                userAvatarElement.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(this.user.name)}&background=0d9488&color=fff`;
            }
        }
    }

    // Setup event listeners
    setupEventListeners() {
        // Mood buttons
        const moodButtons = document.querySelectorAll('.mood-btn');
        moodButtons.forEach(btn => {
            btn.addEventListener('click', (e) => this.selectMood(e.target.dataset.mood));
        });

        // Save mood button
        const saveMoodBtn = document.getElementById('save-mood');
        if (saveMoodBtn) {
            saveMoodBtn.addEventListener('click', () => this.saveMood());
        }

        // Logout button
        const logoutBtn = document.getElementById('logout-btn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', () => this.handleLogout());
        }
    }

    // Setup user menu
    setupUserMenu() {
        const userMenuButton = document.getElementById('user-menu-button');
        const userMenu = document.getElementById('user-menu');

        if (userMenuButton && userMenu) {
            userMenuButton.addEventListener('click', (e) => {
                e.stopPropagation();
                userMenu.classList.toggle('hidden');
            });

            // Close menu when clicking outside
            document.addEventListener('click', (e) => {
                if (!userMenuButton.contains(e.target) && !userMenu.contains(e.target)) {
                    userMenu.classList.add('hidden');
                }
            });
        }
    }

    // Load dashboard data
    async loadDashboardData() {
        try {
            // Load stats from localStorage for now
            // In a real app, this would come from Supabase
            const stats = this.loadUserStats();
            this.displayStats(stats);
            
            // Load recent chats
            this.loadRecentChats();
            
        } catch (error) {
            console.error('Error loading dashboard data:', error);
        }
    }

    // Load user statistics
    loadUserStats() {
        const defaultStats = {
            totalChats: 0,
            activeDays: 0,
            goalsAchieved: 0,
            articlesRead: 0
        };

        const savedStats = localStorage.getItem(`mental_health_stats_${this.user?.id}`);
        if (savedStats) {
            return { ...defaultStats, ...JSON.parse(savedStats) };
        }

        return defaultStats;
    }

    // Display statistics
    displayStats(stats) {
        const elements = {
            'total-chats': stats.totalChats,
            'active-days': stats.activeDays,
            'goals-achieved': stats.goalsAchieved,
            'articles-read': stats.articlesRead
        };

        Object.entries(elements).forEach(([id, value]) => {
            const element = document.getElementById(id);
            if (element) {
                this.animateNumber(element, 0, value, 1000);
            }
        });
    }

    // Animate number counting
    animateNumber(element, start, end, duration) {
        const range = end - start;
        const minTimer = 50;
        const stepTime = Math.abs(Math.floor(duration / range));
        const timer = Math.max(stepTime, minTimer);

        let current = start;
        const increment = end > start ? 1 : -1;

        const obj = setInterval(() => {
            current += increment;
            element.textContent = current;

            if (current === end) {
                clearInterval(obj);
            }
        }, timer);
    }

    // Load recent chats
    loadRecentChats() {
        const recentChatsContainer = document.getElementById('recent-chats');
        if (!recentChatsContainer) return;

        // Load from localStorage for now
        const chatHistory = localStorage.getItem(`mental_health_chats_${this.user?.id}`);
        
        if (chatHistory) {
            const chats = JSON.parse(chatHistory);
            const recentChats = chats.slice(-3).reverse(); // Get last 3 chats

            if (recentChats.length > 0) {
                recentChatsContainer.innerHTML = recentChats.map(chat => `
                    <div class="border-l-4 border-teal-500 pl-4 py-2">
                        <p class="text-sm text-gray-800">${this.truncateText(chat.message, 60)}</p>
                        <p class="text-xs text-gray-500">${this.formatDate(chat.timestamp)}</p>
                    </div>
                `).join('');
            }
        }
    }

    // Select mood
    selectMood(mood) {
        this.selectedMood = mood;
        
        // Update UI
        document.querySelectorAll('.mood-btn').forEach(btn => {
            btn.classList.remove('bg-teal-100', 'border-teal-500');
        });
        
        const selectedBtn = document.querySelector(`[data-mood="${mood}"]`);
        if (selectedBtn) {
            selectedBtn.classList.add('bg-teal-100', 'border-2', 'border-teal-500');
        }

        // Update today's mood display
        const todayMoodElement = document.getElementById('today-mood');
        if (todayMoodElement) {
            todayMoodElement.textContent = mood;
        }

        // Enable save button
        const saveMoodBtn = document.getElementById('save-mood');
        if (saveMoodBtn) {
            saveMoodBtn.disabled = false;
            saveMoodBtn.classList.remove('opacity-50', 'cursor-not-allowed');
        }
    }

    // Save mood
    async saveMood() {
        if (!this.selectedMood || !this.user) return;

        try {
            const today = new Date().toISOString().split('T')[0];
            const moodData = {
                date: today,
                mood: this.selectedMood,
                timestamp: new Date().toISOString()
            };

            // Save to localStorage for now
            const moodHistory = this.loadMoodHistory();
            moodHistory[today] = moodData;
            localStorage.setItem(`mental_health_moods_${this.user.id}`, JSON.stringify(moodHistory));

            // Show success message
            this.showNotification('মেজাজ সফলভাবে সেভ হয়েছে!', 'success');

            // Disable save button
            const saveMoodBtn = document.getElementById('save-mood');
            if (saveMoodBtn) {
                saveMoodBtn.disabled = true;
                saveMoodBtn.classList.add('opacity-50', 'cursor-not-allowed');
                saveMoodBtn.textContent = 'সেভ হয়েছে';
            }

            // Update stats
            this.updateStats('moodsSaved', 1);

        } catch (error) {
            console.error('Error saving mood:', error);
            this.showNotification('মেজাজ সেভ করতে সমস্যা হয়েছে।', 'error');
        }
    }

    // Load mood data
    loadMoodData() {
        const today = new Date().toISOString().split('T')[0];
        const moodHistory = this.loadMoodHistory();
        
        if (moodHistory[today]) {
            const todayMood = moodHistory[today].mood;
            this.selectMood(todayMood);
            
            // Disable save button since mood is already saved
            const saveMoodBtn = document.getElementById('save-mood');
            if (saveMoodBtn) {
                saveMoodBtn.disabled = true;
                saveMoodBtn.classList.add('opacity-50', 'cursor-not-allowed');
                saveMoodBtn.textContent = 'আজকে সেভ হয়েছে';
            }
        }
    }

    // Load mood history
    loadMoodHistory() {
        if (!this.user) return {};
        
        const moodHistory = localStorage.getItem(`mental_health_moods_${this.user.id}`);
        return moodHistory ? JSON.parse(moodHistory) : {};
    }

    // Display daily quote
    displayDailyQuote() {
        const today = new Date().toISOString().split('T')[0];
        const quoteIndex = this.hashCode(today) % this.quotes.length;
        const todayQuote = this.quotes[Math.abs(quoteIndex)];

        const quoteElement = document.getElementById('daily-quote');
        const authorElement = document.getElementById('quote-author');

        if (quoteElement) {
            quoteElement.textContent = `"${todayQuote.text}"`;
        }

        if (authorElement) {
            authorElement.textContent = `- ${todayQuote.author}`;
        }
    }

    // Update user statistics
    updateStats(statType, increment = 1) {
        if (!this.user) return;

        const stats = this.loadUserStats();
        
        switch (statType) {
            case 'chatsCompleted':
                stats.totalChats += increment;
                break;
            case 'activeDays':
                // Check if this is the first activity today
                const today = new Date().toISOString().split('T')[0];
                const lastActiveDate = localStorage.getItem(`mental_health_last_active_${this.user.id}`);
                
                if (lastActiveDate !== today) {
                    stats.activeDays += increment;
                    localStorage.setItem(`mental_health_last_active_${this.user.id}`, today);
                }
                break;
            case 'goalsAchieved':
                stats.goalsAchieved += increment;
                break;
            case 'articlesRead':
                stats.articlesRead += increment;
                break;
        }

        // Save updated stats
        localStorage.setItem(`mental_health_stats_${this.user.id}`, JSON.stringify(stats));
        
        // Update display
        this.displayStats(stats);
    }

    // Handle logout
    async handleLogout() {
        if (confirm('আপনি কি লগআউট করতে চান?')) {
            if (window.AuthManager) {
                await window.AuthManager.logout();
            }
            window.location.href = 'auth/login.html';
        }
    }

    // Utility functions
    hashCode(str) {
        let hash = 0;
        for (let i = 0; i < str.length; i++) {
            const char = str.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash; // Convert to 32-bit integer
        }
        return hash;
    }

    truncateText(text, maxLength) {
        if (text.length <= maxLength) return text;
        return text.substring(0, maxLength) + '...';
    }

    formatDate(isoString) {
        const date = new Date(isoString);
        const now = new Date();
        const diffTime = Math.abs(now - date);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays === 0) {
            return 'আজ';
        } else if (diffDays === 1) {
            return 'গতকাল';
        } else if (diffDays < 7) {
            return `${diffDays} দিন আগে`;
        } else {
            return date.toLocaleDateString('bn-BD');
        }
    }

    showNotification(message, type = 'info') {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg max-w-sm transition-all duration-300 transform translate-x-full`;
        
        // Set colors based on type
        const colors = {
            success: 'bg-green-100 border border-green-200 text-green-700',
            error: 'bg-red-100 border border-red-200 text-red-700',
            info: 'bg-blue-100 border border-blue-200 text-blue-700',
            warning: 'bg-yellow-100 border border-yellow-200 text-yellow-700'
        };
        
        notification.className += ` ${colors[type] || colors.info}`;
        
        // Set content
        notification.innerHTML = `
            <div class="flex items-center">
                <span class="mr-2">${type === 'success' ? '✅' : type === 'error' ? '❌' : 'ℹ️'}</span>
                <span>${message}</span>
                <button class="ml-4 text-gray-500 hover:text-gray-700" onclick="this.parentElement.parentElement.remove()">×</button>
            </div>
        `;
        
        // Add to DOM
        document.body.appendChild(notification);
        
        // Animate in
        setTimeout(() => {
            notification.classList.remove('translate-x-full');
        }, 100);
        
        // Auto remove after 5 seconds
        setTimeout(() => {
            notification.classList.add('translate-x-full');
            setTimeout(() => {
                if (notification.parentElement) {
                    notification.remove();
                }
            }, 300);
        }, 5000);
    }

    // Get user activity summary
    getActivitySummary() {
        if (!this.user) return null;

        const stats = this.loadUserStats();
        const moodHistory = this.loadMoodHistory();
        const moodEntries = Object.keys(moodHistory).length;

        return {
            totalChats: stats.totalChats,
            activeDays: stats.activeDays,
            moodEntries: moodEntries,
            joinDate: this.user.loginTime || new Date().toISOString(),
            lastActivity: new Date().toISOString()
        };
    }

    // Export user data (for privacy/GDPR compliance)
    exportUserData() {
        if (!this.user) return null;

        const userData = {
            profile: this.user,
            stats: this.loadUserStats(),
            moodHistory: this.loadMoodHistory(),
            exportDate: new Date().toISOString()
        };

        // Create downloadable file
        const dataStr = JSON.stringify(userData, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        
        const url = URL.createObjectURL(dataBlob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `mental-health-data-${this.user.id}-${Date.now()}.json`;
        link.click();
        
        URL.revokeObjectURL(url);
        
        this.showNotification('আপনার ডেটা ডাউনলোড হচ্ছে।', 'success');
    }
}

// Initialize Dashboard Manager globally
window.DashboardManager = new DashboardManager();

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = DashboardManager;
}
