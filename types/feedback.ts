// Feedback Types
export type Outcome = 'great' | 'good' | 'okay' | 'difficult' | 'didnt_work';
export type PartnerReaction = 'loved_it' | 'enjoyed' | 'neutral' | 'uncomfortable';

export interface Feedback {
  id: string;
  plan_execution_id: string;
  relationship_id: string;
  user_id: string;
  outcome: Outcome;
  what_worked?: string[];
  what_didnt_work?: string[];
  partner_reaction?: PartnerReaction;
  would_repeat: boolean;
  notes?: string;
  learned_preferences?: Record<string, any>;
  submitted_at: string;
}
