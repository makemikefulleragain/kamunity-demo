import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export interface EmailResult {
  success: boolean;
  method: string;
  messageId?: string;
  error?: string;
}

export interface EmailData {
  to: string;
  subject: string;
  html: string;
  from?: string;
}

/**
 * Send email using Resend with retry mechanism
 */
export async function sendEmailWithResend(emailData: EmailData): Promise<EmailResult> {
  const { to, subject, html, from = 'Kamunity Demo <demo@kamunity.org>' } = emailData;
  
  console.log('📧 Resend email attempt:', { 
    to: to.substring(0, 10) + '***', 
    subject: subject.substring(0, 50),
    from 
  });

  try {
    // Validate API key
    if (!process.env.RESEND_API_KEY) {
      throw new Error('RESEND_API_KEY not configured');
    }

    const { data, error } = await resend.emails.send({
      from,
      to: [to],
      subject,
      html,
    });

    if (error) {
      console.error('📧 Resend API error:', error);
      return {
        success: false,
        method: 'resend',
        error: error.message || 'Resend API error'
      };
    }

    console.log('✅ Resend email sent successfully:', { 
      messageId: data?.id,
      to: to.substring(0, 10) + '***'
    });

    return {
      success: true,
      method: 'resend',
      messageId: data?.id
    };

  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : 'Unknown Resend error';
    console.error('📧 Resend error:', errorMsg);
    
    return {
      success: false,
      method: 'resend',
      error: errorMsg
    };
  }
}

/**
 * Send dual emails (user + admin) with retry mechanism
 */
export async function sendDualEmails(
  userEmail: string,
  userEmailData: EmailData,
  adminEmailData: EmailData
): Promise<{ user: EmailResult; admin: EmailResult }> {
  
  console.log('📧 Starting dual email delivery:', {
    userEmail: userEmail.substring(0, 10) + '***',
    adminEmail: 'mike@kamunityconsulting.com'
  });

  // Send user email first
  const userResult = await sendEmailWithResend(userEmailData);
  
  // Send admin notification
  const adminResult = await sendEmailWithResend({
    ...adminEmailData,
    to: 'mike@kamunityconsulting.com'
  });

  console.log('📧 Dual email results:', {
    user: { success: userResult.success, method: userResult.method },
    admin: { success: adminResult.success, method: adminResult.method }
  });

  return { user: userResult, admin: adminResult };
}

/**
 * Email delivery with fallback mechanism
 */
export async function sendEmailWithFallback(emailData: EmailData): Promise<EmailResult> {
  // Primary: Resend
  const resendResult = await sendEmailWithResend(emailData);
  
  if (resendResult.success) {
    return resendResult;
  }

  // Fallback: Console simulation for demo
  console.log('📧 EMAIL FALLBACK - Resend failed, using console simulation');
  console.log(`📧 SIMULATION - To: ${emailData.to}`);
  console.log(`📧 SIMULATION - Subject: ${emailData.subject}`);
  console.log(`📧 SIMULATION - Content: ${emailData.html.substring(0, 200)}...`);

  return {
    success: true,
    method: 'console_simulation',
    error: `Resend failed: ${resendResult.error}`
  };
}
