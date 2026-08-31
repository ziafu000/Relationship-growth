-- Create relationships table
CREATE TABLE IF NOT EXISTS public.relationships (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  relationship_type TEXT NOT NULL CHECK (relationship_type IN ('new', 'long_term')),
  mode TEXT DEFAULT 'solo' CHECK (mode IN ('solo', 'couple')),
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'paused', 'ended')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.relationships ENABLE ROW LEVEL SECURITY;

-- Create relationship_members table
CREATE TABLE IF NOT EXISTS public.relationship_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  relationship_id UUID REFERENCES public.relationships(id) ON DELETE CASCADE,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (role IN ('owner', 'partner')),
  consent_shared_data BOOLEAN DEFAULT FALSE,
  consent_given_at TIMESTAMPTZ,
  invited_at TIMESTAMPTZ,
  joined_at TIMESTAMPTZ,
  UNIQUE(relationship_id, user_id)
);

-- Enable RLS
ALTER TABLE public.relationship_members ENABLE ROW LEVEL SECURITY;

-- RLS Policies for relationships
CREATE POLICY "Users can view own relationships"
  ON public.relationships FOR SELECT
  USING (
    id IN (
      SELECT relationship_id
      FROM public.relationship_members
      WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Users can create relationships"
  ON public.relationships FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Relationship owners can update"
  ON public.relationships FOR UPDATE
  USING (
    id IN (
      SELECT relationship_id
      FROM public.relationship_members
      WHERE user_id = auth.uid() AND role = 'owner'
    )
  );

-- RLS Policies for relationship_members
CREATE POLICY "Users can view own memberships"
  ON public.relationship_members FOR SELECT
  USING (user_id = auth.uid() OR relationship_id IN (
    SELECT relationship_id FROM public.relationship_members WHERE user_id = auth.uid()
  ));

CREATE POLICY "Users can create memberships"
  ON public.relationship_members FOR INSERT
  TO authenticated
  WITH CHECK (
    user_id = auth.uid()
    AND (
      -- the user is creating a new solo relationship
      (role = 'owner')
      OR
      -- the user has been invited via a valid invitation
      EXISTS (
        SELECT 1 FROM public.couple_invitations
        WHERE relationship_id = public.relationship_members.relationship_id
        AND status = 'pending'
        AND invitee_email = (SELECT email FROM auth.users WHERE id = auth.uid())
      )
    )
  );

CREATE POLICY "Users can update own membership"
  ON public.relationship_members FOR UPDATE
  USING (user_id = auth.uid());

-- Auto-update updated_at for relationships
CREATE TRIGGER update_relationships_updated_at
  BEFORE UPDATE ON public.relationships
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Indexes
CREATE INDEX idx_relationships_type ON public.relationships(relationship_type);
CREATE INDEX idx_relationships_mode ON public.relationships(mode);
CREATE INDEX idx_relationships_status ON public.relationships(status);
CREATE INDEX idx_relationship_members_user ON public.relationship_members(user_id);
CREATE INDEX idx_relationship_members_relationship ON public.relationship_members(relationship_id);
