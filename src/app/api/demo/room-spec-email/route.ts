import { NextRequest, NextResponse } from 'next/server';
import { sendEmailWithFallback } from '@/lib/email/resend-service';
import { generateSaveNotificationUserEmail, generateSaveNotificationAdminEmail } from '@/lib/email/templates/save-notification-email';

export async function POST(request: NextRequest) {
  try {
    console.log('🔥 Room spec email API called - Entry point reached');
    
    const body = await request.json();
    console.log('📋 Raw room spec email request body:', { hasData: !!body, keys: Object.keys(body || {}) });
    
    const { roomData, userEmail } = body;

    // Validate required fields
    if (!userEmail || !roomData?.name) {
      return NextResponse.json(
        { error: 'Missing required fields: userEmail and roomData.name' },
        { status: 400 }
      );
    }

    console.log('📧 Sending room save notification to user...');
    const userEmailData = {
      to: userEmail,
      subject: `Kamunity Room Saved - ${roomData.name}`,
      html: generateSaveNotificationUserEmail(roomData),
      from: 'Kamunity Demo <demo@kamunity.org>'
    };

    const userResult = await sendEmailWithFallback(userEmailData);
    
    console.log('📧 Sending room save notification to admin...');
    const adminEmailData = {
      to: 'mike@kamunityconsulting.com',
      subject: `New Room Saved in Demo - ${roomData.name}`,
      html: generateSaveNotificationAdminEmail(roomData, userEmail),
      from: 'Kamunity Demo <demo@kamunity.org>'
    };

    const adminResult = await sendEmailWithFallback(adminEmailData);

    console.log('📧 Room Save Email Results:', {
      to: userEmail,
      room: roomData.name,
      user: { success: userResult.success, method: userResult.method },
      admin: { success: adminResult.success, method: adminResult.method },
      timestamp: new Date().toISOString()
    });

    return NextResponse.json({
      success: true,
      message: 'Room specification emailed successfully',
      emailStatus: {
        user: userResult,
        admin: adminResult
      },
      debug: {
        timestamp: new Date().toISOString(),
        resendConfigured: !!process.env.RESEND_API_KEY
      }
    });

  } catch (error) {
    console.error('Error in room-spec-email API:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to send room specification email',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
