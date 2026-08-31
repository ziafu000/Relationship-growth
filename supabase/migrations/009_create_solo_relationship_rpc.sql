CREATE OR REPLACE FUNCTION public.create_solo_relationship(
  p_user_id UUID,
  p_relationship_type TEXT,
  p_city TEXT,
  p_love_languages TEXT[],
  p_interests TEXT[],
  p_user_email TEXT,
  p_user_name TEXT
) RETURNS void AS $$
DECLARE
  v_relationship_id UUID;
BEGIN
  -- Insert relationship
  INSERT INTO public.relationships (relationship_type, mode, status)
  VALUES (p_relationship_type, 'solo', 'active')
  RETURNING id INTO v_relationship_id;

  -- Insert member
  INSERT INTO public.relationship_members (relationship_id, user_id, role, joined_at)
  VALUES (v_relationship_id, p_user_id, 'owner', NOW());

  -- Insert passport
  INSERT INTO public.relationship_passports (relationship_id, partner1_love_languages, partner1_interests)
  VALUES (v_relationship_id, p_love_languages, p_interests);

  -- Upsert user
  INSERT INTO public.users (id, email, name, city)
  VALUES (p_user_id, p_user_email, p_user_name, p_city)
  ON CONFLICT (id) DO UPDATE SET
    email = EXCLUDED.email,
    name = EXCLUDED.name,
    city = EXCLUDED.city;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
