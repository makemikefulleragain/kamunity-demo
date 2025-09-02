import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const supabase = createClient();
    
    // Query room specifications with user data
    const { data: roomSpecs, error } = await supabase
      .from('saved_rooms')
      .select(`
        *,
        user_email,
        session_id,
        created_at,
        room_data,
        source_type
      `)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching room specs:', error);
      return NextResponse.json({ error: 'Failed to fetch room specifications' }, { status: 500 });
    }

    // Transform data for admin dashboard
    const transformedSpecs = (roomSpecs || []).map(spec => ({
      id: spec.id,
      title: spec.room_data?.title || spec.room_data?.name || 'Untitled Room',
      description: spec.room_data?.description || spec.room_data?.purpose || 'No description',
      category: spec.room_data?.category || 'Uncategorized',
      engagement: spec.room_data?.engagement || 0,
      tags: spec.room_data?.tags || [],
      userEmail: spec.user_email || 'anonymous@demo.com',
      sessionId: spec.session_id || 'unknown',
      timestamp: spec.created_at,
      source: spec.source_type === 'generator' ? 'generator' : 'saved',
      fullSpecification: spec.room_data,
      analytics: spec.room_data?.analytics || null
    }));

    return NextResponse.json({ 
      success: true, 
      data: transformedSpecs,
      count: transformedSpecs.length 
    });

  } catch (error) {
    console.error('Admin room specs API error:', error);
    return NextResponse.json({ 
      error: 'Internal server error',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { roomData, userEmail, sessionId, sourceType = 'saved' } = body;

    if (!roomData) {
      return NextResponse.json({ error: 'Room data is required' }, { status: 400 });
    }

    const supabase = createClient();
    
    // Save room specification to database
    const { data, error } = await supabase
      .from('saved_rooms')
      .insert({
        user_email: userEmail || 'anonymous@demo.com',
        session_id: sessionId || `session_${Date.now()}`,
        room_data: roomData,
        source_type: sourceType,
        created_at: new Date().toISOString()
      })
      .select()
      .single();

    if (error) {
      console.error('Error saving room spec:', error);
      return NextResponse.json({ error: 'Failed to save room specification' }, { status: 500 });
    }

    return NextResponse.json({ 
      success: true, 
      data: data,
      message: 'Room specification saved successfully' 
    });

  } catch (error) {
    console.error('Admin room specs POST error:', error);
    return NextResponse.json({ 
      error: 'Internal server error',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    }, { status: 500 });
  }
}
