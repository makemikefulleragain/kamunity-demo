import { NextRequest, NextResponse } from 'next/server';
import { sendEmailWithFallback } from '@/lib/email/resend-service';
import { generateRoomSpecUserEmail, generateRoomSpecAdminEmail } from '@/lib/email/templates/room-spec-email';

export async function POST(request: NextRequest) {
  try {
    console.log('🔥 Spec email API called - Entry point reached');
    
    const body = await request.json();
    console.log('📋 Raw spec email request body:', { hasData: !!body, keys: Object.keys(body || {}) });
    
    const { to_email, user_email, room_name, room_purpose, room_spec, timestamp } = body;

    // Validate required fields
    if (!to_email || !room_name || !room_spec) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Parse and format the detailed spec
    let parsedSpec;
    try {
      parsedSpec = JSON.parse(room_spec);
    } catch {
      parsedSpec = null;
    }

    const formatSpecSections = (spec: any) => {
      if (!spec?.detailedSpec) return 'Basic room specification included.';
      
      const ds = spec.detailedSpec;
      return `
🎯 PITCH & CALL TO ACTION
${ds.pitchSection?.hook || 'Transform your collaboration'}
${ds.pitchSection?.cta || 'Let\'s get started!'}

💰 COMMUNITY SPACE ROI
${ds.roiStory || 'Significant productivity improvements expected'}

⏰ TIME & COST SAVINGS
Before: ${ds.savingsTable?.before?.weeklyHours || '8 hours'} | ${ds.savingsTable?.before?.monthlyTools || '$200'}
After: ${ds.savingsTable?.after?.weeklyHours || '3 hours'} | ${ds.savingsTable?.after?.monthlyTools || '$50'}
Savings: ${ds.savingsTable?.savings?.timeWeekly || '5 hours'} | ${ds.savingsTable?.savings?.costMonthly || '$150'}

🏠 HOMEPAGE WIREFRAME
${ds.wireframe?.description || 'Standard layout with navigation, content areas, and widgets'}

📋 USER FLOW
${ds.userFlow?.map((step: string, i: number) => `${i + 1}. ${step}`).join('\n') || 'Standard onboarding and engagement flow'}

❓ DESIGN QUESTIONS
${ds.designQuestions?.map((q: string, i: number) => `${i + 1}. ${q}`).join('\n') || 'Customisation options available'}

📊 FEATURE MATRIX
MVP: ${ds.featureMatrix?.mvp?.join(', ') || 'Core features'}
Pro: ${ds.featureMatrix?.pro?.join(', ') || 'Advanced features'}
Full: ${ds.featureMatrix?.full?.join(', ') || 'Enterprise features'}

💡 ADDITIONAL SUGGESTIONS
Metrics: ${ds.suggestions?.metrics?.join(', ') || 'Standard analytics'}
Pilot: ${ds.suggestions?.pilot || 'Gradual rollout recommended'}
Next Steps: ${ds.suggestions?.nextSteps?.join(', ') || 'Implementation planning'}
      `.trim();
    };

    // Email content for user
    const userEmailContent = `
G'day!

Thank you for using the Kamunity Focus Room Generator! Your comprehensive Focus Room specification is ready.

🏠 ROOM DETAILS
═══════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════────
Name: ${room_name}
Purpose: ${room_purpose}
Generated: ${new Date(timestamp).toLocaleString('en-AU')}

📋 COMPLETE SPECIFICATION
${formatSpecSections(parsedSpec)}

🚀 WHAT'S NEXT
1. Review your comprehensive specification above
2. Access your demo room to see it in action
3. Contact mike@kamunityconsulting.com for implementation

🔗 STAY CONNECTED
• Visit kamunity.org to learn more about our platform
• Try kamunitydemo.org to create more rooms and explore ideas

We're building this together—your feedback helps shape the future of community collaboration.

Cheers,
The Kamunity Team

P.S. Your data won't be shared, and this specification is tailored specifically for your needs.
    `.trim();

    // Admin notification email
    const adminEmailContent = `
New Room Specification Generated

User Email: ${user_email}
Room Name: ${room_name}
Room Purpose: ${room_purpose}
Generated: ${new Date(timestamp).toLocaleString()}

Full Specification:
${room_spec}
    `.trim();

    // Send user email
    console.log('📧 Sending room spec email to user...');
    const userEmailData = {
      to: to_email,
      subject: `🏠 Your Kamunity Focus Room: "${room_name}" - Complete Specification`,
      html: generateRoomSpecUserEmail({ title: room_name, description: room_purpose, roomData: parsedSpec }, true),
      from: 'Kamunity Demo <demo@kamunity.org>'
    };

    const userResult = await sendEmailWithFallback(userEmailData);
    
    // Send admin notification
    console.log('📧 Sending room spec notification to admin...');
    const adminEmailData = {
      to: 'mike@kamunityconsulting.com',
      subject: `New Focus Room Spec Request - ${room_name}`,
      html: generateRoomSpecAdminEmail({ title: room_name, description: room_purpose, roomData: parsedSpec }, user_email || to_email, true),
      from: 'Kamunity Demo <demo@kamunity.org>'
    };

    const adminResult = await sendEmailWithFallback(adminEmailData);

    console.log('📧 Spec Email Results:', {
      to: to_email,
      room: room_name,
      user: { success: userResult.success, method: userResult.method },
      admin: { success: adminResult.success, method: adminResult.method },
      timestamp: new Date().toISOString()
    });

    return NextResponse.json({
      success: true,
      message: 'Specification emailed successfully',
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
    console.error('Spec email error:', error);
    return NextResponse.json(
      { error: 'Failed to send specification email' },
      { status: 500 }
    );
  }
}

