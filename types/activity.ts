// Six Pillars of Relationship Growth
export type Pillar =
  | 'understanding'   // Thấu hiểu
  | 'communication'   // Giao tiếp
  | 'appreciation'    // Trân trọng
  | 'connection'      // Kết nối
  | 'novelty'         // Mới mẻ
  | 'repair';         // Hàn gắn

export type EffortLevel = 'low' | 'medium' | 'high';
export type LocationType = 'indoor' | 'outdoor' | 'home' | 'virtual';
export type CostRange = 'free' | 'budget' | 'moderate' | 'premium';
export type City = 'hanoi' | 'hcmc';

export interface Activity {
  id: string;
  slug: string;
  title_vi: string;
  title_en?: string;
  description_vi?: string;
  description_en?: string;
  category: string;
  pillar: Pillar[];
  relationship_type: ('new' | 'long_term')[];
  effort_level: EffortLevel;
  time_required_minutes?: number;
  location_type?: LocationType;
  city?: City[];
  cost_range?: CostRange;
  steps: ActivityStep[];
  conversation_prompts?: ConversationPrompt[];
  tips?: ActivityTips;
  tags?: string[];
  prerequisites?: Record<string, any>;
  safety_notes?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface ActivityStep {
  order: number;
  instruction_vi: string;
  instruction_en?: string;
}

export interface ConversationPrompt {
  prompt_vi: string;
  prompt_en?: string;
}

export interface ActivityTips {
  do: string[];
  dont: string[];
}
