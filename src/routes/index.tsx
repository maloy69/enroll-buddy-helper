import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import {
  ArrowRight,
  CalendarClock,
  ClipboardList,
  FileCheck2,
  QrCode,
  ShieldCheck,
  Sparkles,
  Users,
} from "lucide-react";
import { HeroSpmb } from "@/components/HeroSpmb";
import { db, fmtWIB, pendaftaranDibuka, type Jadwal } from "@/lib/spmb";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  DEFAULT_HERO_CONTRAST,
  isHeroOverlayOpacity,
  isHeroTextTone,
} from "@/lib/hero-contrast";
import type { Tables } from "@/integrations/supabase/types";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Penerimaan Murid Baru — SMK Muhammadiyah 1 Paguyangan" },
      {
        name: "description",
        content:
          "Layanan penerimaan murid baru SMK Muhammadiyah 1 Paguyangan secara daring: pendaftaran, pengunggahan berkas, seleksi, hingga daftar ulang.",
      },
      {
        property: "og:title",
        content: "Penerimaan Murid Baru — SMK Muhammadiyah 1 Paguyangan",
      },
      {
        property: "og:description",
        content:
          "Pendaftaran murid baru dilaksanakan secara daring meliputi pengisian formulir, pengunggahan berkas, hingga pengumuman hasil seleksi.",
      },
    ],
  }),
  component: Beranda,
});

type Major = { id: string; code: string; name: string; description: string | null; quota: number };

function Beranda() {
  const { data: settings } = useQuery({
    queryKey: ["settings"],
    queryFn: async () => {
      const { data } = await db.from("settings").select("*").maybeSingle();
      return data as (Jadwal & Tables<"settings">) | null;
    },
  });
  const { data: majors } = useQuery({
    queryKey: ["majors-active"],
    queryFn: async () => {
      const { data } = await db.from("majors").select("*").eq("active", true).order("code");
      return (data ?? []) as Major[];
    },
  });

  const buka = pendaftaranDibuka(settings);
  const totalKuota = (majors ?? []).reduce((a, m) => a + (m.quota ?? 0), 0);

  return (
    <>
      <HeroSpmb
        schoolName={settings?.school_name ?? "SMK Muhammadiyah 1 Paguyangan"}
        academicYear={settings?.academic_year ?? ""}
        buka={buka}
        textTone={
          isHeroTextTone(settings?.hero_text_tone)
            ? settings.hero_text_tone
            : DEFAULT_HERO_CONTRAST.textTone
        }
        overlayOpacity={
          isHeroOverlayOpacity(settings?.hero_overlay_opacity)
            ? settings.hero_overlay_opacity
            : DEFAULT_HERO_CONTRAST.overlayOpacity
        }
      />

      <section className="mx-auto max-w-6xl px-4 pt-14">
        <div className="flex items-center gap-2">
          <Sparkles className="size-4 shrink-0 text-primary" />
          <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            {settings?.school_name ?? "SMK Muhammadiyah 1 Paguyangan"}
          </span>
        </div>
        <p className="mt-3 max-w-3xl text-lg font-medium leading-relaxed">
          Pendaftaran dilaksanakan secara daring, meliputi pengisian formulir, pengunggahan
          berkas, hingga pengumuman hasil seleksi.
        </p>
        <p className="mt-3 max-w-3xl text-sm leading-relaxed text-muted-foreground sm:text-base">
          Seluruh tahapan penerimaan murid baru — pengisian data, verifikasi berkas, seleksi,
          hingga daftar ulang — dapat diselesaikan melalui satu akun.
        </p>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-14">
        <h2 className="text-2xl font-bold">Jadwal Penting</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Seluruh waktu mengikuti Waktu Indonesia Barat (WIB).
        </p>
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { label: "Pendaftaran dibuka", value: settings?.registration_open_at },
            { label: "Pendaftaran ditutup", value: settings?.registration_close_at },
            { label: "Pengumuman hasil", value: settings?.announcement_at },
            { label: "Batas daftar ulang", value: settings?.reregistration_close_at },
          ].map((j) => (
            <Card key={j.label}>
              <CardHeader className="pb-2">
                <CalendarClock className="size-5 text-primary" />
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {j.label}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm font-semibold">{fmtWIB(j.value)}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section className="border-y bg-muted/40">
        <div className="mx-auto max-w-6xl px-4 py-14">
          <h2 className="text-2xl font-bold">Kenapa mendaftar di sini mudah?</h2>
          <div className="mt-6 grid gap-5 md:grid-cols-3">
            {[
              {
                icon: ClipboardList,
                title: "Formulir bertahap",
                desc: "Isi sedikit demi sedikit. Data tersimpan otomatis, bisa dilanjutkan kapan saja.",
              },
              {
                icon: FileCheck2,
                title: "Unggah dokumen aman",
                desc: "Format PDF/PNG/JPG dengan pratinjau, indikator kemajuan, dan status verifikasi.",
              },
              {
                icon: QrCode,
                title: "Kartu peserta ber-QR",
                desc: "Cetak kartu ukuran A4 dan tunjukkan QR saat daftar ulang di sekolah.",
              },
              {
                icon: Users,
                title: "Pilihan jurusan ganda",
                desc: "Ajukan pilihan pertama dan cadangan sesuai minat calon murid.",
              },
              {
                icon: ShieldCheck,
                title: "Data terlindungi",
                desc: "Hanya Anda dan operator sekolah yang dapat melihat berkas pendaftaran.",
              },
              {
                icon: CalendarClock,
                title: "Pengumuman terjadwal",
                desc: "Hasil seleksi terbit otomatis sesuai jadwal yang ditetapkan sekolah.",
              },
            ].map((f) => (
              <div key={f.title} className="rounded-xl border bg-card p-5">
                <f.icon className="size-6 text-primary" />
                <h3 className="mt-3 font-semibold">{f.title}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-14">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <h2 className="text-2xl font-bold">Pilihan Jurusan</h2>
          <Button asChild variant="ghost">
            <Link to="/jurusan">
              Selengkapnya <ArrowRight className="size-4" />
            </Link>
          </Button>
        </div>
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          {(majors ?? []).map((m) => (
            <Card key={m.id}>
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center justify-between text-base">
                  <span>{m.name}</span>
                  <Badge variant="outline">{m.code}</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">{m.description}</p>
                <p className="mt-3 text-sm font-medium">Kuota: {m.quota} murid</p>
              </CardContent>
            </Card>
          ))}
          {majors?.length === 0 && (
            <p className="text-sm text-muted-foreground">
              Belum ada jurusan yang dibuka. Silakan cek kembali nanti.
            </p>
          )}
        </div>
      </section>
    </>
  );
}
