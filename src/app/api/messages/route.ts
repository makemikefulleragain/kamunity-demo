import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { content, conversationId, userId, authorName } = body

    // Validate required fields
    if (!content || !conversationId || !userId) {
      return NextResponse.json({ 
        error: 'Missing required fields: content, conversationId, userId' 
      }, { status: 400 })
    }

    // Create the message
    const { data: message, error } = await supabase
      .from('messages')
      .insert({
        content,
        room_id: conversationId,
        user_id: userId
      })
      .select()
      .single()

    if (error) {
      return NextResponse.json({ error: 'Failed to create message' }, { status: 500 })
    }

    // Update room's last activity (rooms table doesn't have updatedAt field)
    // This would be handled by database triggers if needed

    return NextResponse.json({
      success: true,
      message: {
        id: message.id,
        content: message.content,
        authorName: message.authorName,
        createdAt: message.createdAt,
        conversationId: message.conversationId
      }
    })

  } catch (error) {
    console.error('Message creation error:', error)
    return NextResponse.json({ 
      error: 'Failed to send message. Please try again.' 
    }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const conversationId = searchParams.get('conversationId')
    const limit = parseInt(searchParams.get('limit') || '50')
    const offset = parseInt(searchParams.get('offset') || '0')

    if (!conversationId) {
      return NextResponse.json({ 
        error: 'Missing conversationId parameter' 
      }, { status: 400 })
    }

    // Get messages for the room
    const { data: messages, error } = await supabase
      .from('messages')
      .select('*')
      .eq('room_id', conversationId)
      .order('created_at', { ascending: true })
      .range(offset, offset + limit - 1)

    if (error) {
      return NextResponse.json({ error: 'Failed to fetch messages' }, { status: 500 })
    }

    return NextResponse.json({
      messages,
      total: messages.length,
      hasMore: messages.length === limit
    })

  } catch (error) {
    console.error('Get messages error:', error)
    return NextResponse.json({ 
      error: 'Failed to fetch messages. Please try again.' 
    }, { status: 500 })
  }
}
