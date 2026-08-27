-- Create check_ins table
CREATE TABLE IF NOT EXISTS public.check_ins (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  relationship_id UUID REFERENCES public.relationships(id) ON DELETE CASCADE,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,

  -- Check-in responses
  current_mood TEXT NOT NULL,
  connection_level INTEGER NOT NULL CHECK (connection_level BETWEEN 1 AND 10),
  time_together_recently TEXT NOT NULL,
  recent_challenges JSONB,
  what_matters_now TEXT NOT NULL,

  -- Context
  available_time TEXT NOT NULL,
  budget_preference TEXT NOT NULL,
  location_preference TEXT NOT NULL,

  completed_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.check_ins ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view own check-ins"
  ON public.check_ins FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY "Users can view partner check-ins with consent"
  ON public.check_ins FOR SELECT
  USING (
    relationship_id IN (
      SELECT rm.relationship_id
      FROM public.relationship_members rm
      WHERE rm.user_id = auth.uid()
        AND rm.consent_shared_data = true
    )
  );

CREATE POLICY "Users can insert own check-ins"
  ON public.check_ins FOR INSERT
  WITH CHECK (user_id = auth.uid());

-- Indexes
CREATE INDEX idx_check_ins_relationship ON public.check_ins(relationship_id);
CREATE INDEX idx_check_ins_user ON public.check_ins(user_id);
CREATE INDEX idx_check_ins_completed_at ON public.check_ins(completed_at DESC);

-- Create goals table
CREATE TABLE IF NOT EXISTS public.goals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  relationship_id UUID REFERENCES public.relationships(id) ON DELETE CASCADE,
  check_in_id UUID REFERENCES public.check_ins(id) ON DELETE SET NULL,

  goal_type TEXT NOT NULL,
  goal_description_vi TEXT,
  goal_description_en TEXT,

  selected_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.goals ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view own goals"
  ON public.goals FOR SELECT
  USING (
    relationship_id IN (
      SELECT relationship_id
      FROM public.relationship_members
      WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert goals"
  ON public.goals FOR INSERT
  WITH CHECK (
    relationship_id IN (
      SELECT relationship_id
      FROM public.relationship_members
      WHERE user_id = auth.uid()
    )
  );

-- Indexes
CREATE INDEX idx_goals_relationship ON public.goals(relationship_id);
CREATE INDEX idx_goals_check_in ON public.goals(check_in_id);
CREATE INDEX idx_goals_type ON public.goals(goal_type);
