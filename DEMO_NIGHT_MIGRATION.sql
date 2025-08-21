-- ============================================================================
-- KAMUNITY DEMO NIGHT - MANUAL SQL MIGRATION
-- ============================================================================
-- Execute this ENTIRE script in Supabase SQL Editor
-- ============================================================================

-- Step 1: Create Missing Tables
-- ============================================================================

-- News Items Table
CREATE TABLE IF NOT EXISTS public.news_items (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    summary TEXT,
    category VARCHAR(50) DEFAULT 'general',
    author VARCHAR(100),
    source_url VARCHAR(500),
    image_url VARCHAR(500),
    published_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    view_count INTEGER DEFAULT 0,
    comment_count INTEGER DEFAULT 0,
    engagement_score DECIMAL(10,2) DEFAULT 0,
    is_featured BOOLEAN DEFAULT false,
    is_active BOOLEAN DEFAULT true
);

-- News Comments Table
CREATE TABLE IF NOT EXISTS public.news_comments (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    news_item_id UUID REFERENCES public.news_items(id) ON DELETE CASCADE,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    parent_comment_id UUID REFERENCES public.news_comments(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    is_deleted BOOLEAN DEFAULT false,
    is_flagged BOOLEAN DEFAULT false
);

-- User Sessions Table
CREATE TABLE IF NOT EXISTS public.user_sessions (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    session_id VARCHAR(100) NOT NULL,
    device_info JSONB,
    ip_address INET,
    user_agent TEXT,
    started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    ended_at TIMESTAMP WITH TIME ZONE,
    last_activity TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    demo_context JSONB,
    is_active BOOLEAN DEFAULT true
);

-- Analytics Events Table
CREATE TABLE IF NOT EXISTS public.analytics_events (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
    session_id VARCHAR(100),
    event_type VARCHAR(50) NOT NULL,
    event_data JSONB,
    page_url VARCHAR(500),
    referrer VARCHAR(500),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    demo_phase VARCHAR(50),
    user_journey_stage VARCHAR(50)
);

-- Step 2: Create Performance Indexes
-- ============================================================================

CREATE INDEX IF NOT EXISTS idx_news_items_created_at ON public.news_items(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_news_items_category ON public.news_items(category);
CREATE INDEX IF NOT EXISTS idx_news_items_active ON public.news_items(is_active);

CREATE INDEX IF NOT EXISTS idx_news_comments_news_item ON public.news_comments(news_item_id);
CREATE INDEX IF NOT EXISTS idx_news_comments_user ON public.news_comments(user_id);
CREATE INDEX IF NOT EXISTS idx_news_comments_created_at ON public.news_comments(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_user_sessions_user ON public.user_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_user_sessions_session ON public.user_sessions(session_id);
CREATE INDEX IF NOT EXISTS idx_user_sessions_active ON public.user_sessions(is_active);

CREATE INDEX IF NOT EXISTS idx_analytics_events_user ON public.analytics_events(user_id);
CREATE INDEX IF NOT EXISTS idx_analytics_events_session ON public.analytics_events(session_id);
CREATE INDEX IF NOT EXISTS idx_analytics_events_type ON public.analytics_events(event_type);
CREATE INDEX IF NOT EXISTS idx_analytics_events_created_at ON public.analytics_events(created_at DESC);

-- Step 3: Enable RLS on All Tables
-- ============================================================================

ALTER TABLE public.news_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.news_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.analytics_events ENABLE ROW LEVEL SECURITY;

-- Ensure existing tables have RLS enabled
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.room_participants ENABLE ROW LEVEL SECURITY;

-- Step 4: Drop Existing Restrictive Policies
-- ============================================================================

DROP POLICY IF EXISTS "Users can view their own profile" ON public.users;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.users;
DROP POLICY IF EXISTS "Users can insert their own profile" ON public.users;
DROP POLICY IF EXISTS "Demo: Allow all user operations" ON public.users;
DROP POLICY IF EXISTS "Enable read access for all users" ON public.rooms;
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON public.rooms;
DROP POLICY IF EXISTS "Enable read access for all users" ON public.messages;
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON public.messages;
DROP POLICY IF EXISTS "Enable read access for all users" ON public.articles;
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON public.articles;
DROP POLICY IF EXISTS "Enable read access for all users" ON public.reactions;
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON public.reactions;
DROP POLICY IF EXISTS "Enable read access for all users" ON public.room_participants;
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON public.room_participants;

-- Step 5: Create Demo-Optimized Maximally Permissive Policies
-- ============================================================================

CREATE POLICY "Demo: Allow all user operations" ON public.users FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Demo: Allow all room operations" ON public.rooms FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Demo: Allow all message operations" ON public.messages FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Demo: Allow all article operations" ON public.articles FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Demo: Allow all reaction operations" ON public.reactions FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Demo: Allow all participant operations" ON public.room_participants FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Demo: Allow all news_items operations" ON public.news_items FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Demo: Allow all news_comments operations" ON public.news_comments FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Demo: Allow all user_sessions operations" ON public.user_sessions FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Demo: Allow all analytics_events operations" ON public.analytics_events FOR ALL USING (true) WITH CHECK (true);

-- Step 6: Grant Permissions
-- ============================================================================

GRANT ALL ON public.users TO authenticated, anon;
GRANT ALL ON public.rooms TO authenticated, anon;
GRANT ALL ON public.messages TO authenticated, anon;
GRANT ALL ON public.articles TO authenticated, anon;
GRANT ALL ON public.reactions TO authenticated, anon;
GRANT ALL ON public.room_participants TO authenticated, anon;
GRANT ALL ON public.news_items TO authenticated, anon;
GRANT ALL ON public.news_comments TO authenticated, anon;
GRANT ALL ON public.user_sessions TO authenticated, anon;
GRANT ALL ON public.analytics_events TO authenticated, anon;

GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO authenticated, anon;

-- Step 7: Insert Demo Seed Data
-- ============================================================================

INSERT INTO public.news_items (title, content, summary, category, author, is_featured, is_active) VALUES
('Welcome to Kamunity Demo', 'This is a sample news item to demonstrate the platform capabilities during our demo session.', 'Demo welcome message', 'announcement', 'Kamunity Team', true, true),
('Community Building Best Practices', 'Learn how successful communities grow from small groups to thriving ecosystems through democratic participation and transparent governance.', 'Guide to community growth', 'guide', 'Community Expert', false, true),
('The Future of Collective Action', 'Exploring how technology enables new forms of collaboration and collective decision-making in the digital age.', 'Technology and collaboration trends', 'insights', 'Tech Analyst', false, true)
ON CONFLICT DO NOTHING;
