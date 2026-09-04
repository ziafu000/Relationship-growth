// Database type definitions
export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          name: string | null
          avatar_url: string | null
          language: string
          city: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          email: string
          name?: string | null
          avatar_url?: string | null
          language?: string
          city?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          name?: string | null
          avatar_url?: string | null
          language?: string
          city?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      relationships: {
        Row: {
          id: string
          relationship_type: 'new' | 'long_term'
          mode: 'solo' | 'couple'
          status: 'active' | 'paused' | 'ended'
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          relationship_type: 'new' | 'long_term'
          mode?: 'solo' | 'couple'
          status?: 'active' | 'paused' | 'ended'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          relationship_type?: 'new' | 'long_term'
          mode?: 'solo' | 'couple'
          status?: 'active' | 'paused' | 'ended'
          created_at?: string
          updated_at?: string
        }
      }
      relationship_members: {
        Row: {
          id: string
          relationship_id: string
          user_id: string
          role: 'owner' | 'partner'
          consent_shared_data: boolean
          consent_given_at: string | null
          invited_at: string | null
          joined_at: string | null
        }
        Insert: {
          id?: string
          relationship_id: string
          user_id: string
          role: 'owner' | 'partner'
          consent_shared_data?: boolean
          consent_given_at?: string | null
          invited_at?: string | null
          joined_at?: string | null
        }
        Update: {
          id?: string
          relationship_id?: string
          user_id?: string
          role?: 'owner' | 'partner'
          consent_shared_data?: boolean
          consent_given_at?: string | null
          invited_at?: string | null
          joined_at?: string | null
        }
      }
      relationship_passports: {
        Row: {
          id: string
          relationship_id: string
          partner1_love_languages: string[] | null
          partner1_interests: string[] | null
          partner1_boundaries: any | null
          partner1_important_dates: any | null
          partner2_love_languages: string[] | null
          partner2_interests: string[] | null
          partner2_boundaries: any | null
          partner2_important_dates: any | null
          couple_shared_interests: string[] | null
          couple_relationship_values: string[] | null
          couple_communication_style: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          relationship_id: string
          partner1_love_languages?: string[] | null
          partner1_interests?: string[] | null
          partner1_boundaries?: any | null
          partner1_important_dates?: any | null
          partner2_love_languages?: string[] | null
          partner2_interests?: string[] | null
          partner2_boundaries?: any | null
          partner2_important_dates?: any | null
          couple_shared_interests?: string[] | null
          couple_relationship_values?: string[] | null
          couple_communication_style?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          relationship_id?: string
          partner1_love_languages?: string[] | null
          partner1_interests?: string[] | null
          partner1_boundaries?: any | null
          partner1_important_dates?: any | null
          partner2_love_languages?: string[] | null
          partner2_interests?: string[] | null
          partner2_boundaries?: any | null
          partner2_important_dates?: any | null
          couple_shared_interests?: string[] | null
          couple_relationship_values?: string[] | null
          couple_communication_style?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      activities: {
        Row: {
          id: string
          slug: string
          title_vi: string
          title_en: string | null
          description_vi: string | null
          description_en: string | null
          category: string
          pillar: string[]
          relationship_type: string[]
          effort_level: 'low' | 'medium' | 'high'
          time_required_minutes: number | null
          location_type: string | null
          city: string[] | null
          cost_range: string | null
          steps: any
          conversation_prompts: any | null
          tips: any | null
          tags: any | null
          prerequisites: any | null
          safety_notes: string | null
          is_active: boolean
          created_by: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          slug: string
          title_vi: string
          title_en?: string | null
          description_vi?: string | null
          description_en?: string | null
          category: string
          pillar: string[]
          relationship_type: string[]
          effort_level: 'low' | 'medium' | 'high'
          time_required_minutes?: number | null
          location_type?: string | null
          city?: string[] | null
          cost_range?: string | null
          steps: any
          conversation_prompts?: any | null
          tips?: any | null
          tags?: any | null
          prerequisites?: any | null
          safety_notes?: string | null
          is_active?: boolean
          created_by?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          slug?: string
          title_vi?: string
          title_en?: string | null
          description_vi?: string | null
          description_en?: string | null
          category?: string
          pillar?: string[]
          relationship_type?: string[]
          effort_level?: 'low' | 'medium' | 'high'
          time_required_minutes?: number | null
          location_type?: string | null
          city?: string[] | null
          cost_range?: string | null
          steps?: any
          conversation_prompts?: any | null
          tips?: any | null
          tags?: any | null
          prerequisites?: any | null
          safety_notes?: string | null
          is_active?: boolean
          created_by?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      check_ins: {
        Row: {
          id: string
          relationship_id: string
          user_id: string
          current_mood: string
          connection_level: number
          time_together_recently: string
          recent_challenges: string[] | null
          what_matters_now: string
          available_time: string
          budget_preference: string
          location_preference: string
          completed_at: string
        }
        Insert: {
          id?: string
          relationship_id: string
          user_id: string
          current_mood: string
          connection_level: number
          time_together_recently: string
          recent_challenges?: string[] | null
          what_matters_now: string
          available_time: string
          budget_preference: string
          location_preference: string
          completed_at?: string
        }
        Update: {
          id?: string
          relationship_id?: string
          user_id?: string
          current_mood?: string
          connection_level?: number
          time_together_recently?: string
          recent_challenges?: string[] | null
          what_matters_now?: string
          available_time?: string
          budget_preference?: string
          location_preference?: string
          completed_at?: string
        }
      }
      goals: {
        Row: {
          id: string
          relationship_id: string
          check_in_id: string | null
          goal_type: string
          goal_description_vi: string | null
          goal_description_en: string | null
          selected_at: string
        }
        Insert: {
          id?: string
          relationship_id: string
          check_in_id?: string | null
          goal_type: string
          goal_description_vi?: string | null
          goal_description_en?: string | null
          selected_at?: string
        }
        Update: {
          id?: string
          relationship_id?: string
          check_in_id?: string | null
          goal_type?: string
          goal_description_vi?: string | null
          goal_description_en?: string | null
          selected_at?: string
        }
      }
      plans: {
        Row: {
          id: string
          relationship_id: string
          goal_id: string
          user_id: string
          plan_title_vi: string
          plan_title_en: string | null
          reasoning_vi: string
          reasoning_en: string | null
          activity_id: string | null
          estimated_time_minutes: number | null
          effort_level: string | null
          steps: any
          conversation_starters: any | null
          tips: any | null
          scoring_metadata: any | null
          rank: number
          viewed_at: string | null
          selected_at: string | null
          rejected_at: string | null
          rejection_reason: string | null
          created_at: string
        }
        Insert: {
          id?: string
          relationship_id: string
          goal_id: string
          user_id: string
          plan_title_vi: string
          plan_title_en?: string | null
          reasoning_vi: string
          reasoning_en?: string | null
          activity_id?: string | null
          estimated_time_minutes?: number | null
          effort_level?: string | null
          steps: any
          conversation_starters?: any | null
          tips?: any | null
          scoring_metadata?: any | null
          rank: number
          viewed_at?: string | null
          selected_at?: string | null
          rejected_at?: string | null
          rejection_reason?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          relationship_id?: string
          goal_id?: string
          user_id?: string
          plan_title_vi?: string
          plan_title_en?: string | null
          reasoning_vi?: string
          reasoning_en?: string | null
          activity_id?: string | null
          estimated_time_minutes?: number | null
          effort_level?: string | null
          steps?: any
          conversation_starters?: any | null
          tips?: any | null
          scoring_metadata?: any | null
          rank?: number
          viewed_at?: string | null
          selected_at?: string | null
          rejected_at?: string | null
          rejection_reason?: string | null
          created_at?: string
        }
      }
      plan_executions: {
        Row: {
          id: string
          plan_id: string
          relationship_id: string
          user_id: string
          status: 'planned' | 'started' | 'completed' | 'abandoned'
          started_at: string | null
          completed_at: string | null
          abandoned_at: string | null
          steps_completed: any | null
          notes: string | null
          activity_photo_path: string | null
          created_at: string
        }
        Insert: {
          id?: string
          plan_id: string
          relationship_id: string
          user_id: string
          status?: 'planned' | 'started' | 'completed' | 'abandoned'
          started_at?: string | null
          completed_at?: string | null
          abandoned_at?: string | null
          steps_completed?: any | null
          notes?: string | null
          activity_photo_path?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          plan_id?: string
          relationship_id?: string
          user_id?: string
          status?: 'planned' | 'started' | 'completed' | 'abandoned'
          started_at?: string | null
          completed_at?: string | null
          abandoned_at?: string | null
          steps_completed?: any | null
          notes?: string | null
          activity_photo_path?: string | null
          created_at?: string
        }
      }
      feedback: {
        Row: {
          id: string
          plan_execution_id: string
          relationship_id: string
          user_id: string
          outcome: 'great' | 'good' | 'okay' | 'difficult' | 'didnt_work'
          what_worked: string[] | null
          what_didnt_work: string[] | null
          partner_reaction: string | null
          would_repeat: boolean
          notes: string | null
          learned_preferences: any | null
          submitted_at: string
        }
        Insert: {
          id?: string
          plan_execution_id: string
          relationship_id: string
          user_id: string
          outcome: 'great' | 'good' | 'okay' | 'difficult' | 'didnt_work'
          what_worked?: string[] | null
          what_didnt_work?: string[] | null
          partner_reaction?: string | null
          would_repeat: boolean
          notes?: string | null
          learned_preferences?: any | null
          submitted_at?: string
        }
        Update: {
          id?: string
          plan_execution_id?: string
          relationship_id?: string
          user_id?: string
          outcome?: 'great' | 'good' | 'okay' | 'difficult' | 'didnt_work'
          what_worked?: string[] | null
          what_didnt_work?: string[] | null
          partner_reaction?: string | null
          would_repeat?: boolean
          notes?: string | null
          learned_preferences?: any | null
          submitted_at?: string
        }
      }
    }
    Views: {}
    Functions: {
      create_solo_relationship: {
        Args: {
          p_user_id: string
          p_relationship_type: string
          p_city: string
          p_love_languages: string[]
          p_interests: string[]
          p_user_email: string
          p_user_name: string
        }
        Returns: undefined
      }
      set_plan_execution_step_completion: {
        Args: {
          p_execution_id: string
          p_step_order: number
          p_completed: boolean
        }
        Returns: any
      }
    }
    Enums: {}
  }
}

/**
 * Supabase JS expects generated table definitions to include Relationships.
 * This project maintains its schema types by hand, so add the generated field
 * at the client boundary without weakening row, insert, update, or RPC types.
 */
type TableRelationships<TableName> = TableName extends 'goals'
  ? [
      {
        foreignKeyName: 'goals_check_in_id_fkey'
        columns: ['check_in_id']
        isOneToOne: false
        referencedRelation: 'check_ins'
        referencedColumns: ['id']
      },
      {
        foreignKeyName: 'goals_relationship_id_fkey'
        columns: ['relationship_id']
        isOneToOne: false
        referencedRelation: 'relationships'
        referencedColumns: ['id']
      },
    ]
  : []

export type SupabaseDatabase = {
  public: {
    Tables: {
      [TableName in keyof Database['public']['Tables']]:
        Database['public']['Tables'][TableName] & {
          Relationships: TableRelationships<TableName>
        }
    }
    Views: Database['public']['Views']
    Functions: Database['public']['Functions']
    Enums: Database['public']['Enums']
  }
}
