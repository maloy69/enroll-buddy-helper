// ============= Full file contents =============

import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowRight, Check, LogIn, Menu, UserPlus, X } from "lucide-react";
import HeroVideoBg from "@/components/HeroVideoBg";
import logoSekolah from "@/assets/logo-smk.webp";


const NAV = [
  { to: "/alur", label: "Alur" },
  { to: "/jurusan", label: "Jurusan" },
  { to: "/pengumuman", label: "Pengumuman" },
] as const;

type Props = {
  schoolName: string;
  academicYear: string;
  buka: boolean;
};

const SHADOW_KUAT = "[text-shadow:0_1px_2px_rgb(0_0_0_/_0.9),0_2px_6px_rgb(0_0_0_/_0.75),0_4px_18px_rgb(0_0_0_/_0.6)]";
const SHADOW_JUDUL = "[text-shadow:0_2px_4px_rgb(0_0_0_/_0.9),0_4px_12px_rgb(0_0_0_/_0.7),0_8px_28px_rgb(0_0_0_/_0.55)]";

export function HeroSpmb({ schoolName, academicYear, buka }: Props) {
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  return (
    <section className="relative flex w-full min-h-[35svh] flex-col overflow-hidden bg-hero-ink print:hidden">
      <HeroVideoBg className="absolute inset-0" />
      <div className="absolute inset-0 bg-hero-ink/5" />
      {/* Scrim gradien hanya di area bawah agar tulisan menyolok, video tetap terang */}
      <div className="absolute inset-x-0 bottom-0 h-3/5 bg-gradient-to-t from-hero-ink/80 via-hero-ink/40 to-transparent" />

      {/* Navbar */}
      <div className="relative z-20 flex items-center justify-between gap-4 px-4 py-3 sm:px-6 sm:py-4 md:px-10">
        <Link to="/" className="flex items-center gap-2">
          <img
            src={logoSekolah}
            alt={`Logo ${schoolName}`}
            width={40}
            height={40}
            className="size-10 object-contain drop-shadow"
          />
          <span className={`text-base font-bold tracking-tight text-white drop-shadow sm:text-lg ${SHADOW_JUDUL}`}>
            SPMB Online
          </span>
        </Link>

        <nav className="hidden items-center gap-1 rounded-full border border-white/60 bg-white/70 py-1 pl-6 pr-1 shadow-sm backdrop-blur-md lg:flex">
          {NAV.map((n) => (
            <Link
              key={n.to}
              to={n.to}
              className="px-4 py-2 text-sm font-medium text-hero-ink transition-opacity hover:opacity-80"
            >
              {n.label}
            </Link>
          ))}
          <Link
            to="/pendaftaran"
            className="ml-2 rounded-full bg-hero-ink px-5 py-2 text-sm font-semibold text-white transition-colors hover:bg-hero-ink-hover"
          >
            Daftar Sekarang
          </Link>
        </nav>

        <div className="flex items-center gap-2">
          <Link
            to="/auth"
            className="hidden items-center gap-2 rounded-full border border-white/60 bg-white/70 px-5 py-2 text-sm font-semibold text-hero-ink backdrop-blur-md transition-colors hover:bg-white/90 sm:inline-flex"
          >
            <UserPlus className="size-4" />
            Buat Akun
          </Link>
          <Link
            to="/auth"
            className="hidden items-center gap-2 rounded-full bg-hero-ink px-5 py-2 text-sm font-semibold text-white transition-colors hover:bg-hero-ink-hover sm:inline-flex"
          >
            <LogIn className="size-4" />
            Masuk
          </Link>
          <button
            onClick={() => setMenuOpen((v) => !v)}
            className="relative flex size-10 items-center justify-center rounded-full border border-white/60 bg-white/70 text-hero-ink backdrop-blur-md transition-all duration-300 hover:bg-white/90 lg:hidden"
            aria-label={menuOpen ? "Tutup menu" : "Buka menu"}
            aria-expanded={menuOpen}
          >
            <Menu
              className={`absolute size-5 transition-all duration-300 ${
                menuOpen ? "scale-50 rotate-90 opacity-0" : "scale-100 rotate-0 opacity-100"
              }`}
            />
            <X
              className={`absolute size-5 transition-all duration-300 ${
                menuOpen ? "scale-100 rotate-0 opacity-100" : "scale-50 -rotate-90 opacity-0"
              }`}
            />
          </button>
        </div>
      </div>

      {/* Overlay */}
      <div
        onClick={() => setMenuOpen(false)}
        className={`fixed inset-0 z-30 bg-hero-ink/40 backdrop-blur-sm transition-opacity duration-300 lg:hidden ${
          menuOpen ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"
        }`}
      />

      {/* Drawer */}
      <div
        className={`fixed inset-y-0 right-0 z-40 flex w-[82%] max-w-sm flex-col justify-between bg-white px-6 py-8 shadow-2xl transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] lg:hidden ${
          menuOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="mt-12 flex flex-col">
          {NAV.map((n, i) => (
            <Link
              key={n.to}
              to={n.to}
              onClick={() => setMenuOpen(false)}
              className={`border-b border-hero-ink/10 py-4 text-2xl font-semibold text-hero-ink transition-all duration-500 ${
                menuOpen ? "translate-x-0 opacity-100" : "translate-x-8 opacity-0"
              }`}
              style={{ transitionDelay: menuOpen ? `${150 + i * 70}ms` : "0ms" }}
            >
              {n.label}
            </Link>
          ))}
        </div>
        <div
          className={`flex flex-col gap-3 transition-all duration-500 ${
            menuOpen ? "translate-x-0 opacity-100" : "translate-x-8 opacity-0"
          }`}
          style={{ transitionDelay: menuOpen ? "400ms" : "0ms" }}
        >
          <Link
            to="/pendaftaran"
            onClick={() => setMenuOpen(false)}
            className="inline-flex items-center justify-center gap-2 rounded-full bg-hero-ink px-5 py-3 text-sm font-semibold text-white"
          >
            Mulai Pendaftaran <ArrowRight className="size-4" />
          </Link>
          <Link
            to="/auth"
            onClick={() => setMenuOpen(false)}
            className="inline-flex items-center justify-center gap-2 rounded-full border border-hero-ink/20 px-5 py-3 text-sm font-semibold text-hero-ink"
          >
            <LogIn className="size-4" /> Masuk / Buat Akun
          </Link>
        </div>
      </div>

      {/* Perbandingan dua susunan hero dalam tinggi yang sama */}
      <div className="relative z-10 grid min-h-0 flex-1 grid-cols-2">
        <article className="relative flex min-w-0 flex-col justify-end border-r border-white/30 px-3 pb-5 sm:px-6 md:px-10 md:pb-7">
          <span className={`mb-2 text-[10px] font-bold uppercase tracking-wide text-white/90 sm:text-xs ${SHADOW_KUAT}`}>
            Versi formal
          </span>
          <h1 className={`max-w-2xl text-lg font-bold leading-tight text-white sm:text-2xl md:text-3xl lg:text-4xl ${SHADOW_JUDUL}`}>
            Penerimaan Murid Baru{" "}
            <span className="text-hero-accent">{academicYear || "Tahun Ajaran Baru"}</span>
          </h1>
          <div className="mt-3 flex flex-wrap items-center gap-2">
            <Link
              to="/pendaftaran"
              className="inline-flex items-center gap-1.5 rounded-full bg-hero-cta px-3 py-2 text-[11px] font-semibold text-white shadow-lg transition-colors hover:bg-hero-cta-hover sm:px-5 sm:py-2.5 sm:text-sm"
            >
              Mulai Pendaftaran <ArrowRight className="size-3.5" />
            </Link>
            <span className={`hidden items-center gap-2 text-xs font-semibold text-white sm:flex ${SHADOW_KUAT}`}>
              <span className={`size-2 rounded-full ${buka ? "bg-hero-accent" : "bg-white/60"}`} />
              {buka ? "Dibuka" : "Belum dibuka"}
            </span>
          </div>
        </article>

        <article className="relative flex min-w-0 flex-col items-center justify-end px-3 pb-5 text-center sm:px-6 md:px-10 md:pb-7">
          <span className="absolute right-2 top-2 inline-flex items-center gap-1 rounded-full bg-hero-accent px-2 py-1 text-[9px] font-bold text-hero-ink shadow-lg sm:right-4 sm:top-3 sm:px-3 sm:text-[10px]">
            <Check className="size-3" /> Pilihan terbaik
          </span>
          <h2 className={`text-xl font-extrabold leading-none text-white sm:text-3xl md:text-4xl lg:text-5xl ${SHADOW_JUDUL}`}>
            SPMB {academicYear || "2026/2027"}
          </h2>
          <p className={`mt-1 text-[9px] font-bold uppercase tracking-wide text-hero-accent sm:text-xs ${SHADOW_KUAT}`}>
            Penerimaan Murid Baru
          </p>
          <Link
            to="/pendaftaran"
            className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-hero-cta px-4 py-2 text-[11px] font-bold text-white shadow-lg transition-colors hover:bg-hero-cta-hover sm:px-7 sm:py-2.5 sm:text-sm"
          >
            Daftar Sekarang <ArrowRight className="size-3.5" />
          </Link>
        </article>
      </div>
    </section>
  );
}
