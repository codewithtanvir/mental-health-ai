# 🔧 Database Fix and Setup Guide

## ❌ **Issue Resolved**

**Error:** `column user_profiles.user_id does not exist`

**Cause:** The existing `user_profiles` table uses `id` as the primary key, but the admin system was trying to reference `user_id`.

## ✅ **Fixed Files**

1. **admin/database-setup.sql** - Updated all column references from `user_id` to `id`
2. **admin/admin-dashboard.js** - Fixed user profile queries
3. **js/auth.js** - Updated authentication queries

## 🚀 **Setup Instructions**

### Step 1: Run the Fixed Database Script

Copy and paste this **corrected version** into your Supabase SQL editor:

```sql
-- Mental Health Website Admin Database Schema (CORRECTED VERSION)
-- Run these commands in your Supabase SQL editor

-- 1. Create blog_posts table
CREATE TABLE IF NOT EXISTS blog_posts (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    excerpt TEXT NOT NULL,
    content TEXT NOT NULL,
    featured_image TEXT,
    category TEXT NOT NULL DEFAULT 'mental-health',
    status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published')),
    author TEXT NOT NULL,
    read_time INTEGER DEFAULT 5,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Add role column to user_profiles if it doesn't exist
ALTER TABLE user_profiles 
ADD COLUMN IF NOT EXISTS role TEXT DEFAULT 'user' CHECK (role IN ('user', 'admin'));

-- 3. Create or update chat_messages table
CREATE TABLE IF NOT EXISTS chat_messages (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    message TEXT NOT NULL,
    response TEXT,
    session_id TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Create analytics table for tracking
CREATE TABLE IF NOT EXISTS analytics (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    event_type TEXT NOT NULL,
    event_data JSONB,
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. Create system_settings table
CREATE TABLE IF NOT EXISTS system_settings (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    setting_key TEXT UNIQUE NOT NULL,
    setting_value JSONB NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 6. Set up Row Level Security (RLS)
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE system_settings ENABLE ROW LEVEL SECURITY;

-- 7. Create policies for blog_posts
-- Public can read published blogs
CREATE POLICY "Anyone can read published blogs" ON blog_posts
    FOR SELECT USING (status = 'published');

-- Admins can do everything with blogs
CREATE POLICY "Admins can manage blogs" ON blog_posts
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM user_profiles 
            WHERE user_profiles.id = auth.uid() 
            AND user_profiles.role = 'admin'
        )
    );

-- 8. Create policies for chat_messages
-- Users can only see their own messages
CREATE POLICY "Users can see own messages" ON chat_messages
    FOR SELECT USING (user_id = auth.uid());

-- Users can insert their own messages
CREATE POLICY "Users can insert own messages" ON chat_messages
    FOR INSERT WITH CHECK (user_id = auth.uid());

-- Admins can see all messages
CREATE POLICY "Admins can see all messages" ON chat_messages
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM user_profiles 
            WHERE user_profiles.id = auth.uid() 
            AND user_profiles.role = 'admin'
        )
    );

-- 9. Create policies for analytics
-- Only admins can access analytics
CREATE POLICY "Only admins can access analytics" ON analytics
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM user_profiles 
            WHERE user_profiles.id = auth.uid() 
            AND user_profiles.role = 'admin'
        )
    );

-- 10. Create policies for system_settings
-- Only admins can manage settings
CREATE POLICY "Only admins can manage settings" ON system_settings
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM user_profiles 
            WHERE user_profiles.id = auth.uid() 
            AND user_profiles.role = 'admin'
        )
    );

-- 11. Create function to promote user to admin
CREATE OR REPLACE FUNCTION promote_to_admin(user_email TEXT)
RETURNS BOOLEAN AS $$
BEGIN
    UPDATE user_profiles 
    SET role = 'admin' 
    WHERE id = (
        SELECT id FROM auth.users WHERE email = user_email
    );
    
    RETURN FOUND;
END;
$$ LANGUAGE plpgsql;

-- 12. Insert default system settings
INSERT INTO system_settings (setting_key, setting_value) VALUES 
('site_name', '"মানসিক স্বাস্থ্য কেন্দ্র"'),
('contact_email', '"contact@mentalhealth.com"'),
('daily_chat_limit', '50'),
('maintenance_mode', 'false'),
('registration_enabled', 'true')
ON CONFLICT (setting_key) DO NOTHING;

-- 13. Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_blog_posts_status ON blog_posts(status);
CREATE INDEX IF NOT EXISTS idx_blog_posts_created_at ON blog_posts(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_chat_messages_user_id ON chat_messages(user_id);
CREATE INDEX IF NOT EXISTS idx_chat_messages_created_at ON chat_messages(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_user_profiles_role ON user_profiles(role);
CREATE INDEX IF NOT EXISTS idx_analytics_event_type ON analytics(event_type);
CREATE INDEX IF NOT EXISTS idx_analytics_created_at ON analytics(created_at DESC);
```

### Step 2: Create Your First Admin User

1. **Register normally** through your website signup
2. **Run this command** in Supabase SQL editor:
   ```sql
   SELECT promote_to_admin('your-email@domain.com');
   ```
   Replace `your-email@domain.com` with your actual email

### Step 3: Insert Sample Blog Posts (Optional)

Run this to add sample blog content:

```sql
INSERT INTO blog_posts (title, slug, excerpt, content, category, status, author, read_time, featured_image) VALUES 
(
    'মানসিক স্বাস্থ্য: একটি সম্পূর্ণ গাইড',
    'mental-health-guide',
    'মানসিক স্বাস্থ্য বলতে আমাদের মানসিক, আবেগময় এবং সামাজিক সুস্থতার অবস্থাকে বোঝায়।',
    '<h2>মানসিক স্বাস্থ্য কী?</h2><p>মানসিক স্বাস্থ্য হল আমাদের সামগ্রিক সুস্থতার একটি গুরুত্বপূর্ণ অংশ।</p>',
    'mental-health',
    'published',
    'admin@example.com',
    8,
    'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?ixlib=rb-4.0.3'
);
```

## ✅ **Verification Steps**

1. **Check Role Column:**
   ```sql
   SELECT id, email, full_name, role FROM user_profiles LIMIT 5;
   ```

2. **Verify Admin User:**
   ```sql
   SELECT email, role FROM user_profiles WHERE role = 'admin';
   ```

3. **Test Blog Posts:**
   ```sql
   SELECT title, status, created_at FROM blog_posts LIMIT 3;
   ```

## 🎯 **Now You Can:**

1. ✅ Login with your admin account
2. ✅ Access the admin dashboard at `/admin/dashboard.html`
3. ✅ Create and manage blog posts
4. ✅ View user analytics
5. ✅ Monitor chat logs
6. ✅ Configure system settings

## 🔍 **Troubleshooting**

If you still get errors:

1. **Check column exists:**
   ```sql
   SELECT column_name FROM information_schema.columns 
   WHERE table_name = 'user_profiles' AND column_name = 'role';
   ```

2. **Manual role update:**
   ```sql
   UPDATE user_profiles SET role = 'admin' 
   WHERE email = 'your-email@domain.com';
   ```

3. **Verify policies:**
   ```sql
   SELECT policyname, tablename FROM pg_policies 
   WHERE tablename IN ('blog_posts', 'user_profiles');
   ```

## 🎉 **All Fixed!**

The database schema is now corrected and all files are updated to use the proper column names. Your admin system should work perfectly now! 🚀
