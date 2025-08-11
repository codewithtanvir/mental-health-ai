# 🧠 Mental Health AI - মানসিক স্বাস্থ্য সহায়ক

A comprehensive mental health support web application with AI-powered chatbot, user authentication, mood tracking, and resources - specifically designed for Bengali speakers with English support.

## 🌟 Features

- **🤖 AI Chatbot**: Bengali/English mental health support using Google Gemini 2.5 Flash
- **🔐 Secure Authentication**: Email/password and Google OAuth login with Supabase
- **📊 User Dashboard**: Personal mood tracking, statistics, and chat history
- **📝 Mental Health Resources**: Curated articles, guides, and professional help
- **📱 Responsive Design**: Works seamlessly on all devices
- **🛡️ Privacy-Focused**: Secure data handling with row-level security
- **💾 Data Persistence**: Chat history and user progress tracking
- **🌍 Multilingual**: Primary Bengali support with English fallback

## � Quick Start

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd mental-health
   ```

2. **Follow the setup guide**
   - Read `SETUP.md` for detailed instructions
   - Configure Supabase and Google Gemini API
   - Start local server for full functionality

3. **Access the application**
   - Open `index.html` in your browser
   - Or use a local server for authentication features

## 📋 Requirements

- Supabase account (free tier available)
- Google AI Studio API key
- Modern web browser
- Local server for testing authentication (optional)

## 🏗️ Tech Stack

- **Frontend**: HTML5, CSS3, JavaScript ES6+, Tailwind CSS
- **Backend**: Supabase (Authentication, Database, Storage)
- **AI**: Google Gemini 2.5 Flash API
- **Language**: Bengali (primary), English (secondary)
- **Authentication**: Supabase Auth with email/password and OAuth
- **Database**: PostgreSQL with Row Level Security
- **Fonts**: Hind Siliguri for Bengali typography

## 📁 Project Structure

```
mental-health/
├── index.html              # Landing page
├── chat.html              # AI chatbot interface
├── dashboard.html         # User dashboard (protected)
├── config.json            # App configuration
├── .env.example           # Environment template
│
├── auth/                  # Authentication pages
│   ├── login.html         # User login
│   ├── signup.html        # User registration
│   ├── forgot-password.html # Password reset
│   └── callback.html      # OAuth callback
│
├── js/                    # JavaScript modules
│   ├── main.js            # Main application logic
│   ├── chat.js            # AI chatbot functionality
│   ├── auth.js            # Authentication manager
│   ├── dashboard.js       # Dashboard features
│   └── gemini-ai.js       # AI integration
│
├── css/                   # Stylesheets
│   ├── style.css          # Main styles
│   ├── chat.css           # Chat interface styles
│   └── dashboard.css      # Dashboard styles
│
├── pages/                 # Additional pages
│   ├── about.html         # About page
│   ├── contact.html       # Contact form
│   ├── privacy.html       # Privacy policy
│   └── terms.html         # Terms of service
│
├── blog/                  # Mental health articles
│   ├── stress-management.html
│   ├── mindfulness-meditation.html
│   ├── sleep-hygiene.html
│   ├── anxiety-coping.html
│   └── depression-support.html
│
├── database/              # Database setup
│   └── setup.sql          # Supabase table creation
│
├── SETUP.md              # Detailed setup guide
└── README.md             # Project overview
```

## 🔧 Setup

For detailed setup instructions, please see [SETUP.md](SETUP.md).

### Quick Setup Summary:

1. **Create Supabase Project**
   - Sign up at supabase.com
   - Create new project and get credentials

2. **Configure APIs**
   - Get Google Gemini API key from AI Studio
   - Update `config.json` with your credentials

3. **Setup Database**
   - Run the SQL setup script in Supabase SQL Editor
   - Configure authentication providers

4. **Test Locally**
   - Start local server for full functionality
   - Test authentication and AI chatbot

## 🌍 Language Support

This application is primarily designed for Bengali speakers:
- **Primary Language**: Bengali (বাংলা)
- **Secondary Language**: English  
- **Font**: Hind Siliguri for Bengali text
- **AI Responses**: Supports both Bengali and English contexts
- **UI Elements**: Bilingual interface elements

## 🛡️ Privacy & Security

- **Secure Authentication**: Supabase Auth with email verification
- **Data Protection**: Row-level security ensures user data privacy
- **No Local Storage**: Sensitive data stored securely in Supabase
- **HTTPS Only**: All API communications encrypted
- **GDPR Compliant**: Privacy-focused design with user control
- **Session Management**: Secure token-based authentication

## 📊 Features in Detail

### 🤖 AI Chatbot
- Mental health support in Bengali and English
- Context-aware responses using Google Gemini 2.5 Flash
- Crisis intervention guidance and professional referrals
- Chat history persistence for registered users
- Real-time messaging interface

### 🔐 Authentication System
- Email/password registration with verification
- Google OAuth integration for quick access
- Secure password reset functionality
- Protected routes and session management
- User profile management

### 📊 User Dashboard
- Personal mood tracking with visual charts
- Chat session history and statistics
- Progress tracking and insights
- Quick access to mental health resources
- Personalized daily mental health quotes

### 📝 Mental Health Resources
- Comprehensive blog with expert articles
- Stress management and coping techniques
- Mindfulness and meditation guides
- Sleep hygiene and wellness tips
- Professional help directory and emergency contacts

### 📱 Mobile Experience
- Responsive design optimized for mobile devices
- Touch-friendly interface elements
- Fast loading and offline-capable features
- Progressive Web App capabilities

## 🆘 Crisis Support

**If you're experiencing a mental health emergency:**
- **Bangladesh**: National Helpline 999
- **NASIB**: 09611677777 (24/7)
- **Kan Pete Roi**: 09612677777 (8 AM - 12 AM)
- **Moner Bondhu**: 01779554391 (9 AM - 9 PM)
- **International**: Contact your local emergency services

*This application provides support but is not a replacement for professional medical care.*

## 🤝 Contributing

We welcome contributions to improve mental health support! Please:

1. **Fork the repository**
2. **Create a feature branch** (`git checkout -b feature/amazing-feature`)
3. **Make your changes** with proper testing
4. **Commit your changes** (`git commit -m 'Add amazing feature'`)
5. **Push to the branch** (`git push origin feature/amazing-feature`)
6. **Submit a pull request**

### Code Style Guidelines
- Use consistent indentation (2 spaces)
- Comment complex functions in both Bengali and English
- Follow semantic HTML practices
- Maintain responsive design principles
- Test on multiple devices and browsers

### Content Guidelines
- Write in clear, empathetic language
- Maintain cultural sensitivity for Bengali users
- Include proper disclaimers for health content
- Verify all mental health information with professionals

## 🚀 Deployment

### Static Hosting Options
- **Netlify**: Continuous deployment from Git with form handling
- **Vercel**: Zero-configuration deployment with edge functions
- **GitHub Pages**: Free hosting for static sites

### Traditional Hosting
- **Shared Hosting**: cPanel-based services with database support
- **VPS/Cloud**: AWS, Google Cloud, or DigitalOcean for scalability

### Environment Variables for Production
```bash
SUPABASE_URL=your_production_supabase_url
SUPABASE_ANON_KEY=your_production_anon_key
GOOGLE_API_KEY=your_gemini_api_key
NODE_ENV=production
```

## 🐛 Troubleshooting

### Common Issues

1. **Authentication Not Working**
   - Verify Supabase URL and anon key in config.json
   - Check browser console for errors
   - Ensure database tables are created with setup.sql

2. **AI Chatbot Errors**
   - Check Gemini API key in configuration
   - Verify API key is active in Google AI Studio
   - Monitor API usage limits

3. **Database Connection Issues**
   - Confirm Supabase project is active
   - Check Row Level Security policies
   - Verify user permissions

### Debug Mode
Enable debug logging in browser console:
```javascript
localStorage.setItem('debug', 'true');
```

## 📊 Performance & Analytics

- **Core Web Vitals**: Optimized for fast loading
- **Mobile Performance**: Progressive Web App capabilities
- **Analytics**: User engagement tracking (privacy-compliant)
- **Monitoring**: Error tracking and performance metrics

## 🔒 Security Best Practices

- Never commit sensitive credentials to version control
- Use environment variables for all API keys
- Regularly rotate API keys and passwords
- Monitor Supabase logs for suspicious activity
- Enable 2FA on all admin accounts
- Regular security audits and updates

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Google Gemini**: For providing advanced AI capabilities
- **Supabase**: For backend infrastructure and authentication
- **Tailwind CSS**: For responsive design framework
- **Mental Health Professionals**: For guidance and content review
- **Bengali Community**: For language and cultural insights
- **Open Source Contributors**: For ongoing improvements

## 📞 Support & Contact

### Technical Support
- Check the [SETUP.md](SETUP.md) troubleshooting section
- Review browser console for JavaScript errors
- Verify API configurations and credentials
- Test with sample data in development environment

### Content Support
- Mental health content reviewed by professionals
- Cultural sensitivity verified by Bengali speakers
- Regular updates based on user feedback
- Professional disclaimer included

### Community
- GitHub Issues: Report bugs and request features
- Discussions: Share ideas and improvements
- Pull Requests: Contribute code and content

---

## 🌈 Our Mission

**Mental Health AI** is committed to breaking down barriers to mental health support in Bangladesh and Bengali-speaking communities worldwide. We believe that:

- Mental health support should be accessible to everyone
- Technology can bridge gaps in mental healthcare
- Cultural and linguistic sensitivity is essential
- Privacy and security are fundamental rights
- Community support makes a difference

**Remember**: You are not alone. Help is available. This tool is here to support you on your mental health journey, but professional help should always be sought for serious mental health concerns.

---

**Made with ❤️ for mental health awareness and support in Bangladesh** 🇧🇩

*If you or someone you know is in crisis, please contact emergency services or a mental health professional immediately.*
