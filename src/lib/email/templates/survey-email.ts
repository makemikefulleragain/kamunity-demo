export function generateSurveyUserEmail(surveyData: any, analyticsData: any, timestamp: string): string {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f8fafc;">
      <div style="background: white; border-radius: 12px; padding: 30px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
        
        <!-- Header -->
        <div style="text-align: center; margin-bottom: 30px; border-bottom: 2px solid #0ea5e9; padding-bottom: 20px;">
          <h1 style="color: #0ea5e9; margin: 0; font-size: 28px;">Thank You for Your Feedback! 🎉</h1>
          <p style="color: #64748b; font-size: 16px; margin: 10px 0 0 0;">Your insights help us build better communities together</p>
        </div>

        <!-- Feedback Summary -->
        <div style="background: #f1f5f9; padding: 20px; border-radius: 8px; margin-bottom: 25px;">
          <h2 style="color: #334155; margin: 0 0 15px 0; font-size: 20px;">Your Feedback Summary</h2>
          <div style="color: #475569; line-height: 1.6;">
            <p><strong>Experience:</strong> ${surveyData.experience}</p>
            <p><strong>Most Interesting:</strong> ${surveyData.mostInteresting}</p>
            <p><strong>Would Use Again:</strong> ${surveyData.wouldUseAgain}</p>
            ${surveyData.suggestions ? `<p><strong>Suggestions:</strong> ${surveyData.suggestions}</p>` : ''}
            ${surveyData.additionalFeatures ? `<p><strong>Feature Ideas:</strong> ${surveyData.additionalFeatures}</p>` : ''}
            ${surveyData.roomIdeas ? `<p><strong>Room Ideas:</strong> ${surveyData.roomIdeas}</p>` : ''}
          </div>
        </div>

        <!-- What's Next -->
        <div style="background: #ecfdf5; padding: 20px; border-radius: 8px; border-left: 4px solid #10b981; margin-bottom: 25px;">
          <h3 style="color: #065f46; margin: 0 0 10px 0; font-size: 18px;">What's Next?</h3>
          <p style="color: #047857; margin: 0; line-height: 1.5;">
            We're actively building Kamunity based on feedback like yours. Your insights are helping shape how communities connect and create change together.
          </p>
        </div>

        <!-- Call to Action -->
        <div style="text-align: center; margin-bottom: 25px;">
          <a href="https://kamunity.org" style="display: inline-block; background: #0ea5e9; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; margin: 0 10px 10px 0;">
            Stay Connected
          </a>
          <a href="https://kamunitydemo.org" style="display: inline-block; background: #10b981; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; margin: 0 10px 10px 0;">
            Try Demo Again
          </a>
        </div>

        <!-- Footer -->
        <div style="text-align: center; border-top: 1px solid #e2e8f0; padding-top: 20px; margin-top: 30px;">
          <p style="color: #94a3b8; font-size: 14px; margin: 0;">
            Questions or ideas? Reply to this email anytime.<br>
            <strong>Building community, one conversation at a time.</strong>
          </p>
        </div>
      </div>
    </div>
  `;
}

export function generateSurveyAdminEmail(surveyData: any, analyticsData: any, timestamp: string): string {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="background: white; border-radius: 8px; padding: 25px; border-left: 4px solid #0ea5e9;">
        
        <h2 style="color: #0ea5e9; margin: 0 0 20px 0;">New Kamunity Demo Feedback</h2>
        <p style="color: #64748b; margin: 0 0 25px 0;"><strong>Submitted:</strong> ${new Date(timestamp).toLocaleString()}</p>
        
        <div style="background: #f8fafc; padding: 20px; border-radius: 6px; margin-bottom: 20px;">
          <h3 style="color: #334155; margin: 0 0 15px 0;">Survey Responses</h3>
          <ul style="color: #475569; line-height: 1.6; margin: 0; padding-left: 20px;">
            <li><strong>Experience:</strong> ${surveyData.experience}</li>
            <li><strong>Most Interesting:</strong> ${surveyData.mostInteresting}</li>
            <li><strong>Would Use Again:</strong> ${surveyData.wouldUseAgain}</li>
            <li><strong>Suggestions:</strong> ${surveyData.suggestions || 'None provided'}</li>
            <li><strong>Feature Ideas:</strong> ${surveyData.additionalFeatures || 'None provided'}</li>
            <li><strong>Room Ideas:</strong> ${surveyData.roomIdeas || 'None provided'}</li>
            <li><strong>Email:</strong> ${surveyData.email || 'Not provided'}</li>
          </ul>
        </div>

        <div style="background: #f1f5f9; padding: 20px; border-radius: 6px;">
          <h3 style="color: #334155; margin: 0 0 15px 0;">Analytics Summary</h3>
          <ul style="color: #475569; line-height: 1.6; margin: 0; padding-left: 20px;">
            <li><strong>Session ID:</strong> ${analyticsData.sessionId}</li>
            <li><strong>User ID:</strong> ${analyticsData.userId || 'Anonymous'}</li>
            <li><strong>Engagement Level:</strong> ${analyticsData.engagementLevel}</li>
            <li><strong>Behavior Patterns:</strong> ${JSON.stringify(analyticsData.interests?.behaviorPatterns || {})}</li>
            <li><strong>Recommended Actions:</strong> ${analyticsData.recommendedActions?.join(', ') || 'None'}</li>
          </ul>
        </div>
      </div>
    </div>
  `;
}
