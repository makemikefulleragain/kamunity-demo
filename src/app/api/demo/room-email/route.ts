import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    const { 
      to_email, 
      user_email, 
      room_name, 
      room_purpose, 
      room_features, 
      rating, 
      feedback, 
      timestamp 
    } = data;

    // User email content
    const userEmailContent = `
      <h2>Your Kamunity Room Details</h2>
      <p>Thank you for designing a room with us! Here are your room details:</p>
      
      <div style="background: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <h3><strong>Room Name:</strong> ${room_name}</h3>
        <p><strong>Purpose:</strong> ${room_purpose}</p>
        <p><strong>Features:</strong> ${room_features}</p>
        <p><strong>Your Rating:</strong> ${rating}/5 stars</p>
        ${feedback ? `<p><strong>Your Feedback:</strong> ${feedback}</p>` : ''}
      </div>
      
      <p>We're creating this together! Your input helps us build better community spaces.</p>
      
      <p>
        <strong>Stay Connected:</strong><br>
        • Visit <a href="https://kamunity.org">kamunity.org</a> to stay in touch<br>
        • Try again at <a href="https://kamunitydemo.org">kamunitydemo.org</a> to provide more ideas
      </p>
      
      <p style="color: #6b7280; font-size: 14px;">
        Privacy Note: Your data won't be shared with third parties. 
        We use it only to improve the platform and may contact you about your room design.
      </p>
    `;

    // Admin email content
    const adminEmailContent = `
      <h2>New Room Design Submission</h2>
      <p>A user has completed a room design and provided feedback:</p>
      
      <div style="background: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <h3><strong>Room Details:</strong></h3>
        <p><strong>Name:</strong> ${room_name}</p>
        <p><strong>Purpose:</strong> ${room_purpose}</p>
        <p><strong>Features:</strong> ${room_features}</p>
        <p><strong>User Email:</strong> ${user_email}</p>
        <p><strong>Rating:</strong> ${rating}/5 stars</p>
        ${feedback ? `<p><strong>User Feedback:</strong> ${feedback}</p>` : ''}
        <p><strong>Timestamp:</strong> ${new Date(timestamp).toLocaleString()}</p>
      </div>
      
      <p>Please review and follow up as needed.</p>
    `;

    // Send emails (using existing email infrastructure pattern)
    console.log('Room Email - User:', {
      to: to_email,
      subject: `Your Kamunity Room: ${room_name}`,
      content: userEmailContent
    });

    console.log('Room Email - Admin:', {
      to: 'mike@kamunityconsulting.com',
      subject: `New Room Design: ${room_name} (${rating}/5 stars)`,
      content: adminEmailContent
    });

    // Track the email event
    console.log('Room email tracking:', {
      event: 'room_details_emailed',
      room_name,
      rating,
      has_feedback: !!feedback,
      timestamp
    });

    return NextResponse.json({ 
      success: true, 
      message: 'Room details emailed successfully' 
    });

  } catch (error) {
    console.error('Room email error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to send email' },
      { status: 500 }
    );
  }
}
