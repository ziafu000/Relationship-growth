-- Create plans table
CREATE TABLE IF NOT EXISTS public.plans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  relationship_id UUID REFERENCES public.relationships(id) ON DELETE CASCADE,
  goal_id UUID REFERENCES public.goals(id) ON DELETE CASCADE,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,

  -- Plan content
  plan_title_vi TEXT NOT NULL,
  plan_title_en TEXT,
  reasoning_vi TEXT NOT NULL,
  reasoning_en TEXT,
  activity_id UUID REFERENCES public.activities(id),
  estimated_time_minutes INTEGER,
  effort_level TEXT CHECK (effort_level IN ('low', 'medium', 'high')),

  -- Execution details
  steps JSONB NOT NULL,
  conversation_starters JSONB,
  tips JSONB,

  -- Personalization metadata
  scoring_metadata JSONB,

  -- User interaction
  rank INTEGER NOT NULL CHECK (rank IN (1, 2, 3)),
  viewed_at TIMESTAMPTZ,
  selected_at TIMESTAMPTZ,
  rejected_at TIMESTAMPTZ,
  rejection_reason TEXT,

  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.plans ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view own plans"
  ON public.plans FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY "Users can view partner plans with consent"
  ON public.plans FOR SELECT
  USING (
    relationship_id IN (
      SELECT rm.relationship_id
      FROM public.relationship_members rm
      WHERE rm.user_id = auth.uid()
        AND rm.consent_shared_data = true
    )
  );

CREATE POLICY "Users can insert own plans"
  ON public.plans FOR INSERT
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update own plans"
  ON public.plans FOR UPDATE
  USING (user_id = auth.uid());

-- Indexes
CREATE INDEX idx_plans_relationship ON public.plans(relationship_id);
CREATE INDEX idx_plans_goal ON public.plans(goal_id);
CREATE INDEX idx_plans_user ON public.plans(user_id);
CREATE INDEX idx_plans_activity ON public.plans(activity_id);
CREATE INDEX idx_plans_rank ON public.plans(rank);
CREATE INDEX idx_plans_selected_at ON public.plans(selected_at);

-- Create plan_executions table
CREATE TABLE IF NOT EXISTS public.plan_executions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  plan_id UUID REFERENCES public.plans(id) ON DELETE CASCADE,
  relationship_id UUID REFERENCES public.relationships(id) ON DELETE CASCADE,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,

  status TEXT DEFAULT 'planned' CHECK (status IN ('planned', 'started', 'completed', 'abandoned')),
  started_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  abandoned_at TIMESTAMPTZ,

  -- Tracking
  steps_completed JSONB,
  notes TEXT,

  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.plan_executions ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view own executions"
  ON public.plan_executions FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY "Users can insert own executions"
  ON public.plan_executions FOR INSERT
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update own executions"
  ON public.plan_executions FOR UPDATE
  USING (user_id = auth.uid());

-- Indexes
CREATE INDEX idx_plan_executions_plan ON public.plan_executions(plan_id);
CREATE INDEX idx_plan_executions_relationship ON public.plan_executions(relationship_id);
CREATE INDEX idx_plan_executions_user ON public.plan_executions(user_id);
CREATE INDEX idx_plan_executions_status ON public.plan_executions(status);
CREATE INDEX idx_plan_executions_completed_at ON public.plan_executions(completed_at);
