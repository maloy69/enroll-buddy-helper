import { createServerFn } from "@tanstack/react-start";
import { getRequest } from "@tanstack/react-start/server";
import { Output, streamText } from "ai";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import heroPoster from "@/assets/hero-poster.jpg.asset.json";
import { createLovableResponsesProvider } from "@/lib/ai-gateway.server";
import {
  HERO_OVERLAY_OPACITIES,
  HERO_TEXT_TONES,
  minimumContrastRatio,
  type HeroOverlayOpacity,
  type HeroTextTone,
} from "@/lib/hero-contrast";

const ContrastOutput = z.object({
  textTone: z.enum(HERO_TEXT_TONES),
  overlayOpacity: z.union([z.literal(55), z.literal(65), z.literal(75)]),
  reason: z.string(),
});

function gatewayMessage(error: unknown) {
  const candidate = error as { statusCode?: number; status?: number; responseBody?: string; message?: string };
  const status = candidate.statusCode ?? candidate.status;
  if (status === 402) return "Kredit Lovable AI tidak mencukupi. Tambahkan kredit lalu coba lagi.";
  if (status === 403) return candidate.message || "Akses Lovable AI sedang dibatasi oleh workspace.";
  if (status === 429) return "Lovable AI sedang membatasi permintaan. Silakan coba lagi beberapa saat nanti.";
  if (status === 401) return "Konfigurasi Lovable AI belum tersedia untuk aplikasi ini.";
  if (status === 400) return "Gambar atau pengaturan kontras tidak dapat dianalisis.";
  return "Analisis kontras gagal. Pengaturan hero sebelumnya tetap digunakan.";
}

export const analyzeAndApplyHeroContrast = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => z.object({}).parse(input))
  .handler(async ({ context }) => {
    const { data: allowed } = await context.supabase.rpc("is_staff", {
      _user_id: context.userId,
    });
    if (!allowed) throw new Error("Akses hanya tersedia untuk operator sekolah.");

    const apiKey = process.env["LOVABLE_API_KEY"];
    if (!apiKey) throw new Error("Konfigurasi Lovable AI belum tersedia untuk aplikasi ini.");

    const request = getRequest();
    const initialRunId = request.headers.get("X-Lovable-AIG-Run-ID") ?? undefined;
    const posterUrl = new URL(heroPoster.url, request.url).toString();
    const { provider, getRunId } = createLovableResponsesProvider(apiKey, initialRunId);

    try {
      const result = streamText({
        model: provider.responses("openai/gpt-6-astra"),
        output: Output.object({ schema: ContrastOutput }),
        messages: [
          {
            role: "user",
            content: [
              {
                type: "text",
                text:
                  "Analisis poster hero sekolah ini. Di atas gambar diterapkan overlay biru langit putih terang. Pilih kombinasi paling mudah dibaca: textTone hanya dark-green atau near-black, overlayOpacity hanya 55, 65, atau 75. Utamakan WCAG AA untuk judul dan label, sambil menjaga video tetap terlihat. Berikan alasan singkat dalam Bahasa Indonesia.",
              },
              { type: "image", image: new URL(posterUrl), mediaType: "image/jpeg" },
            ],
          },
        ],
        providerOptions: {
          openai: {
            forceReasoning: true,
            reasoningEffort: "medium",
            reasoningSummary: "auto",
            store: false,
            include: ["reasoning.encrypted_content"],
          },
        },
      });

      const output = await result.output;
      const ratio = minimumContrastRatio(
        output.textTone as HeroTextTone,
        output.overlayOpacity as HeroOverlayOpacity,
      );
      if (ratio < 4.5) throw new Error("AI_CONTRAST_BELOW_AA");

      const analyzedAt = new Date().toISOString();
      const { error } = await context.supabase
        .from("settings")
        .update({
          hero_text_tone: output.textTone,
          hero_overlay_opacity: output.overlayOpacity,
          hero_contrast_reason: output.reason.slice(0, 300),
          hero_contrast_analyzed_at: analyzedAt,
        })
        .eq("id", true);
      if (error) throw error;

      return {
        textTone: output.textTone,
        overlayOpacity: output.overlayOpacity,
        reason: output.reason.slice(0, 300),
        analyzedAt,
        contrastRatio: Number(ratio.toFixed(2)),
        runId: getRunId() ?? null,
      };
    } catch (error) {
      if (error instanceof Error && error.message === "AI_CONTRAST_BELOW_AA") {
        throw new Error("Saran AI tidak memenuhi WCAG AA. Pengaturan hero sebelumnya tetap digunakan.");
      }
      throw new Error(gatewayMessage(error));
    }
  });