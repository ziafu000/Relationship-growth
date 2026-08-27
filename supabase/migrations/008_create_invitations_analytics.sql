-- Create couple_invitations table
CREATE TABLE IF NOT EXISTS public.couple_invitations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  relationship_id UUID REFERENCES public.relationships(id) ON DELETE CASCADE,
  inviter_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  invite_token TEXT UNIQUE NOT NULL,
  invitee_email TEXT,

  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'declined', 'expired')),
  accepted_at TIMESTAMPTZ,
  declined_at TIMESTAMPTZ,
  expires_at TIMESTAMPTZ NOT NULL,

  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.couple_invitations ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view invitations they created"
  ON public.couple_invitations FOR SELECT
  USING (inviter_id = auth.uid());

CREATE POLICY "Users can view invitations by token"
  ON public.couple_invitations FOR SELECT
  USING (auth.uid() IS NOT NULL);

CREATE POLICY "Users can create invitations"
  ON public.couple_invitations FOR INSERT
  WITH CHECK (inviter_id = auth.uid());

CREATE POLICY "Users can update invitations"
  ON public.couple_invitations FOR UPDATE
  USING (inviter_id = auth.uid() OR auth.uid() IS NOT NULL);

-- Indexes
CREATE INDEX idx_couple_invitations_relationship ON public.couple_invitations(relationship_id);
CREATE INDEX idx_couple_invitations_inviter ON public.couple_invitations(inviter_id);
CREATE INDEX idx_couple_invitations_token ON public.couple_invitations(invite_token);
CREATE INDEX idx_couple_invitations_status ON public.couple_invitations(status);
CREATE INDEX idx_couple_invitations_expires_at ON public.couple_invitations(expires_at);

-- Create analytics_events table
CREATE TABLE IF NOT EXISTS public.analytics_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
  relationship_id UUID REFERENCES public.relationships(id) ON DELETE SET NULL,

  event_name TEXT NOT NULL,
  event_properties JSONB,

  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.analytics_events ENABLE ROW LEVEL SECURITY;

-- RLS Policies (system can write, users can't directly access)
CREATE POLICY "System can insert analytics events"
  ON public.analytics_events FOR INSERT
  WITH CHECK (auth.uid() IS NOT NULL);

-- Indexes
CREATE INDEX idx_analytics_events_name ON public.analytics_events(event_name);
CREATE INDEX idx_analytics_events_user ON public.analytics_events(user_id);
CREATE INDEX idx_analytics_events_relationship ON public.analytics_events(relationship_id);
CREATE INDEX idx_analytics_events_created ON public.analytics_events(created_at DESC);
