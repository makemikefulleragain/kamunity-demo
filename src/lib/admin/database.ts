import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export interface DemoRoomData {
  id: string;
  title: string;
  description?: string;
  category?: string;
  engagement?: number;
  tags: string[];
  createdBy: string;
  specification?: any;
  createdAt: Date;
  updatedAt: Date;
  isActive: boolean;
}

export interface DemoSurveyData {
  id: string;
  userEmail?: string;
  responses: any;
  analytics?: any;
  sessionId: string;
  createdAt: Date;
}

export interface DemoUserTrackingData {
  id: string;
  sessionId: string;
  userEmail?: string;
  actions: any[];
  metadata?: any;
  createdAt: Date;
  updatedAt: Date;
}

export class AdminDatabase {
  // Room Management
  static async saveRoom(roomData: Omit<DemoRoomData, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
    const { data, error } = await supabase
      .from('DemoRoom')
      .insert([roomData])
      .select('id')
      .single();

    if (error) throw error;
    return data.id;
  }

  static async getAllRooms(): Promise<DemoRoomData[]> {
    const { data, error } = await supabase
      .from('DemoRoom')
      .select('*')
      .eq('isActive', true)
      .order('createdAt', { ascending: false });

    if (error) throw error;
    return data || [];
  }

  static async deleteRoom(roomId: string): Promise<void> {
    const { error } = await supabase
      .from('DemoRoom')
      .update({ isActive: false })
      .eq('id', roomId);

    if (error) throw error;
  }

  // Survey Management
  static async saveSurvey(surveyData: Omit<DemoSurveyData, 'id' | 'createdAt'>): Promise<string> {
    const { data, error } = await supabase
      .from('DemoSurvey')
      .insert([surveyData])
      .select('id')
      .single();

    if (error) throw error;
    return data.id;
  }

  static async getAllSurveys(): Promise<DemoSurveyData[]> {
    const { data, error } = await supabase
      .from('DemoSurvey')
      .select('*')
      .order('createdAt', { ascending: false });

    if (error) throw error;
    return data || [];
  }

  // User Tracking Management
  static async saveUserTracking(trackingData: Omit<DemoUserTrackingData, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
    const { data, error } = await supabase
      .from('DemoUserTracking')
      .upsert([trackingData], { 
        onConflict: 'sessionId',
        ignoreDuplicates: false 
      })
      .select('id')
      .single();

    if (error) throw error;
    return data.id;
  }

  static async getAllUserTracking(): Promise<DemoUserTrackingData[]> {
    const { data, error } = await supabase
      .from('DemoUserTracking')
      .select('*')
      .order('createdAt', { ascending: false });

    if (error) throw error;
    return data || [];
  }

  // Export Methods
  static async exportAllData() {
    const [rooms, surveys, tracking] = await Promise.all([
      this.getAllRooms(),
      this.getAllSurveys(),
      this.getAllUserTracking()
    ]);

    return { rooms, surveys, tracking };
  }
}
