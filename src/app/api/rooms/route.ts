import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(request: NextRequest) {
  try {
    const supabase = createClient()
    const body = await request.json()
    
    // Extract room data from request
    const {
      id,
      title,
      description,
      category = 'Saved Demo',
      tags = [],
      createdBy = 'demo-user',
      specification,
      isActive = true
    } = body

    // Insert room into DemoRoom table
    const { data: room, error } = await supabase
      .from('DemoRoom')
      .insert([{
        id,
        title,
        description,
        category,
        tags,
        createdBy,
        specification,
        isActive,
        engagement: 0
      }])
      .select()
      .single()
    
    if (error) {
      console.error('Supabase error saving room:', error)
      return NextResponse.json({ error: 'Failed to save room to database' }, { status: 500 })
    }
    
    return NextResponse.json({ success: true, room })
  } catch (error) {
    console.error('Error saving room:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    const supabase = createClient()
    const { data: rooms, error } = await supabase
      .from('DemoRoom')
      .select('*')
      .eq('isActive', true)
      .order('createdAt', { ascending: false })
    
    if (error) {
      console.error('Supabase error fetching rooms:', error)
      return NextResponse.json({ error: 'Failed to fetch rooms' }, { status: 500 })
    }
    
    return NextResponse.json({ rooms: rooms || [] })
  } catch (error) {
    console.error('Error fetching rooms:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
