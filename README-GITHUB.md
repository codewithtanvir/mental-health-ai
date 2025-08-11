# 🧠 Mental Health AI - মানসিক স্বাস্থ্য সহায়ক

<div align="center">

![Mental Health AI](https://img.shields.io/badge/Mental%20Health-AI%20Powered-teal)
![Language](https://img.shields.io/badge/Language-Bengali%20%26%20English-blue)
![License](https://img.shields.io/badge/License-MIT-green)
![Version](https://img.shields.io/badge/Version-1.0.0-orange)

**A comprehensive mental health support web application with AI-powered chatbot, user authentication, mood tracking, and resources - specifically designed for Bengali speakers with English support.**

[📖 Setup Guide](./SETUP.md) • [🎯 Deployment Guide](./DEPLOYMENT.md) • [📄 License](./LICENSE)

</div>

## 🌟 Features

- **🤖 AI Chatbot**: Bengali/English mental health support using Google Gemini 2.5 Flash
- **🔐 Secure Authentication**: Email/password and Google OAuth login with Supabase
- **📊 User Dashboard**: Personal mood tracking, statistics, and chat history
- **📝 Mental Health Resources**: Curated articles, guides, and professional help
- **📱 Responsive Design**: Works seamlessly on all devices
- **🛡️ Privacy-Focused**: Secure data handling with row-level security
- **💾 Data Persistence**: Chat history and user progress tracking
- **🌍 Multilingual**: Primary Bengali support with English fallback

## 🚀 Quick Start

### **Prerequisites**
- [Supabase account](https://supabase.com) (free tier available)
- [Google AI Studio API key](https://makersuite.google.com)
- Modern web browser
- Local server for testing (optional)

### **Installation**

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/mental-health-ai.git
   cd mental-health-ai
   ```

2. **Setup configuration files**
   ```bash
   cp .env.example .env
   cp config/config.example.json config/config.json
   ```

3. **Configure your credentials**
   - Update `.env` and `config/config.json` with your API credentials:
   ```env
   SUPABASE_URL=https://your-project.supabase.co
   SUPABASE_ANON_KEY=your_anon_key_here
   GEMINI_API_KEY=your_gemini_api_key_here
   ```

4. **Setup database**
   - Copy and run `database/setup.sql` in your Supabase SQL Editor

5. **Start local development server**
   ```bash
   # Using Python
   python -m http.server 3000
   
   # Using Node.js
   npx http-server -p 3000
   ```

6. **Test the application**
   - Homepage: `http://localhost:3000`
   - Signup: `http://localhost:3000/auth/signup.html`
   - Chatbot: `http://localhost:3000/chat.html`

📖 **For detailed setup instructions, see [SETUP.md](./SETUP.md)**

## 🏗️ Tech Stack

- **Frontend**: HTML5, CSS3, JavaScript ES6+, Tailwind CSS
- **Backend**: Supabase (Authentication, Database, Storage)
- **AI**: Google Gemini 2.5 Flash API
- **Language**: Bengali (primary), English (secondary)
- **Database**: PostgreSQL with Row Level Security
- **Authentication**: Email/password + Google OAuth
- **Fonts**: Hind Siliguri for Bengali typography

## 📁 Project Structure

```
mental-health-ai/
├── index.html                 # Landing page
├── chat.html                 # AI chatbot interface
├── dashboard.html            # User dashboard (protected)
├── auth/                     # Authentication pages
│   ├── login.html           # User login
│   ├── signup.html          # User registration
│   └── callback.html        # OAuth callback
├── js/                      # JavaScript modules
│   ├── main.js              # Main application logic
│   ├── chat.js              # AI chatbot functionality
│   ├── auth.js              # Authentication manager
│   └── dashboard.js         # Dashboard features
├── css/                     # Stylesheets
├── pages/                   # Additional pages
├── blog/                    # Mental health articles
├── database/                # Database setup
│   └── setup.sql            # Supabase table creation
├── config/                  # Configuration files
│   └── config.example.json  # Config template
├── SETUP.md                 # Detailed setup guide
├── DEPLOYMENT.md            # Deployment instructions
└── README.md               # This file
```

## 🌍 Language Support

This application is designed for Bengali-speaking communities:
- **Primary Language**: Bengali (বাংলা) with proper font support
- **Secondary Language**: English for wider accessibility
- **AI Responses**: Context-aware in both languages
- **UI Elements**: Bilingual interface design

## 🛡️ Privacy & Security

- **Data Protection**: Row-level security ensures user data privacy
- **Secure Authentication**: Supabase Auth with email verification
- **HTTPS Only**: All API communications encrypted
- **No Local Storage**: Sensitive data stored securely in Supabase
- **GDPR Compliant**: Privacy-focused design with user control

## 📊 Key Features in Detail

### 🤖 **AI Mental Health Chatbot**
- Powered by Google Gemini 2.5 Flash
- Bengali and English language support
- Context-aware mental health conversations
- Crisis intervention guidance
- Professional help referrals

### 🔐 **Authentication System**
- Email/password registration with verification
- Google OAuth integration
- Secure session management
- Password reset functionality
- Protected routes and user sessions

### 📊 **User Dashboard**
- Personal mood tracking with visual charts
- Chat session history and analytics
- Progress insights and statistics
- Personalized mental health quotes
- Quick access to resources

### 📝 **Mental Health Resources**
- Curated blog articles by experts
- Stress management techniques
- Mindfulness and meditation guides
- Emergency contact information
- Professional help directory

## 🆘 Crisis Support

**If you're experiencing a mental health emergency:**

### Bangladesh 🇧🇩
- **National Emergency**: 999
- **NASIB Helpline**: 09611677777 (24/7)
- **Kan Pete Roi**: 09612677777 (8 AM - 12 AM)
- **Moner Bondhu**: 01779554391 (9 AM - 9 PM)

### International
- Contact your local emergency services
- Visit your country's mental health crisis website

*This application provides support but is not a replacement for professional medical care.*

## 🚀 Deployment

Ready to deploy? Check out our [Deployment Guide](./DEPLOYMENT.md) for:
- **Netlify**: One-click deployment with environment variables
- **Vercel**: Seamless GitHub integration
- **GitHub Pages**: Free static hosting
- **Custom Domain**: SSL and DNS configuration

## 🤝 Contributing

We welcome contributions to improve mental health support! 

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines
- Test on multiple devices and browsers
- Maintain cultural sensitivity for Bengali users
- Include proper disclaimers for health content
- Follow our code style guidelines

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

### Important Disclaimers
- **Medical Disclaimer**: This software is for educational and supportive purposes only
- **Crisis Support**: Not a substitute for professional medical care
- **Data Privacy**: Review privacy implications before production use
- **Ethical Use**: Must be used responsibly to support mental health

## 🙏 Acknowledgments

- **Google Gemini** for advanced AI capabilities
- **Supabase** for backend infrastructure and authentication
- **Tailwind CSS** for responsive design framework
- **Mental Health Professionals** for content guidance
- **Bengali Community** for language and cultural insights
- **Open Source Contributors** for ongoing improvements

## 📞 Support

### Technical Support
- 📖 Check the [Setup Guide](./SETUP.md) for troubleshooting
- 🔍 Review browser console for errors
- ⚙️ Verify API configurations
- 💬 Open an issue for bugs or feature requests

### Community
- **Issues**: Report bugs and request features
- **Discussions**: Share ideas and improvements
- **Pull Requests**: Contribute code and content

---

## 🌈 Our Mission

**Mental Health AI** is committed to breaking down barriers to mental health support in Bangladesh and Bengali-speaking communities worldwide. We believe that mental health support should be accessible, culturally sensitive, and technologically empowered.

**Remember**: You are not alone. Help is available. This tool is here to support you on your mental health journey. 

---

<div align="center">

**Made with ❤️ for mental health awareness and support in Bangladesh** 🇧🇩

*If you or someone you know is in crisis, please contact emergency services or a mental health professional immediately.*

</div>
