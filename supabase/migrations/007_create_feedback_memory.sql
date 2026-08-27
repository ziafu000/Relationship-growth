-- Create feedback table
CREATE TABLE IF NOT EXISTS public.feedback (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  plan_execution_id UUID REFERENCES public.plan_executions(id) ON DELETE CASCADE,
  relationship_id UUID REFERENCES public.relationships(id) ON DELETE CASCADE,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,

  -- Feedback content
  outcome TEXT NOT NULL CHECK (outcome IN ('great', 'good', 'okay', 'difficult', 'didnt_work')),
  what_worked JSONB,
  what_didnt_work JSONB,
  partner_reaction TEXT CHECK (partner_reaction IN ('loved_it', 'enjoyed', 'neutral', 'uncomfortable')),
  would_repeat BOOLEAN NOT NULL,

  -- Open feedback
  notes TEXT,

  -- Learning signals for memory
  learned_preferences JSONB,

  submitted_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.feedback ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view own feedback"
  ON public.feedback FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY "Users can insert own feedback"
  ON public.feedback FOR INSERT
  WITH CHECK (user_id = auth.uid());

-- Indexes
CREATE INDEX idx_feedback_plan_execution ON public.feedback(plan_execution_id);
CREATE INDEX idx_feedback_relationship ON public.feedback(relationship_id);
CREATE INDEX idx_feedback_user ON public.feedback(user_id);
CREATE INDEX idx_feedback_outcome ON public.feedback(outcome);
CREATE INDEX idx_feedback_submitted_at ON public.feedback(submitted_at DESC);

-- Create relationship_memory table
CREATE TABLE IF NOT EXISTS public.relationship_memory (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  relationship_id UUID REFERENCES public.relationships(id) ON DELETE CASCADE,

  memory_type TEXT NOT NULL CHECK (memory_type IN ('activity_history', 'preference_learned', 'avoid_pattern')),
  content JSONB NOT NULL,

  -- For activity history
  activity_id UUID REFERENCES public.activities(id),
  last_used_at TIMESTAMPTZ,
  times_used INTEGER DEFAULT 0,
  average_rating DECIMAL(3,2),

  -- For learned preferences
  confidence_score DECIMAL(3,2),
  source_feedback_ids UUID[],

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.relationship_memory ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view own relationship memory"
  ON public.relationship_memory FOR SELECT
  USING (
    relationship_id IN (
      SELECT relationship_id
      FROM public.relationship_members
      WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "System can insert memory"
  ON public.relationship_memory FOR INSERT
  WITH CHECK (
    relationship_id IN (
      SELECT relationship_id
      FROM public.relationship_members
      WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "System can update memory"
  ON public.relationship_memory FOR UPDATE
  USING (
    relationship_id IN (
      SELECT relationship_id
      FROM public.relationship_members
      WHERE user_id = auth.uid()
    )
  );

-- Auto-update updated_at
CREATE TRIGGER update_relationship_memory_updated_at
  BEFORE UPDATE ON public.relationship_memory
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Indexes
CREATE INDEX idx_relationship_memory_relationship ON public.relationship_memory(relationship_id);
CREATE INDEX idx_relationship_memory_type ON public.relationship_memory(memory_type);
CREATE INDEX idx_relationship_memory_activity ON public.relationship_memory(activity_id);
