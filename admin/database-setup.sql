-- Mental Health Website Admin Database Schema
-- Run these commands in your Supabase SQL editor

-- 1. Create blog_posts table
CREATE TABLE IF NOT -- Admins can see -- 10. Create polici-- 11. Create policies for system_settings
-- Only admins can manage settings
CREATE POLICY "Only admins can manage settings" ON system_settings
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM user_profiles 
            WHERE user_profiles.id = auth.uid() 
            AND user_profiles.role = 'admin'
        )
    );lytics
-- Only admins can access analytics
CREATE POLICY "Only admins can access analytics" ON analytics
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM user_profiles 
            WHERE user_profiles.id = auth.uid() 
            AND user_profiles.role = 'admin'
        )
    );es
CREATE POLICY "Admins can see all messages" ON chat_messages
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM user_profiles 
            WHERE user_profiles.id = auth.uid() 
            AND user_profiles.role = 'admin'
        )
    );og_posts (
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

-- 6. Insert default blog posts
INSERT INTO blog_posts (title, slug, excerpt, content, category, status, author, read_time, featured_image) VALUES 
(
    'মানসিক স্বাস্থ্য: একটি সম্পূর্ণ গাইড',
    'mental-health-guide',
    'মানসিক স্বাস্থ্য বলতে আমাদের মানসিক, আবেগময় এবং সামাজিক সুস্থতার অবস্থাকে বোঝায়। এটি আমাদের চিন্তাভাবনা, অনুভূতি এবং আচরণকে প্রভাবিত করে।',
    '<h2>মানসিক স্বাস্থ্য কী?</h2><p>মানসিক স্বাস্থ্য হল আমাদের সামগ্রিক সুস্থতার একটি গুরুত্বপূর্ণ অংশ। এটি শুধুমাত্র মানসিক রোগের অনুপস্থিতি নয়, বরং একটি সামগ্রিক সুস্থতার অবস্থা যেখানে একজন ব্যক্তি তার ক্ষমতা উপলব্ধি করতে পারে, জীবনের স্বাভাবিক চাপ মোকাবেলা করতে পারে, উৎপাদনশীলভাবে কাজ করতে পারে এবং তার সম্প্রদায়ে অবদান রাখতে পারে।</p><h3>মানসিক স্বাস্থ্যের গুরুত্ব</h3><ul><li>শারীরিক স্বাস্থ্যের উপর প্রভাব</li><li>সম্পর্কের গুণমান উন্নতি</li><li>কর্মক্ষেত্রে উৎপাদনশীলতা বৃদ্ধি</li><li>জীবনযাত্রার মান উন্নতি</li></ul><h3>সুস্থ মানসিক স্বাস্থ্যের লক্ষণ</h3><p>একজন মানসিকভাবে সুস্থ ব্যক্তির মধ্যে নিম্নলিখিত বৈশিষ্ট্য দেখা যায়:</p><ul><li>আবেগ নিয়ন্ত্রণের ক্ষমতা</li><li>স্ট্রেস মোকাবেলার দক্ষতা</li><li>ভাল সামাজিক সম্পর্ক</li><li>আত্মবিশ্বাস এবং আত্মসম্মান</li><li>জীবনের প্রতি ইতিবাচক দৃষ্টিভঙ্গি</li></ul>',
    'mental-health',
    'published',
    'admin@example.com',
    8,
    'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?ixlib=rb-4.0.3'
),
(
    'ঘুম এবং মানসিক স্বাস্থ্যের সম্পর্ক',
    'sleep-mental-health',
    'ভাল ঘুম মানসিক স্বাস্থ্যের জন্য অত্যন্ত গুরুত্বপূর্ণ। দেখুন কীভাবে ঘুমের মান আপনার মানসিক সুস্থতাকে প্রভাবিত করে।',
    '<h2>ঘুম এবং মানসিক স্বাস্থ্য</h2><p>ঘুম এবং মানসিক স্বাস্থ্যের মধ্যে একটি গভীর সম্পর্ক রয়েছে। পর্যাপ্ত এবং গুণগত ঘুম আমাদের মানসিক সুস্থতার জন্য অপরিহার্য।</p><h3>ঘুমের অভাবের প্রভাব</h3><ul><li>বিষণ্নতা এবং উদ্বেগ বৃদ্ধি</li><li>মেজাজের ওঠানামা</li><li>স্মৃতিশক্তি এবং একাগ্রতার সমস্যা</li><li>সিদ্ধান্ত নেওয়ার ক্ষমতা হ্রাস</li></ul><h3>ভাল ঘুমের জন্য টিপস</h3><ul><li>নিয়মিত ঘুমের সময়সূচী</li><li>ঘুমের পরিবেশ উন্নত করুন</li><li>ক্যাফেইন এবং স্ক্রিন টাইম সীমিত করুন</li><li>শারীরিক ব্যায়াম করুন</li><li>শিথিলকরণ কৌশল অনুশীলন করুন</li></ul>',
    'sleep',
    'published',
    'admin@example.com',
    6,
    'https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?ixlib=rb-4.0.3'
),
(
    'ডিজিটাল যুগে মানসিক সুস্থতা',
    'digital-wellness',
    'প্রযুক্তির এই যুগে কীভাবে আমরা আমাদের মানসিক স্বাস্থ্য রক্ষা করতে পারি এবং ডিজিটাল ওয়েলনেস বজায় রাখতে পারি।',
    '<h2>ডিজিটাল যুগের চ্যালেঞ্জ</h2><p>আধুনিক প্রযুক্তি আমাদের জীবনকে সহজ করেছে, কিন্তু একই সাথে নতুন মানসিক স্বাস্থ্য চ্যালেঞ্জের সৃষ্টি করেছে।</p><h3>সাধারণ সমস্যাগুলি</h3><ul><li>সোশ্যাল মিডিয়া আসক্তি</li><li>FOMO (Fear of Missing Out)</li><li>অনলাইন হয়রানি</li><li>তথ্য অতিরিক্ততা</li><li>নিদ্রাহীনতা</li></ul><h3>ডিজিটাল ডিটক্স</h3><p>নিয়মিত ডিজিটাল ডিটক্স আমাদের মানসিক স্বাস্থ্যের জন্য উপকারী:</p><ul><li>নির্দিষ্ট সময় স্ক্রিন-ফ্রি রাখুন</li><li>সোশ্যাল মিডিয়া ব্যবহার সীমিত করুন</li><li>প্রকৃতির সাথে সময় কাটান</li><li>অফলাইন কার্যকলাপে অংশগ্রহণ করুন</li></ul>',
    'digital-wellness',
    'published',
    'admin@example.com',
    7,
    'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?ixlib=rb-4.0.3'
),
(
    'উদ্বেগ নিয়ন্ত্রণের কার্যকর উপায়',
    'anxiety-management',
    'উদ্বেগ একটি স্বাভাবিক আবেগ, কিন্তু অতিরিক্ত উদ্বেগ দৈনন্দিন জীবনে বাধা সৃষ্টি করতে পারে। জানুন উদ্বেগ নিয়ন্ত্রণের উপায়।',
    '<h2>উদ্বেগ কী এবং কেন হয়?</h2><p>উদ্বেগ হল একটি স্বাভাবিক প্রতিক্রিয়া যা আমাদের শরীর চাপের সময় দেয়। তবে অতিরিক্ত উদ্বেগ সমস্যার কারণ হতে পারে।</p><h3>উদ্বেগের লক্ষণ</h3><ul><li>হৃদস্পন্দন বৃদ্ধি</li><li>ঘামতে থাকা</li><li>নিঃশ্বাসের সমস্যা</li><li>অস্থিরতা</li><li>মনোযোগের অভাব</li></ul><h3>উদ্বেগ কমানোর কৌশল</h3><h4>শ্বাস-প্রশ্বাসের ব্যায়াম</h4><p>গভীর শ্বাস নেওয়া উদ্বেগ কমানোর একটি কার্যকর উপায়:</p><ul><li>৪ সেকেন্ড নিঃশ্বাস নিন</li><li>৪ সেকেন্ড ধরে রাখুন</li><li>৪ সেকেন্ড ছেড়ে দিন</li><li>এই প্রক্রিয়া পুনরাবৃত্তি করুন</li></ul><h4>মাইন্ডফুলনেস</h4><p>বর্তমান মুহূর্তে মনোযোগ দেওয়া উদ্বেগ কমাতে সাহায্য করে।</p>',
    'anxiety',
    'published',
    'admin@example.com',
    6,
    'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3'
),
(
    'মেডিটেশন: মানসিক শান্তির পথ',
    'meditation-guide',
    'মেডিটেশন একটি প্রাচীন অনুশীলন যা আধুনিক জীবনে মানসিক শান্তি এবং সুস্থতা আনতে পারে। শিখুন কীভাবে শুরু করবেন।',
    '<h2>মেডিটেশন কী?</h2><p>মেডিটেশন হল মনের একাগ্রতা এবং সচেতনতার অনুশীলন। এটি আমাদের মানসিক শান্তি এবং স্পষ্টতা আনতে সাহায্য করে।</p><h3>মেডিটেশনের উপকারিতা</h3><ul><li>স্ট্রেস কমায়</li><li>মনোযোগ বাড়ায়</li><li>আবেগিক নিয়ন্ত্রণ উন্নত করে</li><li>ঘুমের মান বাড়ায়</li><li>রক্তচাপ কমায়</li></ul><h3>শুরুকারীদের জন্য মেডিটেশন</h3><h4>৫ মিনিটের সহজ মেডিটেশন</h4><ol><li>আরামদায়ক ভঙ্গিতে বসুন</li><li>চোখ বন্ধ করুন</li><li>শ্বাস-প্রশ্বাসে মনোযোগ দিন</li><li>মন অন্যদিকে গেলে আবার শ্বাসে ফিরিয়ে আনুন</li><li>৫ মিনিট চালিয়ে যান</li></ol><h4>নিয়মিত অনুশীলনের টিপস</h4><ul><li>প্রতিদিন একই সময়ে করুন</li><li>ছোট সময় দিয়ে শুরু করুন</li><li>ধৈর্য রাখুন</li><li>গাইডেড মেডিটেশন ব্যবহার করুন</li></ul>',
    'meditation',
    'published',
    'admin@example.com',
    5,
    'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3'
),
(
    'মানসিক স্বাস্থ্যের কলঙ্ক দূর করা',
    'mental-health-stigma',
    'মানসিক স্বাস্থ্য নিয়ে সামাজিক কলঙ্ক একটি বড় সমস্যা। এই কলঙ্ক দূর করতে আমাদের সবার ভূমিка রয়েছে।',
    '<h2>মানসিক স্বাস্থ্যের কলঙ্ক</h2><p>মানসিক স্বাস্থ্য নিয়ে সামাজিক কলঙ্ক এবং ভুল ধারণা অনেক মানুষকে সাহায্য চাইতে বাধা দেয়।</p><h3>সাধারণ ভুল ধারণা</h3><ul><li>"মানসিক সমস্যা মানে পাগলামি"</li><li>"এটা দুর্বলতার লক্ষণ"</li><li>"নিজে নিজেই ঠিক হয়ে যাবে"</li><li>"শুধু চেষ্টা করলেই ভাল হয়ে যাবে"</li></ul><h3>সত্য ও তথ্য</h3><ul><li>মানসিক স্বাস্থ্য সমস্যা খুবই সাধারণ</li><li>এটি কোনো ব্যক্তিগত দুর্বলতা নয়</li><li>চিকিৎসায় উন্নতি সম্ভব</li><li>শিক্ষিত ও সফল মানুষেরাও এতে আক্রান্ত হন</li></ul><h3>কলঙ্ক দূর করার উপায়</h3><h4>সচেতনতা বৃদ্ধি</h4><ul><li>সঠিক তথ্য শেয়ার করুন</li><li>খোলামেলা আলোচনা করুন</li><li>অভিজ্ঞতা শেয়ার করুন</li></ul><h4>সহানুভূতিশীল আচরণ</h4><ul><li>বিচার না করে শুনুন</li><li>সমর্থন প্রদান করুন</li><li>পেশাদার সাহায্যের পরামর্শ দিন</li></ul>',
    'stigma',
    'published',
    'admin@example.com',
    7,
    'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3'
);

-- 7. Set up Row Level Security (RLS)
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE system_settings ENABLE ROW LEVEL SECURITY;

-- 8. Create policies for blog_posts
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

-- 9. Create policies for chat_messages
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
            WHERE user_profiles.user_id = auth.uid() 
            AND user_profiles.role = 'admin'
        )
    );

-- 10. Create policies for analytics
-- Only admins can access analytics
CREATE POLICY "Only admins can access analytics" ON analytics
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM user_profiles 
            WHERE user_profiles.user_id = auth.uid() 
            AND user_profiles.role = 'admin'
        )
    );

-- 11. Create policies for system_settings
-- Only admins can manage settings
CREATE POLICY "Only admins can manage settings" ON system_settings
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM user_profiles 
            WHERE user_profiles.user_id = auth.uid() 
            AND user_profiles.role = 'admin'
        )
    );

-- 12. Insert default system settings
INSERT INTO system_settings (setting_key, setting_value) VALUES 
('site_name', '"মানসিক স্বাস্থ্য কেন্দ্র"'),
('contact_email', '"contact@mentalhealth.com"'),
('daily_chat_limit', '50'),
('maintenance_mode', 'false'),
('registration_enabled', 'true')
ON CONFLICT (setting_key) DO NOTHING;

-- 13. Create admin user function
CREATE OR REPLACE FUNCTION create_admin_user(admin_email TEXT, admin_password TEXT, admin_name TEXT)
RETURNS TEXT AS $$
DECLARE
    new_user_id UUID;
BEGIN
    -- This function should be called manually by a database admin
    -- to create the first admin user
    
    -- Insert into user_profiles with admin role
    -- (The actual user creation should be done through Supabase Auth)
    
    RETURN 'Admin user setup instructions: 
    1. Create user through Supabase Auth with email: ' || admin_email || '
    2. Update user_profiles table to set role = ''admin'' for this user
    3. The user will then have admin access';
END;
$$ LANGUAGE plpgsql;

-- 14. Create function to promote user to admin
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

-- Instructions for creating first admin:
-- 1. Register a user normally through the website
-- 2. Run: SELECT promote_to_admin('admin@yourdomain.com');
-- 3. The user will now have admin access

-- 15. Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_blog_posts_status ON blog_posts(status);
CREATE INDEX IF NOT EXISTS idx_blog_posts_created_at ON blog_posts(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_chat_messages_user_id ON chat_messages(user_id);
CREATE INDEX IF NOT EXISTS idx_chat_messages_created_at ON chat_messages(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_user_profiles_role ON user_profiles(role);
CREATE INDEX IF NOT EXISTS idx_analytics_event_type ON analytics(event_type);
CREATE INDEX IF NOT EXISTS idx_analytics_created_at ON analytics(created_at DESC);
