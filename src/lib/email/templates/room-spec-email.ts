export function generateRoomSpecUserEmail(roomData: any, isFromGenerator: boolean = false): string {
  const roomType = isFromGenerator ? 'Focus Room Generator' : 'Saved Room';
  const roomId = roomData.id || 'demo';
  
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f8fafc;">
      <div style="background: white; border-radius: 12px; padding: 30px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
        
        <!-- Header -->
        <div style="text-align: center; margin-bottom: 30px; border-bottom: 2px solid #10b981; padding-bottom: 20px;">
          <h1 style="color: #10b981; margin: 0; font-size: 28px;">Your ${roomType} 🎯</h1>
          <p style="color: #64748b; font-size: 16px; margin: 10px 0 0 0;">Room created and ready to explore</p>
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

        <!-- Room Access Link -->
        <div style="background: #dbeafe; padding: 20px; border-radius: 8px; margin-bottom: 25px; border-left: 4px solid #3b82f6; text-align: center;">
          <h3 style="color: #1e40af; margin: 0 0 15px 0; font-size: 18px;">🔗 View Complete Specification</h3>
          <p style="color: #1d4ed8; margin: 0 0 15px 0;">Access your room to view the full implementation details, wireframes, and specifications.</p>
          <a href="https://kamunitydemo.org/rooms/${roomId}" style="display: inline-block; background: #3b82f6; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold;">
            Open Room & View Specs
          </a>
        </div>

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
  const roomId = roomData.id || 'demo';
  
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="background: white; border-radius: 8px; padding: 25px; border-left: 4px solid #10b981;">
        
        <h2 style="color: #10b981; margin: 0 0 20px 0;">New ${roomType} Request</h2>
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

        <!-- Room Access Link -->
        <div style="background: #dbeafe; padding: 15px; border-radius: 6px; text-align: center; margin-bottom: 20px;">
          <h3 style="color: #1e40af; margin: 0 0 10px 0; font-size: 16px;">🔗 View Complete Specification</h3>
          <p style="color: #1d4ed8; margin: 0 0 10px 0; font-size: 14px;">Access the room to view full implementation details.</p>
          <a href="https://kamunitydemo.org/rooms/${roomId}" style="display: inline-block; background: #3b82f6; color: white; padding: 8px 16px; text-decoration: none; border-radius: 4px; font-weight: bold; font-size: 14px;">
            Open Room & View Specs
          </a>
        </div>

        <!-- Action Required -->
        <div style="background: #fef3c7; padding: 15px; border-radius: 6px;">
          <p style="color: #92400e; margin: 0; font-weight: bold;">
            📋 Action Required: Review specification and follow up with user if interested in implementation.
          </p>
        </div>
      </div>
    </div>
  `;
}
