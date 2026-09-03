-- Atomically create the authenticated user's solo relationship.
-- CREATE OR REPLACE plus the membership check make this safe to deploy or retry.
CREATE OR REPLACE FUNCTION public.create_solo_relationship(
  p_user_id UUID,
  p_relationship_type TEXT,
  p_city TEXT,
  p_love_languages TEXT[],
  p_interests TEXT[],
  p_user_email TEXT,
  p_user_name TEXT
) RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
  v_authenticated_user_id UUID := (SELECT auth.uid());
  v_relationship_id UUID;
  v_verified_email TEXT;
BEGIN
  IF v_authenticated_user_id IS NULL OR v_authenticated_user_id <> p_user_id THEN
    RAISE EXCEPTION 'Not authorized to create this relationship'
      USING ERRCODE = '42501';
  END IF;

  IF p_relationship_type NOT IN ('new', 'long_term') THEN
    RAISE EXCEPTION 'Invalid relationship type' USING ERRCODE = '22023';
  END IF;

  IF p_city NOT IN ('hanoi', 'hcmc') THEN
    RAISE EXCEPTION 'Invalid city' USING ERRCODE = '22023';
  END IF;

  IF cardinality(p_love_languages) NOT BETWEEN 1 AND 3
    OR p_love_languages IS NULL
    OR NOT p_love_languages <@ ARRAY[
      'quality_time',
      'words_of_affirmation',
      'physical_touch',
      'acts_of_service',
      'gifts'
    ]::TEXT[]
    OR cardinality(ARRAY(SELECT DISTINCT unnest(p_love_languages))) <> cardinality(p_love_languages)
  THEN
    RAISE EXCEPTION 'Select between 1 and 3 valid love languages'
      USING ERRCODE = '22023';
  END IF;

  IF cardinality(p_interests) NOT BETWEEN 3 AND 5
    OR p_interests IS NULL
    OR NOT p_interests <@ ARRAY[
      'coffee',
      'art',
      'food',
      'nature',
      'music',
      'sports',
      'movies',
      'books',
      'cooking',
      'travel'
    ]::TEXT[]
    OR cardinality(ARRAY(SELECT DISTINCT unnest(p_interests))) <> cardinality(p_interests)
  THEN
    RAISE EXCEPTION 'Select between 3 and 5 valid interests'
      USING ERRCODE = '22023';
  END IF;

  -- Serialize retries for one auth user so concurrent submissions cannot create
  -- orphan duplicate relationships.
  PERFORM pg_catalog.pg_advisory_xact_lock(
    pg_catalog.hashtextextended(p_user_id::TEXT, 0)
  );

  IF EXISTS (
    SELECT 1
    FROM public.relationship_members
    WHERE user_id = v_authenticated_user_id
  ) THEN
    RETURN;
  END IF;

  SELECT email
  INTO v_verified_email
  FROM auth.users
  WHERE id = v_authenticated_user_id;

  IF v_verified_email IS NULL THEN
    RAISE EXCEPTION 'Authenticated user has no verified identity'
      USING ERRCODE = '23503';
  END IF;

  -- Ensure the referenced public profile exists before creating membership.
  -- The email is sourced from auth.users rather than trusting the RPC payload.
  INSERT INTO public.users (id, email, name, city)
  VALUES (
    v_authenticated_user_id,
    v_verified_email,
    NULLIF(trim(p_user_name), ''),
    p_city
  )
  ON CONFLICT (id) DO UPDATE SET
    email = EXCLUDED.email,
    name = COALESCE(EXCLUDED.name, public.users.name),
    city = EXCLUDED.city;

  INSERT INTO public.relationships (relationship_type, mode, status)
  VALUES (p_relationship_type, 'solo', 'active')
  RETURNING id INTO v_relationship_id;

  INSERT INTO public.relationship_members (
    relationship_id,
    user_id,
    role,
    joined_at
  )
  VALUES (v_relationship_id, v_authenticated_user_id, 'owner', now());

  INSERT INTO public.relationship_passports (
    relationship_id,
    partner1_love_languages,
    partner1_interests
  )
  VALUES (v_relationship_id, p_love_languages, p_interests);
END;
$$;

-- SECURITY DEFINER is required for the atomic cross-table setup, but the RPC is
-- only callable by an authenticated user and verifies auth.uid() internally.
REVOKE ALL ON FUNCTION public.create_solo_relationship(
  UUID, TEXT, TEXT, TEXT[], TEXT[], TEXT, TEXT
) FROM PUBLIC;
REVOKE ALL ON FUNCTION public.create_solo_relationship(
  UUID, TEXT, TEXT, TEXT[], TEXT[], TEXT, TEXT
) FROM anon;
GRANT EXECUTE ON FUNCTION public.create_solo_relationship(
  UUID, TEXT, TEXT, TEXT[], TEXT[], TEXT, TEXT
) TO authenticated;
