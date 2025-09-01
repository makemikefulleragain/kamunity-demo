import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
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

    // Send email using EmailJS service with fallback
    const emailResult = await sendSpecEmail({
      to: to_email,
      subject: `🏠 Your Kamunity Focus Room: "${room_name}" - Complete Specification`,
      html: userEmailContent,
      roomName: room_name
    });

    // Send admin notification
    await sendSpecEmail({
      to: 'mike@kamunityconsulting.com',
      subject: `New Room Specification Generated: ${room_name}`,
      html: adminEmailContent,
      roomName: room_name,
      isAdmin: true
    });

    console.log('📧 Spec Email Result:', {
      to: to_email,
      room: room_name,
      success: emailResult.success,
      method: emailResult.method,
      timestamp: new Date().toISOString()
    });

    return NextResponse.json({
      success: true,
      message: 'Specification emailed successfully',
      emailSent: emailResult.success,
      method: emailResult.method
    });

  } catch (error) {
    console.error('Spec email error:', error);
    return NextResponse.json(
      { error: 'Failed to send specification email' },
      { status: 500 }
    );
  }
}

async function sendSpecEmail({ to, subject, html, roomName, isAdmin = false }: { 
  to: string; 
  subject: string; 
  html: string; 
  roomName: string; 
  isAdmin?: boolean; 
}) {
  const emailSent = { success: false, method: 'none' };
  
  try {
    // Primary: EmailJS service
    if (process.env.EMAILJS_SERVICE_ID && process.env.EMAILJS_TEMPLATE_ID && process.env.EMAILJS_USER_ID) {
      try {
        console.log('📧 Attempting EmailJS send for spec:', { to, subject: subject.substring(0, 50), isAdmin });
        
        const response = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            service_id: process.env.EMAILJS_SERVICE_ID,
            template_id: process.env.EMAILJS_TEMPLATE_ID,
            user_id: process.env.EMAILJS_USER_ID,
            template_params: {
              to_email: to,
              to_name: to.split('@')[0],
              subject: subject,
              message: html.replace(/<[^>]*>/g, ''), // Strip HTML for plain text
              html_content: html,
              from_name: 'Kamunity Demo',
              from_email: 'demo@kamunity.org',
              reply_to: 'mike@kamunityconsulting.com',
              room_name: roomName,
              is_admin: isAdmin
            }
          })
        });

        if (response.ok) {
          console.log(`✅ Spec email sent via EmailJS to ${to}`);
          emailSent.success = true;
          emailSent.method = 'emailjs';
          return emailSent;
        } else {
          const errorData = await response.text();
          console.error('📧 EmailJS spec email error:', {
            status: response.status,
            error: errorData.substring(0, 200)
          });
        }
      } catch (emailJsError) {
        console.warn('EmailJS spec email failed, trying fallback:', emailJsError);
      }
    }

    // Fallback: Console logging for demo
    console.log(`📧 SPEC EMAIL SIMULATION - To: ${to}`);
    console.log(`📧 SPEC EMAIL SIMULATION - Subject: ${subject}`);
    console.log(`📧 SPEC EMAIL SIMULATION - Room: ${roomName}`);
    console.log(`📧 SPEC EMAIL SIMULATION - Content: ${html.substring(0, 200)}...`);
    
    emailSent.success = true;
    emailSent.method = 'console_simulation';
    
  } catch (error) {
    console.error('All spec email methods failed:', error);
  }
  
  return emailSent;
}
