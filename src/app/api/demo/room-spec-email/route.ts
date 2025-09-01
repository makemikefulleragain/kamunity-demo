import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    console.log('🔥 Room spec email API called - Entry point reached');
    
    const body = await request.json();
    console.log('📋 Raw room spec email request body:', { hasData: !!body, keys: Object.keys(body || {}) });
    
    const { roomData, userEmail } = body;

    // Generate comprehensive room specification email content
    const emailContent = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Your Kamunity Focus Room Specification</title>
    <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; max-width: 800px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #10b981, #059669); color: white; padding: 30px; border-radius: 12px; text-align: center; margin-bottom: 30px; }
        .section { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 20px; margin-bottom: 20px; }
        .section h2 { color: #1e293b; margin-top: 0; border-bottom: 2px solid #10b981; padding-bottom: 8px; }
        .stats-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 15px; margin: 20px 0; }
        .stat-card { background: white; border: 1px solid #d1d5db; border-radius: 6px; padding: 15px; text-align: center; }
        .stat-value { font-size: 24px; font-weight: bold; color: #10b981; }
        .stat-label { font-size: 12px; color: #6b7280; text-transform: uppercase; }
        .feature-list { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 10px; }
        .feature-item { background: white; border-left: 4px solid #10b981; padding: 10px 15px; }
        .footer { text-align: center; padding: 30px; background: #f1f5f9; border-radius: 8px; margin-top: 30px; }
    </style>
</head>
<body>
    <div class="header">
        <h1>🏠 Your Focus Room Specification</h1>
        <p>Complete specification for: <strong>${roomData.name}</strong></p>
        <p>Generated on ${new Date().toLocaleDateString('en-AU', { 
          weekday: 'long', 
          year: 'numeric', 
          month: 'long', 
          day: 'numeric' 
        })}</p>
    </div>

    <div class="section">
        <h2>📋 Room Overview</h2>
        <p><strong>Name:</strong> ${roomData.name}</p>
        <p><strong>Purpose:</strong> ${roomData.purpose}</p>
        <p><strong>Target Audience:</strong> ${roomData.targetAudience}</p>
        <p><strong>Expected Members:</strong> ${roomData.expectedMembers}</p>
        <p><strong>Category:</strong> ${roomData.category}</p>
        <p><strong>Completeness:</strong> ${roomData.completeness}%</p>
    </div>

    <div class="section">
        <h2>🎯 Expected Outcomes</h2>
        <ul>
          ${roomData.expectedOutcomes?.map((outcome: string) => `<li>${outcome}</li>`).join('') || '<li>No specific outcomes defined</li>'}
        </ul>
    </div>

    <div class="section">
        <h2>🛠️ Tools & Features</h2>
        <div class="feature-list">
          ${roomData.tools?.map((tool: string) => `<div class="feature-item"><strong>${tool}</strong></div>`).join('') || '<div class="feature-item">Standard collaboration tools</div>'}
        </div>
    </div>

    <div class="section">
        <h2>📊 Current Room Statistics</h2>
        <div class="stats-grid">
            <div class="stat-card">
                <div class="stat-value">${roomData.stats?.activeMembers || 12}</div>
                <div class="stat-label">Active Members</div>
            </div>
            <div class="stat-card">
                <div class="stat-value">${roomData.stats?.messages || 156}</div>
                <div class="stat-label">Messages</div>
            </div>
            <div class="stat-card">
                <div class="stat-value">${roomData.stats?.engagement || 78}%</div>
                <div class="stat-label">Engagement</div>
            </div>
            <div class="stat-card">
                <div class="stat-value">${roomData.stats?.impactScore || 450}</div>
                <div class="stat-label">Impact Score</div>
            </div>
        </div>
    </div>

    <div class="section">
        <h2>🏷️ Room Tags</h2>
        <p>${roomData.tags?.join(', ') || 'No tags specified'}</p>
    </div>

    <div class="section">
        <h2>📝 Implementation Details</h2>
        <p><strong>Time Commitment:</strong> ${roomData.timeCommitment || 'Flexible'}</p>
        <p><strong>Skills Required:</strong> ${roomData.skillsRequired || 'None specified'}</p>
        <p><strong>Privacy Level:</strong> ${roomData.privacyLevel || 'Standard'}</p>
    </div>

    <div class="footer">
        <h3>🚀 Next Steps</h3>
        <p>Your room has been saved to the Kamunity Room Hub where you can:</p>
        <ul style="text-align: left; display: inline-block;">
            <li>View and interact with your saved room</li>
            <li>Share the room with potential members</li>
            <li>Generate additional rooms for different purposes</li>
            <li>Explore other community rooms for inspiration</li>
        </ul>
        <p><strong>Visit your Room Hub:</strong> <a href="https://kamunitydemo.org/rooms" style="color: #10b981;">kamunitydemo.org/rooms</a></p>
        <p style="margin-top: 20px; font-size: 14px; color: #6b7280;">
            This email was generated automatically from your Kamunity Focus Room Generator session.
        </p>
    </div>
</body>
</html>
    `;

    // Send email directly using EmailJS service (avoid circular dependency)
    const emailResult = await sendRoomSpecEmail({
      to: userEmail,
      subject: `🏠 Your Kamunity Focus Room: "${roomData.name}" - Complete Specification`,
      html: emailContent,
      roomName: roomData.name
    });

    // Send admin notification
    const adminEmailContent = `
      <h2>New Room Saved & Emailed</h2>
      <p><strong>User Email:</strong> ${userEmail}</p>
      <p><strong>Room Name:</strong> ${roomData.name}</p>
      <p><strong>Room Purpose:</strong> ${roomData.purpose}</p>
      <p><strong>Completeness:</strong> ${roomData.completeness}%</p>
      <p><strong>Generated:</strong> ${new Date().toLocaleString()}</p>
      
      <h3>Room Data Summary</h3>
      <pre>${JSON.stringify(roomData, null, 2)}</pre>
    `;

    await sendRoomSpecEmail({
      to: 'mike@kamunityconsulting.com',
      subject: `Room Saved: ${roomData.name} (${userEmail})`,
      html: adminEmailContent,
      roomName: roomData.name,
      isAdmin: true
    });

    return NextResponse.json({ 
      success: true, 
      message: 'Room specification email sent successfully',
      roomId: roomData.id,
      emailSent: emailResult.success,
      method: emailResult.method
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

async function sendRoomSpecEmail({ to, subject, html, roomName, isAdmin = false }: { 
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
        console.log('📧 Attempting EmailJS send for room spec:', { to, subject: subject.substring(0, 50), isAdmin });
        
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
          console.log(`✅ Room spec email sent via EmailJS to ${to}`);
          emailSent.success = true;
          emailSent.method = 'emailjs';
          return emailSent;
        } else {
          const errorData = await response.text();
          console.error('📧 EmailJS room spec error:', {
            status: response.status,
            error: errorData.substring(0, 200)
          });
        }
      } catch (emailJsError) {
        console.warn('EmailJS room spec failed, trying fallback:', emailJsError);
      }
    }

    // Fallback: Console logging for demo
    console.log(`📧 ROOM SPEC EMAIL SIMULATION - To: ${to}`);
    console.log(`📧 ROOM SPEC EMAIL SIMULATION - Subject: ${subject}`);
    console.log(`📧 ROOM SPEC EMAIL SIMULATION - Room: ${roomName}`);
    console.log(`📧 ROOM SPEC EMAIL SIMULATION - Content: ${html.substring(0, 200)}...`);
    
    emailSent.success = true;
    emailSent.method = 'console_simulation';
    
  } catch (error) {
    console.error('All room spec email methods failed:', error);
  }
  
  return emailSent;
}
