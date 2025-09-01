export function generateSaveNotificationUserEmail(roomData: any): string {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f8fafc;">
      <div style="background: white; border-radius: 12px; padding: 30px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
        
        <!-- Header -->
        <div style="text-align: center; margin-bottom: 30px; border-bottom: 2px solid #8b5cf6; padding-bottom: 20px;">
          <h1 style="color: #8b5cf6; margin: 0; font-size: 28px;">Room Saved Successfully! 💾</h1>
          <p style="color: #64748b; font-size: 16px; margin: 10px 0 0 0;">Your generated room has been saved to your collection</p>
        </div>

        <!-- Room Summary -->
        <div style="background: #faf5ff; padding: 20px; border-radius: 8px; margin-bottom: 25px; border-left: 4px solid #8b5cf6;">
          <h2 style="color: #6b21a8; margin: 0 0 15px 0; font-size: 20px;">${roomData.title || roomData.name}</h2>
          <p style="color: #7c3aed; margin: 0 0 15px 0; line-height: 1.6;">
            ${roomData.description || roomData.purpose || 'Your custom community room'}
          </p>
          
          <div style="color: #6b21a8; font-size: 14px;">
            ${roomData.category ? `<p style="margin: 5px 0;"><strong>Category:</strong> ${roomData.category}</p>` : ''}
            ${roomData.engagement ? `<p style="margin: 5px 0;"><strong>Engagement:</strong> ${roomData.engagement}%</p>` : ''}
            ${roomData.tags ? `<p style="margin: 5px 0;"><strong>Focus Areas:</strong> ${roomData.tags.join(', ')}</p>` : ''}
          </div>
        </div>

        <!-- Access Information -->
        <div style="background: #ecfdf5; padding: 20px; border-radius: 8px; border-left: 4px solid #10b981; margin-bottom: 25px;">
          <h3 style="color: #065f46; margin: 0 0 10px 0; font-size: 18px;">Access Your Saved Room</h3>
          <p style="color: #047857; margin: 0 0 15px 0; line-height: 1.5;">
            Your room has been saved to your personal collection. You can access it anytime from your saved rooms page.
          </p>
          <a href="https://kamunitydemo.org/rooms" style="display: inline-block; background: #10b981; color: white; padding: 10px 20px; text-decoration: none; border-radius: 6px; font-weight: bold;">
            View Saved Rooms
          </a>
        </div>

        <!-- What's Next -->
        <div style="background: #fef3c7; padding: 20px; border-radius: 8px; margin-bottom: 25px;">
          <h3 style="color: #92400e; margin: 0 0 10px 0; font-size: 18px;">Ready to Make It Real?</h3>
          <p style="color: #d97706; margin: 0 0 15px 0; line-height: 1.5;">
            This room specification can be turned into a real community space. Interested in bringing your vision to life?
          </p>
          <a href="https://kamunity.org/contact" style="display: inline-block; background: #d97706; color: white; padding: 10px 20px; text-decoration: none; border-radius: 6px; font-weight: bold;">
            Start Conversation
          </a>
        </div>

        <!-- Footer -->
        <div style="text-align: center; border-top: 1px solid #e2e8f0; padding-top: 20px; margin-top: 30px;">
          <p style="color: #94a3b8; font-size: 14px; margin: 0;">
            Questions about your room? Reply to this email anytime.<br>
            <strong>Building community, one room at a time.</strong>
          </p>
        </div>
      </div>
    </div>
  `;
}

export function generateSaveNotificationAdminEmail(roomData: any, userEmail: string): string {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="background: white; border-radius: 8px; padding: 25px; border-left: 4px solid #8b5cf6;">
        
        <h2 style="color: #8b5cf6; margin: 0 0 20px 0;">New Room Saved in Demo</h2>
        <p style="color: #64748b; margin: 0 0 25px 0;"><strong>Saved:</strong> ${new Date().toLocaleString()}</p>
        
        <!-- User Info -->
        <div style="background: #f8fafc; padding: 15px; border-radius: 6px; margin-bottom: 20px;">
          <h3 style="color: #334155; margin: 0 0 10px 0; font-size: 16px;">User Information</h3>
          <p style="color: #475569; margin: 0;"><strong>Email:</strong> ${userEmail}</p>
          <p style="color: #475569; margin: 5px 0 0 0;"><strong>Action:</strong> Saved Generated Room</p>
        </div>

        <!-- Room Details -->
        <div style="background: #faf5ff; padding: 15px; border-radius: 6px; margin-bottom: 20px;">
          <h3 style="color: #334155; margin: 0 0 10px 0; font-size: 16px;">Saved Room Details</h3>
          <p style="color: #7c3aed; margin: 0 0 10px 0;"><strong>Title:</strong> ${roomData.title || roomData.name}</p>
          <p style="color: #7c3aed; margin: 0;"><strong>Description:</strong> ${roomData.description || roomData.purpose}</p>
          ${roomData.category ? `<p style="color: #7c3aed; margin: 5px 0 0 0;"><strong>Category:</strong> ${roomData.category}</p>` : ''}
          ${roomData.engagement ? `<p style="color: #7c3aed; margin: 5px 0 0 0;"><strong>Engagement:</strong> ${roomData.engagement}%</p>` : ''}
        </div>

        <!-- Full Room Data -->
        ${roomData.roomData ? `
        <div style="background: #f1f5f9; padding: 15px; border-radius: 6px; margin-bottom: 20px;">
          <h3 style="color: #334155; margin: 0 0 10px 0; font-size: 16px;">Complete Room Data</h3>
          <div style="color: #475569; font-size: 12px; line-height: 1.4; white-space: pre-wrap; max-height: 200px; overflow-y: auto; background: #f8fafc; padding: 10px; border-radius: 4px;">
            ${JSON.stringify(roomData.roomData, null, 2)}
          </div>
        </div>
        ` : ''}

        <!-- Lead Opportunity -->
        <div style="background: #fef3c7; padding: 15px; border-radius: 6px; margin-top: 20px;">
          <p style="color: #92400e; margin: 0; font-weight: bold;">
            🎯 Lead Opportunity: User engaged enough to save a room specification. Consider follow-up for implementation.
          </p>
        </div>
      </div>
    </div>
  `;
}
