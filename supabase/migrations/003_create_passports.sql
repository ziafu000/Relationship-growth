-- Create relationship_passports table
CREATE TABLE IF NOT EXISTS public.relationship_passports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  relationship_id UUID REFERENCES public.relationships(id) ON DELETE CASCADE UNIQUE,

  -- Partner 1 preferences
  partner1_love_languages JSONB,
  partner1_interests JSONB,
  partner1_boundaries JSONB,
  partner1_important_dates JSONB,

  -- Partner 2 preferences (for couple mode)
  partner2_love_languages JSONB,
  partner2_interests JSONB,
  partner2_boundaries JSONB,
  partner2_important_dates JSONB,

  -- Couple preferences
  couple_shared_interests JSONB,
  couple_relationship_values JSONB,
  couple_communication_style TEXT,

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.relationship_passports ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view own relationship passport"
  ON public.relationship_passports FOR SELECT
  USING (
    relationship_id IN (
      SELECT relationship_id
      FROM public.relationship_members
      WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert passport for own relationship"
  ON public.relationship_passports FOR INSERT
  WITH CHECK (
    relationship_id IN (
      SELECT relationship_id
      FROM public.relationship_members
      WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update own relationship passport"
  ON public.relationship_passports FOR UPDATE
  USING (
    relationship_id IN (
      SELECT relationship_id
      FROM public.relationship_members
      WHERE user_id = auth.uid()
    )
  );

-- Auto-update updated_at
CREATE TRIGGER update_relationship_passports_updated_at
  BEFORE UPDATE ON public.relationship_passports
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Index
CREATE INDEX idx_relationship_passports_relationship ON public.relationship_passports(relationship_id);
