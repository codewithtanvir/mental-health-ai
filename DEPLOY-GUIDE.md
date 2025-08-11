# 🚀 Deployment Guide - Mental Health AI

## Quick Deploy to Vercel (Recommended)

### Step 1: Prepare Repository
```bash
# Make sure all files are committed
git add .
git commit -m "Production ready deployment"
git push origin main
```

### Step 2: Deploy to Vercel
1. Go to [vercel.com](https://vercel.com)
2. Connect your GitHub account
3. Import your repository
4. Deploy with these settings:
   - **Framework Preset**: Other
   - **Root Directory**: `./`
   - **Build Command**: (leave empty)
   - **Output Directory**: (leave empty)

### Step 3: Configure Domain
- Your app will be available at: `https://your-project.vercel.app`
- Add custom domain if needed

### Step 4: Update Supabase URLs
In your Supabase dashboard:
1. Go to Authentication → URL Configuration
2. Add your Vercel domain to redirect URLs:
   ```
   https://your-project.vercel.app/
   https://your-project.vercel.app/auth/login.html
   https://your-project.vercel.app/auth/signup.html
   https://your-project.vercel.app/auth/reset-password.html
   ```

## Alternative: Deploy to Netlify

### Step 1: Prepare for Netlify
1. Go to [netlify.com](https://netlify.com)
2. Connect GitHub repository
3. Deploy with default settings

### Step 2: Configure
- **Build command**: (leave empty)
- **Publish directory**: `./`

## File Structure for Production
```
mental-health/
├── index.html              # Main landing page
├── dashboard.html           # User dashboard
├── auth/
│   ├── login.html          # Login page
│   ├── signup.html         # Signup page
│   └── reset-password.html # Password reset
├── pages/
│   ├── blog.html           # Mental health blog
│   └── resources.html      # Emergency resources
├── js/
│   ├── main.js             # Main app logic
│   ├── auth.js             # Authentication
│   └── dashboard-prod.js   # Dashboard logic
├── css/
│   └── styles.css          # Custom styles
└── admin/
    └── dashboard.html      # Admin dashboard
```

## Environment Variables (Optional)

For enhanced security, you can set these in your hosting platform:

```bash
# Vercel/Netlify Environment Variables
SUPABASE_URL=https://brecotrpmeiwktcffdws.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

## Performance Optimizations

### 1. Enable Compression
Most hosting platforms automatically enable gzip compression.

### 2. CDN Resources
The app uses CDN for:
- Tailwind CSS
- Supabase SDK
- Google Fonts

### 3. Image Optimization
Images are loaded from Unsplash CDN with optimized parameters.

## SSL/HTTPS
Both Vercel and Netlify provide automatic HTTPS certificates.

## Custom Domain Setup

### For Vercel:
1. Go to your project dashboard
2. Settings → Domains
3. Add your domain
4. Update DNS records as instructed

### For Netlify:
1. Site Settings → Domain Management
2. Add custom domain
3. Configure DNS

## Monitoring & Analytics

### Add Google Analytics (Optional):
```html
<!-- Add to <head> of index.html -->
<script async src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'GA_MEASUREMENT_ID');
</script>
```

## Post-Deployment Checklist

- [ ] Test user registration
- [ ] Test login/logout
- [ ] Test AI chat functionality
- [ ] Test mood tracking
- [ ] Test all navigation links
- [ ] Test password reset
- [ ] Test responsive design on mobile
- [ ] Verify all images load correctly
- [ ] Test emergency resources links

## Maintenance

### Regular Updates:
1. **Dependencies**: Update Supabase SDK when new versions are released
2. **Content**: Update blog posts and resources
3. **Security**: Monitor Supabase for security updates

### Backup:
- Database backups handled by Supabase
- Code backups in GitHub repository

---

## 🎉 Your Mental Health AI is Ready for Production!

The application is now fully optimized and ready for users. All features are working, non-functional elements removed, and the codebase is production-ready.
