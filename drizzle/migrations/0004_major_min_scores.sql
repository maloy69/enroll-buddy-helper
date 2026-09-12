-- Add minimum score requirements per major
ALTER TABLE public.majors
  ADD COLUMN IF NOT EXISTS min_exam_score numeric(5,2) NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS min_diploma_score numeric(5,2) NOT NULL DEFAULT 0;

-- Set baseline minimums
UPDATE public.majors SET min_exam_score = 60, min_diploma_score = 60;

-- Reference criteria for exam and diploma scores
INSERT INTO public.criteria (code, name, weight, max_value, sort_order) VALUES
 ('UJIAN','Nilai Ujian Sekolah', 0, 100, 5),
 ('IJAZAH','Nilai Ijazah/SKL', 0, 100, 6)
ON CONFLICT (code) DO NOTHING;