// User Types
export interface User {
  id: string;
  email: string;
  name?: string;
  avatar_url?: string;
  language: 'vi' | 'en';
  city?: 'hanoi' | 'hcmc';
  created_at: string;
  updated_at: string;
}

// Couple Invitation
export interface CoupleInvitation {
  id: string;
  relationship_id: string;
  inviter_id: string;
  invite_token: string;
  invitee_email?: string;
  status: 'pending' | 'accepted' | 'declined' | 'expired';
  accepted_at?: string;
  declined_at?: string;
  expires_at: string;
  created_at: string;
}

// Consent Settings
export interface ConsentSettings {
  share_passport: boolean;
  share_check_ins: boolean;
  share_feedback: boolean;
  share_memory: boolean;
  allow_joint_activities: boolean;
}
