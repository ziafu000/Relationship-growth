import type { Pillar, City, EffortLevel, Activity, ActivityStep, ConversationPrompt, ActivityTips } from './activity';
import type { RelationshipType } from './relationship';

// Check-in
export interface CheckIn {
  id: string;
  relationship_id: string;
  user_id: string;
  current_mood: string;
  connection_level: number;
  time_together_recently: string;
  recent_challenges?: string[];
  what_matters_now: string;
  available_time: string;
  budget_preference: string;
  location_preference: string;
  completed_at: string;
}

// Goal
export interface Goal {
  id: string;
  relationship_id: string;
  check_in_id?: string;
  goal_type: Pillar;
  goal_description_vi?: string;
  goal_description_en?: string;
  selected_at: string;
}

// Plan
export interface Plan {
  id: string;
  relationship_id: string;
  goal_id: string;
  user_id: string;
  plan_title_vi: string;
  plan_title_en?: string;
  reasoning_vi: string;
  reasoning_en?: string;
  activity_id?: string;
  estimated_time_minutes?: number;
  effort_level?: EffortLevel;
  steps: PlanStep[];
  conversation_starters?: ConversationPrompt[];
  tips?: ActivityTips;
  scoring_metadata?: Record<string, any>;
  rank: number;
  viewed_at?: string;
  selected_at?: string;
  rejected_at?: string;
  rejection_reason?: string;
  created_at: string;

  // Populated relations
  activity?: Activity;
}

export interface PlanStep {
  order: number;
  instruction_vi: string;
  instruction_en?: string;
  estimated_minutes?: number;
}

// Plan Execution
export interface PlanExecution {
  id: string;
  plan_id: string;
  relationship_id: string;
  user_id: string;
  status: 'planned' | 'started' | 'completed' | 'abandoned';
  started_at?: string;
  completed_at?: string;
  abandoned_at?: string;
  steps_completed?: StepCompletion[];
  notes?: string;
  created_at: string;
}

export interface StepCompletion {
  step_id: number;
  completed_at: string;
}
