ALTER TABLE public.majors
  ADD COLUMN IF NOT EXISTS exam_criteria_id uuid REFERENCES public.criteria(id),
  ADD COLUMN IF NOT EXISTS diploma_criteria_id uuid REFERENCES public.criteria(id);

UPDATE public.majors m
SET exam_criteria_id = (SELECT id FROM public.criteria WHERE code = 'UJIAN'),
    diploma_criteria_id = (SELECT id FROM public.criteria WHERE code = 'IJAZAH');