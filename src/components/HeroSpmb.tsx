import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowRight, LogIn, Menu, Sparkles, UserPlus, X } from "lucide-react";
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

export function HeroSpmb({ schoolName, academicYear, buka }: Props) {
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  return (
    <section className="relative w-full min-h-screen overflow-hidden bg-hero-ink print:hidden">
      <BoomerangVideoBg src={BG_VIDEO} poster={heroImg} className="absolute inset-0" />
      <div className="absolute inset-0 bg-gradient-to-b from-hero-ink/35 via-hero-ink/20 to-hero-ink/70" />

      {/* Navbar */}
      <div className="relative z-20 flex items-center justify-between gap-4 px-4 py-4 sm:px-6 sm:py-6 md:px-10">
        <Link to="/" className="flex items-center gap-2">
          <img
            src={logoSekolah}
            alt={`Logo ${schoolName}`}
            width={40}
            height={40}
            className="size-10 object-contain drop-shadow"
          />
          <span className="text-base font-bold tracking-tight text-white drop-shadow sm:text-lg">
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

      {/* Hero copy */}
      <div className="relative z-10 px-4 pt-20 sm:px-6 sm:pt-24 md:px-10 md:pt-28">
        <h1
          className="max-w-4xl text-[2rem] font-bold leading-[0.95] text-white drop-shadow-sm sm:text-4xl md:text-5xl lg:text-[4.75rem] xl:text-[5.25rem]"
          style={{ letterSpacing: "-0.035em" }}
        >
          Pendaftaran Murid Baru{" "}
          <span className="text-hero-accent">{academicYear || "tahun ajaran baru"}</span>
        </h1>
        <p className="mt-5 max-w-xl text-base text-white/85 md:text-lg">
          Isi formulir bertahap, unggah dokumen, pantau hasil seleksi, sampai cetak kartu peserta —
          semua dari rumah.
        </p>
      </div>

      {/* Bottom-left block */}
      <div className="relative z-10 mt-16 px-4 pb-28 sm:px-6 md:px-10 lg:absolute lg:bottom-10 lg:left-10 lg:mt-0 lg:max-w-md lg:px-0 lg:pb-0">
        <div className="flex items-center gap-2">
          <Sparkles className="size-4 text-hero-accent" />
          <span className="text-sm font-semibold uppercase tracking-wide text-white">
            {schoolName}
          </span>
        </div>
        <p className="mt-3 text-sm leading-relaxed text-white/80">
          Satu akun untuk seluruh proses pendaftaran: data diri, berkas, seleksi, hingga daftar
          ulang — tanpa perlu bolak-balik ke sekolah.
        </p>
        <div className="mt-5 flex flex-wrap gap-3">
          <Link
            to="/pendaftaran"
            className="inline-flex items-center gap-2 rounded-full bg-hero-cta px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-hero-cta-hover"
          >
            Mulai Pendaftaran <ArrowRight className="size-4" />
          </Link>
          <Link
            to="/alur"
            className="inline-flex items-center gap-2 rounded-full border border-white/60 bg-white/70 px-5 py-3 text-sm font-semibold text-hero-ink backdrop-blur-md transition-colors hover:bg-white/90"
          >
            Lihat Alur
          </Link>
        </div>
      </div>

      {/* Bottom-right status */}
      <div className="absolute bottom-8 right-6 z-10 flex items-center gap-2 rounded-full border border-white/40 bg-white/20 px-4 py-2 backdrop-blur-md md:bottom-10 md:right-10">
        <span
          className={`size-2 rounded-full ${buka ? "bg-hero-accent" : "bg-white/60"}`}
          aria-hidden="true"
        />
        <span className="text-xs font-semibold text-white">
          {buka ? "Pendaftaran dibuka" : "Pendaftaran belum dibuka"}
        </span>
      </div>
    </section>
  );
}
