const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing Supabase environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

async function seedNewsContent() {
  try {
    console.log('🌱 Seeding news content...');

    // First, let's create the tables if they don't exist
    console.log('📋 Creating news system tables...');
    
    const createTablesSQL = `
      -- News Items Table
      CREATE TABLE IF NOT EXISTS news_items (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        title VARCHAR(255) NOT NULL CHECK (length(trim(title)) > 0),
        content TEXT NOT NULL CHECK (length(trim(content)) > 0),
        summary TEXT,
        content_type VARCHAR(50) NOT NULL CHECK (content_type IN ('room_summary', 'chat_highlight', 'kamunity_story', 'external_story')),
        source_id UUID,
        author_id UUID,
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
        user_id UUID,
        content TEXT NOT NULL CHECK (length(trim(content)) > 0 AND length(content) <= 2000),
        parent_comment_id UUID REFERENCES news_comments(id),
        is_deleted BOOLEAN DEFAULT FALSE,
        is_flagged BOOLEAN DEFAULT FALSE,
        flag_reason TEXT,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );

      -- Enable RLS
      ALTER TABLE news_items ENABLE ROW LEVEL SECURITY;
      ALTER TABLE news_comments ENABLE ROW LEVEL SECURITY;

      -- RLS Policies for news_items
      DROP POLICY IF EXISTS "Public read access for published news items" ON news_items;
      CREATE POLICY "Public read access for published news items" ON news_items
        FOR SELECT USING (is_published = true AND is_deleted = false);

      DROP POLICY IF EXISTS "Authenticated users can create news items" ON news_items;
      CREATE POLICY "Authenticated users can create news items" ON news_items
        FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

      -- RLS Policies for news_comments  
      DROP POLICY IF EXISTS "Public read access for non-deleted comments" ON news_comments;
      CREATE POLICY "Public read access for non-deleted comments" ON news_comments
        FOR SELECT USING (is_deleted = false);

      DROP POLICY IF EXISTS "Authenticated users can create comments" ON news_comments;
      CREATE POLICY "Authenticated users can create comments" ON news_comments
        FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

      -- Indexes
      CREATE INDEX IF NOT EXISTS idx_news_items_content_type ON news_items(content_type) WHERE is_published = TRUE AND is_deleted = FALSE;
      CREATE INDEX IF NOT EXISTS idx_news_items_created_at ON news_items(created_at DESC) WHERE is_published = TRUE AND is_deleted = FALSE;
      CREATE INDEX IF NOT EXISTS idx_news_comments_news_item ON news_comments(news_item_id) WHERE is_deleted = FALSE;
    `;

    // Execute table creation
    const { error: createError } = await supabase.rpc('exec_sql', { 
      sql_query: createTablesSQL 
    });

    if (createError) {
      console.warn('⚠️ Table creation warning (may already exist):', createError.message);
    }

    // Get a demo user ID (or create one)
    let demoUserId;
    const { data: users, error: userError } = await supabase
      .from('users')
      .select('id')
      .limit(1);

    if (userError || !users || users.length === 0) {
      console.log('👤 Creating demo user...');
      const { data: newUser, error: createUserError } = await supabase
        .from('users')
        .insert({
          name: 'Demo User',
          email: 'demo@kamunity.com',
          emoji_avatar: '🚀',
          email_subscribed: true
        })
        .select()
        .single();

      if (createUserError) {
        console.error('❌ Error creating demo user:', createUserError);
        demoUserId = '00000000-0000-0000-0000-000000000000'; // fallback
      } else {
        demoUserId = newUser.id;
      }
    } else {
      demoUserId = users[0].id;
    }

    console.log('👤 Using demo user ID:', demoUserId);

    // Clear existing news items
    await supabase.from('news_items').delete().neq('id', '00000000-0000-0000-0000-000000000000');

    // Seed news items
    const newsItems = [
      {
        title: 'Community Spotlight: Local Tech Meetup Grows to 500+ Members',
        content: 'What started as a small gathering of 12 developers in a coffee shop has transformed into the largest tech community in the region. The "Code & Coffee" meetup, which began through a casual chat room discussion, now hosts monthly events with industry leaders and has helped launch 3 successful startups.',
        summary: 'Local tech meetup grows from 12 to 500+ members, launches 3 startups',
        content_type: 'kamunity_story',
        category: 'Community Success',
        tags: ['tech', 'meetup', 'community', 'startup'],
        engagement_score: 45,
        comment_count: 8,
        author_id: demoUserId
      },
      {
        title: 'Room Summary: "Climate Action Now" - Weekly Highlights',
        content: 'This week in the Climate Action Now room: Members organized a city-wide tree planting event (127 trees planted!), shared 15 sustainable living tips, and coordinated with local environmental groups. The room\'s carbon footprint calculator tool reached 1,000+ uses.',
        summary: 'Tree planting event, sustainability tips, carbon calculator milestone',
        content_type: 'room_summary',
        category: 'Environment',
        tags: ['climate', 'environment', 'action', 'community'],
        engagement_score: 32,
        comment_count: 12,
        author_id: demoUserId
      },
      {
        title: 'Breaking: New Partnership with Local Universities',
        content: 'Kamunity announces partnerships with 5 local universities to create dedicated spaces for student-led initiatives. Students can now create verified academic rooms, access mentorship programs, and connect their projects with real-world impact opportunities.',
        summary: 'University partnerships enable student-led initiatives and mentorship',
        content_type: 'external_story',
        category: 'Partnerships',
        tags: ['education', 'university', 'students', 'mentorship'],
        engagement_score: 67,
        comment_count: 15,
        author_id: demoUserId
      },
      {
        title: 'Chat Highlight: "Urban Gardening" Discussion Sparks City Initiative',
        content: 'A spontaneous discussion in our Urban Gardening chat about food deserts led to a collaborative proposal that\'s now being reviewed by the city council. The 48-hour conversation involved 23 community members and produced a detailed action plan.',
        summary: 'Urban gardening chat leads to city council proposal',
        content_type: 'chat_highlight',
        category: 'Civic Impact',
        tags: ['gardening', 'urban', 'civic', 'food-access'],
        engagement_score: 28,
        comment_count: 9,
        author_id: demoUserId
      },
      {
        title: 'Feature Update: Enhanced Room Analytics Now Live',
        content: 'Room creators can now access detailed analytics including engagement patterns, action completion rates, and community growth metrics. The new dashboard helps organizers understand their impact and optimize their community-building strategies.',
        summary: 'New analytics dashboard for room creators',
        content_type: 'kamunity_story',
        category: 'Product Updates',
        tags: ['analytics', 'features', 'rooms', 'metrics'],
        engagement_score: 19,
        comment_count: 6,
        author_id: demoUserId
      }
    ];

    console.log('📰 Inserting news items...');
    const { data: insertedItems, error: insertError } = await supabase
      .from('news_items')
      .insert(newsItems)
      .select();

    if (insertError) {
      console.error('❌ Error inserting news items:', insertError);
      return;
    }

    console.log(`✅ Inserted ${insertedItems.length} news items`);

    // Seed comments for testing promotion workflow
    const comments = [
      // Comments for the first item (8 comments - close to promotion threshold)
      { news_item_id: insertedItems[0].id, content: 'This is amazing! I was at that first meetup in the coffee shop. Never imagined it would grow this big! 🚀', user_id: demoUserId },
      { news_item_id: insertedItems[0].id, content: 'The networking opportunities have been incredible. Made connections that led to my current job!', user_id: demoUserId },
      { news_item_id: insertedItems[0].id, content: 'Love seeing grassroots communities thrive. This is what Kamunity is all about! 💪', user_id: demoUserId },
      { news_item_id: insertedItems[0].id, content: 'Which startups launched from this group? Would love to learn more about their journey.', user_id: demoUserId },
      { news_item_id: insertedItems[0].id, content: 'Planning to start a similar group in my city. Any tips from the organizers?', user_id: demoUserId },
      { news_item_id: insertedItems[0].id, content: 'The monthly format works really well. Consistent but not overwhelming.', user_id: demoUserId },
      { news_item_id: insertedItems[0].id, content: 'Coffee shop to 500 members - that\'s exponential growth! What was the turning point?', user_id: demoUserId },
      { news_item_id: insertedItems[0].id, content: 'This story should be featured in our next community newsletter! 📰', user_id: demoUserId },

      // Comments for room summary (12 comments - ready for promotion)
      { news_item_id: insertedItems[1].id, content: 'Participated in the tree planting! Such a rewarding experience 🌳', user_id: demoUserId },
      { news_item_id: insertedItems[1].id, content: 'The carbon calculator is super helpful. Eye-opening results!', user_id: demoUserId },
      { news_item_id: insertedItems[1].id, content: 'Those sustainability tips are gold. Implemented 5 of them already!', user_id: demoUserId },
      { news_item_id: insertedItems[1].id, content: 'Can we organize another planting event next month?', user_id: demoUserId },
      { news_item_id: insertedItems[1].id, content: 'Love the collaboration with local environmental groups 🤝', user_id: demoUserId },
      { news_item_id: insertedItems[1].id, content: 'This room is making real impact. Proud to be part of it!', user_id: demoUserId },
      { news_item_id: insertedItems[1].id, content: 'The weekly format keeps momentum going. Great structure!', user_id: demoUserId },
      { news_item_id: insertedItems[1].id, content: 'Would love to see before/after photos of the planting sites', user_id: demoUserId },
      { news_item_id: insertedItems[1].id, content: 'How do we track the long-term impact of these initiatives?', user_id: demoUserId },
      { news_item_id: insertedItems[1].id, content: 'The carbon calculator should be promoted to other rooms too!', user_id: demoUserId },
      { news_item_id: insertedItems[1].id, content: 'This is exactly why I joined Kamunity - real action, real results! 💚', user_id: demoUserId },
      { news_item_id: insertedItems[1].id, content: 'Ready to promote this to a dedicated chat for ongoing coordination?', user_id: demoUserId },

      // Fewer comments for other items
      { news_item_id: insertedItems[2].id, content: 'Great news for students! This will open so many opportunities 🎓', user_id: demoUserId },
      { news_item_id: insertedItems[2].id, content: 'The mentorship aspect is particularly exciting', user_id: demoUserId },
      { news_item_id: insertedItems[2].id, content: 'Which universities are involved? Hope mine is on the list!', user_id: demoUserId },

      { news_item_id: insertedItems[3].id, content: 'From chat to city council - that\'s the power of community! 🏛️', user_id: demoUserId },
      { news_item_id: insertedItems[3].id, content: 'Would love to read the full proposal if it\'s available', user_id: demoUserId }
    ];

    console.log('💬 Inserting comments...');
    const { error: commentError } = await supabase
      .from('news_comments')
      .insert(comments);

    if (commentError) {
      console.error('❌ Error inserting comments:', commentError);
      return;
    }

    console.log(`✅ Inserted ${comments.length} comments`);

    // Update comment counts
    console.log('🔢 Updating comment counts...');
    for (const item of insertedItems) {
      const itemComments = comments.filter(c => c.news_item_id === item.id);
      await supabase
        .from('news_items')
        .update({ comment_count: itemComments.length })
        .eq('id', item.id);
    }

    console.log('🎉 News content seeding completed successfully!');
    console.log('\n📊 Summary:');
    console.log(`   • ${insertedItems.length} news items created`);
    console.log(`   • ${comments.length} comments added`);
    console.log(`   • 1 item ready for chat promotion (12+ comments)`);
    console.log(`   • Mix of content types: room summaries, chat highlights, stories`);
    console.log('\n🧪 Test the promotion workflow:');
    console.log('   1. Navigate to /news');
    console.log('   2. Find the "Climate Action Now" room summary');
    console.log('   3. Click to expand comments');
    console.log('   4. Look for "Promote to Chat" button');

  } catch (error) {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  }
}

seedNewsContent();
