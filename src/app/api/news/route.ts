import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    // const limit = parseInt(searchParams.get('limit') || '20');
    // const offset = parseInt(searchParams.get('offset') || '0');
    const contentType = searchParams.get('content_type');
    const category = searchParams.get('category');

    // Validate parameters
    if (limit > 100) {
      return NextResponse.json(
        { error: 'Limit cannot exceed 100' },
        { status: 400 }
      );
    }

    let query = supabase
      .from('news_items')
      .select(`
        *,
        author:users(id, name, emoji_avatar)
      `)
      .eq('is_published', true)
      .eq('is_deleted', false)
      .order('engagement_score', { ascending: false })
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    // Apply filters
    if (contentType) {
      query = query.eq('content_type', contentType);
    }

    if (category) {
      query = query.eq('category', category);
    }

    const { data: newsItems, error } = await query;

    if (error) {
      console.error('Error fetching news items:', error);
      return NextResponse.json(
        { error: 'Failed to fetch news items' },
        { status: 500 }
      );
    }

    // Get comment counts and recent comments for each item
    const newsWithComments = await Promise.all(
      newsItems.map(async (item) => {
        const { data: comments, error: commentsError } = await supabase
          .from('news_comments')
          .select(`
            id,
            content,
            created_at,
            user:users(id, name, emoji_avatar)
          `)
          .eq('news_item_id', item.id)
          .eq('is_deleted', false)
          .eq('is_flagged', false)
          .order('created_at', { ascending: true })
          .limit(3);

        if (commentsError) {
          console.error('Error fetching comments:', commentsError);
          return { ...item, comments: [] };
        }

        return {
          ...item,
          comments: comments || []
        };
      })
    );

    return NextResponse.json({
      news_items: newsWithComments,
      total: newsWithComments.length,
      has_more: newsWithComments.length === limit
    });

  } catch (error) {
    console.error('Unexpected error in news API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      title,
      content,
      summary,
      content_type,
      source_id,
      category,
      tags,
      image_url,
      external_url
    } = body;

    // Validate required fields
    if (!title || !content || !content_type) {
      return NextResponse.json(
        { error: 'Title, content, and content_type are required' },
        { status: 400 }
      );
    }

    // Validate content_type
    const validContentTypes = ['room_summary', 'chat_highlight', 'kamunity_story', 'external_story'];
    if (!validContentTypes.includes(content_type)) {
      return NextResponse.json(
        { error: 'Invalid content_type' },
        { status: 400 }
      );
    }

    // For demo purposes, use a system user ID
    // In production, this would come from authentication
    const { data: systemUser } = await supabase
      .from('users')
      .select('id')
      .eq('email', 'system@kamunity.com')
      .single();

    const authorId = systemUser?.id || null;

    const { data: newsItem, error } = await supabase
      .from('news_items')
      .insert({
        title: title.trim(),
        content: content.trim(),
        summary: summary?.trim(),
        content_type,
        source_id,
        author_id: authorId,
        category,
        tags: Array.isArray(tags) ? tags : [],
        image_url,
        external_url,
        engagement_score: 0
      })
      .select(`
        *,
        author:users(id, name, emoji_avatar)
      `)
      .single();

    if (error) {
      console.error('Error creating news item:', error);
      return NextResponse.json(
        { error: 'Failed to create news item' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      news_item: { ...newsItem, comments: [] }
    }, { status: 201 });

  } catch (error) {
    console.error('Unexpected error creating news item:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
