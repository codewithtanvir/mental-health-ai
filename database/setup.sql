-- Mental Health AI - Supabase Database Setup (Safe Version)
-- Run these SQL commands in your Supabase SQL editor
-- This version handles existing policies and tables gracefully

-- Enable Row Level Security (RLS)
-- This ensures users can only access their own data

-- 1. User Profiles Table
CREATE TABLE IF NOT EXISTS user_profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  date_of_birth DATE,
  gender TEXT CHECK (gender IN ('male', 'female', 'other', 'prefer_not_to_say')),
  phone TEXT,
  emergency_contact_name TEXT,
  emergency_contact_phone TEXT,
  privacy_settings JSONB DEFAULT '{"shareData": false, "analytics": false}',
  notification_preferences JSONB DEFAULT '{"email": true, "push": false, "sms": false}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on user_profiles
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist, then recreate them
DROP POLICY IF EXISTS "Users can view own profile" ON user_profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON user_profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON user_profiles;

-- Policy: Users can only see and edit their own profile
CREATE POLICY "Users can view own profile" ON user_profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON user_profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON user_profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- 2. Chat Sessions Table
CREATE TABLE IF NOT EXISTS chat_sessions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT,
  session_data JSONB,
  message_count INTEGER DEFAULT 0,
  started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_activity TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  is_active BOOLEAN DEFAULT true
);

-- Enable RLS on chat_sessions
ALTER TABLE chat_sessions ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist, then recreate them
DROP POLICY IF EXISTS "Users can view own chat sessions" ON chat_sessions;
DROP POLICY IF EXISTS "Users can insert own chat sessions" ON chat_sessions;
DROP POLICY IF EXISTS "Users can update own chat sessions" ON chat_sessions;
DROP POLICY IF EXISTS "Users can delete own chat sessions" ON chat_sessions;

-- Policy: Users can only access their own chat sessions
CREATE POLICY "Users can view own chat sessions" ON chat_sessions
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own chat sessions" ON chat_sessions
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own chat sessions" ON chat_sessions
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own chat sessions" ON chat_sessions
  FOR DELETE USING (auth.uid() = user_id);

-- 3. Chat Messages Table
CREATE TABLE IF NOT EXISTS chat_messages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  session_id UUID REFERENCES chat_sessions(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  message_type TEXT CHECK (message_type IN ('user', 'ai')) NOT NULL,
  content TEXT NOT NULL,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on chat_messages
ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist, then recreate them
DROP POLICY IF EXISTS "Users can view own chat messages" ON chat_messages;
DROP POLICY IF EXISTS "Users can insert own chat messages" ON chat_messages;

-- Policy: Users can only access messages from their own sessions
CREATE POLICY "Users can view own chat messages" ON chat_messages
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own chat messages" ON chat_messages
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- 4. Mood Tracking Table
CREATE TABLE IF NOT EXISTS mood_entries (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  mood_value INTEGER CHECK (mood_value BETWEEN 1 AND 5) NOT NULL,
  mood_emoji TEXT,
  notes TEXT,
  energy_level INTEGER CHECK (energy_level BETWEEN 1 AND 5),
  stress_level INTEGER CHECK (stress_level BETWEEN 1 AND 5),
  sleep_hours DECIMAL(3,1),
  activities TEXT[], -- Array of activities
  recorded_date DATE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, recorded_date) -- One mood entry per day
);

-- Enable RLS on mood_entries
ALTER TABLE mood_entries ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist, then recreate them
DROP POLICY IF EXISTS "Users can view own mood entries" ON mood_entries;
DROP POLICY IF EXISTS "Users can insert own mood entries" ON mood_entries;
DROP POLICY IF EXISTS "Users can update own mood entries" ON mood_entries;
DROP POLICY IF EXISTS "Users can delete own mood entries" ON mood_entries;

-- Policy: Users can only access their own mood entries
CREATE POLICY "Users can view own mood entries" ON mood_entries
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own mood entries" ON mood_entries
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own mood entries" ON mood_entries
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own mood entries" ON mood_entries
  FOR DELETE USING (auth.uid() = user_id);

-- 5. User Statistics Table
CREATE TABLE IF NOT EXISTS user_statistics (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
  total_chat_sessions INTEGER DEFAULT 0,
  total_messages INTEGER DEFAULT 0,
  active_days INTEGER DEFAULT 0,
  mood_entries_count INTEGER DEFAULT 0,
  articles_read INTEGER DEFAULT 0,
  goals_achieved INTEGER DEFAULT 0,
  last_activity TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on user_statistics
ALTER TABLE user_statistics ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist, then recreate them
DROP POLICY IF EXISTS "Users can view own statistics" ON user_statistics;
DROP POLICY IF EXISTS "Users can update own statistics" ON user_statistics;
DROP POLICY IF EXISTS "Users can insert own statistics" ON user_statistics;

-- Policy: Users can only access their own statistics
CREATE POLICY "Users can view own statistics" ON user_statistics
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update own statistics" ON user_statistics
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own statistics" ON user_statistics
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- 6. Emergency Contacts Table
CREATE TABLE IF NOT EXISTS emergency_contacts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  relationship TEXT,
  phone TEXT NOT NULL,
  email TEXT,
  is_primary BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on emergency_contacts
ALTER TABLE emergency_contacts ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist, then recreate them
DROP POLICY IF EXISTS "Users can view own emergency contacts" ON emergency_contacts;
DROP POLICY IF EXISTS "Users can insert own emergency contacts" ON emergency_contacts;
DROP POLICY IF EXISTS "Users can update own emergency contacts" ON emergency_contacts;
DROP POLICY IF EXISTS "Users can delete own emergency contacts" ON emergency_contacts;

-- Policy: Users can only access their own emergency contacts
CREATE POLICY "Users can view own emergency contacts" ON emergency_contacts
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own emergency contacts" ON emergency_contacts
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own emergency contacts" ON emergency_contacts
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own emergency contacts" ON emergency_contacts
  FOR DELETE USING (auth.uid() = user_id);

-- 7. App Settings Table (for admin and global settings)
CREATE TABLE IF NOT EXISTS app_settings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  setting_key TEXT UNIQUE NOT NULL,
  setting_value JSONB NOT NULL,
  description TEXT,
  is_public BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert default app settings (use ON CONFLICT to avoid duplicates)
INSERT INTO app_settings (setting_key, setting_value, description, is_public) VALUES
  ('maintenance_mode', 'false', 'Enable/disable maintenance mode', true),
  ('chat_enabled', 'true', 'Enable/disable chat functionality', true),
  ('registration_enabled', 'true', 'Enable/disable new user registration', true),
  ('max_daily_messages', '100', 'Maximum messages per user per day', false)
ON CONFLICT (setting_key) DO NOTHING;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_chat_sessions_user_id ON chat_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_chat_sessions_last_activity ON chat_sessions(last_activity);
CREATE INDEX IF NOT EXISTS idx_chat_messages_session_id ON chat_messages(session_id);
CREATE INDEX IF NOT EXISTS idx_chat_messages_created_at ON chat_messages(created_at);
CREATE INDEX IF NOT EXISTS idx_mood_entries_user_date ON mood_entries(user_id, recorded_date);
CREATE INDEX IF NOT EXISTS idx_mood_entries_recorded_date ON mood_entries(recorded_date);

-- Create functions for automatic timestamp updates
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for automatic timestamp updates (drop existing first)
DROP TRIGGER IF EXISTS update_user_profiles_updated_at ON user_profiles;
DROP TRIGGER IF EXISTS update_user_statistics_updated_at ON user_statistics;
DROP TRIGGER IF EXISTS update_app_settings_updated_at ON app_settings;

CREATE TRIGGER update_user_profiles_updated_at BEFORE UPDATE ON user_profiles 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_statistics_updated_at BEFORE UPDATE ON user_statistics 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_app_settings_updated_at BEFORE UPDATE ON app_settings 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to create user profile after signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.user_profiles (id, email, full_name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1))
  );
  
  INSERT INTO public.user_statistics (user_id)
  VALUES (NEW.id);
  
  RETURN NEW;
END;
$$ language 'plpgsql' security definer;

-- Trigger for automatic profile creation (drop existing first)
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Create a function to get user statistics
CREATE OR REPLACE FUNCTION get_user_statistics(user_uuid UUID)
RETURNS TABLE (
  total_chats BIGINT,
  total_messages BIGINT,
  mood_entries BIGINT,
  active_days BIGINT,
  avg_mood NUMERIC
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    COALESCE((SELECT COUNT(*) FROM chat_sessions WHERE user_id = user_uuid), 0) as total_chats,
    COALESCE((SELECT COUNT(*) FROM chat_messages WHERE user_id = user_uuid), 0) as total_messages,
    COALESCE((SELECT COUNT(*) FROM mood_entries WHERE user_id = user_uuid), 0) as mood_entries,
    COALESCE((SELECT COUNT(DISTINCT recorded_date) FROM mood_entries WHERE user_id = user_uuid), 0) as active_days,
    COALESCE((SELECT AVG(mood_value) FROM mood_entries WHERE user_id = user_uuid), 0) as avg_mood;
END;
$$ language 'plpgsql' security definer;

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO authenticated;

-- Public read access for app_settings (only public settings)
DROP POLICY IF EXISTS "Anyone can view public app settings" ON app_settings;
CREATE POLICY "Anyone can view public app settings" ON app_settings
  FOR SELECT USING (is_public = true);

COMMIT;
