# 🔧 Vercel Environment Variables Setup Guide

## ✅ **API Endpoint Created Successfully!**

Your Vercel deployment now has an API endpoint at:
**`/api/env`** - https://mental-health-nt1619bk3-tanvirrahman38s-projects.vercel.app/api/env

## 🔑 **Step-by-Step: Add Environment Variables to Vercel**

### 1. **Go to Vercel Dashboard**
- Visit: https://vercel.com/dashboard
- Click on your **`mental-health-ai`** project

### 2. **Navigate to Settings**
- Click the **"Settings"** tab
- Click **"Environment Variables"** in the left sidebar

### 3. **Add These Variables:**

#### **Required Variables:**
```
Name: GEMINI_API_KEY
Value: AIzaSyCyanEOeTKAQAZqGBjchstgP5p9Q73eZVg
Environment: Production
```

```
Name: SUPABASE_URL
Value: https://brecotrpmeiwktcffdws.supabase.co
Environment: Production
```

```
Name: SUPABASE_ANON_KEY
Value: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJyZWNvdHJwbWVpd2t0Y2ZmZHdzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ4NzM1MzcsImV4cCI6MjA3MDQ0OTUzN30.eixsq-rJ5JGDihhA1DVKPaXnycFnNRoUvER0HMnlnqI
Environment: Production
```

#### **Optional Variables:**
```
Name: NODE_ENV
Value: production
Environment: Production
```

```
Name: ENABLE_CHAT
Value: true
Environment: Production
```

```
Name: ADMIN_EMAIL
Value: admin@mentalhealth-ai.bd
Environment: Production
```

```
Name: SUPPORT_EMAIL
Value: support@mentalhealth-ai.bd
Environment: Production
```

### 4. **Save and Redeploy**
- After adding all variables, click **"Save"**
- Vercel will automatically redeploy your application
- Wait for the deployment to complete (usually 1-2 minutes)

## 🧪 **Testing the Integration**

### 1. **Test API Endpoint**
Visit: https://mental-health-nt1619bk3-tanvirrahman38s-projects.vercel.app/api/env

You should see a JSON response with your environment variables.

### 2. **Test Chat Functionality**
Visit: https://mental-health-nt1619bk3-tanvirrahman38s-projects.vercel.app/chat.html

- Open browser console (F12)
- Look for: "✅ Loaded configuration from Vercel API"
- Try sending a message to the AI chatbot

### 3. **Verify API Key Loading**
In the browser console, you should see:
```
✅ Loaded configuration from Vercel API
```

Instead of:
```
⚠️ No Gemini API key found in environment variables
```

## 🔧 **How It Works**

1. **Frontend Request**: Your app makes a request to `/api/env`
2. **Vercel API**: The serverless function reads environment variables
3. **Secure Response**: Returns variables as JSON to your frontend
4. **Configuration**: Your app uses these variables for API calls

## 🛠️ **Troubleshooting**

### If environment variables are not loading:

1. **Check Variables in Vercel Dashboard**
   - Ensure all variables are saved
   - Make sure they're set to "Production" environment

2. **Check API Endpoint**
   - Visit `/api/env` directly
   - Verify JSON response contains your variables

3. **Redeploy if Needed**
   ```bash
   npx vercel --prod
   ```

4. **Clear Browser Cache**
   - Hard refresh (Ctrl+Shift+R)
   - Clear browser cache and cookies

## 🎯 **Expected Result**

After setup, your Mental Health AI chat should:
- ✅ Load environment variables from Vercel
- ✅ Connect to Gemini API successfully
- ✅ Process chat messages without errors
- ✅ Show proper authentication status

## 📞 **Support**

If you encounter issues:
1. Check browser console for errors
2. Verify environment variables in Vercel dashboard
3. Test the `/api/env` endpoint directly
4. Ensure all values are correct (no extra spaces)

---

**Next Step**: Go to https://vercel.com/dashboard and add the environment variables! 🚀
