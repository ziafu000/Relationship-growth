// Memory Types
export type MemoryType = 'activity_history' | 'preference_learned' | 'avoid_pattern';

export interface RelationshipMemory {
  id: string;
  relationship_id: string;
  memory_type: MemoryType;
  content: Record<string, any>;
  activity_id?: string;
  last_used_at?: string;
  times_used?: number;
  average_rating?: number;
  confidence_score?: number;
  source_feedback_ids?: string[];
  created_at: string;
  updated_at: string;
}

export interface MemoryInsights {
  learned_preferences: string[];
  avoid_patterns: string[];
  successful_activities: string[];
  relationship_strengths: string[];
}
