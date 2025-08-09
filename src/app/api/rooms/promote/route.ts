import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

interface RoomPromotionRequest {
  chatId: string
  proposedName: string
  purpose: string
  targetAudience: string
  successCriteria: string
  additionalFeatures: string[]
  constraints?: string
  tone: 'formal' | 'casual' | 'playful' | 'professional'
  originalChatId: string
  requestedBy: string
}

export async function POST(request: NextRequest) {
  try {
    const body: RoomPromotionRequest = await request.json()
    
    // Validate required fields
    const { proposedName, purpose, targetAudience, successCriteria, originalChatId, requestedBy } = body
    
    if (!proposedName || !purpose || !targetAudience || !successCriteria || !originalChatId || !requestedBy) {
      return NextResponse.json({ 
        error: 'Missing required fields' 
      }, { status: 400 })
    }

    // Create room promotion request record
    const { data: promotionRequest, error: insertError } = await supabase
      .from('room_promotion_requests')
      .insert({
        original_chat_id: originalChatId,
        proposed_name: proposedName,
        purpose: purpose,
        target_audience: targetAudience,
        success_criteria: successCriteria,
        additional_features: body.additionalFeatures || [],
        constraints: body.constraints,
        tone: body.tone,
        requested_by: requestedBy,
        status: 'pending',
        created_at: new Date().toISOString()
      })
      .select()
      .single()

    if (insertError) {
      console.error('Database error:', insertError)
      return NextResponse.json({ 
        error: 'Failed to create promotion request' 
      }, { status: 500 })
    }

    // For demo purposes, auto-approve and create the room
    // In production, this would go through a manual review process
    const roomEmoji = body.tone === 'playful' ? '🎨' : 
                     body.tone === 'formal' ? '📋' : 
                     body.tone === 'professional' ? '💼' : '💬'

    const { data: newRoom, error: roomError } = await supabase
      .from('rooms')
      .insert({
        name: proposedName,
        description: `${purpose}\n\nTarget Audience: ${targetAudience}\nSuccess Criteria: ${successCriteria}`,
        emoji_theme: roomEmoji,
        room_type: 'focus',
        max_participants: 50,
        current_participants: 0,
        is_active: true,
        created_by: requestedBy
      })
      .select()
      .single()

    if (roomError) {
      console.error('Room creation error:', roomError)
      return NextResponse.json({ 
        error: 'Failed to create room' 
      }, { status: 500 })
    }

    // Update promotion request status
    await supabase
      .from('room_promotion_requests')
      .update({ 
        status: 'approved',
        created_room_id: newRoom.id,
        processed_at: new Date().toISOString()
      })
      .eq('id', promotionRequest.id)

    // Get chat participants and migrate them to the new room
    const { data: chatMessages } = await supabase
      .from('messages')
      .select('user_id')
      .eq('room_id', originalChatId)

    if (chatMessages) {
      const uniqueUserIds = [...new Set(chatMessages.map(m => m.user_id))]
      
      // Add participants to new room
      const participantInserts = uniqueUserIds.map(userId => ({
        user_id: userId,
        room_id: newRoom.id,
        joined_at: new Date().toISOString(),
        last_active: new Date().toISOString()
      }))

      await supabase
        .from('room_participants')
        .insert(participantInserts)

      // Update room participant count
      await supabase
        .from('rooms')
        .update({ current_participants: uniqueUserIds.length })
        .eq('id', newRoom.id)
    }

    // Create a system message in the new room
    await supabase
      .from('messages')
      .insert({
        user_id: requestedBy,
        room_id: newRoom.id,
        content: `🎉 Welcome to ${proposedName}! This Focus Room was created from an active chat conversation. Let's continue building our community here!`,
        message_type: 'system'
      })

    return NextResponse.json({
      success: true,
      promotionRequest: promotionRequest,
      newRoom: newRoom,
      message: 'Room promotion request submitted and approved!'
    })

  } catch (error) {
    console.error('Error processing room promotion:', error)
    return NextResponse.json({ 
      error: 'Internal server error' 
    }, { status: 500 })
  }
}
