-- First-user operator claim: the very first authenticated account can become admin+operator,
-- but only while no admin exists yet. Afterwards this function always refuses.
CREATE OR REPLACE FUNCTION public.claim_first_operator()
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  admin_exists boolean;
BEGIN
  IF auth.uid() IS NULL THEN
    RETURN false;
  END IF;

  SELECT EXISTS (
    SELECT 1 FROM public.user_roles WHERE role = 'admin'
  ) INTO admin_exists;

  IF admin_exists THEN
    RETURN false;
  END IF;

  INSERT INTO public.user_roles (user_id, role)
  VALUES (auth.uid(), 'admin'), (auth.uid(), 'operator')
  ON CONFLICT DO NOTHING;

  INSERT INTO public.audit_logs (actor_id, action, entity, detail)
  VALUES (auth.uid(), 'klaim_operator_pertama', 'user_roles', jsonb_build_object('user_id', auth.uid()));

  RETURN true;
END;
$$;

GRANT EXECUTE ON FUNCTION public.claim_first_operator() TO authenticated;