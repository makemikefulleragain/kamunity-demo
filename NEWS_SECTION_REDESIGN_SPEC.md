# 📰 NEWS SECTION REDESIGN: COMPREHENSIVE SPECIFICATION
*Community-Driven Content with Auto-Promotion to Chat*

---

## 🎯 CONFIRMED REQUIREMENTS (96% CONFIDENCE)

### **Content Strategy**
- **Mixed Chronological Feed**: Content sorted by recency/engagement
- **Content Sources**: Room summaries + Chat highlights + Kamunity stories + External org stories
- **Room/Chat Summaries**: Auto-generated daily from activity (AI-powered)
- **External Content**: Manual curation by Kamunity team

### **Comments System**
- **Structure**: Flat list (simple, easy to follow)
- **Display**: Show first 3 comments, expand to show all
- **Authentication**: Login required to comment, anonymous viewing allowed
- **Count Display**: Always visible as badge
- **Real-time Updates**: WebSocket integration

### **Auto-Promotion Workflow**
- **Trigger**: "Promote to Chat" suggestion appears at 10 comments
- **Activation**: Any user can trigger promotion
- **Chat Initialization**: Original content + comment summary as first message
- **Notification**: Banner on original news item + chat link

### **Technical Architecture**
- **Database**: New `news_items` and `news_comments` tables
- **UI**: New community content card type
- **Mobile**: Inline expandable comments
- **Moderation**: RLS policies + user reporting

---

## 🏗️ DATABASE SCHEMA DESIGN

### **New Tables**

```sql
-- News Items Table
CREATE TABLE news_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(255) NOT NULL,
  content TEXT NOT NULL,
  summary TEXT,
  content_type VARCHAR(50) NOT NULL, -- 'room_summary', 'chat_highlight', 'kamunity_story', 'external_story'
  source_id UUID, -- References room/chat ID for summaries
  author_id UUID REFERENCES users(id),
  category VARCHAR(50),
  tags TEXT[], -- Array of tags for filtering
  image_url VARCHAR(500),
  external_url VARCHAR(500),
  engagement_score INTEGER DEFAULT 0,
  comment_count INTEGER DEFAULT 0,
  is_promoted_to_chat BOOLEAN DEFAULT FALSE,
  promoted_chat_id UUID,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- News Comments Table
CREATE TABLE news_comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  news_item_id UUID REFERENCES news_items(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id),
  content TEXT NOT NULL,
  parent_comment_id UUID, -- For future threading (currently NULL)
  is_deleted BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX idx_news_items_content_type ON news_items(content_type);
CREATE INDEX idx_news_items_created_at ON news_items(created_at DESC);
CREATE INDEX idx_news_items_engagement ON news_items(engagement_score DESC);
CREATE INDEX idx_news_comments_news_item ON news_comments(news_item_id);
CREATE INDEX idx_news_comments_created_at ON news_comments(created_at);
```

### **RLS Policies**

```sql
-- News Items: Public read, authenticated write
ALTER TABLE news_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view news items" ON news_items
  FOR SELECT USING (true);

CREATE POLICY "Authenticated users can create news items" ON news_items
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Authors can update their news items" ON news_items
  FOR UPDATE USING (auth.uid() = author_id);

-- News Comments: Public read, authenticated write
ALTER TABLE news_comments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view comments" ON news_comments
  FOR SELECT USING (NOT is_deleted);

CREATE POLICY "Authenticated users can create comments" ON news_comments
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Authors can update their comments" ON news_comments
  FOR UPDATE USING (auth.uid() = user_id);
```

---

## 🎨 UI COMPONENT ARCHITECTURE

### **Component Structure**

```
NewsSection/
├── NewsSection.tsx (Main container)
├── NewsFeed.tsx (Content feed with filtering)
├── NewsCard.tsx (Individual news item card)
├── CommentsSection.tsx (Expandable comments)
├── CommentItem.tsx (Individual comment)
├── CommentForm.tsx (Add new comment)
├── PromoteToChatButton.tsx (Promotion trigger)
└── NewsFilters.tsx (Content type filtering)
```

### **NewsCard Component Design**

```typescript
interface NewsItem {
  id: string;
  title: string;
  content: string;
  summary?: string;
  content_type: 'room_summary' | 'chat_highlight' | 'kamunity_story' | 'external_story';
  source_id?: string;
  author_id: string;
  category?: string;
  tags: string[];
  image_url?: string;
  external_url?: string;
  engagement_score: number;
  comment_count: number;
  is_promoted_to_chat: boolean;
  promoted_chat_id?: string;
  created_at: string;
  updated_at: string;
  author?: {
    name: string;
    emoji_avatar: string;
  };
  comments?: NewsComment[];
}

interface NewsComment {
  id: string;
  news_item_id: string;
  user_id: string;
  content: string;
  created_at: string;
  user?: {
    name: string;
    emoji_avatar: string;
  };
}
```

---

## 🔄 REAL-TIME INTEGRATION

### **WebSocket Events**

```typescript
// Comment added
{
  type: 'news_comment_added',
  payload: {
    news_item_id: string,
    comment: NewsComment,
    new_comment_count: number
  }
}

// Chat promotion triggered
{
  type: 'news_promoted_to_chat',
  payload: {
    news_item_id: string,
    chat_id: string,
    promoted_by_user_id: string
  }
}

// Engagement score updated
{
  type: 'news_engagement_updated',
  payload: {
    news_item_id: string,
    new_engagement_score: number
  }
}
```

### **Supabase Real-time Subscriptions**

```typescript
// Subscribe to comments for a news item
const commentsSubscription = supabase
  .channel(`news_comments:${newsItemId}`)
  .on('postgres_changes', 
    { event: 'INSERT', schema: 'public', table: 'news_comments' },
    (payload) => {
      // Add new comment to local state
      setComments(prev => [...prev, payload.new]);
      setCommentCount(prev => prev + 1);
    }
  )
  .subscribe();

// Subscribe to news item updates (promotion status)
const newsItemSubscription = supabase
  .channel(`news_items:${newsItemId}`)
  .on('postgres_changes',
    { event: 'UPDATE', schema: 'public', table: 'news_items' },
    (payload) => {
      // Update promotion status
      if (payload.new.is_promoted_to_chat) {
        setIsPromoted(true);
        setPromotedChatId(payload.new.promoted_chat_id);
      }
    }
  )
  .subscribe();
```

---

## 🚀 AUTO-PROMOTION WORKFLOW

### **Promotion Trigger Logic**

```typescript
const handlePromoteToChat = async (newsItem: NewsItem) => {
  try {
    // 1. Create new chat room
    const chatRoom = await createChatRoom({
      name: `Discussion: ${newsItem.title}`,
      description: `Continuing the conversation from: ${newsItem.title}`,
      emoji_theme: getCategoryEmoji(newsItem.category),
      room_type: 'chat',
      max_participants: 50
    });

    // 2. Create initial message with content + comment summary
    const initialMessage = formatPromotionMessage(newsItem, comments);
    await createMessage({
      room_id: chatRoom.id,
      content: initialMessage,
      message_type: 'promotion_summary',
      user_id: 'system'
    });

    // 3. Update news item with promotion status
    await updateNewsItem(newsItem.id, {
      is_promoted_to_chat: true,
      promoted_chat_id: chatRoom.id
    });

    // 4. Notify commenters (optional)
    await notifyCommenters(newsItem.id, chatRoom.id);

    return chatRoom;
  } catch (error) {
    console.error('Promotion failed:', error);
    throw error;
  }
};

const formatPromotionMessage = (newsItem: NewsItem, comments: NewsComment[]) => {
  return `🚀 **Discussion Promoted from News**

**Original Topic:** ${newsItem.title}

**Summary:** ${newsItem.summary || newsItem.content.substring(0, 200)}

**Previous Discussion Highlights:**
${comments.slice(0, 3).map(c => `• ${c.user?.name}: ${c.content.substring(0, 100)}`).join('\n')}

${comments.length > 3 ? `\n...and ${comments.length - 3} more comments` : ''}

Welcome to the live discussion! 💬`;
};
```

---

## 📱 MOBILE-FIRST UI IMPLEMENTATION

### **Responsive Comments Section**

```typescript
const CommentsSection: React.FC<CommentsSectionProps> = ({
  newsItemId,
  comments,
  commentCount,
  onCommentAdded
}) => {
  const [expanded, setExpanded] = useState(false);
  const [showPromoteButton, setShowPromoteButton] = useState(commentCount >= 10);

  return (
    <div className="border-t border-gray-200 mt-4">
      {/* Comment Count Badge - Always Visible */}
      <div className="flex items-center justify-between p-4">
        <button
          onClick={() => setExpanded(!expanded)}
          className="flex items-center space-x-2 text-sm text-gray-600 hover:text-gray-900"
        >
          <MessageCircle size={16} />
          <span>{commentCount} comments</span>
          <ChevronDown 
            size={16} 
            className={cn("transition-transform", expanded && "rotate-180")} 
          />
        </button>

        {showPromoteButton && (
          <PromoteToChatButton 
            newsItemId={newsItemId}
            commentCount={commentCount}
          />
        )}
      </div>

      {/* Expandable Comments */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-4 space-y-3">
              {/* Show first 3 comments by default */}
              {comments.slice(0, 3).map(comment => (
                <CommentItem key={comment.id} comment={comment} />
              ))}

              {/* Show all comments when expanded */}
              {comments.length > 3 && (
                <div className="space-y-3">
                  {comments.slice(3).map(comment => (
                    <CommentItem key={comment.id} comment={comment} />
                  ))}
                </div>
              )}

              {/* Comment Form */}
              <CommentForm 
                newsItemId={newsItemId}
                onCommentAdded={onCommentAdded}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
```

---

## 🤖 AI-POWERED CONTENT GENERATION

### **Daily Room/Chat Summary Generation**

```typescript
const generateDailySummaries = async () => {
  try {
    // Get active rooms from last 24 hours
    const activeRooms = await getActiveRooms(24);
    
    for (const room of activeRooms) {
      const messages = await getRoomMessages(room.id, 24);
      
      if (messages.length >= 5) { // Minimum activity threshold
        const summary = await generateAISummary({
          roomName: room.name,
          roomType: room.room_type,
          messages: messages,
          participantCount: room.current_participants
        });

        await createNewsItem({
          title: `${room.emoji_theme} ${room.name} - Daily Highlights`,
          content: summary.content,
          summary: summary.brief,
          content_type: room.room_type === 'chat' ? 'chat_highlight' : 'room_summary',
          source_id: room.id,
          category: 'Community Activity',
          tags: ['daily-summary', room.room_type],
          engagement_score: calculateEngagementScore(messages, room.current_participants)
        });
      }
    }
  } catch (error) {
    console.error('Summary generation failed:', error);
  }
};

// Run daily at 6 AM
cron.schedule('0 6 * * *', generateDailySummaries);
```

---

## 📊 ENGAGEMENT SCORING ALGORITHM

```typescript
const calculateEngagementScore = (
  messages: Message[],
  participantCount: number,
  reactions: Reaction[] = [],
  comments: NewsComment[] = []
): number => {
  let score = 0;

  // Message activity (40% of score)
  score += messages.length * 2;

  // Participant diversity (20% of score)
  const uniqueParticipants = new Set(messages.map(m => m.user_id)).size;
  score += (uniqueParticipants / participantCount) * 100;

  // Reactions (20% of score)
  score += reactions.length * 3;

  // Comments (20% of score)
  score += comments.length * 5;

  // Recency boost (decay over time)
  const hoursOld = (Date.now() - new Date(messages[0]?.created_at).getTime()) / (1000 * 60 * 60);
  const recencyMultiplier = Math.max(0.1, 1 - (hoursOld / 168)); // Decay over 1 week

  return Math.round(score * recencyMultiplier);
};
```

---

## 🔒 MODERATION & SAFETY

### **Content Moderation Workflow**

```typescript
const moderateComment = async (comment: NewsComment) => {
  // 1. Automatic keyword filtering
  const hasInappropriateContent = await checkContentFilter(comment.content);
  
  if (hasInappropriateContent) {
    await flagComment(comment.id, 'auto_filter');
    return false;
  }

  // 2. Community reporting system
  const reportCount = await getCommentReportCount(comment.id);
  
  if (reportCount >= 3) {
    await flagComment(comment.id, 'community_reports');
    await notifyModerators(comment.id);
    return false;
  }

  return true;
};

// User reporting interface
const ReportCommentButton: React.FC<{ commentId: string }> = ({ commentId }) => {
  const handleReport = async (reason: string) => {
    await reportComment(commentId, reason);
    toast.success('Comment reported. Thank you for keeping our community safe.');
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm">
          <Flag size={14} />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem onClick={() => handleReport('spam')}>
          Report as Spam
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleReport('inappropriate')}>
          Inappropriate Content
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleReport('harassment')}>
          Harassment
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
```

---

## 🚀 IMPLEMENTATION ROADMAP

### **Phase 1: Core Infrastructure (Days 1-2)**
- [ ] Create database tables and RLS policies
- [ ] Build basic NewsCard component with comment badge
- [ ] Implement comment CRUD operations
- [ ] Add authentication checks for commenting

### **Phase 2: Real-time Features (Days 3-4)**
- [ ] Integrate WebSocket subscriptions for comments
- [ ] Build expandable comments section with animations
- [ ] Implement comment form with real-time updates
- [ ] Add engagement score calculation

### **Phase 3: Auto-Promotion System (Days 5-6)**
- [ ] Build "Promote to Chat" button and workflow
- [ ] Implement chat room creation from news items
- [ ] Add promotion notification system
- [ ] Create initial chat message formatting

### **Phase 4: Content Generation (Days 7-8)**
- [ ] Implement AI-powered room/chat summary generation
- [ ] Build manual curation workflow for external content
- [ ] Add content type filtering and categorization
- [ ] Integrate with existing news feed

### **Phase 5: Polish & Testing (Days 9-10)**
- [ ] Mobile responsiveness optimization
- [ ] Moderation system implementation
- [ ] Performance optimization and caching
- [ ] End-to-end testing and bug fixes

---

## 📈 SUCCESS METRICS

### **Engagement Metrics**
- **Comment Rate**: Target 15% of news viewers leave comments
- **Promotion Rate**: Target 20% of items with 10+ comments get promoted
- **Chat Participation**: Target 60% of promoted discussions have active chat participation
- **Content Discovery**: Target 40% engagement with AI-generated summaries

### **Technical Performance**
- **Real-time Latency**: Comments appear within 1 second
- **Mobile Performance**: Smooth animations, no layout shifts
- **Database Performance**: Comment queries under 100ms
- **WebSocket Stability**: 99%+ uptime for real-time features

---

This comprehensive specification provides a complete roadmap for implementing the community-driven news section with auto-promotion to chat, aligned with your requirements and existing codebase architecture! 🎯
