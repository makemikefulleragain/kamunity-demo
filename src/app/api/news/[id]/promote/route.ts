import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const newsItemId = params.id;
    const body = await request.json();
    const { promoted_by_user_id } = body;

    // Validate UUID format
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(newsItemId)) {
      return NextResponse.json(
        { error: 'Invalid news item ID format' },
        { status: 400 }
      );
    }

    if (!promoted_by_user_id || !uuidRegex.test(promoted_by_user_id)) {
      return NextResponse.json(
        { error: 'Valid user ID is required' },
        { status: 400 }
      );
    }

    // Get news item with comments
    const { data: newsItem, error: newsError } = await supabase
      .from('news_items')
      .select(`
        *,
        author:users(id, name, emoji_avatar)
      `)
      .eq('id', newsItemId)
      .eq('is_published', true)
      .eq('is_deleted', false)
      .single();

    if (newsError || !newsItem) {
      return NextResponse.json(
        { error: 'News item not found' },
        { status: 404 }
      );
    }

    // Check if already promoted
    if (newsItem.is_promoted_to_chat) {
      return NextResponse.json(
        { error: 'News item has already been promoted to chat' },
        { status: 400 }
      );
    }

    // Check if eligible for promotion (10+ comments)
    if (newsItem.comment_count < 10) {
      return NextResponse.json(
        { error: 'News item must have at least 10 comments to be promoted' },
        { status: 400 }
      );
    }

    // Get recent comments for summary
    const { data: comments, error: commentsError } = await supabase
      .from('news_comments')
      .select(`
        id,
        content,
        created_at,
        user:users(id, name, emoji_avatar)
      `)
      .eq('news_item_id', newsItemId)
      .eq('is_deleted', false)
      .eq('is_flagged', false)
      .order('created_at', { ascending: true })
      .limit(5);

    if (commentsError) {
      console.error('Error fetching comments for promotion:', commentsError);
      return NextResponse.json(
        { error: 'Failed to fetch comments' },
        { status: 500 }
      );
    }

    // Create chat room
    const chatRoomData = {
      name: `Discussion: ${newsItem.title.substring(0, 80)}${newsItem.title.length > 80 ? '...' : ''}`,
      description: `Continuing the conversation from: ${newsItem.title}`,
      emoji_theme: getCategoryEmoji(newsItem.category),
      room_type: 'chat',
      max_participants: 50,
      is_active: true,
      created_at: new Date().toISOString()
    };

    const { data: chatRoom, error: chatError } = await supabase
      .from('rooms')
      .insert(chatRoomData)
      .select()
      .single();

    if (chatError) {
      console.error('Error creating chat room:', chatError);
      return NextResponse.json(
        { error: 'Failed to create chat room' },
        { status: 500 }
      );
    }

    // Create initial message with content + comment summary
    const initialMessage = formatPromotionMessage(newsItem, comments || []);
    
    const { error: messageError } = await supabase
      .from('messages')
      .insert({
        room_id: chatRoom.id,
        content: initialMessage,
        message_type: 'promotion_summary',
        user_id: null, // System message
        created_at: new Date().toISOString()
      });

    if (messageError) {
      console.error('Error creating initial message:', messageError);
      // Continue anyway, don't fail the promotion
    }

    // Update news item with promotion status
    const { error: updateError } = await supabase
      .from('news_items')
      .update({
        is_promoted_to_chat: true,
        promoted_chat_id: chatRoom.id,
        updated_at: new Date().toISOString()
      })
      .eq('id', newsItemId);

    if (updateError) {
      console.error('Error updating news item promotion status:', updateError);
      return NextResponse.json(
        { error: 'Failed to update promotion status' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      chat_room: chatRoom,
      message: 'News item successfully promoted to chat'
    });

  } catch (error) {
    console.error('Unexpected error promoting to chat:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

function getCategoryEmoji(category?: string): string {
  const emojiMap: Record<string, string> = {
    'Success Stories': '🌟',
    'Education': '📚',
    'Health & Wellness': '🌱',
    'Environment': '🌍',
    'Technology': '💻',
    'Community Action': '🤝',
    'Platform Updates': '📢',
    'Food Security': '🍽️',
    'Mental Health': '💚',
    'Sustainability': '♻️'
  };

  return emojiMap[category || ''] || '💬';
}

function formatPromotionMessage(newsItem: any, comments: unknown[]): string {
  const commentHighlights = comments
    .slice(0, 3)
    .map(c => `• ${c.user?.name || 'Community Member'}: ${c.content.substring(0, 100)}${c.content.length > 100 ? '...' : ''}`)
    .join('\n');

  return `🚀 **Discussion Promoted from News**

**Original Topic:** ${newsItem.title}

**Summary:** ${newsItem.summary || newsItem.content.substring(0, 200)}${newsItem.content.length > 200 ? '...' : ''}

**Previous Discussion Highlights:**
${commentHighlights}

${comments.length > 3 ? `\n...and ${comments.length - 3} more comments from the original discussion` : ''}

Welcome to the live discussion! This conversation was promoted because of the great engagement on the original news item. Feel free to continue the discussion, share your thoughts, and connect with others who are passionate about this topic. 💬`;
}
