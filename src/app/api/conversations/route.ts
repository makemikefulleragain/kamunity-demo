import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js'
import { Database } from '@/lib/supabase/types'

const supabase = createClient<Database>(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function GET() {
  try {
    const { data: conversations, error } = await supabase
      .from('conversations')
      .select(`
        *,
        messages(*)
      `)
      .order('updated_at', { ascending: false });
    
    if (error) {
      return NextResponse.json({ error: 'Failed to fetch conversations' }, { status: 500 });
    }
    
    const conversationsWithDetails = conversations?.map((conv: any) => ({
      id: conv.id,
      topic: conv.topic || 'Untitled Conversation',
      source_type: conv.source_type,
      source_id: conv.source_id,
      created_at: conv.created_at,
      updated_at: conv.updated_at,
      message_count: conv.messages?.length || 0,
      last_message: conv.messages?.[0] || null,
    })) || [];

    return NextResponse.json(conversationsWithDetails);
  } catch (error) {
    console.error('Error fetching conversations:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
