import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { Database } from '@/lib/supabase/types'

const supabase = createClient<Database>(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { data: room, error } = await supabase
      .from('focus_rooms')
      .select('*')
      .eq('id', params.id)
      .single()
    
    if (error) {
      return NextResponse.json({ error: 'Room not found' }, { status: 404 })
    }
    
    if (!room) {
      return NextResponse.json({ error: 'Room not found' }, { status: 404 })
    }

    return NextResponse.json(room)
  } catch (error) {
    console.error('Error fetching room:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    const { name, purpose } = body

    const { data: room, error } = await supabase
      .from('focus_rooms')
      .update({ name, purpose })
      .eq('id', params.id)
      .select()
      .single()
    
    if (error) {
      return NextResponse.json({ error: 'Failed to update room' }, { status: 500 })
    }
    
    return NextResponse.json(room)
  } catch (error) {
    console.error('Error updating room:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { error } = await supabase
      .from('focus_rooms')
      .delete()
      .eq('id', params.id)
    
    if (error) {
      return NextResponse.json({ error: 'Failed to delete room' }, { status: 500 })
    }
    
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting room:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
