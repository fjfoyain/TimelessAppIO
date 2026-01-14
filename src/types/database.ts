// Database types for Supabase
// These types will be auto-generated once Supabase is set up
// For now, we define them manually based on the schema from the deployment guide

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          email: string
          full_name: string | null
          role: 'client' | 'talent' | 'admin' | 'venue' | 'provider'
          avatar_url: string | null
          bio: string | null
          phone: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          full_name?: string | null
          role: 'client' | 'talent' | 'admin' | 'venue' | 'provider'
          avatar_url?: string | null
          bio?: string | null
          phone?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          full_name?: string | null
          role?: 'client' | 'talent' | 'admin' | 'venue' | 'provider'
          avatar_url?: string | null
          bio?: string | null
          phone?: string | null
          updated_at?: string
        }
      }
      talents: {
        Row: {
          id: string
          user_id: string
          title: string
          category: string
          hourly_rate: number
          rating: number
          total_reviews: number
          skills: string[]
          portfolio_urls: string[]
          availability_status: string
          verified: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          title: string
          category: string
          hourly_rate: number
          rating?: number
          total_reviews?: number
          skills?: string[]
          portfolio_urls?: string[]
          availability_status?: string
          verified?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          user_id?: string
          title?: string
          category?: string
          hourly_rate?: number
          rating?: number
          total_reviews?: number
          skills?: string[]
          portfolio_urls?: string[]
          availability_status?: string
          verified?: boolean
          updated_at?: string
        }
      }
      events: {
        Row: {
          id: string
          talent_id: string
          client_id: string
          title: string
          description: string | null
          event_date: string
          duration_hours: number
          location: string | null
          status: 'pending' | 'confirmed' | 'completed' | 'cancelled'
          total_price: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          talent_id: string
          client_id: string
          title: string
          description?: string | null
          event_date: string
          duration_hours: number
          location?: string | null
          status?: 'pending' | 'confirmed' | 'completed' | 'cancelled'
          total_price: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          talent_id?: string
          client_id?: string
          title?: string
          description?: string | null
          event_date?: string
          duration_hours?: number
          location?: string | null
          status?: 'pending' | 'confirmed' | 'completed' | 'cancelled'
          total_price?: number
          updated_at?: string
        }
      }
      reviews: {
        Row: {
          id: string
          event_id: string
          reviewer_id: string
          talent_id: string
          rating: number
          comment: string | null
          created_at: string
        }
        Insert: {
          id?: string
          event_id: string
          reviewer_id: string
          talent_id: string
          rating: number
          comment?: string | null
          created_at?: string
        }
        Update: {
          event_id?: string
          reviewer_id?: string
          talent_id?: string
          rating?: number
          comment?: string | null
        }
      }
      messages: {
        Row: {
          id: string
          conversation_id: string
          sender_id: string
          recipient_id: string
          content: string
          read: boolean
          created_at: string
        }
        Insert: {
          id?: string
          conversation_id: string
          sender_id: string
          recipient_id: string
          content: string
          read?: boolean
          created_at?: string
        }
        Update: {
          conversation_id?: string
          sender_id?: string
          recipient_id?: string
          content?: string
          read?: boolean
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

// Helper types
export type Profile = Database['public']['Tables']['profiles']['Row']
export type ProfileInsert = Database['public']['Tables']['profiles']['Insert']
export type ProfileUpdate = Database['public']['Tables']['profiles']['Update']

export type Talent = Database['public']['Tables']['talents']['Row']
export type TalentInsert = Database['public']['Tables']['talents']['Insert']
export type TalentUpdate = Database['public']['Tables']['talents']['Update']

export type Event = Database['public']['Tables']['events']['Row']
export type EventInsert = Database['public']['Tables']['events']['Insert']
export type EventUpdate = Database['public']['Tables']['events']['Update']

export type Review = Database['public']['Tables']['reviews']['Row']
export type ReviewInsert = Database['public']['Tables']['reviews']['Insert']
export type ReviewUpdate = Database['public']['Tables']['reviews']['Update']

export type Message = Database['public']['Tables']['messages']['Row']
export type MessageInsert = Database['public']['Tables']['messages']['Insert']
export type MessageUpdate = Database['public']['Tables']['messages']['Update']
