export const HERO_TEXT_TONES = ["dark-green", "near-black"] as const;
export const HERO_OVERLAY_OPACITIES = [55, 65, 75] as const;

export type HeroTextTone = (typeof HERO_TEXT_TONES)[number];
export type HeroOverlayOpacity = (typeof HERO_OVERLAY_OPACITIES)[number];

export const DEFAULT_HERO_CONTRAST = {
  textTone: "dark-green" as HeroTextTone,
  overlayOpacity: 55 as HeroOverlayOpacity,
};

export const HERO_TEXT_CLASSES: Record<HeroTextTone, string> = {
  "dark-green": "text-hero-ink",
  "near-black": "text-foreground",
};

export const HERO_OVERLAY_CLASSES: Record<HeroOverlayOpacity, string> = {
  55: "bg-hero-sky/55",
  65: "bg-hero-sky/65",
  75: "bg-hero-sky/75",
};

const TEXT_RGB: Record<HeroTextTone, [number, number, number]> = {
  "dark-green": [45, 62, 45],
  "near-black": [17, 24, 39],
};

const OVERLAY_RGB: [number, number, number] = [225, 245, 255];

function linearChannel(value: number) {
  const channel = value / 255;
  return channel <= 0.04045 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4;
}

function luminance(rgb: [number, number, number]) {
  return (
    0.2126 * linearChannel(rgb[0]) +
    0.7152 * linearChannel(rgb[1]) +
    0.0722 * linearChannel(rgb[2])
  );
}

export function minimumContrastRatio(tone: HeroTextTone, opacity: HeroOverlayOpacity) {
  const alpha = opacity / 100;
  // Hitam dan putih menjadi batas luminans latar video yang mungkin berada di bawah overlay.
  const backgrounds = ([0, 255] as const).map((channel) =>
    OVERLAY_RGB.map((overlay) => Math.round(overlay * alpha + channel * (1 - alpha))) as [
      number,
      number,
      number,
    ],
  );
  const textLuminance = luminance(TEXT_RGB[tone]);
  return Math.min(
    ...backgrounds.map((background) => {
      const bgLuminance = luminance(background);
      const lighter = Math.max(textLuminance, bgLuminance);
      const darker = Math.min(textLuminance, bgLuminance);
      return (lighter + 0.05) / (darker + 0.05);
    }),
  );
}

export function isHeroTextTone(value: unknown): value is HeroTextTone {
  return HERO_TEXT_TONES.includes(value as HeroTextTone);
}

export function isHeroOverlayOpacity(value: unknown): value is HeroOverlayOpacity {
  return HERO_OVERLAY_OPACITIES.includes(value as HeroOverlayOpacity);
}