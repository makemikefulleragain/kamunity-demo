import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const supabase = createClient();
    
    // Query user activities
    const { data: activities, error } = await supabase
      .from('user_activities')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(100);

    if (error) {
      console.error('Error fetching user activities:', error);
      return NextResponse.json({ error: 'Failed to fetch user activities' }, { status: 500 });
    }

    // Transform data for admin dashboard
    const transformedActivities = (activities || []).map(activity => ({
      id: activity.id,
      sessionId: activity.session_id,
      userEmail: activity.user_email,
      eventType: activity.event_type,
      eventData: activity.event_data,
      timestamp: activity.created_at,
      page: activity.page_url || activity.event_data?.page || 'Unknown'
    }));

    return NextResponse.json({ 
      success: true, 
      data: transformedActivities,
      count: transformedActivities.length 
    });

  } catch (error) {
    console.error('Admin user activities API error:', error);
    return NextResponse.json({ 
      error: 'Internal server error',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { sessionId, userEmail, eventType, eventData, pageUrl } = body;

    if (!sessionId || !eventType) {
      return NextResponse.json({ error: 'Session ID and event type are required' }, { status: 400 });
    }

    const supabase = createClient();
    
    // Save user activity to database
    const { data, error } = await supabase
      .from('user_activities')
      .insert({
        session_id: sessionId,
        user_email: userEmail,
        event_type: eventType,
        event_data: eventData || {},
        page_url: pageUrl,
        created_at: new Date().toISOString()
      })
      .select()
      .single();

    if (error) {
      console.error('Error saving user activity:', error);
      return NextResponse.json({ error: 'Failed to save user activity' }, { status: 500 });
    }

    return NextResponse.json({ 
      success: true, 
      data: data,
      message: 'User activity saved successfully' 
    });

  } catch (error) {
    console.error('Admin user activities POST error:', error);
    return NextResponse.json({ 
      error: 'Internal server error',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    }, { status: 500 });
  }
}
