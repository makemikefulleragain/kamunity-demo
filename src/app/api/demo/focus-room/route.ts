import { NextRequest, NextResponse } from 'next/server';

interface FocusRoomData {
  roomName: string;
  primaryGoal: string;
  targetAudience: string;
  timeCommitment: string;
  keyFeatures: string[];
  successMetrics: string[];
  email?: string;
}

export async function POST(request: NextRequest) {
  try {
    const focusRoomData = await request.json() as FocusRoomData;
    
    // Validate required fields
    if (!focusRoomData.roomName || !focusRoomData.primaryGoal) {
      return NextResponse.json(
        { success: false, message: 'Room name and primary goal are required' },
        { status: 400 }
      );
    }

    // Check if email services are configured
    const emailConfigured = process.env.EMAILJS_SERVICE_ID && 
                            process.env.EMAILJS_TEMPLATE_ID && 
                            process.env.EMAILJS_USER_ID;

    // Generate comprehensive spec sheet content
    const specSheetContent = generateSpecSheet(focusRoomData);

    let emailStatus = 'skipped';
    
    if (emailConfigured) {
      try {
        // Send admin notification
        await sendAdminNotification(focusRoomData, specSheetContent);

        // Send user spec sheet if email provided
        if (focusRoomData.email) {
          await sendUserSpecSheet(focusRoomData, specSheetContent);
          emailStatus = 'sent';
        }
      } catch (emailError) {
        console.error('Email sending failed:', emailError);
        emailStatus = 'failed';
      }
    } else {
      console.warn('Email service not configured - skipping email notifications');
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Focus Room spec sheet generated successfully',
      emailStatus,
      specSheet: specSheetContent
    });

  } catch (error) {
    console.error('Focus Room generation error:', error);
    
    // Provide more detailed error information
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    
    return NextResponse.json(
      { 
        success: false, 
        message: 'Failed to generate Focus Room spec sheet',
        error: errorMessage,
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    );
  }
}

function generateSpecSheet(data: FocusRoomData) {
  const memberCount = 15;
  const hoursSaved = 5;
  const hourlyValue = 35;
  const weeklyROI = memberCount * hoursSaved * hourlyValue;
  const monthlyROI = weeklyROI * 4;
  const yearlyROI = monthlyROI * 12;

  const timeframe = data.timeCommitment.includes('daily') ? 'day' : 'week';
  
  const dayInTheLife = `
**A ${timeframe} in the life of your ${data.roomName}:**

**Morning (9:00 AM):** Sarah logs into her ${data.roomName} and sees 3 new updates from overnight. The AI assistant has already summarized key discussions and highlighted 2 action items that need her attention.

**Mid-Morning (10:30 AM):** The weekly check-in begins. 12 members join the video call, with 8 more participating asynchronously. The AI facilitates by tracking speaking time and suggesting agenda items based on recent activity.

**Afternoon (2:00 PM):** A breakthrough moment! The collaborative workspace shows real progress on ${data.primaryGoal}. Members vote on next steps using the integrated decision-making tools.

**Evening (6:00 PM):** Impact achieved! The room's dashboard shows measurable progress: ${data.successMetrics.slice(0, 2).join(' and ')}. Members celebrate and plan the next milestone.

**Result:** What used to take 3 separate meetings and countless emails now happens seamlessly in one integrated space, saving 5+ hours per week while achieving better outcomes.
  `;

  return {
    roomOverview: {
      name: data.roomName,
      goal: data.primaryGoal,
      audience: data.targetAudience,
      commitment: data.timeCommitment,
      features: data.keyFeatures,
      metrics: data.successMetrics
    },
    roiAnalysis: {
      weekly: weeklyROI,
      monthly: monthlyROI,
      yearly: yearlyROI,
      memberCount,
      hoursSaved
    },
    dayInTheLife,
    implementationPlan: {
      phase1: "Setup & Onboarding (Week 1-2)",
      phase2: "Community Building (Week 3-6)", 
      phase3: "Full Operations (Week 7+)"
    }
  };
}

async function sendAdminNotification(data: FocusRoomData, specSheet: any) {
  const emailContent = `
    <h2>New Focus Room Generated</h2>
    <p><strong>Generated:</strong> ${new Date().toLocaleString()}</p>
    
    <h3>Room Details</h3>
    <ul>
      <li><strong>Room Name:</strong> ${data.roomName}</li>
      <li><strong>Primary Goal:</strong> ${data.primaryGoal}</li>
      <li><strong>Target Audience:</strong> ${data.targetAudience}</li>
      <li><strong>Time Commitment:</strong> ${data.timeCommitment}</li>
      <li><strong>Key Features:</strong> ${data.keyFeatures.join(', ')}</li>
      <li><strong>Success Metrics:</strong> ${data.successMetrics.join(', ')}</li>
      <li><strong>User Email:</strong> ${data.email || 'Not provided'}</li>
    </ul>

    <h3>ROI Analysis</h3>
    <ul>
      <li><strong>Projected Annual Value:</strong> $${specSheet.roiAnalysis.yearly.toLocaleString()}</li>
      <li><strong>Members:</strong> ${specSheet.roiAnalysis.memberCount}</li>
      <li><strong>Hours Saved/Week:</strong> ${specSheet.roiAnalysis.hoursSaved} per member</li>
    </ul>
  `;

  await sendEmail({
    to: 'mike@kamunityconsulting.com',
    subject: `New Focus Room: ${data.roomName}`,
    html: emailContent
  });
}

async function sendUserSpecSheet(data: FocusRoomData, specSheet: any) {
  const emailContent = `
    <div style="font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto; padding: 20px;">
      <div style="text-align: center; margin-bottom: 30px;">
        <h1 style="color: #0ea5e9; margin-bottom: 10px;">Your Focus Room Specification 🎯</h1>
        <p style="color: #666; font-size: 18px;">${data.roomName}</p>
      </div>

      <!-- Room Overview -->
      <div style="background: linear-gradient(135deg, #ddd6fe 0%, #e0e7ff 100%); padding: 25px; border-radius: 12px; margin-bottom: 25px;">
        <h2 style="color: #7c3aed; margin-top: 0; display: flex; align-items: center;">
          ✨ ${data.roomName}
        </h2>
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin-top: 15px;">
          <div><strong>Primary Goal:</strong> ${data.primaryGoal}</div>
          <div><strong>Target Audience:</strong> ${data.targetAudience}</div>
          <div><strong>Time Commitment:</strong> ${data.timeCommitment}</div>
          <div><strong>Key Features:</strong> ${data.keyFeatures.join(', ')}</div>
        </div>
      </div>

      <!-- ROI Analysis -->
      <div style="background: #ecfdf5; padding: 25px; border-radius: 12px; margin-bottom: 25px;">
        <h2 style="color: #059669; margin-top: 0; display: flex; align-items: center;">
          💰 ROI & Time Savings
        </h2>
        <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; text-align: center; margin-top: 15px;">
          <div>
            <div style="font-size: 24px; font-weight: bold; color: #059669;">$${specSheet.roiAnalysis.weekly.toLocaleString()}</div>
            <div style="color: #065f46; font-size: 14px;">Weekly Value</div>
          </div>
          <div>
            <div style="font-size: 24px; font-weight: bold; color: #059669;">$${specSheet.roiAnalysis.monthly.toLocaleString()}</div>
            <div style="color: #065f46; font-size: 14px;">Monthly Value</div>
          </div>
          <div>
            <div style="font-size: 24px; font-weight: bold; color: #059669;">$${specSheet.roiAnalysis.yearly.toLocaleString()}</div>
            <div style="color: #065f46; font-size: 14px;">Annual Value</div>
          </div>
        </div>
        <div style="text-align: center; margin-top: 15px; color: #065f46; font-size: 14px;">
          Based on ${specSheet.roiAnalysis.memberCount} members saving ${specSheet.roiAnalysis.hoursSaved} hours/week each
        </div>
      </div>

      <!-- Feedback Section -->
      <div style="background: #fff7ed; padding: 20px; border-radius: 8px; border-left: 4px solid #f97316; margin-bottom: 25px;">
        <h2 style="color: #f97316; margin-top: 0;">💬 Need Adjustments?</h2>
        <p style="margin-bottom: 15px;">Your Focus Room can be perfectly tailored to your community's needs!</p>
        <p style="margin-bottom: 15px;"><strong>Use the feedback button</strong> in your room to request:</p>
        <ul style="margin-bottom: 15px; padding-left: 20px;">
          <li>Fast dedicated room adjustments</li>
          <li>Custom tool integrations</li>
          <li>Specialized features for your use case</li>
          <li>Community-specific optimizations</li>
        </ul>
        <p style="margin-bottom: 0; font-weight: bold; color: #ea580c;">We respond within 24 hours with personalized solutions!</p>
      </div>

      <!-- Day in the Life -->
      <div style="background: #fff7ed; padding: 25px; border-radius: 12px; margin-bottom: 25px;">
        <h2 style="color: #ea580c; margin-top: 0; display: flex; align-items: center;">
          🕐 Day in the Life
        </h2>
        <div style="white-space: pre-line; color: #9a3412; line-height: 1.6;">
          ${specSheet.dayInTheLife}
        </div>
      </div>

      <!-- Success Metrics -->
      <div style="background: #faf5ff; padding: 25px; border-radius: 12px; margin-bottom: 25px;">
        <h2 style="color: #9333ea; margin-top: 0; display: flex; align-items: center;">
          🎯 Success Metrics
        </h2>
        <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 10px; margin-top: 15px;">
          ${data.successMetrics.map(metric => `
            <div style="display: flex; align-items: center; color: #7c2d12;">
              <span style="color: #22c55e; margin-right: 8px;">✓</span>
              ${metric}
            </div>
          `).join('')}
        </div>
      </div>

      <!-- Implementation Plan -->
      <div style="background: #f0f9ff; padding: 25px; border-radius: 12px; margin-bottom: 25px;">
        <h2 style="color: #0284c7; margin-top: 0;">🚀 Implementation Roadmap</h2>
        <div style="margin-top: 15px;">
          <div style="margin-bottom: 10px;"><strong>Phase 1:</strong> ${specSheet.implementationPlan.phase1}</div>
          <div style="margin-bottom: 10px;"><strong>Phase 2:</strong> ${specSheet.implementationPlan.phase2}</div>
          <div style="margin-bottom: 10px;"><strong>Phase 3:</strong> ${specSheet.implementationPlan.phase3}</div>
        </div>
      </div>


      <!-- Call to Action -->
      <div style="background: linear-gradient(135deg, #1e40af 0%, #7c3aed 100%); color: white; padding: 25px; border-radius: 12px; text-align: center; margin-bottom: 25px;">
        <h2 style="margin-top: 0;">Ready to Launch Your Focus Room?</h2>
        <p style="margin-bottom: 20px; opacity: 0.9;">
          This specification is your blueprint for building a thriving community space. Let's make it happen!
        </p>
        <div style="display: flex; gap: 15px; justify-content: center; flex-wrap: wrap;">
          <a href="https://kamunity.org" 
             style="background: white; color: #1e40af; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block; font-weight: bold;">
            🌍 Get Started at Kamunity.org
          </a>
          <a href="https://kamunitydemo.org" 
             style="background: rgba(255,255,255,0.2); color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block; font-weight: bold;">
            🎯 Explore More Features
          </a>
        </div>
      </div>

      <div style="text-align: center; border-top: 1px solid #e2e8f0; padding-top: 20px; margin-top: 30px;">
        <p style="color: #94a3b8; font-size: 14px; margin: 0;">
          Questions about your Focus Room? Reply to this email - we're here to help!<br>
          <strong>Building community, one room at a time.</strong>
        </p>
      </div>
    </div>
  `;

  await sendEmail({
    to: data.email!,
    subject: `Your Focus Room Spec: ${data.roomName} 🎯`,
    html: emailContent
  });
}

async function sendEmail({ to, subject, html }: { to: string; subject: string; html: string }) {
  try {
    const response = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        service_id: process.env.EMAILJS_SERVICE_ID,
        template_id: process.env.EMAILJS_TEMPLATE_ID,
        user_id: process.env.EMAILJS_USER_ID,
        template_params: {
          to_email: to,
          subject: subject,
          html_content: html,
          from_name: 'Kamunity Focus Room Generator',
          from_email: 'rooms@kamunity.org'
        }
      })
    });

    if (!response.ok) {
      throw new Error(`Email service responded with ${response.status}`);
    }

    console.log(`Focus Room spec sheet sent successfully to ${to}`);
  } catch (error) {
    console.error('Failed to send Focus Room email:', error);
  }
}
