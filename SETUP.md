# Mental Health AI - Complete Setup Guide

## 🚀 Quick Start Guide

This guide will help you set up the complete Mental Health AI web application with authentication and database functionality.

## 📋 Prerequisites

Before starting, make sure you have:
- A web browser (Chrome, Firefox, Safari, Edge)
- A Supabase account (free tier available)
- A Google Cloud Console account (for Gemini AI API)
- A text editor or IDE

## 🛠️ Setup Steps

### 1. Supabase Project Setup

1. **Create Supabase Project**
   - Go to [supabase.com](https://supabase.com)
   - Sign up/login and create a new project
   - Choose a project name (e.g., "mental-health-ai")
   - Select a region closest to your users
   - Wait for the project to be ready (2-3 minutes)

2. **Get Project Credentials**
   - Go to Settings → API
   - Copy your **Project URL** (looks like: `https://xxxxx.supabase.co`)
   - Copy your **anon/public key** (starts with `eyJhbG...`)

3. **Setup Database Tables**
   - Go to SQL Editor in your Supabase dashboard
   - Copy and paste the entire contents of `database/setup.sql`
   - Click "Run" to execute the SQL commands
   - Verify tables are created in the Table Editor

4. **Configure Authentication**
   - Go to Authentication → Settings
   - Enable **Email** authentication
   - Enable **Google** authentication (optional but recommended)
   - For Google OAuth:
     - Add your domain to redirect URLs
     - Set redirect URL: `http://localhost:3000/auth/callback.html` (for local testing)
     - Set redirect URL: `https://yourdomain.com/auth/callback.html` (for production)

### 2. Environment Configuration

1. **Create Environment File**
   ```bash
   cp .env.example .env
   ```

2. **Update .env file with your credentials**
   ```env
   # Supabase Configuration
   SUPABASE_URL=https://your-project-id.supabase.co
   SUPABASE_ANON_KEY=your-anon-key-here
   
   # Google Gemini AI Configuration
   GOOGLE_API_KEY=your-gemini-api-key-here
   
   # App Configuration
   NODE_ENV=development
   ```

3. **Update config.json**
   - Open `config.json`
   - Replace placeholder values with your actual credentials:
   ```json
   {
     "supabase": {
       "url": "https://your-project-id.supabase.co",
       "anonKey": "your-anon-key-here"
     },
     "google": {
       "apiKey": "your-gemini-api-key-here"
     }
   }
   ```

### 3. Google Gemini AI Setup

1. **Get Gemini API Key**
   - Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
   - Create a new API key
   - Copy the key and add it to your `.env` and `config.json` files

2. **Test AI Integration**
   - The chatbot will automatically use the API key from config
   - Test by visiting the chat page after setup

### 4. Local Testing

1. **Start a Local Server**
   
   Using Python (if installed):
   ```bash
   # Python 3
   python -m http.server 3000
   
   # Python 2
   python -m SimpleHTTPServer 3000
   ```
   
   Using Node.js (if installed):
   ```bash
   npx http-server -p 3000
   ```
   
   Using Live Server (VS Code extension):
   - Install "Live Server" extension
   - Right-click on `index.html`
   - Select "Open with Live Server"

2. **Test the Application**
   - Open browser to `http://localhost:3000`
   - Test signup/login functionality
   - Try the AI chatbot
   - Check dashboard features

### 5. Google OAuth Setup (Optional)

1. **Google Cloud Console Setup**
   - Go to [Google Cloud Console](https://console.cloud.google.com)
   - Create a new project or select existing
   - Enable Google+ API
   - Create OAuth 2.0 credentials
   - Add authorized origins:
     - `http://localhost:3000` (for testing)
     - `https://yourdomain.com` (for production)

2. **Configure Supabase OAuth**
   - In Supabase Dashboard → Authentication → Settings → OAuth
   - Add Google provider
   - Enter your Google OAuth client ID and secret

## 📁 Project Structure

```
mental-health/
├── index.html                 # Main landing page
├── chat.html                 # AI chatbot interface
├── dashboard.html            # User dashboard (protected)
├── blog.html                 # Mental health blog
├── resources.html            # Resources and tools
├── config.json               # App configuration
├── .env.example              # Environment template
├── .env                      # Your environment variables
│
├── auth/                     # Authentication pages
│   ├── login.html           # User login
│   ├── signup.html          # User registration
│   ├── forgot-password.html # Password reset
│   └── callback.html        # OAuth callback
│
├── css/                      # Stylesheets
│   ├── style.css            # Main styles
│   ├── chat.css             # Chat interface styles
│   └── dashboard.css        # Dashboard styles
│
├── js/                       # JavaScript files
│   ├── main.js              # Main application logic
│   ├── chat.js              # Chat functionality
│   ├── auth.js              # Authentication manager
│   ├── dashboard.js         # Dashboard features
│   └── gemini-ai.js         # AI integration
│
├── pages/                    # Additional pages
│   ├── about.html           # About page
│   ├── contact.html         # Contact form
│   ├── privacy.html         # Privacy policy
│   └── terms.html           # Terms of service
│
├── blog/                     # Blog posts
│   ├── stress-management.html
│   ├── mindfulness-meditation.html
│   ├── sleep-hygiene.html
│   ├── anxiety-coping.html
│   └── depression-support.html
│
├── assets/                   # Static assets
│   ├── images/              # Images and icons
│   └── fonts/               # Font files
│
└── database/                 # Database setup
    └── setup.sql            # Supabase table creation
```

## 🔧 Features

### ✅ Completed Features

- **🏠 Landing Page**: Responsive homepage with navigation
- **🤖 AI Chatbot**: Bengali/English mental health support
- **🔐 Authentication**: Email/password and Google OAuth
- **📊 Dashboard**: User stats, mood tracking, quick actions
- **📝 Blog**: Mental health articles and resources
- **📱 Responsive**: Mobile-friendly design
- **🛡️ Security**: Row-level security with Supabase
- **💾 Data Persistence**: Chat history and user data
- **📈 Analytics**: User statistics and mood tracking

### 🎯 Key Components

1. **Authentication System**
   - Secure signup/login with email verification
   - Google OAuth integration
   - Password reset functionality
   - Protected routes and session management

2. **AI Chatbot**
   - Google Gemini 2.5 Flash integration
   - Bengali language support
   - Context-aware responses
   - Chat history storage

3. **User Dashboard**
   - Mood tracking and visualization
   - Chat session history
   - Personal statistics
   - Quick action buttons

4. **Mental Health Resources**
   - Curated blog articles
   - Stress management tools
   - Emergency contact information
   - Professional help resources

## 🚀 Deployment

### Netlify Deployment

1. **Build for Production**
   - Ensure all config files have production URLs
   - Test locally before deploying

2. **Deploy to Netlify**
   - Connect your Git repository
   - Set build command: (none needed for static site)
   - Set publish directory: `/` (root)
   - Add environment variables in Netlify dashboard

3. **Configure Redirects**
   - Create `_redirects` file for SPA routing
   - Update Supabase OAuth URLs

### Vercel Deployment

1. **Deploy to Vercel**
   - Connect GitHub repository
   - Deploy with default settings
   - Add environment variables

2. **Update URLs**
   - Update Supabase redirect URLs
   - Test authentication flow

## 🐛 Troubleshooting

### Common Issues

1. **"Invalid API Key" Error**
   - Check your Gemini API key in config.json
   - Ensure the API key is active in Google AI Studio

2. **Authentication Not Working**
   - Verify Supabase URL and anon key
   - Check browser console for errors
   - Ensure database tables are created

3. **OAuth Redirect Issues**
   - Check redirect URLs in Supabase settings
   - Ensure callback.html is accessible
   - Verify domain configuration

4. **Chat Not Loading**
   - Check browser console for JavaScript errors
   - Verify Gemini API key configuration
   - Ensure chat.js is loading properly

### Debug Mode

Add this to your browser console to enable debug mode:
```javascript
localStorage.setItem('debug', 'true');
```

## 📞 Support

If you encounter issues:

1. Check browser console for errors
2. Verify all configuration files
3. Test with sample data
4. Check Supabase dashboard for database issues

## 🔒 Security Notes

- Never commit `.env` file to version control
- Use environment variables for all sensitive data
- Regularly update API keys
- Monitor Supabase logs for suspicious activity
- Enable 2FA on all accounts

## 📊 Performance Tips

- Enable Supabase CDN for faster loading
- Optimize images and assets
- Use compression for production
- Monitor API usage limits
- Cache static resources

---

## 🎉 You're Ready!

Your Mental Health AI application is now set up and ready to help users with their mental health journey. The application provides a safe, secure, and supportive environment for users to:

- Chat with an AI therapist in Bengali/English
- Track their mood and mental health progress
- Access curated mental health resources
- Connect with professional help when needed

Happy coding! 🚀
