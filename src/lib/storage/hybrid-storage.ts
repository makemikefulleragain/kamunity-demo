"use client";

import { AdminDatabase } from '@/lib/admin/database';

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

      // Also save to Supabase for admin access
      try {
        const supabaseData = {
          ...roomData,
          tags: roomData.tags || [],
          specification: roomData.roomData
        };
        await AdminDatabase.saveRoom(supabaseData);
        console.log('✅ Room synced to Supabase:', roomData.id);
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

      // Also remove from Supabase
      try {
        await AdminDatabase.deleteRoom(roomId);
        console.log('✅ Room deleted from Supabase:', roomId);
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
        const supabaseData = {
          ...room,
          tags: room.tags || [],
          specification: room.roomData
        };
        await AdminDatabase.saveRoom(supabaseData);
        console.log('✅ Synced room to Supabase:', room.id);
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
      const trackingData = {
        sessionId: data.sessionId,
        userEmail: data.userEmail,
        actions: [{
          action: data.action,
          page: data.page,
          timestamp: data.timestamp,
          metadata: data.metadata
        }],
        metadata: data.metadata
      };
      await AdminDatabase.saveUserTracking(trackingData);
      console.log('✅ User tracking saved:', data.action);
    } catch (error) {
      console.warn('⚠️ Failed to save user tracking:', error);
    }
  }

  // Save survey response
  static async saveSurvey(surveyData: Record<string, any>, analyticsData: Record<string, any>): Promise<void> {
    try {
      const data = {
        userEmail: surveyData.email,
        responses: surveyData,
        analytics: analyticsData,
        sessionId: `session-${Date.now()}`,
        submittedAt: new Date().toISOString()
      };
      
      await AdminDatabase.saveSurvey(data);
      console.log('✅ Survey saved to database');
    } catch (error) {
      console.warn('⚠️ Failed to save survey:', error);
    }
  }
}
