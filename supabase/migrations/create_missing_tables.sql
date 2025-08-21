-- Create Missing Database Tables for Kamunity Demo
-- Context: Demo-optimized tables for news system and user sessions
-- Priority: Functionality > Complex Relations

-- News Items table (replaces articles for news system)
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
    -- Engagement metrics
    view_count INTEGER DEFAULT 0,
    comment_count INTEGER DEFAULT 0,
    engagement_score DECIMAL(10,2) DEFAULT 0,
    -- Demo flags
    is_featured BOOLEAN DEFAULT false,
    is_active BOOLEAN DEFAULT true
);

-- News Comments table
CREATE TABLE IF NOT EXISTS public.news_comments (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    news_item_id UUID REFERENCES public.news_items(id) ON DELETE CASCADE,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    parent_comment_id UUID REFERENCES public.news_comments(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    -- Moderation
    is_deleted BOOLEAN DEFAULT false,
    is_flagged BOOLEAN DEFAULT false
);

-- User Sessions table for analytics continuity
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
    -- Demo tracking
    demo_context JSONB,
    is_active BOOLEAN DEFAULT true
);

-- Analytics Events table (if missing)
CREATE TABLE IF NOT EXISTS public.analytics_events (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
    session_id VARCHAR(100),
    event_type VARCHAR(50) NOT NULL,
    event_data JSONB,
    page_url VARCHAR(500),
    referrer VARCHAR(500),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    -- Demo context
    demo_phase VARCHAR(50),
    user_journey_stage VARCHAR(50)
);

-- Create indexes for performance
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

-- Enable RLS on new tables
ALTER TABLE public.news_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.news_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.analytics_events ENABLE ROW LEVEL SECURITY;

-- Demo-optimized maximally permissive policies
CREATE POLICY "Demo: Allow all news_items operations" ON public.news_items
    FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Demo: Allow all news_comments operations" ON public.news_comments
    FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Demo: Allow all user_sessions operations" ON public.user_sessions
    FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Demo: Allow all analytics_events operations" ON public.analytics_events
    FOR ALL USING (true) WITH CHECK (true);

-- Grant permissions to authenticated and anonymous users
GRANT ALL ON public.news_items TO authenticated;
GRANT ALL ON public.news_items TO anon;

GRANT ALL ON public.news_comments TO authenticated;
GRANT ALL ON public.news_comments TO anon;

GRANT ALL ON public.user_sessions TO authenticated;
GRANT ALL ON public.user_sessions TO anon;

GRANT ALL ON public.analytics_events TO authenticated;
GRANT ALL ON public.analytics_events TO anon;

-- Grant sequence usage
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO authenticated;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO anon;

COMMIT;
