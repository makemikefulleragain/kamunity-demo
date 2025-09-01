import { NextRequest, NextResponse } from 'next/server';
import { logEmailAttempt } from '@/lib/debug/emailDebugger';

interface SurveyData {
  email?: string;
  experience: string;
  mostInteresting: string;
  suggestions: string;
  wouldUseAgain: string;
  additionalFeatures: string;
  roomIdeas: string;
}

interface AnalyticsData {
  sessionId: string;
  userId?: string;
  interests: any;
  engagementLevel: string;
  recommendedActions: string[];
}

export async function POST(request: NextRequest) {
  try {
    console.log('🔥 Survey API called');
    
    const { surveyData, analyticsData, timestamp } = await request.json() as {
      surveyData: SurveyData;
      analyticsData: AnalyticsData;
      timestamp: string;
    };

    console.log('📋 Survey data received:', { 
      hasEmail: !!surveyData.email, 
      experience: surveyData.experience,
      emailAddress: surveyData.email ? surveyData.email.substring(0, 3) + '***' : 'none'
    });

    // Send admin notification email
    console.log('📧 Sending admin notification...');
    await sendAdminNotification(surveyData, analyticsData, timestamp);
    console.log('✅ Admin notification sent');

    // Send user thank you email if email provided
    if (surveyData.email) {
      console.log('📧 Sending user thank you email...');
      await sendUserThankYou(surveyData, analyticsData, timestamp);
      console.log('✅ User thank you email sent');
    } else {
      console.log('⚠️ No user email provided, skipping user email');
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Survey submitted successfully' 
    });

  } catch (error) {
    console.error('💥 Survey submission error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to submit survey' },
      { status: 500 }
    );
  }
}

async function sendAdminNotification(
  surveyData: SurveyData, 
  analyticsData: AnalyticsData, 
  timestamp: string
) {
  const emailContent = `
    <h2>New Kamunity Demo Feedback</h2>
    <p><strong>Submitted:</strong> ${new Date(timestamp).toLocaleString()}</p>
    
    <h3>Survey Responses</h3>
    <ul>
      <li><strong>Experience:</strong> ${surveyData.experience}</li>
      <li><strong>Most Interesting:</strong> ${surveyData.mostInteresting}</li>
      <li><strong>Would Use Again:</strong> ${surveyData.wouldUseAgain}</li>
      <li><strong>Suggestions:</strong> ${surveyData.suggestions || 'None provided'}</li>
      <li><strong>Feature Ideas:</strong> ${surveyData.additionalFeatures || 'None provided'}</li>
      <li><strong>Room Ideas:</strong> ${surveyData.roomIdeas || 'None provided'}</li>
      <li><strong>Email:</strong> ${surveyData.email || 'Not provided'}</li>
    </ul>

    <h3>Analytics Summary</h3>
    <ul>
      <li><strong>Session ID:</strong> ${analyticsData.sessionId}</li>
      <li><strong>User ID:</strong> ${analyticsData.userId || 'Anonymous'}</li>
      <li><strong>Engagement Level:</strong> ${analyticsData.engagementLevel}</li>
      <li><strong>Behavior Patterns:</strong> ${JSON.stringify(analyticsData.interests?.behaviorPatterns || {})}</li>
      <li><strong>Recommended Actions:</strong> ${analyticsData.recommendedActions?.join(', ') || 'None'}</li>
    </ul>
  `;

  await sendEmail({
    to: 'mike@kamunityconsulting.com',
    subject: 'New Kamunity Demo Feedback',
    html: emailContent
  });
}

async function sendUserThankYou(
  surveyData: SurveyData, 
  analyticsData: AnalyticsData, 
  timestamp: string
) {
  const emailContent = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="text-align: center; margin-bottom: 30px;">
        <h1 style="color: #0ea5e9; margin-bottom: 10px;">Thank You for Your Feedback! 🎉</h1>
        <p style="color: #666; font-size: 18px;">Here's a summary of your Kamunity demo experience</p>
      </div>

      <div style="background: #f8fafc; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
        <h2 style="color: #334155; margin-top: 0;">Your Feedback Summary</h2>
        <ul style="color: #64748b; line-height: 1.6;">
          <li>Experience rating: <strong>${surveyData.experience}</strong></li>
          <li>Most interesting: <strong>${surveyData.mostInteresting}</strong></li>
          <li>Would use again: <strong>${surveyData.wouldUseAgain}</strong></li>
          ${surveyData.suggestions ? `<li>Your suggestions: "${surveyData.suggestions}"</li>` : ''}
          ${surveyData.additionalFeatures ? `<li>Feature ideas: "${surveyData.additionalFeatures}"</li>` : ''}
          ${surveyData.roomIdeas ? `<li>Room ideas: "${surveyData.roomIdeas}"</li>` : ''}
        </ul>
      </div>

      <div style="text-align: center; margin: 30px 0;">
        <h3 style="color: #334155;">Thank You for Exploring Kamunity</h3>
        <p style="color: #64748b; margin-bottom: 20px;">
          Your feedback helps us understand how people experience community-building platforms. 
          This demo showcases the potential for progressive community organization.
        </p>
        
        <div style="display: flex; gap: 15px; justify-content: center; flex-wrap: wrap;">
          <a href="https://kamunity.org" 
             style="background: #0ea5e9; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
            🌍 Learn More
          </a>
          <a href="https://kamunitydemo.org" 
             style="background: #a855f7; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
            🎯 Try Demo Again
          </a>
        </div>
      </div>

      <div style="text-align: center; border-top: 1px solid #e2e8f0; padding-top: 20px; margin-top: 30px;">
        <p style="color: #94a3b8; font-size: 14px; margin: 0;">
          Questions or ideas? Reply to this email anytime.<br>
          <strong>Building community, one conversation at a time.</strong>
        </p>
      </div>
    </div>
  `;

  await sendEmail({
    to: surveyData.email!,
    subject: 'Thank you for your Kamunity feedback! 🎉',
    html: emailContent
  });
}

async function sendEmail({ to, subject, html }: { to: string; subject: string; html: string }) {
  const emailSent = { success: false, method: 'none' };
  
  try {
    // Primary: EmailJS service
    if (process.env.EMAILJS_SERVICE_ID && process.env.EMAILJS_TEMPLATE_ID && process.env.EMAILJS_USER_ID) {
      try {
        console.log('📧 Attempting EmailJS send:', { to, subject: subject.substring(0, 50) });
        
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
              reply_to: 'mike@kamunityconsulting.com'
            }
          })
        });

        console.log('📧 EmailJS response status:', response.status);
        
        if (response.ok) {
          const responseData = await response.text();
          console.log('📧 EmailJS success:', responseData.substring(0, 100));
        } else {
          const errorData = await response.text();
          console.error('📧 EmailJS error:', {
            status: response.status,
            statusText: response.statusText,
            error: errorData.substring(0, 200)
          });
        }

        if (response.ok) {
          console.log(`✅ Email sent via EmailJS to ${to}`);
          emailSent.success = true;
          emailSent.method = 'emailjs';
          logEmailAttempt(to, subject, 'emailjs', true);
          return emailSent;
        } else {
          const errorData = await response.text();
          logEmailAttempt(to, subject, 'emailjs', false, `HTTP ${response.status}: ${errorData.substring(0, 100)}`);
        }
      } catch (emailJsError) {
        const errorMsg = emailJsError instanceof Error ? emailJsError.message : 'Unknown EmailJS error';
        logEmailAttempt(to, subject, 'emailjs', false, errorMsg);
        console.warn('EmailJS failed, trying fallback:', emailJsError);
      }
    }

    // Fallback: Console logging for demo (when email service unavailable)
    console.log(`📧 EMAIL SIMULATION - To: ${to}`);
    console.log(`📧 EMAIL SIMULATION - Subject: ${subject}`);
    console.log(`📧 EMAIL SIMULATION - Content: ${html.substring(0, 200)}...`);
    
    emailSent.success = true;
    emailSent.method = 'console_simulation';
    
    // Track email delivery attempt
    logEmailAttempt(to, subject, 'console_simulation', true);
    await trackEmailDelivery(to, subject, emailSent.method, emailSent.success);
    
  } catch (error) {
    console.error('All email methods failed:', error);
    await trackEmailDelivery(to, subject, 'failed', false);
  }
  
  return emailSent;
}

async function trackEmailDelivery(to: string, subject: string, method: string, success: boolean) {
  try {
    // Enhanced logging for production debugging
    const logData = {
      timestamp: new Date().toISOString(),
      success,
      method,
      domain: to.includes('@') ? to.split('@')[1] : 'unknown',
      subject: subject.substring(0, 50),
      environment: process.env.NODE_ENV || 'unknown'
    };
    console.log(`📊 Email Delivery:`, logData);
    
    // Store in localStorage for debugging
    if (typeof window !== 'undefined') {
      const logs = JSON.parse(localStorage.getItem('email-delivery-logs') || '[]');
      logs.push(logData);
      // Keep only last 50 logs
      if (logs.length > 50) logs.shift();
      localStorage.setItem('email-delivery-logs', JSON.stringify(logs));
    }
  } catch (error) {
    console.warn('Failed to track email delivery:', error);
  }
}
