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
      user_profiles: {
        Row: {
          id: string
          role: 'admin' | 'client'
          company_name: string | null
          avatar_url: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          role: 'admin' | 'client'
          company_name?: string | null
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          role?: 'admin' | 'client'
          company_name?: string | null
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      ga4_connections: {
        Row: {
          id: string
          user_id: string
          property_id: string
          property_name: string
          access_token: string
          refresh_token: string
          token_expires_at: string | null
          connected_at: string
          last_synced_at: string | null
          is_active: boolean
        }
        Insert: {
          id?: string
          user_id: string
          property_id: string
          property_name: string
          access_token: string
          refresh_token: string
          token_expires_at?: string | null
          connected_at?: string
          last_synced_at?: string | null
          is_active?: boolean
        }
        Update: {
          id?: string
          user_id?: string
          property_id?: string
          property_name?: string
          access_token?: string
          refresh_token?: string
          token_expires_at?: string | null
          connected_at?: string
          last_synced_at?: string | null
          is_active?: boolean
        }
      }
      report_templates: {
        Row: {
          id: string
          name: string
          description: string | null
          template_config: Json
          is_active: boolean
          created_by: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          template_config: Json
          is_active?: boolean
          created_by: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          template_config?: Json
          is_active?: boolean
          created_by?: string
          created_at?: string
          updated_at?: string
        }
      }
      generated_reports: {
        Row: {
          id: string
          user_id: string
          template_id: string
          property_id: string
          report_data: Json
          date_range_start: string
          date_range_end: string
          generated_at: string
          expires_at: string
        }
        Insert: {
          id?: string
          user_id: string
          template_id: string
          property_id: string
          report_data: Json
          date_range_start: string
          date_range_end: string
          generated_at?: string
          expires_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          template_id?: string
          property_id?: string
          report_data?: Json
          date_range_start?: string
          date_range_end?: string
          generated_at?: string
          expires_at?: string
        }
      }
    }
  }
}

