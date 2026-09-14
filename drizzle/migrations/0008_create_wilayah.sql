CREATE TABLE public.wilayah (
  kode varchar(13) PRIMARY KEY,
  nama text NOT NULL,
  level smallint NOT NULL,
  parent varchar(13)
);

CREATE INDEX wilayah_parent_idx ON public.wilayah (parent, nama);
CREATE INDEX wilayah_level_idx ON public.wilayah (level, nama);

GRANT SELECT ON public.wilayah TO anon;
GRANT SELECT ON public.wilayah TO authenticated;
GRANT ALL ON public.wilayah TO service_role;

ALTER TABLE public.wilayah ENABLE ROW LEVEL SECURITY;

CREATE POLICY "wilayah publik" ON public.wilayah FOR SELECT TO public USING (true);