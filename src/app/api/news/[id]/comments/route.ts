import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const newsItemId = params.id;
    const { searchParams } = new URL(request.url);
    // const limit = parseInt(searchParams.get('limit') || '50');
    // const offset = parseInt(searchParams.get('offset') || '0');

    // Validate UUID format
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(newsItemId)) {
      return NextResponse.json(
        { error: 'Invalid news item ID format' },
        { status: 400 }
      );
    }

    // Verify news item exists
    const { data: newsItem, error: newsError } = await supabase
      .from('news_items')
      .select('id, title, comment_count')
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

    // Fetch comments
    const { data: comments, error: commentsError } = await supabase
      .from('news_comments')
      .select(`
        id,
        content,
        created_at,
        updated_at,
        user:users(id, name, emoji_avatar)
      `)
      .eq('news_item_id', newsItemId)
      .eq('is_deleted', false)
      .eq('is_flagged', false)
      .order('created_at', { ascending: true })
      .range(offset, offset + limit - 1);

    if (commentsError) {
      console.error('Error fetching comments:', commentsError);
      return NextResponse.json(
        { error: 'Failed to fetch comments' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      news_item: newsItem,
      comments: comments || [],
      total_comments: newsItem.comment_count,
      has_more: (comments?.length || 0) === limit
    });

  } catch (error) {
    console.error('Unexpected error fetching comments:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const newsItemId = params.id;
    const body = await request.json();
    const { content, user_id } = body;

    // Validate UUID format
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(newsItemId)) {
      return NextResponse.json(
        { error: 'Invalid news item ID format' },
        { status: 400 }
      );
    }

    // Validate input
    if (!content || !content.trim()) {
      return NextResponse.json(
        { error: 'Comment content is required' },
        { status: 400 }
      );
    }

    if (!user_id || !uuidRegex.test(user_id)) {
      return NextResponse.json(
        { error: 'Valid user ID is required' },
        { status: 400 }
      );
    }

    // Validate content length
    if (content.length > 2000) {
      return NextResponse.json(
        { error: 'Comment content cannot exceed 2000 characters' },
        { status: 400 }
      );
    }

    // Verify news item exists and is published
    const { data: newsItem, error: newsError } = await supabase
      .from('news_items')
      .select('id, title, comment_count')
      .eq('id', newsItemId)
      .eq('is_published', true)
      .eq('is_deleted', false)
      .single();

    if (newsError || !newsItem) {
      return NextResponse.json(
        { error: 'News item not found or not available for comments' },
        { status: 404 }
      );
    }

    // Verify user exists
    const { data: user, error: userError } = await supabase
      .from('users')
      .select('id, name, emoji_avatar')
      .eq('id', user_id)
      .single();

    if (userError || !user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Basic content filtering (prevent empty/whitespace-only comments)
    const trimmedContent = content.trim();
    if (trimmedContent.length < 1) {
      return NextResponse.json(
        { error: 'Comment cannot be empty' },
        { status: 400 }
      );
    }

    // Create comment
    const { data: comment, error: commentError } = await supabase
      .from('news_comments')
      .insert({
        news_item_id: newsItemId,
        user_id: user_id,
        content: trimmedContent
      })
      .select(`
        id,
        content,
        created_at,
        user:users(id, name, emoji_avatar)
      `)
      .single();

    if (commentError) {
      console.error('Error creating comment:', commentError);
      return NextResponse.json(
        { error: 'Failed to create comment' },
        { status: 500 }
      );
    }

    // Get updated comment count
    const { data: updatedNewsItem } = await supabase
      .from('news_items')
      .select('comment_count')
      .eq('id', newsItemId)
      .single();

    return NextResponse.json({
      comment,
      total_comments: updatedNewsItem?.comment_count || 0,
      can_promote: (updatedNewsItem?.comment_count || 0) >= 10
    }, { status: 201 });

  } catch (error) {
    console.error('Unexpected error creating comment:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
