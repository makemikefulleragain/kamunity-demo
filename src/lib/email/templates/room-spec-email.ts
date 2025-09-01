function formatDetailedSpec(detailedSpec: any): string {
  if (!detailedSpec) return 'Basic room specification included.';
  
  let formatted = '';
  
  // Pitch & Call to Action
  if (detailedSpec.pitchSection) {
    formatted += `<div style="margin-bottom: 20px;"><h4 style="color: #713f12; margin: 0 0 8px 0;">🎯 PITCH & CALL TO ACTION</h4>`;
    formatted += `<p style="margin: 0 0 5px 0;">${detailedSpec.pitchSection.hook || 'Transform your collaboration'}</p>`;
    formatted += `<p style="margin: 0;">${detailedSpec.pitchSection.cta || 'Let\'s get started!'}</p></div>`;
  }
  
  // ROI Story
  if (detailedSpec.roiStory) {
    formatted += `<div style="margin-bottom: 20px;"><h4 style="color: #713f12; margin: 0 0 8px 0;">💰 COMMUNITY SPACE ROI</h4>`;
    formatted += `<p style="margin: 0;">${detailedSpec.roiStory}</p></div>`;
  }
  
  // Savings Table
  if (detailedSpec.savingsTable) {
    formatted += `<div style="margin-bottom: 20px;"><h4 style="color: #713f12; margin: 0 0 8px 0;">⏰ TIME & COST SAVINGS</h4>`;
    const st = detailedSpec.savingsTable;
    formatted += `<p style="margin: 0 0 5px 0;"><strong>Before:</strong> ${st.before?.weeklyHours || '8 hours'} | ${st.before?.monthlyTools || '$200'}</p>`;
    formatted += `<p style="margin: 0 0 5px 0;"><strong>After:</strong> ${st.after?.weeklyHours || '3 hours'} | ${st.after?.monthlyTools || '$50'}</p>`;
    formatted += `<p style="margin: 0;"><strong>Savings:</strong> ${st.savings?.timeWeekly || '5 hours'} | ${st.savings?.costMonthly || '$150'}</p></div>`;
  }
  
  // Wireframe
  if (detailedSpec.wireframe) {
    formatted += `<div style="margin-bottom: 20px;"><h4 style="color: #713f12; margin: 0 0 8px 0;">🏠 HOMEPAGE WIREFRAME</h4>`;
    formatted += `<p style="margin: 0;">${detailedSpec.wireframe.description || 'Standard layout with navigation, content areas, and widgets'}</p></div>`;
  }
  
  // User Flow
  if (detailedSpec.userFlow && detailedSpec.userFlow.length > 0) {
    formatted += `<div style="margin-bottom: 20px;"><h4 style="color: #713f12; margin: 0 0 8px 0;">📋 USER FLOW</h4>`;
    detailedSpec.userFlow.forEach((step: string, i: number) => {
      formatted += `<p style="margin: 0 0 3px 0;">${i + 1}. ${step}</p>`;
    });
    formatted += `</div>`;
  }
  
  // Design Questions
  if (detailedSpec.designQuestions && detailedSpec.designQuestions.length > 0) {
    formatted += `<div style="margin-bottom: 20px;"><h4 style="color: #713f12; margin: 0 0 8px 0;">❓ DESIGN QUESTIONS</h4>`;
    detailedSpec.designQuestions.forEach((q: string, i: number) => {
      formatted += `<p style="margin: 0 0 3px 0;">${i + 1}. ${q}</p>`;
    });
    formatted += `</div>`;
  }
  
  // Feature Matrix
  if (detailedSpec.featureMatrix) {
    formatted += `<div style="margin-bottom: 20px;"><h4 style="color: #713f12; margin: 0 0 8px 0;">📊 FEATURE MATRIX</h4>`;
    const fm = detailedSpec.featureMatrix;
    if (fm.mvp) formatted += `<p style="margin: 0 0 3px 0;"><strong>MVP:</strong> ${fm.mvp.join(', ')}</p>`;
    if (fm.pro) formatted += `<p style="margin: 0 0 3px 0;"><strong>Pro:</strong> ${fm.pro.join(', ')}</p>`;
    if (fm.full) formatted += `<p style="margin: 0;"><strong>Full:</strong> ${fm.full.join(', ')}</p>`;
    formatted += `</div>`;
  }
  
  // Additional Suggestions
  if (detailedSpec.suggestions) {
    formatted += `<div style="margin-bottom: 20px;"><h4 style="color: #713f12; margin: 0 0 8px 0;">💡 ADDITIONAL SUGGESTIONS</h4>`;
    const s = detailedSpec.suggestions;
    if (s.metrics) formatted += `<p style="margin: 0 0 3px 0;"><strong>Metrics:</strong> ${s.metrics.join(', ')}</p>`;
    if (s.pilot) formatted += `<p style="margin: 0 0 3px 0;"><strong>Pilot:</strong> ${s.pilot}</p>`;
    if (s.nextSteps) formatted += `<p style="margin: 0;"><strong>Next Steps:</strong> ${s.nextSteps.join(', ')}</p>`;
    formatted += `</div>`;
  }
  
  return formatted || 'Detailed specification data available - contact for full implementation details.';
}

export function generateRoomSpecUserEmail(roomData: any, isFromGenerator: boolean = false): string {
  const roomType = isFromGenerator ? 'Focus Room Generator' : 'Saved Room';
  
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f8fafc;">
      <div style="background: white; border-radius: 12px; padding: 30px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
        
        <!-- Header -->
        <div style="text-align: center; margin-bottom: 30px; border-bottom: 2px solid #10b981; padding-bottom: 20px;">
          <h1 style="color: #10b981; margin: 0; font-size: 28px;">Your ${roomType} Specification 🎯</h1>
          <p style="color: #64748b; font-size: 16px; margin: 10px 0 0 0;">Complete room scope and implementation details</p>
        </div>

        <!-- Room Overview -->
        <div style="background: #f0fdf4; padding: 20px; border-radius: 8px; margin-bottom: 25px; border-left: 4px solid #10b981;">
          <h2 style="color: #065f46; margin: 0 0 15px 0; font-size: 22px;">${roomData.title || roomData.name}</h2>
          <p style="color: #047857; margin: 0; line-height: 1.6; font-size: 16px;">
            ${roomData.description || roomData.purpose || 'Community-focused action room'}
          </p>
        </div>

        <!-- Room Details -->
        <div style="background: #f1f5f9; padding: 20px; border-radius: 8px; margin-bottom: 25px;">
          <h3 style="color: #334155; margin: 0 0 15px 0; font-size: 18px;">Room Details</h3>
          <div style="color: #475569; line-height: 1.6;">
            ${roomData.category ? `<p><strong>Category:</strong> ${roomData.category}</p>` : ''}
            ${roomData.engagement ? `<p><strong>Engagement Score:</strong> ${roomData.engagement}%</p>` : ''}
            ${roomData.memberCount ? `<p><strong>Expected Members:</strong> ${roomData.memberCount}</p>` : ''}
            ${roomData.tags ? `<p><strong>Focus Areas:</strong> ${roomData.tags.join(', ')}</p>` : ''}
          </div>
        </div>

        <!-- Complete Specification -->
        ${roomData.roomData ? `
        <div style="background: #fefce8; padding: 20px; border-radius: 8px; margin-bottom: 25px; border-left: 4px solid #eab308;">
          <h3 style="color: #713f12; margin: 0 0 15px 0; font-size: 18px;">📋 Complete Specification</h3>
          <div style="color: #a16207; line-height: 1.6; font-size: 14px;">
            ${formatDetailedSpec(roomData.roomData)}
          </div>
        </div>
        ` : ''}

        <!-- Call to Action -->
        <div style="text-align: center; margin-bottom: 25px;">
          <a href="https://kamunitydemo.org/rooms" style="display: inline-block; background: #10b981; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; margin: 0 10px 10px 0;">
            Explore More Rooms
          </a>
          <a href="https://kamunity.org" style="display: inline-block; background: #0ea5e9; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; margin: 0 10px 10px 0;">
            Join Kamunity
          </a>
        </div>

        <!-- Footer -->
        <div style="text-align: center; border-top: 1px solid #e2e8f0; padding-top: 20px; margin-top: 30px;">
          <p style="color: #94a3b8; font-size: 14px; margin: 0;">
            Ready to turn this into reality? Reply to start the conversation.<br>
            <strong>Building community, one room at a time.</strong>
          </p>
        </div>
      </div>
    </div>
  `;
}

export function generateRoomSpecAdminEmail(roomData: any, userEmail: string, isFromGenerator: boolean = false): string {
  const roomType = isFromGenerator ? 'Focus Room Generator' : 'Saved Room';
  
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="background: white; border-radius: 8px; padding: 25px; border-left: 4px solid #10b981;">
        
        <h2 style="color: #10b981; margin: 0 0 20px 0;">New ${roomType} Specification Request</h2>
        <p style="color: #64748b; margin: 0 0 25px 0;"><strong>Requested:</strong> ${new Date().toLocaleString()}</p>
        
        <!-- User Info -->
        <div style="background: #f8fafc; padding: 15px; border-radius: 6px; margin-bottom: 20px;">
          <h3 style="color: #334155; margin: 0 0 10px 0; font-size: 16px;">User Information</h3>
          <p style="color: #475569; margin: 0;"><strong>Email:</strong> ${userEmail}</p>
          <p style="color: #475569; margin: 5px 0 0 0;"><strong>Source:</strong> ${roomType}</p>
        </div>

        <!-- Room Details -->
        <div style="background: #f0fdf4; padding: 15px; border-radius: 6px; margin-bottom: 20px;">
          <h3 style="color: #334155; margin: 0 0 10px 0; font-size: 16px;">Room Specification</h3>
          <p style="color: #047857; margin: 0 0 10px 0;"><strong>Title:</strong> ${roomData.title || roomData.name}</p>
          <p style="color: #047857; margin: 0;"><strong>Description:</strong> ${roomData.description || roomData.purpose}</p>
          ${roomData.category ? `<p style="color: #047857; margin: 5px 0 0 0;"><strong>Category:</strong> ${roomData.category}</p>` : ''}
          ${roomData.engagement ? `<p style="color: #047857; margin: 5px 0 0 0;"><strong>Engagement:</strong> ${roomData.engagement}%</p>` : ''}
        </div>

        <!-- Full Specification -->
        ${roomData.roomData ? `
        <div style="background: #fefce8; padding: 15px; border-radius: 6px;">
          <h3 style="color: #334155; margin: 0 0 10px 0; font-size: 16px;">📋 Complete Specification</h3>
          <div style="color: #a16207; font-size: 13px; line-height: 1.4; max-height: 400px; overflow-y: auto;">
            ${formatDetailedSpec(roomData.roomData)}
          </div>
        </div>
        ` : ''}

        <!-- Action Required -->
        <div style="background: #fef3c7; padding: 15px; border-radius: 6px; margin-top: 20px;">
          <p style="color: #92400e; margin: 0; font-weight: bold;">
            📋 Action Required: Review specification and follow up with user if interested in implementation.
          </p>
        </div>
      </div>
    </div>
  `;
}
