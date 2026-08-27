-- Create activities table (structured activity library)
CREATE TABLE IF NOT EXISTS public.activities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,

  -- Titles and descriptions
  title_vi TEXT NOT NULL,
  title_en TEXT,
  description_vi TEXT,
  description_en TEXT,

  -- Classification
  category TEXT NOT NULL,
  pillar TEXT[] NOT NULL,
  relationship_type TEXT[] NOT NULL,

  -- Attributes
  effort_level TEXT NOT NULL CHECK (effort_level IN ('low', 'medium', 'high')),
  time_required_minutes INTEGER,
  location_type TEXT CHECK (location_type IN ('indoor', 'outdoor', 'home', 'virtual')),
  city TEXT[],
  cost_range TEXT CHECK (cost_range IN ('free', 'budget', 'moderate', 'premium')),

  -- Activity content
  steps JSONB NOT NULL,
  conversation_prompts JSONB,
  tips JSONB,

  -- Metadata for scoring/filtering
  tags JSONB,
  prerequisites JSONB,
  safety_notes TEXT,

  -- Admin
  is_active BOOLEAN DEFAULT TRUE,
  created_by UUID REFERENCES public.users(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.activities ENABLE ROW LEVEL SECURITY;

-- RLS Policies (activities are readable by all authenticated users)
CREATE POLICY "Authenticated users can view active activities"
  ON public.activities FOR SELECT
  USING (auth.uid() IS NOT NULL AND is_active = true);

CREATE POLICY "Admins can insert activities"
  ON public.activities FOR INSERT
  WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Admins can update activities"
  ON public.activities FOR UPDATE
  USING (auth.uid() IS NOT NULL);

-- Auto-update updated_at
CREATE TRIGGER update_activities_updated_at
  BEFORE UPDATE ON public.activities
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Indexes for efficient filtering
CREATE INDEX idx_activities_slug ON public.activities(slug);
CREATE INDEX idx_activities_category ON public.activities(category);
CREATE INDEX idx_activities_pillar ON public.activities USING GIN(pillar);
CREATE INDEX idx_activities_relationship_type ON public.activities USING GIN(relationship_type);
CREATE INDEX idx_activities_city ON public.activities USING GIN(city);
CREATE INDEX idx_activities_tags ON public.activities USING GIN(tags);
CREATE INDEX idx_activities_effort_level ON public.activities(effort_level);
CREATE INDEX idx_activities_cost_range ON public.activities(cost_range);
CREATE INDEX idx_activities_is_active ON public.activities(is_active);
