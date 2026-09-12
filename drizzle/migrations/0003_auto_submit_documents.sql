-- Automatically submit a registration once all required document types are uploaded
CREATE OR REPLACE FUNCTION public.trg_auto_submit()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  required_types text[] := ARRAY['ijazah','kk','akta','foto'];
  uploaded int;
BEGIN
  SELECT COUNT(DISTINCT doc_type) INTO uploaded
  FROM public.documents
  WHERE registration_id = NEW.registration_id
    AND doc_type = ANY(required_types);

  IF uploaded = array_length(required_types, 1) THEN
    UPDATE public.registrations
    SET status = 'submitted'
    WHERE id = NEW.registration_id AND status = 'draft';
  END IF;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_docs_auto_submit ON public.documents;
CREATE TRIGGER trg_docs_auto_submit
AFTER INSERT OR UPDATE ON public.documents
FOR EACH ROW EXECUTE FUNCTION public.trg_auto_submit();