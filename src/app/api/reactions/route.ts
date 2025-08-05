import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { Database } from '@/lib/supabase/types'

const supabase = createClient<Database>(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

// Kamunity vibe check reactions
const ALLOWED_REACTIONS = [
  'fun',      // 😄 Light-hearted, entertaining content
  'spot_on',  // 🎯 Accurate, well-reasoned points
  'spicy',    // 🌶️ Controversial or provocative content
  'nice',     // 👍 Positive, supportive reactions
  'weird',    // 🤔 Unusual or unexpected content
  'intriguing' // 🔍 Thought-provoking, interesting content
]

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { contentId, contentType, reactionType, userId } = body

    // Validate required fields
    if (!contentId || !contentType || !reactionType || !userId) {
      return NextResponse.json({ 
        error: 'Missing required fields: contentId, contentType, reactionType, userId' 
      }, { status: 400 })
    }

    // Validate reaction type
    if (!ALLOWED_REACTIONS.includes(reactionType)) {
      return NextResponse.json({ 
        error: `Invalid reaction type. Allowed: ${ALLOWED_REACTIONS.join(', ')}` 
      }, { status: 400 })
    }

    // Check if user already reacted to this content
    const { data: existingReaction } = await supabase
      .from('reactions')
      .select('*')
      .eq('user_id', userId)
      .eq('content_id', contentId)
      .eq('content_type', contentType)
      .single()

    let reaction

    if (existingReaction) {
      if (existingReaction.reactionType === reactionType) {
        // Remove reaction if same type
        await supabase
          .from('reactions')
          .delete()
          .eq('id', existingReaction.id)
        
        return NextResponse.json({ 
          success: true, 
          action: 'removed',
          reactionType 
        })
      } else {
        // Update reaction if different type
        const { data: updatedReaction } = await supabase
          .from('reactions')
          .update({ reaction_type: reactionType })
          .eq('id', existingReaction.id)
          .select()
          .single()
        
        reaction = updatedReaction
      }
    } else {
      // Create new reaction
      const { data: newReaction } = await supabase
        .from('reactions')
        .insert({
          user_id: userId,
          content_id: contentId,
          content_type: contentType,
          reaction_type: reactionType
        })
        .select()
        .single()
      
      reaction = newReaction
    }

    return NextResponse.json({
      success: true,
      action: existingReaction ? 'updated' : 'created',
      reaction: {
        id: reaction.id,
        reactionType: reaction.reactionType,
        user: reaction.user,
        createdAt: reaction.createdAt
      }
    })

  } catch (error) {
    console.error('Reaction error:', error)
    return NextResponse.json({ 
      error: 'Failed to process reaction. Please try again.' 
    }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const contentId = searchParams.get('contentId')
    const contentType = searchParams.get('contentType')

    if (!contentId || !contentType) {
      return NextResponse.json({ 
        error: 'Missing contentId and contentType parameters' 
      }, { status: 400 })
    }

    // Get all reactions for the content
    const { data: reactions } = await supabase
      .from('reactions')
      .select('*, user:users(id, name)')
      .eq('content_id', contentId)
      .eq('content_type', contentType)
      .order('created_at', { ascending: false })

    // Group reactions by type with counts
    const reactionCounts = ALLOWED_REACTIONS.reduce((acc, type) => {
      acc[type] = (reactions || []).filter((r: any) => r.reaction_type === type).length
      return acc
    }, {} as Record<string, number>)

    return NextResponse.json({
      reactions: reactions || [],
      counts: reactionCounts,
      total: (reactions || []).length
    })

  } catch (error) {
    console.error('Get reactions error:', error)
    return NextResponse.json({ 
      error: 'Failed to fetch reactions. Please try again.' 
    }, { status: 500 })
  }
}
