-- Activity photos belong to a single plan execution, not to the shared
-- activity library or generated plan. One user may execute the same activity
-- more than once and should retain a separate private memory for each run.
ALTER TABLE public.plan_executions
ADD COLUMN IF NOT EXISTS activity_photo_path TEXT;

-- Keep user photos private. The application serves short-lived signed URLs.
INSERT INTO storage.buckets (
  id,
  name,
  public,
  file_size_limit,
  allowed_mime_types
)
VALUES (
  'activity_images',
  'activity_images',
  false,
  5242880,
  ARRAY['image/jpeg', 'image/png', 'image/webp']
)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  public = EXCLUDED.public,
  file_size_limit = EXCLUDED.file_size_limit,
  allowed_mime_types = EXCLUDED.allowed_mime_types;

-- Remove only policies created by the previous placeholder version of this
-- migration. The qualification guard prevents touching an unrelated policy
-- that happens to use the same generic name.
DO $$
DECLARE
  v_policy_name TEXT;
BEGIN
  FOREACH v_policy_name IN ARRAY ARRAY[
    'Public Access',
    'Authenticated users can upload activity images',
    'Users can update their own activity images',
    'Users can delete their own activity images'
  ]
  LOOP
    IF EXISTS (
      SELECT 1
      FROM pg_catalog.pg_policies
      WHERE schemaname = 'storage'
        AND tablename = 'objects'
        AND policyname = v_policy_name
        AND (
          COALESCE(qual, '') LIKE '%activity_images%'
          OR COALESCE(with_check, '') LIKE '%activity_images%'
        )
    ) THEN
      EXECUTE format(
        'DROP POLICY %I ON storage.objects',
        v_policy_name
      );
    END IF;
  END LOOP;
END;
$$;

DROP POLICY IF EXISTS "Activity owners can read execution photos" ON storage.objects;
CREATE POLICY "Activity owners can read execution photos"
ON storage.objects
FOR SELECT
TO authenticated
USING (
  bucket_id = 'activity_images'
  AND (storage.foldername(name))[1] = (SELECT auth.uid())::TEXT
  AND EXISTS (
    SELECT 1
    FROM public.plan_executions AS execution
    WHERE execution.id::TEXT = (storage.foldername(name))[2]
      AND execution.user_id = (SELECT auth.uid())
  )
);

DROP POLICY IF EXISTS "Activity owners can upload execution photos" ON storage.objects;
CREATE POLICY "Activity owners can upload execution photos"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'activity_images'
  AND (storage.foldername(name))[1] = (SELECT auth.uid())::TEXT
  AND EXISTS (
    SELECT 1
    FROM public.plan_executions AS execution
    WHERE execution.id::TEXT = (storage.foldername(name))[2]
      AND execution.user_id = (SELECT auth.uid())
  )
);

DROP POLICY IF EXISTS "Activity owners can delete execution photos" ON storage.objects;
CREATE POLICY "Activity owners can delete execution photos"
ON storage.objects
FOR DELETE
TO authenticated
USING (
  bucket_id = 'activity_images'
  AND (storage.foldername(name))[1] = (SELECT auth.uid())::TEXT
  AND EXISTS (
    SELECT 1
    FROM public.plan_executions AS execution
    WHERE execution.id::TEXT = (storage.foldername(name))[2]
      AND execution.user_id = (SELECT auth.uid())
  )
);

-- Persist an explicit desired state so retries are idempotent. The row lock
-- prevents concurrent toggles from overwriting each other.
CREATE OR REPLACE FUNCTION public.set_plan_execution_step_completion(
  p_execution_id UUID,
  p_step_order INTEGER,
  p_completed BOOLEAN
) RETURNS JSONB
LANGUAGE plpgsql
SECURITY INVOKER
SET search_path = ''
AS $$
DECLARE
  v_current JSONB;
  v_updated JSONB;
  v_existing_completed_at TEXT;
BEGIN
  IF (SELECT auth.uid()) IS NULL THEN
    RAISE EXCEPTION 'Authentication required' USING ERRCODE = '42501';
  END IF;

  IF p_step_order IS NULL OR p_step_order < 1 THEN
    RAISE EXCEPTION 'Invalid step order' USING ERRCODE = '22023';
  END IF;

  SELECT COALESCE(steps_completed, '[]'::JSONB)
  INTO v_current
  FROM public.plan_executions
  WHERE id = p_execution_id
    AND user_id = (SELECT auth.uid())
  FOR UPDATE;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Execution not found' USING ERRCODE = '42501';
  END IF;

  IF jsonb_typeof(v_current) <> 'array' THEN
    v_current := '[]'::JSONB;
  END IF;

  SELECT item.value->>'completed_at'
  INTO v_existing_completed_at
  FROM jsonb_array_elements(v_current) WITH ORDINALITY AS item(value, position)
  WHERE item.value->>'step_id' = p_step_order::TEXT
  ORDER BY item.position
  LIMIT 1;

  SELECT COALESCE(jsonb_agg(item.value ORDER BY item.position), '[]'::JSONB)
  INTO v_updated
  FROM jsonb_array_elements(v_current) WITH ORDINALITY AS item(value, position)
  WHERE item.value->>'step_id' IS DISTINCT FROM p_step_order::TEXT;

  IF p_completed THEN
    v_updated := v_updated || jsonb_build_array(
      jsonb_build_object(
        'step_id', p_step_order,
        'completed_at', COALESCE(v_existing_completed_at, now()::TEXT)
      )
    );
  END IF;

  IF v_updated <> v_current THEN
    UPDATE public.plan_executions
    SET steps_completed = v_updated
    WHERE id = p_execution_id
      AND user_id = (SELECT auth.uid());
  END IF;

  RETURN v_updated;
END;
$$;

REVOKE ALL ON FUNCTION public.set_plan_execution_step_completion(
  UUID, INTEGER, BOOLEAN
) FROM PUBLIC;
REVOKE ALL ON FUNCTION public.set_plan_execution_step_completion(
  UUID, INTEGER, BOOLEAN
) FROM anon;
GRANT EXECUTE ON FUNCTION public.set_plan_execution_step_completion(
  UUID, INTEGER, BOOLEAN
) TO authenticated;
