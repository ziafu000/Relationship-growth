// Core Relationship Types
export type RelationshipType = 'new' | 'long_term';
export type RelationshipMode = 'solo' | 'couple';
export type RelationshipStatus = 'active' | 'paused' | 'ended';

export interface Relationship {
  id: string;
  relationship_type: RelationshipType;
  mode: RelationshipMode;
  status: RelationshipStatus;
  created_at: string;
  updated_at: string;
}

export interface RelationshipMember {
  id: string;
  relationship_id: string;
  user_id: string;
  role: 'owner' | 'partner';
  consent_shared_data: boolean;
  consent_given_at?: string;
  invited_at?: string;
  joined_at?: string;
}

export interface ImportantDate {
  type: 'birthday' | 'anniversary' | 'first_date' | 'custom';
  date: string;
  label?: string;
}

export interface RelationshipPassport {
  id: string;
  relationship_id: string;
  // Partner 1 preferences
  partner1_love_languages?: string[];
  partner1_interests?: string[];
  partner1_boundaries?: Record<string, any>;
  partner1_important_dates?: ImportantDate[];
  // Partner 2 preferences (for couple mode)
  partner2_love_languages?: string[];
  partner2_interests?: string[];
  partner2_boundaries?: Record<string, any>;
  partner2_important_dates?: ImportantDate[];
  // Couple preferences
  couple_shared_interests?: string[];
  couple_relationship_values?: string[];
  couple_communication_style?: string;
  created_at: string;
  updated_at: string;
}

// Import types from activity
import type { Pillar, City } from './activity';

// Re-export for convenience
export type { Pillar, City };

// Relationship State (computed from check-ins)
export interface RelationshipState {
  relationship_type: RelationshipType;
  connection_level: number;
  recent_mood: string;
  time_together: string;
  challenges: string[];
  priority_pillar: Pillar;
  context: {
    available_time: string;
    budget: string;
    location: string;
    city: City;
  };
}
