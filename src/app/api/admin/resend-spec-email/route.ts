import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { sendDualRoomSpecificationEmail } from '@/lib/email/resend-service';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { specId } = body;

    if (!specId) {
      return NextResponse.json({ error: 'Specification ID is required' }, { status: 400 });
    }

    const supabase = createClient();
    
    // Get the room specification
    const { data: roomSpec, error } = await supabase
      .from('saved_rooms')
      .select('*')
      .eq('id', specId)
      .single();

    if (error || !roomSpec) {
      console.error('Error fetching room spec:', error);
      return NextResponse.json({ error: 'Room specification not found' }, { status: 404 });
    }

    // Resend the email
    const emailResult = await sendDualRoomSpecificationEmail(
      roomSpec.room_data,
      roomSpec.user_email || 'anonymous@demo.com',
      roomSpec.source_type === 'generator'
    );

    if (!emailResult.success) {
      return NextResponse.json({ 
        error: 'Failed to resend email',
        details: emailResult.error 
      }, { status: 500 });
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Email resent successfully',
      emailId: emailResult.emailId
    });

  } catch (error) {
    console.error('Resend email API error:', error);
    return NextResponse.json({ 
      error: 'Internal server error',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    }, { status: 500 });
  }
}
