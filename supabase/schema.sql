-- Kamunity Database Schema
-- Following best practices: RLS enabled, proper indexing, foreign key constraints

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Users table with emoji avatar selection
CREATE TABLE public.users (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    username VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(100) NOT NULL,
    emoji_avatar VARCHAR(10) DEFAULT '😊',
    email_subscribed BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    last_seen TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Articles table for news content
CREATE TABLE public.articles (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    summary TEXT NOT NULL,
    extended_summary TEXT,
    category VARCHAR(50) NOT NULL,
    author VARCHAR(100),
    source_url VARCHAR(500),
    image_url VARCHAR(500),
    published_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    -- Emoji reaction counts for algorithm
    emoji_fun INTEGER DEFAULT 0,
    emoji_factual INTEGER DEFAULT 0,
    emoji_spicy INTEGER DEFAULT 0,
    emoji_nice INTEGER DEFAULT 0,
    emoji_weird INTEGER DEFAULT 0,
    emoji_intriguing INTEGER DEFAULT 0,
    -- Algorithm score (calculated field)
    engagement_score DECIMAL(10,2) DEFAULT 0
);

-- Emoji reactions table
CREATE TABLE public.reactions (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    article_id UUID REFERENCES public.articles(id) ON DELETE CASCADE,
    emoji_type VARCHAR(20) NOT NULL CHECK (emoji_type IN ('fun', 'factual', 'spicy', 'nice', 'weird', 'intriguing')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, article_id, emoji_type)
);

-- Rooms table for focus rooms
CREATE TABLE public.rooms (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    emoji_theme VARCHAR(10) NOT NULL,
    room_type VARCHAR(20) DEFAULT 'focus' CHECK (room_type IN ('chat', 'focus')),
    max_participants INTEGER DEFAULT 50,
    current_participants INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_by UUID REFERENCES public.users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Messages table for chat functionality
CREATE TABLE public.messages (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    room_id UUID REFERENCES public.rooms(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    message_type VARCHAR(20) DEFAULT 'text' CHECK (message_type IN ('text', 'system', 'emoji')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Room participants for tracking membership
CREATE TABLE public.room_participants (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    room_id UUID REFERENCES public.rooms(id) ON DELETE CASCADE,
    joined_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    last_active TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, room_id)
);

-- User sessions for concurrent user tracking
CREATE TABLE public.user_sessions (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    session_token VARCHAR(255) UNIQUE NOT NULL,
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Analytics events for demo insights
CREATE TABLE public.analytics_events (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
    event_type VARCHAR(50) NOT NULL,
    event_data JSONB,
    page_url VARCHAR(500),
    user_agent TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX idx_users_email ON public.users(email);
CREATE INDEX idx_users_username ON public.users(username);
CREATE INDEX idx_articles_published_at ON public.articles(published_at DESC);
CREATE INDEX idx_articles_engagement_score ON public.articles(engagement_score DESC);
CREATE INDEX idx_articles_category ON public.articles(category);
CREATE INDEX idx_reactions_user_id ON public.reactions(user_id);
CREATE INDEX idx_reactions_article_id ON public.reactions(article_id);
CREATE INDEX idx_messages_room_id ON public.messages(room_id);
CREATE INDEX idx_messages_created_at ON public.messages(created_at DESC);
CREATE INDEX idx_room_participants_room_id ON public.room_participants(room_id);
CREATE INDEX idx_analytics_events_created_at ON public.analytics_events(created_at DESC);

-- Row Level Security (RLS) Policies
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.room_participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.analytics_events ENABLE ROW LEVEL SECURITY;

-- Users can read their own data and update their profile
CREATE POLICY "Users can view own profile" ON public.users
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.users
    FOR UPDATE USING (auth.uid() = id);

-- Articles are publicly readable
CREATE POLICY "Articles are publicly readable" ON public.articles
    FOR SELECT USING (true);

-- Users can manage their own reactions
CREATE POLICY "Users can view all reactions" ON public.reactions
    FOR SELECT USING (true);

CREATE POLICY "Users can insert own reactions" ON public.reactions
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own reactions" ON public.reactions
    FOR DELETE USING (auth.uid() = user_id);

-- Rooms are publicly readable
CREATE POLICY "Rooms are publicly readable" ON public.rooms
    FOR SELECT USING (true);

-- Messages are readable by room participants
CREATE POLICY "Messages readable by participants" ON public.messages
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.room_participants 
            WHERE room_id = messages.room_id AND user_id = auth.uid()
        )
    );

CREATE POLICY "Users can insert messages in joined rooms" ON public.messages
    FOR INSERT WITH CHECK (
        auth.uid() = user_id AND
        EXISTS (
            SELECT 1 FROM public.room_participants 
            WHERE room_id = messages.room_id AND user_id = auth.uid()
        )
    );

-- Room participants policies
CREATE POLICY "Users can view room participants" ON public.room_participants
    FOR SELECT USING (true);

CREATE POLICY "Users can join rooms" ON public.room_participants
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can leave rooms" ON public.room_participants
    FOR DELETE USING (auth.uid() = user_id);

-- User sessions policies
CREATE POLICY "Users can manage own sessions" ON public.user_sessions
    FOR ALL USING (auth.uid() = user_id);

-- Analytics events - users can insert their own events
CREATE POLICY "Users can insert analytics events" ON public.analytics_events
    FOR INSERT WITH CHECK (auth.uid() = user_id OR user_id IS NULL);

-- Functions for updating emoji counts
CREATE OR REPLACE FUNCTION update_article_emoji_counts()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        -- Increment count
        UPDATE public.articles 
        SET 
            emoji_fun = emoji_fun + CASE WHEN NEW.emoji_type = 'fun' THEN 1 ELSE 0 END,
            emoji_factual = emoji_factual + CASE WHEN NEW.emoji_type = 'factual' THEN 1 ELSE 0 END,
            emoji_spicy = emoji_spicy + CASE WHEN NEW.emoji_type = 'spicy' THEN 1 ELSE 0 END,
            emoji_nice = emoji_nice + CASE WHEN NEW.emoji_type = 'nice' THEN 1 ELSE 0 END,
            emoji_weird = emoji_weird + CASE WHEN NEW.emoji_type = 'weird' THEN 1 ELSE 0 END,
            emoji_intriguing = emoji_intriguing + CASE WHEN NEW.emoji_type = 'intriguing' THEN 1 ELSE 0 END
        WHERE id = NEW.article_id;
        
        RETURN NEW;
    ELSIF TG_OP = 'DELETE' THEN
        -- Decrement count
        UPDATE public.articles 
        SET 
            emoji_fun = GREATEST(0, emoji_fun - CASE WHEN OLD.emoji_type = 'fun' THEN 1 ELSE 0 END),
            emoji_factual = GREATEST(0, emoji_factual - CASE WHEN OLD.emoji_type = 'factual' THEN 1 ELSE 0 END),
            emoji_spicy = GREATEST(0, emoji_spicy - CASE WHEN OLD.emoji_type = 'spicy' THEN 1 ELSE 0 END),
            emoji_nice = GREATEST(0, emoji_nice - CASE WHEN OLD.emoji_type = 'nice' THEN 1 ELSE 0 END),
            emoji_weird = GREATEST(0, emoji_weird - CASE WHEN OLD.emoji_type = 'weird' THEN 1 ELSE 0 END),
            emoji_intriguing = GREATEST(0, emoji_intriguing - CASE WHEN OLD.emoji_type = 'intriguing' THEN 1 ELSE 0 END)
        WHERE id = OLD.article_id;
        
        RETURN OLD;
    END IF;
    
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Trigger for emoji count updates
CREATE TRIGGER emoji_count_trigger
    AFTER INSERT OR DELETE ON public.reactions
    FOR EACH ROW EXECUTE FUNCTION update_article_emoji_counts();

-- Function to calculate engagement score
CREATE OR REPLACE FUNCTION calculate_engagement_score(article_id UUID)
RETURNS DECIMAL AS $$
DECLARE
    total_reactions INTEGER;
    reaction_diversity DECIMAL;
    recency_factor DECIMAL;
    article_age_hours DECIMAL;
BEGIN
    -- Get total reactions
    SELECT (emoji_fun + emoji_factual + emoji_spicy + emoji_nice + emoji_weird + emoji_intriguing)
    INTO total_reactions
    FROM public.articles WHERE id = article_id;
    
    -- Calculate reaction diversity (0-1 scale)
    SELECT CASE 
        WHEN total_reactions = 0 THEN 0
        ELSE (
            CASE WHEN emoji_fun > 0 THEN 1 ELSE 0 END +
            CASE WHEN emoji_factual > 0 THEN 1 ELSE 0 END +
            CASE WHEN emoji_spicy > 0 THEN 1 ELSE 0 END +
            CASE WHEN emoji_nice > 0 THEN 1 ELSE 0 END +
            CASE WHEN emoji_weird > 0 THEN 1 ELSE 0 END +
            CASE WHEN emoji_intriguing > 0 THEN 1 ELSE 0 END
        ) / 6.0
    END
    INTO reaction_diversity
    FROM public.articles WHERE id = article_id;
    
    -- Calculate recency factor (newer = higher score)
    SELECT EXTRACT(EPOCH FROM (NOW() - published_at)) / 3600.0
    INTO article_age_hours
    FROM public.articles WHERE id = article_id;
    
    recency_factor := GREATEST(0.1, 1.0 - (article_age_hours / 168.0)); -- 168 hours = 1 week
    
    -- Final score: reactions (40%) + diversity (30%) + recency (30%)
    RETURN (total_reactions * 0.4) + (reaction_diversity * 30.0) + (recency_factor * 30.0);
END;
$$ LANGUAGE plpgsql;

-- Function to update engagement scores
CREATE OR REPLACE FUNCTION update_engagement_scores()
RETURNS void AS $$
BEGIN
    UPDATE public.articles 
    SET engagement_score = calculate_engagement_score(id);
END;
$$ LANGUAGE plpgsql;
