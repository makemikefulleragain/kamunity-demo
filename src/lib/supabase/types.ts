// Database types for Kamunity platform
// Generated from Supabase schema - following best practices

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          username: string
          name: string
          emoji_avatar: string
          email_subscribed: boolean
          created_at: string
          updated_at: string
          last_seen: string
        }
        Insert: {
          id?: string
          email: string
          username: string
          name: string
          emoji_avatar?: string
          email_subscribed?: boolean
          created_at?: string
          updated_at?: string
          last_seen?: string
        }
        Update: {
          id?: string
          email?: string
          username?: string
          name?: string
          emoji_avatar?: string
          email_subscribed?: boolean
          created_at?: string
          updated_at?: string
          last_seen?: string
        }
      }
      articles: {
        Row: {
          id: string
          title: string
          content: string
          summary: string
          extended_summary: string | null
          category: string
          author: string | null
          source_url: string | null
          image_url: string | null
          published_at: string
          created_at: string
          emoji_fun: number
          emoji_factual: number
          emoji_spicy: number
          emoji_nice: number
          emoji_weird: number
          emoji_intriguing: number
          engagement_score: number
        }
        Insert: {
          id?: string
          title: string
          content: string
          summary: string
          extended_summary?: string | null
          category: string
          author?: string | null
          source_url?: string | null
          image_url?: string | null
          published_at?: string
          created_at?: string
          emoji_fun?: number
          emoji_factual?: number
          emoji_spicy?: number
          emoji_nice?: number
          emoji_weird?: number
          emoji_intriguing?: number
          engagement_score?: number
        }
        Update: {
          id?: string
          title?: string
          content?: string
          summary?: string
          extended_summary?: string | null
          category?: string
          author?: string | null
          source_url?: string | null
          image_url?: string | null
          published_at?: string
          created_at?: string
          emoji_fun?: number
          emoji_factual?: number
          emoji_spicy?: number
          emoji_nice?: number
          emoji_weird?: number
          emoji_intriguing?: number
          engagement_score?: number
        }
      }
      reactions: {
        Row: {
          id: string
          user_id: string
          article_id: string
          emoji_type: 'fun' | 'factual' | 'spicy' | 'nice' | 'weird' | 'intriguing'
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          article_id: string
          emoji_type: 'fun' | 'factual' | 'spicy' | 'nice' | 'weird' | 'intriguing'
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          article_id?: string
          emoji_type?: 'fun' | 'factual' | 'spicy' | 'nice' | 'weird' | 'intriguing'
          created_at?: string
        }
      }
      rooms: {
        Row: {
          id: string
          name: string
          description: string | null
          emoji_theme: string
          room_type: 'chat' | 'focus'
          max_participants: number
          current_participants: number
          is_active: boolean
          created_by: string | null
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          emoji_theme: string
          room_type?: 'chat' | 'focus'
          max_participants?: number
          current_participants?: number
          is_active?: boolean
          created_by?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          emoji_theme?: string
          room_type?: 'chat' | 'focus'
          max_participants?: number
          current_participants?: number
          is_active?: boolean
          created_by?: string | null
          created_at?: string
        }
      }
      messages: {
        Row: {
          id: string
          user_id: string
          room_id: string
          content: string
          message_type: 'text' | 'system' | 'emoji'
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          room_id: string
          content: string
          message_type?: 'text' | 'system' | 'emoji'
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          room_id?: string
          content?: string
          message_type?: 'text' | 'system' | 'emoji'
          created_at?: string
        }
      }
      room_participants: {
        Row: {
          id: string
          user_id: string
          room_id: string
          joined_at: string
          last_active: string
        }
        Insert: {
          id?: string
          user_id: string
          room_id: string
          joined_at?: string
          last_active?: string
        }
        Update: {
          id?: string
          user_id?: string
          room_id?: string
          joined_at?: string
          last_active?: string
        }
      }
      user_sessions: {
        Row: {
          id: string
          user_id: string
          session_token: string
          expires_at: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          session_token: string
          expires_at: string
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          session_token?: string
          expires_at?: string
          created_at?: string
        }
      }
      analytics_events: {
        Row: {
          id: string
          user_id: string | null
          event_type: string
          event_data: any | null
          page_url: string | null
          user_agent: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id?: string | null
          event_type: string
          event_data?: any | null
          page_url?: string | null
          user_agent?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string | null
          event_type?: string
          event_data?: any | null
          page_url?: string | null
          user_agent?: string | null
          created_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      calculate_engagement_score: {
        Args: {
          article_id: string
        }
        Returns: number
      }
      update_engagement_scores: {
        Args: Record<PropertyKey, never>
        Returns: void
      }
    }
    Enums: {
      [_ in never]: never
    }
  }
}

// Convenience types
export type User = Database['public']['Tables']['users']['Row']
export type Article = Database['public']['Tables']['articles']['Row']
export type Reaction = Database['public']['Tables']['reactions']['Row']
export type Room = Database['public']['Tables']['rooms']['Row']
export type Message = Database['public']['Tables']['messages']['Row']
export type RoomParticipant = Database['public']['Tables']['room_participants']['Row']
export type UserSession = Database['public']['Tables']['user_sessions']['Row']
export type AnalyticsEvent = Database['public']['Tables']['analytics_events']['Row']

// Emoji types for consistency
export type EmojiType = 'fun' | 'factual' | 'spicy' | 'nice' | 'weird' | 'intriguing'

export const EMOJI_TYPES: Record<EmojiType, string> = {
  fun: '😀',
  factual: '🎯',
  spicy: '🌶️',
  nice: '❤️',
  weird: '🤨',
  intriguing: '🔍'
} as const

// Room request form data (not stored in DB, sent via email)
export interface RoomRequestData {
  name: string
  description: string
  emoji_theme: string
  purpose: string
  duration: string
  participant_count: string
  special_requirements?: string
  user_email: string
  user_name: string
}
