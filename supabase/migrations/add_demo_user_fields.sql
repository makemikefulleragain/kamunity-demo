-- Migration: Add demo user fields for enhanced data collection
-- Date: 2025-08-07
-- Purpose: Support demo user onboarding with contextually relevant data

-- Add demo-specific fields to users table
ALTER TABLE public.users 
ADD COLUMN IF NOT EXISTS passion_area VARCHAR(100),
ADD COLUMN IF NOT EXISTS passion_description TEXT,
ADD COLUMN IF NOT EXISTS community_involvement_scale VARCHAR(20) CHECK (community_involvement_scale IN ('none', 'some', 'active', 'leader')),
ADD COLUMN IF NOT EXISTS community_involvement_types TEXT[], -- Array for multiple types
ADD COLUMN IF NOT EXISTS additional_interests TEXT,
ADD COLUMN IF NOT EXISTS is_demo_user BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS onboarding_completed BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS demo_session_id VARCHAR(50); -- For grouping demo participants

-- Create index for demo user queries
CREATE INDEX IF NOT EXISTS idx_users_demo ON public.users(is_demo_user, created_at);
CREATE INDEX IF NOT EXISTS idx_users_demo_session ON public.users(demo_session_id);

-- Update RLS policies to allow demo user creation
-- Allow anonymous users to create demo accounts
CREATE POLICY "Allow demo user creation" ON public.users
    FOR INSERT
    WITH CHECK (is_demo_user = true);

-- Allow demo users to read their own data
CREATE POLICY "Demo users can read own data" ON public.users
    FOR SELECT
    USING (auth.uid() = id OR is_demo_user = true);

-- Allow demo users to update their own profiles
CREATE POLICY "Demo users can update own data" ON public.users
    FOR UPDATE
    USING (auth.uid() = id)
    WITH CHECK (auth.uid() = id);

-- Create predefined passion areas for dropdown
CREATE TABLE IF NOT EXISTS public.passion_areas (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    emoji VARCHAR(10),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert predefined passion areas
INSERT INTO public.passion_areas (name, description, emoji) VALUES
('Education & Learning', 'Teaching, learning, knowledge sharing', '📚'),
('Environment & Sustainability', 'Climate action, conservation, green living', '🌱'),
('Technology & Innovation', 'Tech development, digital solutions, AI', '💻'),
('Health & Wellness', 'Physical health, mental health, healthcare', '🏥'),
('Arts & Creativity', 'Visual arts, music, writing, design', '🎨'),
('Social Justice & Equality', 'Human rights, equality, social change', '⚖️'),
('Community Building', 'Local communities, networking, collaboration', '🤝'),
('Entrepreneurship & Business', 'Startups, business development, innovation', '🚀'),
('Science & Research', 'Scientific research, discovery, analysis', '🔬'),
('Sports & Recreation', 'Athletics, outdoor activities, fitness', '⚽'),
('Other', 'Something else entirely', '🌟')
ON CONFLICT (name) DO NOTHING;

-- Enable RLS on passion_areas
ALTER TABLE public.passion_areas ENABLE ROW LEVEL SECURITY;

-- Allow public read access to passion areas
CREATE POLICY "Public read passion areas" ON public.passion_areas
    FOR SELECT
    TO public
    USING (is_active = true);

-- Create community involvement types reference
CREATE TABLE IF NOT EXISTS public.community_involvement_types (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    is_active BOOLEAN DEFAULT true
);

-- Insert community involvement types
INSERT INTO public.community_involvement_types (name, description) VALUES
('Online Communities', 'Discord, Reddit, Facebook groups, forums'),
('Local Groups', 'Neighborhood associations, local clubs, meetups'),
('Professional Networks', 'Industry associations, LinkedIn groups, conferences'),
('Volunteer Organizations', 'Non-profits, charities, community service'),
('Educational Communities', 'Alumni networks, study groups, academic societies'),
('Hobby Groups', 'Sports teams, hobby clubs, interest groups'),
('Religious/Spiritual', 'Religious congregations, spiritual communities'),
('Political/Advocacy', 'Political parties, advocacy groups, campaigns')
ON CONFLICT (name) DO NOTHING;

-- Enable RLS on community involvement types
ALTER TABLE public.community_involvement_types ENABLE ROW LEVEL SECURITY;

-- Allow public read access to community involvement types
CREATE POLICY "Public read community types" ON public.community_involvement_types
    FOR SELECT
    TO public
    USING (is_active = true);
