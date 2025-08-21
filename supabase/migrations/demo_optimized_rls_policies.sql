-- Demo-Optimized RLS Policies for Kamunity Demo
-- Context: 200 users, few hours, demo-only (never production)
-- Priority: Functionality > Security, User Experience > Data Protection

-- Drop all existing restrictive policies
DROP POLICY IF EXISTS "Users can view their own profile" ON users;
DROP POLICY IF EXISTS "Users can update their own profile" ON users;
DROP POLICY IF EXISTS "Users can insert their own profile" ON users;
DROP POLICY IF EXISTS "Enable read access for all users" ON rooms;
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON rooms;
DROP POLICY IF EXISTS "Enable read access for all users" ON messages;
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON messages;
DROP POLICY IF EXISTS "Enable read access for all users" ON news_items;
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON news_items;
DROP POLICY IF EXISTS "Enable read access for all users" ON news_comments;
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON news_comments;
DROP POLICY IF EXISTS "Enable read access for all users" ON analytics_events;
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON analytics_events;
DROP POLICY IF EXISTS "Enable read access for all users" ON user_sessions;
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON user_sessions;
DROP POLICY IF EXISTS "Enable read access for all users" ON reactions;
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON reactions;
DROP POLICY IF EXISTS "Enable read access for all users" ON room_participants;
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON room_participants;

-- DEMO-OPTIMIZED MAXIMALLY PERMISSIVE POLICIES
-- These prioritize functionality and user experience for demo context

-- Users table: Allow all operations for demo
CREATE POLICY "Demo: Allow all user operations" ON users
  FOR ALL
  USING (true)
  WITH CHECK (true);

-- Rooms table: Allow all operations
CREATE POLICY "Demo: Allow all room operations" ON rooms
  FOR ALL
  USING (true)
  WITH CHECK (true);

-- Messages table: Allow all operations
CREATE POLICY "Demo: Allow all message operations" ON messages
  FOR ALL
  USING (true)
  WITH CHECK (true);

-- News items table: Allow all operations
CREATE POLICY "Demo: Allow all news operations" ON news_items
  FOR ALL
  USING (true)
  WITH CHECK (true);

-- News comments table: Allow all operations
CREATE POLICY "Demo: Allow all comment operations" ON news_comments
  FOR ALL
  USING (true)
  WITH CHECK (true);

-- Analytics events table: Allow all operations for comprehensive tracking
CREATE POLICY "Demo: Allow all analytics operations" ON analytics_events
  FOR ALL
  USING (true)
  WITH CHECK (true);

-- User sessions table: Allow all operations for session tracking
CREATE POLICY "Demo: Allow all session operations" ON user_sessions
  FOR ALL
  USING (true)
  WITH CHECK (true);

-- Reactions table: Allow all operations
CREATE POLICY "Demo: Allow all reaction operations" ON reactions
  FOR ALL
  USING (true)
  WITH CHECK (true);

-- Room participants table: Allow all operations
CREATE POLICY "Demo: Allow all participant operations" ON room_participants
  FOR ALL
  USING (true)
  WITH CHECK (true);

-- Enable RLS on all tables (but with permissive policies)
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE rooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE news_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE news_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE analytics_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE reactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE room_participants ENABLE ROW LEVEL SECURITY;

-- Create indexes for demo performance (200 concurrent users)
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_username ON users(username);
CREATE INDEX IF NOT EXISTS idx_messages_room_id ON messages(room_id);
CREATE INDEX IF NOT EXISTS idx_messages_created_at ON messages(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_analytics_events_user_id ON analytics_events(user_id);
CREATE INDEX IF NOT EXISTS idx_analytics_events_session_id ON analytics_events(session_id);
CREATE INDEX IF NOT EXISTS idx_analytics_events_created_at ON analytics_events(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_news_comments_news_item_id ON news_comments(news_item_id);
CREATE INDEX IF NOT EXISTS idx_user_sessions_user_id ON user_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_user_sessions_session_id ON user_sessions(session_id);

-- Grant necessary permissions for demo functionality
GRANT ALL ON ALL TABLES IN SCHEMA public TO authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO anon;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO authenticated;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO anon;

COMMIT;
