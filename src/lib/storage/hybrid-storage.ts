"use client";

// Import removed to prevent client-side Supabase service role usage

export interface RoomData {
  id: string;
  title: string;
  description: string;
  category?: string;
  engagement?: number;
  memberCount?: number;
  tags?: string[];
  roomData?: Record<string, any>;
  userEmail?: string;
  createdAt: string;
  source: 'generator' | 'saved';
  createdBy: string;
  isActive: boolean;
}

export class HybridStorage {
  private static isClient = typeof window !== 'undefined';
  
  // Save room to both localStorage and Supabase
  static async saveRoom(roomData: RoomData): Promise<void> {
    try {
      // Always save to localStorage for immediate access
      if (this.isClient) {
        const existingRooms = this.getLocalRooms();
        const updatedRooms = [...existingRooms.filter(r => r.id !== roomData.id), roomData];
        localStorage.setItem('kamunity_demo_rooms', JSON.stringify(updatedRooms));
        console.log('✅ Room saved to localStorage:', roomData.id);
      }

      // Save to Supabase via API route to avoid client-side service role usage
      try {
        const response = await fetch('/api/rooms', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            ...roomData,
            tags: roomData.tags || [],
            specification: roomData.roomData
          })
        });
        
        if (response.ok) {
          console.log('✅ Room synced to Supabase:', roomData.id);
        } else {
          console.warn('⚠️ Failed to sync room to Supabase (localStorage still saved)');
        }
      } catch (error) {
        console.warn('⚠️ Failed to sync room to Supabase (localStorage still saved):', error);
      }
    } catch (error) {
      console.error('❌ Failed to save room:', error);
      throw error;
    }
  }

  // Get rooms from localStorage
  static getLocalRooms(): RoomData[] {
    if (!this.isClient) return [];
    
    try {
      const stored = localStorage.getItem('kamunity_demo_rooms');
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error('❌ Failed to load rooms from localStorage:', error);
      return [];
    }
  }

  // Get specific room from localStorage
  static getLocalRoom(roomId: string): RoomData | null {
    const rooms = this.getLocalRooms();
    return rooms.find(room => room.id === roomId) || null;
  }

  // Delete room from both localStorage and Supabase
  static async deleteRoom(roomId: string): Promise<void> {
    try {
      // Remove from localStorage
      if (this.isClient) {
        const existingRooms = this.getLocalRooms();
        const updatedRooms = existingRooms.filter(r => r.id !== roomId);
        localStorage.setItem('kamunity_demo_rooms', JSON.stringify(updatedRooms));
        console.log('✅ Room removed from localStorage:', roomId);
      }

      // Remove from Supabase via API route
      try {
        const response = await fetch(`/api/rooms/${roomId}`, {
          method: 'DELETE'
        });
        
        if (response.ok) {
          console.log('✅ Room deleted from Supabase:', roomId);
        } else {
          console.warn('⚠️ Failed to delete room from Supabase');
        }
      } catch (error) {
        console.warn('⚠️ Failed to delete room from Supabase:', error);
      }
    } catch (error) {
      console.error('❌ Failed to delete room:', error);
      throw error;
    }
  }

  // Sync all localStorage rooms to Supabase (for admin migration)
  static async syncAllToSupabase(): Promise<void> {
    if (!this.isClient) return;
    
    const localRooms = this.getLocalRooms();
    console.log(`🔄 Syncing ${localRooms.length} rooms to Supabase...`);
    
    for (const room of localRooms) {
      try {
        const response = await fetch('/api/rooms', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            ...room,
            tags: room.tags || [],
            specification: room.roomData
          })
        });
        
        if (response.ok) {
          console.log('✅ Synced room to Supabase:', room.id);
        } else {
          console.warn('⚠️ Failed to sync room:', room.id);
        }
      } catch (error) {
        console.warn('⚠️ Failed to sync room:', room.id, error);
      }
    }
    
    console.log('🔄 Sync complete');
  }

  // Save user tracking data
  static async saveUserTracking(data: {
    sessionId: string;
    userEmail?: string;
    action: string;
    page: string;
    timestamp: string;
    metadata?: Record<string, any>;
  }): Promise<void> {
    try {
      const response = await fetch('/api/admin/user-activities', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId: data.sessionId,
          userEmail: data.userEmail,
          actions: [{
            action: data.action,
            page: data.page,
            timestamp: data.timestamp,
            metadata: data.metadata
          }],
          metadata: data.metadata
        })
      });
      
      if (response.ok) {
        console.log('✅ User tracking saved:', data.action);
      } else {
        console.warn('⚠️ Failed to save user tracking');
      }
    } catch (error) {
      console.warn('⚠️ Failed to save user tracking:', error);
    }
  }

  // Save survey response
  static async saveSurvey(surveyData: Record<string, any>, analyticsData: Record<string, any>): Promise<void> {
    try {
      const response = await fetch('/api/demo/survey', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userEmail: surveyData.email,
          responses: surveyData,
          analytics: analyticsData,
          sessionId: `session-${Date.now()}`,
          submittedAt: new Date().toISOString()
        })
      });
      
      if (response.ok) {
        console.log('✅ Survey saved to database');
      } else {
        console.warn('⚠️ Failed to save survey');
      }
    } catch (error) {
      console.warn('⚠️ Failed to save survey:', error);
    }
  }
}
