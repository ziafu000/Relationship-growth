-- Fix infinite recursion in relationship_members policy
-- Drop the problematic policy
DROP POLICY IF EXISTS "Users can view own memberships" ON public.relationship_members;

-- Create a simpler, non-recursive policy
-- Users can only see their own memberships and memberships in relationships they belong to
CREATE POLICY "Users can view own memberships"
  ON public.relationship_members FOR SELECT
  USING (
    user_id = auth.uid()
  );

-- Add a separate policy to allow viewing other members in the same relationship
-- This uses a security definer function to avoid recursion
CREATE OR REPLACE FUNCTION public.user_relationship_ids()
RETURNS TABLE(relationship_id UUID)
LANGUAGE sql
SECURITY DEFINER
STABLE
AS $$
  SELECT relationship_id
  FROM public.relationship_members
  WHERE user_id = auth.uid();
$$;

CREATE POLICY "Users can view relationship members"
  ON public.relationship_members FOR SELECT
  USING (
    relationship_id IN (SELECT public.user_relationship_ids())
  );
