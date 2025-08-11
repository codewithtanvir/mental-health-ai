# 🚀 Deployment Guide - Mental Health AI

## 📋 Pre-Deployment Checklist

### ✅ **Before Pushing to GitHub:**

1. **Environment Variables Secured** ✅
   - `.env` file is in `.gitignore`
   - `config/config.json` with real credentials is in `.gitignore`
   - Only `config.example.json` and `.env.example` will be committed

2. **Test Files Excluded** ✅
   - `test-supabase.html` and `quick-test.html` are in `.gitignore`
   - These contain hardcoded credentials for testing

3. **All Features Tested** ✅
   - User registration and login working
   - AI chatbot responding correctly
   - Database tables created and functional
   - Supabase authentication configured

## 🌐 **Deployment Options**

### **Option 1: Netlify (Recommended)**

1. **Push to GitHub**
   ```bash
   git add .
   git commit -m "Initial commit: Mental Health AI v1.0"
   git push origin main
   ```

2. **Deploy on Netlify**
   - Go to [netlify.com](https://netlify.com)
   - Connect your GitHub repository
   - Build settings: 
     - Build command: (leave empty)
     - Publish directory: `/` (root)
   - Deploy site

3. **Configure Environment Variables in Netlify**
   - Go to Site Settings → Environment Variables
   - Add:
     ```
     SUPABASE_URL=https://your-project.supabase.co
     SUPABASE_ANON_KEY=your_anon_key_here
     GEMINI_API_KEY=your_gemini_key_here
     ```

4. **Update Supabase Auth URLs**
   - In Supabase Dashboard → Authentication → Settings
   - Add your Netlify domain:
     - Site URL: `https://your-site-name.netlify.app`
     - Redirect URLs: `https://your-site-name.netlify.app/auth/callback.html`

### **Option 2: Vercel**

1. **Deploy to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Import your GitHub repository
   - Deploy with default settings

2. **Add Environment Variables**
   - In Vercel dashboard → Settings → Environment Variables
   - Add the same variables as above

### **Option 3: GitHub Pages**

1. **Enable GitHub Pages**
   - In your repo → Settings → Pages
   - Source: Deploy from branch `main`
   - Folder: `/ (root)`

2. **Configure for GitHub Pages**
   - Update Supabase redirect URLs to use your GitHub Pages URL
   - Note: Limited to static hosting only

## ⚙️ **Production Configuration**

### **1. Create Production Config**
After deployment, create a production `config.json`:

```json
{
  "api": {
    "supabase": {
      "url": "https://your-project.supabase.co",
      "anonKey": "your_production_anon_key"
    },
    "gemini": {
      "apiKey": "your_production_gemini_key"
    }
  }
}
```

### **2. Update Supabase Settings**
- **Authentication → Settings**
  - Site URL: Your production domain
  - Redirect URLs: `https://yourdomain.com/auth/callback.html`
- **Database → Settings**
  - Enable RLS (already done)
  - Review security policies

### **3. Performance Optimization**
- Enable CDN caching for static files
- Compress images and assets
- Minify CSS and JavaScript (optional)

## 🔒 **Security Checklist**

### **✅ Production Security:**
- [ ] API keys stored as environment variables only
- [ ] No hardcoded credentials in code
- [ ] Supabase RLS policies active
- [ ] HTTPS enabled on production domain
- [ ] Auth redirect URLs properly configured
- [ ] Rate limiting enabled in Supabase

### **✅ Repository Security:**
- [ ] `.env` files not committed
- [ ] `config.json` with real credentials not committed
- [ ] Test files with credentials excluded
- [ ] Only example/template files in repository

## 📊 **Monitoring & Analytics**

### **Optional: Add Analytics**
1. **Google Analytics**
   - Get tracking ID from Google Analytics
   - Add to environment variables
   - Update config to enable analytics

2. **Supabase Analytics**
   - Monitor API usage in Supabase dashboard
   - Set up alerts for quota limits
   - Review authentication logs

## 🛠️ **Post-Deployment Setup**

### **1. Test Production Deployment**
- [ ] Visit your live site
- [ ] Test user registration
- [ ] Test login functionality
- [ ] Test AI chatbot
- [ ] Test mood tracking
- [ ] Verify all pages load correctly

### **2. Configure Domain (Optional)**
- Purchase custom domain
- Configure DNS settings
- Update Supabase auth URLs
- Set up SSL certificate

### **3. Backup Strategy**
- Regular Supabase database backups
- Export user data periodically
- Keep configuration templates updated

## 🆘 **Troubleshooting Production Issues**

### **Common Deployment Problems:**

1. **Authentication Not Working**
   - Check Supabase auth redirect URLs
   - Verify environment variables are set
   - Ensure HTTPS is enabled

2. **API Errors**
   - Verify API keys in environment variables
   - Check API usage limits
   - Review browser console for errors

3. **Database Connection Issues**
   - Confirm Supabase URL and keys are correct
   - Check RLS policies are not blocking access
   - Verify database tables exist

### **Quick Fixes:**
```bash
# Re-deploy with updated environment variables
git add .
git commit -m "Update production configuration"
git push origin main
```

## 📞 **Support Contacts**

- **Supabase Support**: [supabase.com/support](https://supabase.com/support)
- **Google AI Support**: [ai.google.dev/support](https://ai.google.dev/support)
- **Netlify Support**: [netlify.com/support](https://netlify.com/support)

---

## 🎉 **You're Ready for Production!**

Your Mental Health AI application is now ready for deployment with:
- ✅ Secure authentication system
- ✅ AI-powered mental health support
- ✅ Bengali language support
- ✅ Responsive design
- ✅ Production-ready configuration
- ✅ Comprehensive documentation

**Next Steps:**
1. Push to GitHub
2. Deploy to your chosen platform
3. Configure production environment variables
4. Test thoroughly
5. Share with users! 🚀
