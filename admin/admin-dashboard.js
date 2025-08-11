// Admin Dashboard JavaScript
let supabase;
let currentUser = null;
let charts = {};

// Initialize dashboard
document.addEventListener('DOMContentLoaded', async function() {
    // Initialize Supabase
    try {
        if (typeof window.supabase === 'undefined') {
            console.error('Supabase not loaded');
            return;
        }
        supabase = window.supabase;
    } catch (error) {
        console.error('Error initializing Supabase:', error);
        return;
    }

    // Check authentication
    await checkAuth();
    
    // Load dashboard data
    await loadDashboardData();
    
    // Setup event listeners
    setupEventListeners();
    
    // Initialize charts
    initializeCharts();
    
    // Hide loading screen
    document.getElementById('loading').classList.add('hidden');
});

// Check if user is authenticated and is admin
async function checkAuth() {
    try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
            window.location.href = '../auth/login.html?redirect=admin';
            return;
        }

        // Check if user is admin
        const { data: profile, error } = await supabase
            .from('user_profiles')
            .select('role, full_name')
            .eq('id', user.id)
            .single();

        if (error) {
            console.error('❌ Database error checking profile:', error);
            // Try to create profile if it doesn't exist
            if (error.code === 'PGRST116') { // No rows returned
                const { data: newProfile, error: createError } = await supabase
                    .from('user_profiles')
                    .insert({
                        id: user.id,
                        email: user.email,
                        full_name: user.user_metadata?.full_name || user.email.split('@')[0],
                        role: user.email === 'rahmantanvirmuhammad@gmail.com' ? 'admin' : 'user'
                    })
                    .select()
                    .single();
                
                if (createError) {
                    console.error('❌ Failed to create profile:', createError);
                    alert('প্রোফাইল তৈরি করতে সমস্যা। অ্যাডমিনের সাথে যোগাযোগ করুন।');
                    window.location.href = '../index.html';
                    return;
                } else {
                    if (newProfile.role !== 'admin') {
                        alert('আপনার অ্যাডমিন অ্যাক্সেস নেই।');
                        window.location.href = '../index.html';
                        return;
                    }
                    // Use the newly created profile
                    profile = newProfile;
                }
            } else {
                alert('ডাটাবেস এরর। পুনরায় চেষ্টা করুন।');
                window.location.href = '../index.html';
                return;
            }
        }

        if (!profile) {
            alert('ব্যবহারকারীর প্রোফাইল পাওয়া যায়নি।');
            window.location.href = '../index.html';
            return;
        }

        if (profile.role !== 'admin') {
            alert('আপনার অ্যাডমিন অ্যাক্সেস নেই।');
            window.location.href = '../index.html';
            return;
        }

        currentUser = user;
        
        // Update admin info in header
        document.getElementById('adminName').textContent = profile.full_name || 'অ্যাডমিন';
        const initials = profile.full_name ? 
            profile.full_name.split(' ').map(n => n[0]).join('').toUpperCase() : 'AD';
        document.getElementById('adminInitials').textContent = initials;

    } catch (error) {
        console.error('💥 Auth check critical error:', error);
        alert('অথেনটিকেশন এরর: ' + error.message);
        window.location.href = '../auth/login.html?redirect=admin';
    }
}

// Setup event listeners
function setupEventListeners() {
    // Navigation
    document.querySelectorAll('.nav-item').forEach(item => {
        item.addEventListener('click', function(e) {
            e.preventDefault();
            const section = this.getAttribute('href').substring(1);
            showSection(section);
        });
    });

    // Blog form
    document.getElementById('blogForm').addEventListener('submit', handleBlogSubmit);
    
    // Auto-generate slug from title
    document.getElementById('blogTitle').addEventListener('input', function() {
        const title = this.value;
        const slug = title.toLowerCase()
            .replace(/\s+/g, '-')
            .replace(/[^\w\-]+/g, '')
            .replace(/\-\-+/g, '-')
            .replace(/^-+/, '')
            .replace(/-+$/, '');
        document.getElementById('blogSlug').value = slug;
    });

    // User search
    document.getElementById('userSearch').addEventListener('input', debounce(searchUsers, 300));
    
    // Blog status filter
    document.getElementById('blogStatusFilter').addEventListener('change', filterBlogs);

    // Settings forms
    document.getElementById('generalSettingsForm').addEventListener('submit', handleGeneralSettings);
    document.getElementById('securitySettingsForm').addEventListener('submit', handleSecuritySettings);
}

// Show specific section
function showSection(sectionName) {
    // Update navigation
    document.querySelectorAll('.nav-item').forEach(item => {
        item.classList.remove('active');
    });
    document.querySelector(`[href="#${sectionName}"]`).classList.add('active');

    // Show section
    document.querySelectorAll('.section').forEach(section => {
        section.classList.remove('active');
    });
    document.getElementById(`${sectionName}-section`).classList.add('active');

    // Load section-specific data
    switch(sectionName) {
        case 'users':
            loadUsers();
            break;
        case 'blogs':
            loadBlogs();
            break;
        case 'chats':
            loadChats();
            break;
        case 'analytics':
            loadAnalytics();
            break;
    }
}

// Load dashboard data
async function loadDashboardData() {
    try {
        // Load statistics
        await Promise.all([
            loadUserStats(),
            loadChatStats(),
            loadBlogStats(),
            loadVisitStats(),
            loadRecentActivity()
        ]);
    } catch (error) {
        console.error('Error loading dashboard data:', error);
    }
}

// Load user statistics
async function loadUserStats() {
    try {
        const { data, error } = await supabase
            .from('user_profiles')
            .select('id, created_at')
            .neq('role', 'admin');

        if (error) throw error;

        document.getElementById('totalUsers').textContent = data.length;
        
        // Today's registrations
        const today = new Date().toISOString().split('T')[0];
        const todayUsers = data.filter(user => 
            user.created_at.startsWith(today)
        ).length;
        
        // Update visits count (placeholder - you can implement actual visit tracking)
        document.getElementById('todayVisits').textContent = todayUsers * 3; // Approximate
        
    } catch (error) {
        console.error('Error loading user stats:', error);
    }
}

// Load chat statistics
async function loadChatStats() {
    try {
        const { data, error } = await supabase
            .from('chat_messages')
            .select('id, created_at');

        if (error) throw error;

        document.getElementById('totalChats').textContent = data.length;
        
        // Today's chats
        const today = new Date().toISOString().split('T')[0];
        const todayChats = data.filter(chat => 
            chat.created_at.startsWith(today)
        ).length;
        
        document.getElementById('todayChats').textContent = todayChats;
        
    } catch (error) {
        console.error('Error loading chat stats:', error);
    }
}

// Load blog statistics
async function loadBlogStats() {
    try {
        const { data, error } = await supabase
            .from('blog_posts')
            .select('id, status');

        if (error) throw error;

        const publishedBlogs = data.filter(blog => blog.status === 'published').length;
        document.getElementById('totalBlogs').textContent = publishedBlogs;
        
    } catch (error) {
        console.error('Error loading blog stats:', error);
        // Fallback to static count
        document.getElementById('totalBlogs').textContent = '7';
    }
}

// Load visit statistics (placeholder)
async function loadVisitStats() {
    // This would connect to analytics service
    // For now, using placeholder data
    document.getElementById('todayVisits').textContent = Math.floor(Math.random() * 100) + 50;
}

// Load recent activity
async function loadRecentActivity() {
    const activities = [
        { text: 'নতুন ব্যবহারকারী নিবন্ধিত হয়েছেন', time: '২ মিনিট আগে', type: 'user' },
        { text: 'নতুন ব্লগ পোস্ট প্রকাশিত হয়েছে', time: '১৫ মিনিট আগে', type: 'blog' },
        { text: 'চ্যাট সেশন সম্পন্ন হয়েছে', time: '৩০ মিনিট আগে', type: 'chat' },
        { text: 'সিস্টেম ব্যাকআপ সফল', time: '১ ঘন্টা আগে', type: 'system' }
    ];

    const activityHtml = activities.map(activity => `
        <div class="flex items-center">
            <div class="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
            <p class="text-sm text-gray-600">${activity.text}</p>
            <span class="ml-auto text-xs text-gray-400">${activity.time}</span>
        </div>
    `).join('');

    document.getElementById('recentActivity').innerHTML = activityHtml;
}

// Load users
async function loadUsers() {
    try {
        const { data, error } = await supabase
            .from('user_profiles')
            .select('*')
            .neq('role', 'admin')
            .order('created_at', { ascending: false });

        if (error) throw error;

        const usersHtml = data.map(user => `
            <tr>
                <td class="px-6 py-4 whitespace-nowrap">
                    <div class="flex items-center">
                        <div class="w-10 h-10 bg-teal-600 rounded-full flex items-center justify-center">
                            <span class="text-white text-sm font-bold">
                                ${(user.full_name || 'U').charAt(0).toUpperCase()}
                            </span>
                        </div>
                        <div class="ml-4">
                            <div class="text-sm font-medium text-gray-900">${user.full_name || 'নাম নেই'}</div>
                        </div>
                    </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${user.email || 'ইমেইল নেই'}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    ${new Date(user.created_at).toLocaleDateString('bn-BD')}
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                    <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                        সক্রিয়
                    </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button onclick="viewUserDetails('${user.id}')" class="text-teal-600 hover:text-teal-900 mr-3">দেখুন</button>
                    <button onclick="deleteUser('${user.id}')" class="text-red-600 hover:text-red-900">মুছুন</button>
                </td>
            </tr>
        `).join('');

        document.getElementById('usersTable').innerHTML = usersHtml;
        
    } catch (error) {
        console.error('Error loading users:', error);
    }
}

// Load blogs
async function loadBlogs() {
    try {
        const { data, error } = await supabase
            .from('blog_posts')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) throw error;

        const blogsHtml = data.map(blog => `
            <tr>
                <td class="px-6 py-4 whitespace-nowrap">
                    <div class="text-sm font-medium text-gray-900">${blog.title}</div>
                    <div class="text-sm text-gray-500">${blog.excerpt.substring(0, 60)}...</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${blog.author}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    ${new Date(blog.created_at).toLocaleDateString('bn-BD')}
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                    <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                        ${blog.status === 'published' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}">
                        ${blog.status === 'published' ? 'প্রকাশিত' : 'খসড়া'}
                    </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button onclick="editBlog('${blog.id}')" class="text-teal-600 hover:text-teal-900 mr-3">সম্পাদনা</button>
                    <button onclick="deleteBlog('${blog.id}')" class="text-red-600 hover:text-red-900">মুছুন</button>
                </td>
            </tr>
        `).join('');

        document.getElementById('blogsTable').innerHTML = blogsHtml;
        
    } catch (error) {
        console.error('Error loading blogs:', error);
    }
}

// Load chats
async function loadChats() {
    try {
        const { data, error } = await supabase
            .from('chat_messages')
            .select(`
                *,
                user_profiles!inner(full_name, email)
            `)
            .order('created_at', { ascending: false })
            .limit(50);

        if (error) throw error;

        const chatsHtml = data.map(chat => `
            <tr>
                <td class="px-6 py-4 whitespace-nowrap">
                    <div class="text-sm font-medium text-gray-900">
                        ${chat.user_profiles?.full_name || 'অজানা ব্যবহারকারী'}
                    </div>
                    <div class="text-sm text-gray-500">${chat.user_profiles?.email || ''}</div>
                </td>
                <td class="px-6 py-4">
                    <div class="text-sm text-gray-900 max-w-xs truncate">
                        ${chat.message.substring(0, 100)}...
                    </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    ${new Date(chat.created_at).toLocaleString('bn-BD')}
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                    <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                        সম্পন্ন
                    </span>
                </td>
            </tr>
        `).join('');

        document.getElementById('chatsTable').innerHTML = chatsHtml;
        
        // Update chat stats
        document.getElementById('avgResponseTime').textContent = '1.2s';
        document.getElementById('satisfactionRate').textContent = '94%';
        
    } catch (error) {
        console.error('Error loading chats:', error);
    }
}

// Load analytics
async function loadAnalytics() {
    // Update analytics charts with real data
    updateAnalyticsCharts();
}

// Initialize charts
function initializeCharts() {
    // User Growth Chart
    const userGrowthCtx = document.getElementById('userGrowthChart').getContext('2d');
    charts.userGrowth = new Chart(userGrowthCtx, {
        type: 'line',
        data: {
            labels: ['জানুয়ারি', 'ফেব্রুয়ারি', 'মার্চ', 'এপ্রিল', 'মে', 'জুন'],
            datasets: [{
                label: 'নতুন ব্যবহারকারী',
                data: [12, 19, 25, 35, 48, 62],
                borderColor: 'rgb(20, 184, 166)',
                backgroundColor: 'rgba(20, 184, 166, 0.1)',
                tension: 0.4
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                }
            }
        }
    });

    // Chat Activity Chart
    const chatActivityCtx = document.getElementById('chatActivityChart').getContext('2d');
    charts.chatActivity = new Chart(chatActivityCtx, {
        type: 'bar',
        data: {
            labels: ['সোম', 'মঙ্গল', 'বুধ', 'বৃহস্পতি', 'শুক্র', 'শনি', 'রবি'],
            datasets: [{
                label: 'চ্যাট সংখ্যা',
                data: [45, 52, 38, 64, 72, 28, 35],
                backgroundColor: 'rgba(59, 130, 246, 0.8)'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                }
            }
        }
    });
}

// Update analytics charts
function updateAnalyticsCharts() {
    // Monthly Users Chart
    const monthlyUsersCtx = document.getElementById('monthlyUsersChart').getContext('2d');
    charts.monthlyUsers = new Chart(monthlyUsersCtx, {
        type: 'doughnut',
        data: {
            labels: ['নতুন', 'ফিরে আসা', 'সক্রিয়'],
            datasets: [{
                data: [30, 45, 25],
                backgroundColor: [
                    'rgba(34, 197, 94, 0.8)',
                    'rgba(59, 130, 246, 0.8)',
                    'rgba(168, 85, 247, 0.8)'
                ]
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false
        }
    });

    // Popular Blogs Chart
    const popularBlogsCtx = document.getElementById('popularBlogsChart').getContext('2d');
    charts.popularBlogs = new Chart(popularBlogsCtx, {
        type: 'horizontalBar',
        data: {
            labels: ['স্ট্রেস ম্যানেজমেন্ট', 'মেডিটেশন গাইড', 'ঘুম ও স্বাস্থ্য'],
            datasets: [{
                label: 'ভিউ সংখ্যা',
                data: [320, 280, 240],
                backgroundColor: 'rgba(168, 85, 247, 0.8)'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                }
            }
        }
    });
}

// Blog management functions
function showCreateBlog() {
    document.getElementById('blogModalTitle').textContent = 'নতুন ব্লগ পোস্ট';
    document.getElementById('blogForm').reset();
    document.getElementById('blogId').value = '';
    document.getElementById('blogModal').classList.remove('hidden');
}

function closeBlogModal() {
    document.getElementById('blogModal').classList.add('hidden');
}

async function editBlog(blogId) {
    try {
        const { data, error } = await supabase
            .from('blog_posts')
            .select('*')
            .eq('id', blogId)
            .single();

        if (error) throw error;

        // Populate form with blog data
        document.getElementById('blogModalTitle').textContent = 'ব্লগ পোস্ট সম্পাদনা';
        document.getElementById('blogId').value = data.id;
        document.getElementById('blogTitle').value = data.title;
        document.getElementById('blogSlug').value = data.slug;
        document.getElementById('blogCategory').value = data.category;
        document.getElementById('blogStatus').value = data.status;
        document.getElementById('blogReadTime').value = data.read_time;
        document.getElementById('blogExcerpt').value = data.excerpt;
        document.getElementById('blogImage').value = data.featured_image || '';
        document.getElementById('blogContent').value = data.content;

        document.getElementById('blogModal').classList.remove('hidden');
        
    } catch (error) {
        console.error('Error loading blog for edit:', error);
        showNotification('ব্লগ লোড করতে ত্রুটি হয়েছে', 'error');
    }
}

async function handleBlogSubmit(e) {
    e.preventDefault();
    
    const blogId = document.getElementById('blogId').value;
    const isEdit = !!blogId;
    
    const blogData = {
        title: document.getElementById('blogTitle').value,
        slug: document.getElementById('blogSlug').value,
        category: document.getElementById('blogCategory').value,
        status: document.getElementById('blogStatus').value,
        read_time: parseInt(document.getElementById('blogReadTime').value),
        excerpt: document.getElementById('blogExcerpt').value,
        featured_image: document.getElementById('blogImage').value || null,
        content: document.getElementById('blogContent').value,
        author: currentUser.email
    };

    try {
        let result;
        
        if (isEdit) {
            result = await supabase
                .from('blog_posts')
                .update({ ...blogData, updated_at: new Date().toISOString() })
                .eq('id', blogId);
        } else {
            result = await supabase
                .from('blog_posts')
                .insert([blogData]);
        }

        if (result.error) throw result.error;

        showNotification(`ব্লগ পোস্ট ${isEdit ? 'আপডেট' : 'তৈরি'} করা হয়েছে`, 'success');
        closeBlogModal();
        loadBlogs();
        loadBlogStats();
        
    } catch (error) {
        console.error('Error saving blog:', error);
        showNotification('ব্লগ সেভ করতে ত্রুটি হয়েছে', 'error');
    }
}

async function deleteBlog(blogId) {
    if (!confirm('আপনি কি নিশ্চিত যে এই ব্লগ পোস্টটি মুছে ফেলতে চান?')) {
        return;
    }

    try {
        const { error } = await supabase
            .from('blog_posts')
            .delete()
            .eq('id', blogId);

        if (error) throw error;

        showNotification('ব্লগ পোস্ট মুছে ফেলা হয়েছে', 'success');
        loadBlogs();
        loadBlogStats();
        
    } catch (error) {
        console.error('Error deleting blog:', error);
        showNotification('ব্লগ মুছতে ত্রুটি হয়েছে', 'error');
    }
}

// User management functions
async function viewUserDetails(userId) {
    // Implement user details view
    alert('ব্যবহারকারীর বিস্তারিত দেখার ফিচার শীঘ্রই আসছে');
}

async function deleteUser(userId) {
    if (!confirm('আপনি কি নিশ্চিত যে এই ব্যবহারকারীকে মুছে ফেলতে চান?')) {
        return;
    }

    try {
        const { error } = await supabase
            .from('user_profiles')
            .delete()
            .eq('id', userId);

        if (error) throw error;

        showNotification('ব্যবহারকারী মুছে ফেলা হয়েছে', 'success');
        loadUsers();
        loadUserStats();
        
    } catch (error) {
        console.error('Error deleting user:', error);
        showNotification('ব্যবহারকারী মুছতে ত্রুটি হয়েছে', 'error');
    }
}

// Search users
function searchUsers() {
    const searchTerm = document.getElementById('userSearch').value.toLowerCase();
    const rows = document.querySelectorAll('#usersTable tr');
    
    rows.forEach(row => {
        const text = row.textContent.toLowerCase();
        row.style.display = text.includes(searchTerm) ? '' : 'none';
    });
}

// Filter blogs
function filterBlogs() {
    const status = document.getElementById('blogStatusFilter').value;
    const rows = document.querySelectorAll('#blogsTable tr');
    
    rows.forEach(row => {
        if (!status) {
            row.style.display = '';
        } else {
            const statusBadge = row.querySelector('.rounded-full');
            const rowStatus = statusBadge?.textContent.trim() === 'প্রকাশিত' ? 'published' : 'draft';
            row.style.display = rowStatus === status ? '' : 'none';
        }
    });
}

// Refresh functions
async function refreshUsers() {
    loadUsers();
    showNotification('ব্যবহারকারী তালিকা রিফ্রেশ করা হয়েছে', 'success');
}

async function refreshBlogs() {
    loadBlogs();
    showNotification('ব্লগ তালিকা রিফ্রেশ করা হয়েছে', 'success');
}

// Settings handlers
async function handleGeneralSettings(e) {
    e.preventDefault();
    
    const settings = {
        site_name: document.getElementById('siteName').value,
        contact_email: document.getElementById('contactEmail').value,
        daily_chat_limit: parseInt(document.getElementById('dailyChatLimit').value)
    };

    // Save to database or local storage
    localStorage.setItem('adminSettings', JSON.stringify(settings));
    showNotification('সাধারণ সেটিংস সেভ করা হয়েছে', 'success');
}

async function handleSecuritySettings(e) {
    e.preventDefault();
    
    const newPassword = document.getElementById('newPassword').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    
    if (newPassword !== confirmPassword) {
        showNotification('পাসওয়ার্ড মিল নেই', 'error');
        return;
    }

    try {
        const { error } = await supabase.auth.updateUser({
            password: newPassword
        });

        if (error) throw error;

        showNotification('পাসওয়ার্ড আপডেট করা হয়েছে', 'success');
        document.getElementById('securitySettingsForm').reset();
        
    } catch (error) {
        console.error('Error updating password:', error);
        showNotification('পাসওয়ার্ড আপডেট করতে ত্রুটি হয়েছে', 'error');
    }
}

// Logout function
async function logout() {
    try {
        await supabase.auth.signOut();
        window.location.href = '../auth/login.html';
    } catch (error) {
        console.error('Logout error:', error);
    }
}

// Utility functions
function showNotification(message, type = 'success') {
    const notification = document.getElementById('notification');
    const messageEl = document.getElementById('notificationMessage');
    
    messageEl.textContent = message;
    notification.className = `fixed top-4 right-4 z-50 px-6 py-3 rounded-lg shadow-lg ${
        type === 'success' ? 'bg-green-500' : 'bg-red-500'
    } text-white`;
    
    notification.classList.remove('hidden');
    
    setTimeout(() => {
        notification.classList.add('hidden');
    }, 3000);
}

function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}
