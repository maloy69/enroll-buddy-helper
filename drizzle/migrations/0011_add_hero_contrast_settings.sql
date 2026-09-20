ALTER TABLE public.settings
  ADD COLUMN IF NOT EXISTS hero_text_tone text NOT NULL DEFAULT 'dark-green',
  ADD COLUMN IF NOT EXISTS hero_overlay_opacity smallint NOT NULL DEFAULT 55,
  ADD COLUMN IF NOT EXISTS hero_contrast_reason text,
  ADD COLUMN IF NOT EXISTS hero_contrast_analyzed_at timestamptz;

ALTER TABLE public.settings
  ADD CONSTRAINT settings_hero_text_tone_check
  CHECK (hero_text_tone IN ('dark-green', 'near-black'));

ALTER TABLE public.settings
  ADD CONSTRAINT settings_hero_overlay_opacity_check
  CHECK (hero_overlay_opacity IN (55, 65, 75));