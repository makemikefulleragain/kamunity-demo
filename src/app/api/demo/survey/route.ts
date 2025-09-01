import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { sendEmailWithFallback, EmailResult } from '@/lib/email/resend-service';
import { generateSurveyUserEmail, generateSurveyAdminEmail } from '@/lib/email/templates/survey-email';

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
    console.log('🔥 Survey API called - Entry point reached');
    
    const body = await request.json();
    console.log('📋 Raw request body:', { hasData: !!body, keys: Object.keys(body || {}) });
    
    const { surveyData, analyticsData, timestamp } = body as {
      surveyData: SurveyData;
      analyticsData: AnalyticsData;
      timestamp: string;
    };

    console.log('📋 Survey data received:', { 
      hasEmail: !!surveyData?.email, 
      experience: surveyData?.experience,
      emailAddress: surveyData?.email ? surveyData.email.substring(0, 3) + '***' : 'none'
    });

    // Send admin notification email
    console.log('📧 Sending admin notification...');
    const adminEmailResult = await sendAdminNotification(surveyData, analyticsData, timestamp);
    console.log('✅ Admin notification sent');

    // Send user thank you email if email provided
    let userEmailResult: EmailResult | null = null;
    if (surveyData?.email) {
      console.log('📧 Sending user thank you email...');
      userEmailResult = await sendUserThankYou(surveyData, analyticsData, timestamp);
      console.log('✅ User thank you email sent');
    } else {
      console.log('⚠️ No user email provided, skipping user email');
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Survey submitted successfully',
      emailStatus: {
        admin: adminEmailResult,
        user: userEmailResult
      },
      debug: {
        timestamp: new Date().toISOString(),
        resendConfigured: !!process.env.RESEND_API_KEY
      }
    });

  } catch (error) {
    console.error('💥 Survey submission error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to submit survey' },
      { status: 500 }
    );
  }
}

async function sendAdminNotification(surveyData: SurveyData, analyticsData: AnalyticsData, timestamp: string): Promise<EmailResult> {
  console.log('📧 Starting admin notification email with Resend...');
  
  const adminEmailData = {
    to: 'mike@kamunityconsulting.com',
    subject: `New Kamunity Demo Survey - ${new Date(timestamp).toLocaleDateString()}`,
    html: generateSurveyAdminEmail(surveyData, analyticsData, timestamp),
    from: 'Kamunity Demo <demo@kamunity.org>'
  };

  const result = await sendEmailWithFallback(adminEmailData);
  
  console.log('📧 Admin notification result:', {
    success: result.success,
    method: result.method,
    messageId: result.messageId
  });

  return result;
}

async function sendUserThankYou(surveyData: SurveyData, analyticsData: AnalyticsData, timestamp: string): Promise<EmailResult> {
  console.log('📧 Starting user thank you email with Resend...');
  
  const userEmailData = {
    to: surveyData.email!,
    subject: 'Thank you for your Kamunity Demo feedback!',
    html: generateSurveyUserEmail(surveyData, analyticsData, timestamp),
    from: 'Kamunity Demo <demo@kamunity.org>'
  };

  const result = await sendEmailWithFallback(userEmailData);
  
  console.log('📧 User thank you result:', {
    success: result.success,
    method: result.method,
    messageId: result.messageId
  });

  return result;
}
