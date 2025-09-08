export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          user_id: string
          farcaster_id: string | null
          created_at: string
          active_rituals: string[]
          streak_count: number
          badges_earned: string[]
          total_points: number
          last_active_date: string | null
          premium_features: boolean
        }
        Insert: {
          user_id: string
          farcaster_id?: string | null
          created_at?: string
          active_rituals?: string[]
          streak_count?: number
          badges_earned?: string[]
          total_points?: number
          last_active_date?: string | null
          premium_features?: boolean
        }
        Update: {
          user_id?: string
          farcaster_id?: string | null
          created_at?: string
          active_rituals?: string[]
          streak_count?: number
          badges_earned?: string[]
          total_points?: number
          last_active_date?: string | null
          premium_features?: boolean
        }
      }
      rituals: {
        Row: {
          ritual_id: string
          user_id: string
          name: string
          description: string
          frequency: string
          start_time: string | null
          completed_today: boolean
          created_at: string
          is_active: boolean
          category: string
          difficulty: string
          estimated_duration: number
        }
        Insert: {
          ritual_id?: string
          user_id: string
          name: string
          description: string
          frequency: string
          start_time?: string | null
          completed_today?: boolean
          created_at?: string
          is_active?: boolean
          category: string
          difficulty: string
          estimated_duration: number
        }
        Update: {
          ritual_id?: string
          user_id?: string
          name?: string
          description?: string
          frequency?: string
          start_time?: string | null
          completed_today?: boolean
          created_at?: string
          is_active?: boolean
          category?: string
          difficulty?: string
          estimated_duration?: number
        }
      }
      sessions: {
        Row: {
          session_id: string
          user_id: string
          ritual_id: string
          timestamp: string
          mood_before: number | null
          mood_after: number | null
          notes: string | null
          points_earned: number
          completed: boolean
        }
        Insert: {
          session_id?: string
          user_id: string
          ritual_id: string
          timestamp?: string
          mood_before?: number | null
          mood_after?: number | null
          notes?: string | null
          points_earned: number
          completed: boolean
        }
        Update: {
          session_id?: string
          user_id?: string
          ritual_id?: string
          timestamp?: string
          mood_before?: number | null
          mood_after?: number | null
          notes?: string | null
          points_earned?: number
          completed?: boolean
        }
      }
      badges: {
        Row: {
          badge_id: string
          name: string
          description: string
          image_url: string | null
          category: string
          requirement: string
          points_required: number | null
          streak_required: number | null
        }
        Insert: {
          badge_id?: string
          name: string
          description: string
          image_url?: string | null
          category: string
          requirement: string
          points_required?: number | null
          streak_required?: number | null
        }
        Update: {
          badge_id?: string
          name?: string
          description?: string
          image_url?: string | null
          category?: string
          requirement?: string
          points_required?: number | null
          streak_required?: number | null
        }
      }
      user_badges: {
        Row: {
          user_id: string
          badge_id: string
          unlocked_at: string
        }
        Insert: {
          user_id: string
          badge_id: string
          unlocked_at?: string
        }
        Update: {
          user_id?: string
          badge_id?: string
          unlocked_at?: string
        }
      }
      notification_settings: {
        Row: {
          user_id: string
          daily_reminders: boolean
          reminder_time: string
          streak_reminders: boolean
          badge_notifications: boolean
          social_sharing: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          user_id: string
          daily_reminders?: boolean
          reminder_time?: string
          streak_reminders?: boolean
          badge_notifications?: boolean
          social_sharing?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          user_id?: string
          daily_reminders?: boolean
          reminder_time?: string
          streak_reminders?: boolean
          badge_notifications?: boolean
          social_sharing?: boolean
          created_at?: string
          updated_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}
