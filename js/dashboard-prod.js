// Dashboard Manager for Mental Health AI - Production Ready
// Handles core dashboard functionality with working features only

class DashboardManager {
  constructor() {
    this.user = null;
    this.selectedMood = null;
    this.supabase = null;
    this.quotes = [
      { text: "প্রতিটি নতুন দিন একটি নতুন সুযোগ।", author: "অজানা" },
      {
        text: "আপনার মানসিক স্বাস্থ্য আপনার সবচেয়ে বড় সম্পদ।",
        author: "অজানা",
      },
      { text: "ছোট ছোট পদক্ষেপেই বড় পরিবর্তন আসে।", author: "লাও জু" },
      {
        text: "নিজের প্রতি দয়ালু হওয়া সাহসিকতার কাজ।",
        author: "ব্রেনে ব্রাউন",
      },
      { text: "আজকের কষ্ট আগামীর শক্তি।", author: "অজানা" },
      { text: "মন শান্ত রাখলে সমাধান সহজ হয়।", author: "বুদ্ধ" },
      { text: "প্রতিদিন নিজের জন্য কিছু সময় রাখুন।", author: "অজানা" },
      { text: "সুখ খুঁজে পাওয়া যায় না, তা তৈরি করতে হয়।", author: "অজানা" },
      {
        text: "প্রতিটি সমস্যার মধ্যে একটি সুযোগ লুকিয়ে আছে।",
        author: "অজানা",
      },
    ];

    this.initializeSupabase();
  }

  // Initialize Supabase client
  initializeSupabase() {
    try {
      const SUPABASE_URL = "https://brecotrpmeiwktcffdws.supabase.co";
      const SUPABASE_ANON_KEY =
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJyZWNvdHJwbWVpd2t0Y2ZmZHdzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ4NzM1MzcsImV4cCI6MjA3MDQ0OTUzN30.eixsq-rJ5JGDihhA1DVKPaXnycFnNRoUvER0HMnlnqI";

      if (typeof window.supabase !== "undefined") {
        this.supabase = window.supabase.createClient(
          SUPABASE_URL,
          SUPABASE_ANON_KEY
        );
      }
    } catch (error) {
      console.error("Failed to initialize Supabase:", error);
    }
  }

  // Initialize dashboard
  async init() {
    try {
      await this.loadUserData();
      this.setupEventListeners();
      await this.loadDashboardData();
      this.displayDailyQuote();
      this.setupUserMenu();
      await this.loadMoodData();
    } catch (error) {
      console.error("Dashboard initialization error:", error);
    }
  }

  // Load current user data from Supabase
  async loadUserData() {
    try {
      if (this.supabase && this.supabase.auth) {
        const {
          data: { user },
        } = await this.supabase.auth.getUser();
        if (user) {
          this.user = {
            id: user.id,
            email: user.email,
            name:
              user.user_metadata?.full_name ||
              user.email?.split("@")[0] ||
              "ব্যবহারকারী",
            created_at: user.created_at,
            last_sign_in_at: user.last_sign_in_at,
          };
          this.displayUserInfo();
        } else {
          console.warn("No user found, redirecting to login");
          // Redirect to login if no user found
          window.location.href = "/auth/login.html";
        }
      } else {
        console.error("Supabase client not properly initialized");
        // Try to reinitialize
        await this.initializeSupabase();
        // Retry once after reinitialization
        if (this.supabase && this.supabase.auth) {
          return this.loadUserData();
        } else {
          throw new Error("Failed to initialize Supabase client");
        }
      }
    } catch (error) {
      console.error("Error loading user data:", error);
      // Show user-friendly error message
      this.showNotification(
        "ব্যবহারকারীর তথ্য লোড করতে সমস্যা হয়েছে। পেজ রিফ্রেশ করুন।",
        "error"
      );
    }
  }

  // Display user information
  displayUserInfo() {
    if (!this.user) return;

    const elements = {
      "user-name": this.user.name,
      "welcome-name": this.user.name,
      "user-email": this.user.email,
      "menu-user-email": this.user.email,
    };

    Object.entries(elements).forEach(([id, value]) => {
      const element = document.getElementById(id);
      if (element && value) {
        element.textContent = value;
      }
    });

    // Update avatar
    const userAvatarElement = document.getElementById("user-avatar");
    if (userAvatarElement) {
      userAvatarElement.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(
        this.user.name
      )}&background=0d9488&color=fff`;
    }

    // Update join date
    if (this.user.created_at) {
      const joinDateElement = document.getElementById("join-date");
      if (joinDateElement) {
        try {
          const joinDate = new Date(this.user.created_at);
          joinDateElement.textContent = joinDate.toLocaleDateString("bn-BD", {
            year: "numeric",
            month: "long",
            day: "numeric",
          });
        } catch (error) {
          console.error("Error formatting join date:", error);
        }
      }
    }

    // Update last login
    if (this.user.last_sign_in_at) {
      const lastLoginElement = document.getElementById("last-login");
      if (lastLoginElement) {
        try {
          const lastLogin = new Date(this.user.last_sign_in_at);
          lastLoginElement.textContent = this.formatDate(
            lastLogin.toISOString()
          );
        } catch (error) {
          console.error("Error formatting last login:", error);
        }
      }
    }
  }

  // Setup event listeners
  setupEventListeners() {
    // Mood buttons
    const moodButtons = document.querySelectorAll(".mood-btn");
    moodButtons.forEach((btn) => {
      btn.addEventListener("click", (e) =>
        this.selectMood(e.target.dataset.mood)
      );
    });

    // Save mood button
    const saveMoodBtn = document.getElementById("save-mood");
    if (saveMoodBtn) {
      saveMoodBtn.addEventListener("click", () => this.saveMood());
    }

    // Logout button
    const logoutBtn = document.getElementById("logout-btn");
    if (logoutBtn) {
      logoutBtn.addEventListener("click", () => this.handleLogout());
    }
  }

  // Setup user menu
  setupUserMenu() {
    const userMenuButton = document.getElementById("user-menu-button");
    const userMenu = document.getElementById("user-menu");

    if (userMenuButton && userMenu) {
      userMenuButton.addEventListener("click", (e) => {
        e.stopPropagation();
        userMenu.classList.toggle("hidden");
      });

      // Close menu when clicking outside
      document.addEventListener("click", (e) => {
        if (
          !userMenuButton.contains(e.target) &&
          !userMenu.contains(e.target)
        ) {
          userMenu.classList.add("hidden");
        }
      });
    }
  }

  // Load dashboard data
  async loadDashboardData() {
    try {
      if (this.user && this.supabase) {
        // Load real stats from Supabase
        await this.loadRealStats();
      } else {
        // Fallback to localStorage
        const stats = this.loadLocalStats();
        this.displayStats(stats);
      }
    } catch (error) {
      console.error("Error loading dashboard data:", error);
      // Fallback to localStorage
      const stats = this.loadLocalStats();
      this.displayStats(stats);
    }
  }

  // Load real statistics from Supabase
  async loadRealStats() {
    try {
      // Get chat count
      const { count: chatCount } = await this.supabase
        .from("chat_messages")
        .select("*", { count: "exact", head: true })
        .eq("user_id", this.user.id);

      // Get active days (distinct dates from chat_messages)
      const { data: chatDates } = await this.supabase
        .from("chat_messages")
        .select("created_at")
        .eq("user_id", this.user.id);

      const uniqueDates = new Set();
      if (chatDates) {
        chatDates.forEach((record) => {
          const date = new Date(record.created_at).toDateString();
          uniqueDates.add(date);
        });
      }

      const stats = {
        totalChats: chatCount || 0,
        activeDays: uniqueDates.size,
      };

      this.displayStats(stats);
    } catch (error) {
      console.error("Error loading real stats:", error);
      // Fallback to localStorage
      const stats = this.loadLocalStats();
      this.displayStats(stats);
    }
  }

  // Load user statistics from localStorage (fallback)
  loadLocalStats() {
    const defaultStats = {
      totalChats: 0,
      activeDays: 0,
    };

    if (!this.user) return defaultStats;

    const savedStats = localStorage.getItem(
      `mental_health_stats_${this.user.id}`
    );
    if (savedStats) {
      return { ...defaultStats, ...JSON.parse(savedStats) };
    }

    return defaultStats;
  }

  // Display statistics
  displayStats(stats) {
    const elements = {
      "total-chats": stats.totalChats,
      "active-days": stats.activeDays,
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
    if (start === end) {
      element.textContent = end;
      return;
    }

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

  // Select mood
  selectMood(mood) {
    this.selectedMood = mood;

    // Update UI
    document.querySelectorAll(".mood-btn").forEach((btn) => {
      btn.classList.remove("bg-teal-100", "border-teal-500");
    });

    const selectedBtn = document.querySelector(`[data-mood="${mood}"]`);
    if (selectedBtn) {
      selectedBtn.classList.add("bg-teal-100", "border-2", "border-teal-500");
    }

    // Update today's mood display
    const todayMoodElement = document.getElementById("today-mood");
    if (todayMoodElement) {
      todayMoodElement.textContent = mood;
    }

    // Enable save button
    const saveMoodBtn = document.getElementById("save-mood");
    if (saveMoodBtn) {
      saveMoodBtn.disabled = false;
      saveMoodBtn.classList.remove("opacity-50", "cursor-not-allowed");
    }
  }

  // Save mood
  async saveMood() {
    if (!this.selectedMood || !this.user) return;

    try {
      const today = new Date().toISOString().split("T")[0];
      const moodData = {
        date: today,
        mood: this.selectedMood,
        timestamp: new Date().toISOString(),
      };

      // Try to save to Supabase if available
      if (this.supabase) {
        try {
          const { error } = await this.supabase.from("mood_entries").upsert([
            {
              user_id: this.user.id,
              date: today,
              mood: this.selectedMood,
              created_at: new Date().toISOString(),
            },
          ]);

          if (error) throw error;
        } catch (dbError) {
          console.error("Database save failed, using localStorage:", dbError);
          // Fallback to localStorage
          this.saveMoodToLocalStorage(moodData);
        }
      } else {
        // Fallback to localStorage
        this.saveMoodToLocalStorage(moodData);
      }

      // Show success message
      this.showNotification("মেজাজ সফলভাবে সেভ হয়েছে!", "success");

      // Disable save button
      const saveMoodBtn = document.getElementById("save-mood");
      if (saveMoodBtn) {
        saveMoodBtn.disabled = true;
        saveMoodBtn.classList.add("opacity-50", "cursor-not-allowed");
        saveMoodBtn.textContent = "সেভ হয়েছে";
      }
    } catch (error) {
      console.error("Error saving mood:", error);
      this.showNotification("মেজাজ সেভ করতে সমস্যা হয়েছে।", "error");
    }
  }

  // Save mood to localStorage
  saveMoodToLocalStorage(moodData) {
    const moodHistory = this.loadMoodHistory();
    moodHistory[moodData.date] = moodData;
    localStorage.setItem(
      `mental_health_moods_${this.user.id}`,
      JSON.stringify(moodHistory)
    );
  }

  // Load mood data
  async loadMoodData() {
    if (!this.user) return;

    const today = new Date().toISOString().split("T")[0];

    try {
      // Try to load from Supabase first
      if (this.supabase) {
        const { data, error } = await this.supabase
          .from("mood_entries")
          .select("mood")
          .eq("user_id", this.user.id)
          .eq("date", today)
          .single();

        if (!error && data) {
          this.selectMood(data.mood);
          this.disableMoodSave();
          return;
        }
      }
    } catch (error) {
      console.error("Error loading mood from database:", error);
    }

    // Fallback to localStorage
    const moodHistory = this.loadMoodHistory();
    if (moodHistory[today]) {
      const todayMood = moodHistory[today].mood;
      this.selectMood(todayMood);
      this.disableMoodSave();
    }
  }

  // Disable mood save button
  disableMoodSave() {
    const saveMoodBtn = document.getElementById("save-mood");
    if (saveMoodBtn) {
      saveMoodBtn.disabled = true;
      saveMoodBtn.classList.add("opacity-50", "cursor-not-allowed");
      saveMoodBtn.textContent = "আজকে সেভ হয়েছে";
    }
  }

  // Load mood history from localStorage
  loadMoodHistory() {
    if (!this.user) return {};

    const moodHistory = localStorage.getItem(
      `mental_health_moods_${this.user.id}`
    );
    return moodHistory ? JSON.parse(moodHistory) : {};
  }

  // Display daily quote
  displayDailyQuote() {
    const today = new Date().toISOString().split("T")[0];
    const quoteIndex = this.hashCode(today) % this.quotes.length;
    const todayQuote = this.quotes[Math.abs(quoteIndex)];

    const quoteElement = document.getElementById("daily-quote");
    const authorElement = document.getElementById("quote-author");

    if (quoteElement) {
      quoteElement.textContent = `"${todayQuote.text}"`;
    }

    if (authorElement) {
      authorElement.textContent = `- ${todayQuote.author}`;
    }
  }

  // Handle logout
  async handleLogout() {
    if (confirm("আপনি কি লগআউট করতে চান?")) {
      try {
        if (this.supabase) {
          await this.supabase.auth.signOut();
        }
        window.location.href = "auth/login.html";
      } catch (error) {
        console.error("Logout error:", error);
        window.location.href = "auth/login.html";
      }
    }
  }

  // Utility functions
  hashCode(str) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = (hash << 5) - hash + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return hash;
  }

  formatDate(isoString) {
    try {
      const date = new Date(isoString);

      // Check if date is valid
      if (isNaN(date.getTime())) {
        return "তারিখ অজানা";
      }

      const now = new Date();
      const diffTime = Math.abs(now - date);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      if (diffDays === 0) {
        return "আজ";
      } else if (diffDays === 1) {
        return "গতকাল";
      } else if (diffDays < 7) {
        return `${diffDays} দিন আগে`;
      } else {
        try {
          return date.toLocaleDateString("bn-BD");
        } catch (localeError) {
          // Fallback to ISO date string if locale formatting fails
          return date.toLocaleDateString();
        }
      }
    } catch (error) {
      console.error("Date formatting error:", error);
      return "তারিখ অজানা";
    }
  }

  showNotification(message, type = "info") {
    // Create notification element
    const notification = document.createElement("div");
    notification.className = `fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg max-w-sm transition-all duration-300 transform translate-x-full`;

    // Set colors based on type
    const colors = {
      success: "bg-green-100 border border-green-200 text-green-700",
      error: "bg-red-100 border border-red-200 text-red-700",
      info: "bg-blue-100 border border-blue-200 text-blue-700",
    };

    notification.className += ` ${colors[type] || colors.info}`;

    // Set content
    notification.innerHTML = `
            <div class="flex items-center">
                <span class="mr-2">${
                  type === "success" ? "✅" : type === "error" ? "❌" : "ℹ️"
                }</span>
                <span>${message}</span>
                <button class="ml-4 text-gray-500 hover:text-gray-700" onclick="this.parentElement.parentElement.remove()">×</button>
            </div>
        `;

    // Add to DOM
    document.body.appendChild(notification);

    // Animate in
    setTimeout(() => {
      notification.classList.remove("translate-x-full");
    }, 100);

    // Auto remove after 5 seconds
    setTimeout(() => {
      notification.classList.add("translate-x-full");
      setTimeout(() => {
        if (notification.parentElement) {
          notification.remove();
        }
      }, 300);
    }, 5000);
  }
}

// Initialize Dashboard Manager globally
window.DashboardManager = new DashboardManager();

// Export for module systems
if (typeof module !== "undefined" && module.exports) {
  module.exports = DashboardManager;
}
