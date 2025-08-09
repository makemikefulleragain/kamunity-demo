-- News System Database Migration
-- Creates news_items and news_comments tables with comprehensive RLS and indexes
-- Following security-first best practices

-- News Items Table
CREATE TABLE IF NOT EXISTS news_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(255) NOT NULL CHECK (length(trim(title)) > 0),
  content TEXT NOT NULL CHECK (length(trim(content)) > 0),
  summary TEXT,
  content_type VARCHAR(50) NOT NULL CHECK (content_type IN ('room_summary', 'chat_highlight', 'kamunity_story', 'external_story')),
  source_id UUID, -- References room/chat ID for summaries
  author_id UUID REFERENCES users(id) ON DELETE SET NULL,
  category VARCHAR(50),
  tags TEXT[] DEFAULT '{}',
  image_url VARCHAR(500),
  external_url VARCHAR(500),
  engagement_score INTEGER DEFAULT 0 CHECK (engagement_score >= 0),
  comment_count INTEGER DEFAULT 0 CHECK (comment_count >= 0),
  is_promoted_to_chat BOOLEAN DEFAULT FALSE,
  promoted_chat_id UUID,
  is_published BOOLEAN DEFAULT TRUE,
  is_deleted BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- News Comments Table
CREATE TABLE IF NOT EXISTS news_comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  news_item_id UUID REFERENCES news_items(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  content TEXT NOT NULL CHECK (length(trim(content)) > 0 AND length(content) <= 2000),
  parent_comment_id UUID REFERENCES news_comments(id), -- For future threading
  is_deleted BOOLEAN DEFAULT FALSE,
  is_flagged BOOLEAN DEFAULT FALSE,
  flag_reason TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Performance Indexes
CREATE INDEX IF NOT EXISTS idx_news_items_content_type ON news_items(content_type) WHERE is_published = TRUE AND is_deleted = FALSE;
CREATE INDEX IF NOT EXISTS idx_news_items_created_at ON news_items(created_at DESC) WHERE is_published = TRUE AND is_deleted = FALSE;
CREATE INDEX IF NOT EXISTS idx_news_items_engagement ON news_items(engagement_score DESC) WHERE is_published = TRUE AND is_deleted = FALSE;
CREATE INDEX IF NOT EXISTS idx_news_items_author ON news_items(author_id) WHERE is_published = TRUE AND is_deleted = FALSE;
CREATE INDEX IF NOT EXISTS idx_news_items_source ON news_items(source_id) WHERE source_id IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_news_comments_news_item ON news_comments(news_item_id) WHERE is_deleted = FALSE;
CREATE INDEX IF NOT EXISTS idx_news_comments_user ON news_comments(user_id) WHERE is_deleted = FALSE;
CREATE INDEX IF NOT EXISTS idx_news_comments_created_at ON news_comments(created_at DESC) WHERE is_deleted = FALSE;
CREATE INDEX IF NOT EXISTS idx_news_comments_parent ON news_comments(parent_comment_id) WHERE parent_comment_id IS NOT NULL;

-- Trigger to update comment count
CREATE OR REPLACE FUNCTION update_news_item_comment_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' AND NEW.is_deleted = FALSE THEN
    UPDATE news_items 
    SET comment_count = comment_count + 1,
        updated_at = NOW()
    WHERE id = NEW.news_item_id;
  ELSIF TG_OP = 'UPDATE' THEN
    -- Handle soft delete
    IF OLD.is_deleted = FALSE AND NEW.is_deleted = TRUE THEN
      UPDATE news_items 
      SET comment_count = GREATEST(0, comment_count - 1),
          updated_at = NOW()
      WHERE id = NEW.news_item_id;
    ELSIF OLD.is_deleted = TRUE AND NEW.is_deleted = FALSE THEN
      UPDATE news_items 
      SET comment_count = comment_count + 1,
          updated_at = NOW()
      WHERE id = NEW.news_item_id;
    END IF;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE news_items 
    SET comment_count = GREATEST(0, comment_count - 1),
        updated_at = NOW()
    WHERE id = OLD.news_item_id;
  END IF;
  
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_comment_count
  AFTER INSERT OR UPDATE OR DELETE ON news_comments
  FOR EACH ROW EXECUTE FUNCTION update_news_item_comment_count();

-- Trigger to update engagement score based on comments
CREATE OR REPLACE FUNCTION update_engagement_score()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE news_items 
  SET engagement_score = (
    -- Base score from comment count
    comment_count * 5 +
    -- Recency boost (higher score for newer items)
    CASE 
      WHEN created_at > NOW() - INTERVAL '24 hours' THEN 50
      WHEN created_at > NOW() - INTERVAL '7 days' THEN 20
      WHEN created_at > NOW() - INTERVAL '30 days' THEN 10
      ELSE 0
    END
  ),
  updated_at = NOW()
  WHERE id = NEW.news_item_id;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_engagement_score
  AFTER INSERT OR UPDATE ON news_comments
  FOR EACH ROW EXECUTE FUNCTION update_engagement_score();

-- Enable Row Level Security
ALTER TABLE news_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE news_comments ENABLE ROW LEVEL SECURITY;

-- RLS Policies for news_items
-- Public read access for published, non-deleted items
CREATE POLICY "Anyone can view published news items" ON news_items
  FOR SELECT USING (is_published = TRUE AND is_deleted = FALSE);

-- Authenticated users can create news items
CREATE POLICY "Authenticated users can create news items" ON news_items
  FOR INSERT WITH CHECK (
    auth.uid() IS NOT NULL 
    AND author_id = auth.uid()
  );

-- Authors can update their own news items
CREATE POLICY "Authors can update their news items" ON news_items
  FOR UPDATE USING (
    auth.uid() = author_id
  ) WITH CHECK (
    auth.uid() = author_id
  );

-- System can update for automated processes (engagement scores, etc.)
CREATE POLICY "System can update news items" ON news_items
  FOR UPDATE USING (
    current_setting('role') = 'service_role'
  );

-- RLS Policies for news_comments
-- Public read access for non-deleted, non-flagged comments
CREATE POLICY "Anyone can view comments" ON news_comments
  FOR SELECT USING (
    is_deleted = FALSE 
    AND is_flagged = FALSE
  );

-- Authenticated users can create comments
CREATE POLICY "Authenticated users can create comments" ON news_comments
  FOR INSERT WITH CHECK (
    auth.uid() IS NOT NULL 
    AND user_id = auth.uid()
    AND content IS NOT NULL
    AND length(trim(content)) > 0
  );

-- Users can update their own comments (for editing)
CREATE POLICY "Users can update their comments" ON news_comments
  FOR UPDATE USING (
    auth.uid() = user_id
  ) WITH CHECK (
    auth.uid() = user_id
    AND (OLD.content != NEW.content OR OLD.is_deleted != NEW.is_deleted)
  );

-- System can update for moderation
CREATE POLICY "System can moderate comments" ON news_comments
  FOR UPDATE USING (
    current_setting('role') = 'service_role'
  );

-- Create comment reporting table for moderation
CREATE TABLE IF NOT EXISTS news_comment_reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  comment_id UUID REFERENCES news_comments(id) ON DELETE CASCADE,
  reporter_user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  reason VARCHAR(50) NOT NULL CHECK (reason IN ('spam', 'inappropriate', 'harassment', 'misinformation', 'other')),
  description TEXT,
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'reviewed', 'resolved', 'dismissed')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  reviewed_at TIMESTAMP WITH TIME ZONE,
  reviewed_by UUID REFERENCES users(id)
);

CREATE INDEX IF NOT EXISTS idx_comment_reports_comment ON news_comment_reports(comment_id);
CREATE INDEX IF NOT EXISTS idx_comment_reports_status ON news_comment_reports(status);

-- RLS for comment reports
ALTER TABLE news_comment_reports ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can create reports" ON news_comment_reports
  FOR INSERT WITH CHECK (
    auth.uid() IS NOT NULL 
    AND reporter_user_id = auth.uid()
  );

CREATE POLICY "Users can view their own reports" ON news_comment_reports
  FOR SELECT USING (
    auth.uid() = reporter_user_id
  );

-- Function to auto-flag comments with multiple reports
CREATE OR REPLACE FUNCTION auto_flag_reported_comments()
RETURNS TRIGGER AS $$
DECLARE
  report_count INTEGER;
BEGIN
  -- Count reports for this comment
  SELECT COUNT(*) INTO report_count
  FROM news_comment_reports
  WHERE comment_id = NEW.comment_id AND status = 'pending';
  
  -- Auto-flag if 3 or more reports
  IF report_count >= 3 THEN
    UPDATE news_comments
    SET is_flagged = TRUE,
        flag_reason = 'Multiple community reports'
    WHERE id = NEW.comment_id;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_auto_flag_comments
  AFTER INSERT ON news_comment_reports
  FOR EACH ROW EXECUTE FUNCTION auto_flag_reported_comments();

-- Seed some initial news items for demo
INSERT INTO news_items (title, content, summary, content_type, category, tags, engagement_score) VALUES
(
  'Welcome to the Kamunity News Hub!',
  'This is where we share inspiring stories from our community, highlight amazing conversations happening in our rooms and chats, and celebrate the collective impact we''re creating together. Every story here represents real people making real change in their communities.',
  'Introducing our community news hub where stories inspire action and connections create change.',
  'kamunity_story',
  'Platform Updates',
  ARRAY['welcome', 'community', 'introduction'],
  75
),
(
  'Community Spotlight: Local Food Bank Initiative',
  'Sarah M. started a conversation in our "Community Action" chat about food insecurity in her neighborhood. Within 48 hours, 12 community members had joined the discussion, sharing resources and coordinating a weekend food drive. The chat was promoted to a Focus Room where they''ve now organized monthly distributions serving 200+ families.',
  'A simple chat conversation grew into a community food bank serving 200+ families monthly.',
  'room_summary',
  'Success Stories',
  ARRAY['food-security', 'community-action', 'success-story'],
  92
),
(
  'Tech for Good: Coding Bootcamp for Underserved Youth',
  'The "Digital Equity" room has been buzzing with activity as members collaborate on launching a free coding bootcamp. Local software engineers are volunteering as mentors, community centers are providing space, and local businesses are sponsoring equipment. The first cohort of 25 students starts next month!',
  'Community members collaborate to launch free coding bootcamp for 25 underserved youth.',
  'room_summary',
  'Education',
  ARRAY['technology', 'education', 'youth', 'mentorship'],
  88
),
(
  'Mental Health Support Network Grows',
  'What started as a few people sharing resources in our "Wellness & Support" chat has evolved into a comprehensive peer support network. The group now hosts weekly virtual check-ins, maintains a resource database, and has trained 15 peer counselors. They''ve helped over 100 community members access mental health resources.',
  'Peer support network provides mental health resources and support to 100+ community members.',
  'chat_highlight',
  'Health & Wellness',
  ARRAY['mental-health', 'peer-support', 'wellness', 'community-care'],
  95
),
(
  'Environmental Action: Community Garden Project',
  'The "Green Spaces" room has transformed an abandoned lot into a thriving community garden! Over 30 families now have garden plots, children learn about sustainable farming, and the harvest is shared with local food pantries. The project has inspired similar initiatives in three neighboring communities.',
  'Community garden project transforms abandoned lot, serves 30 families and inspires neighboring communities.',
  'room_summary',
  'Environment',
  ARRAY['sustainability', 'community-garden', 'environment', 'food-security'],
  90
);

-- Add some initial comments to create engagement
INSERT INTO news_comments (news_item_id, user_id, content) 
SELECT 
  ni.id,
  u.id,
  CASE 
    WHEN ni.title LIKE '%Welcome%' THEN 
      CASE 
        WHEN u.name LIKE '%Sarah%' THEN 'So excited to be part of this community! Looking forward to sharing our local initiatives.'
        WHEN u.name LIKE '%Mike%' THEN 'This is exactly what we need - a place where good people can coordinate good work!'
        ELSE 'Love the vision here. Ready to get involved and make a difference!'
      END
    WHEN ni.title LIKE '%Food Bank%' THEN
      CASE 
        WHEN u.name LIKE '%Sarah%' THEN 'This project has been incredible! We''ve already helped so many families in our area.'
        WHEN u.name LIKE '%Mike%' THEN 'Amazing example of how online conversations can create real-world impact.'
        ELSE 'Would love to start something similar in my community. Any tips for getting started?'
      END
    WHEN ni.title LIKE '%Coding Bootcamp%' THEN
      CASE 
        WHEN u.name LIKE '%Sarah%' THEN 'As a software engineer, I''m volunteering as a mentor. These students are so motivated!'
        WHEN u.name LIKE '%Mike%' THEN 'This is how we bridge the digital divide - through community action and mentorship.'
        ELSE 'My company would love to sponsor equipment for future cohorts. How can we get involved?'
      END
    ELSE 'This is such inspiring work! Thank you for sharing and showing what''s possible.'
  END
FROM news_items ni
CROSS JOIN (
  SELECT id, name FROM users 
  WHERE email_subscribed = true 
  LIMIT 3
) u
WHERE ni.content_type IN ('room_summary', 'chat_highlight', 'kamunity_story')
LIMIT 15;

-- Update comment counts based on actual comments
UPDATE news_items 
SET comment_count = (
  SELECT COUNT(*) 
  FROM news_comments 
  WHERE news_item_id = news_items.id 
  AND is_deleted = FALSE
);

COMMENT ON TABLE news_items IS 'Community news items including room summaries, chat highlights, and stories';
COMMENT ON TABLE news_comments IS 'Comments on news items with moderation and reporting features';
COMMENT ON TABLE news_comment_reports IS 'Community reporting system for comment moderation';
