import { useEffect, useRef, useState } from "react";
import heroHigh from "@/assets/hero-640.mp4.asset.json";
import heroLow from "@/assets/hero-426.mp4.asset.json";
import heroPoster from "@/assets/hero-poster.jpg.asset.json";

type Props = { className?: string };

const LOOPS = 3;
const FADE_MS = 600;

type NetworkInfo = { effectiveType?: string; saveData?: boolean };

function pickSource(): string | null {
  if (typeof navigator === "undefined") return heroHigh.url;
  const conn = (navigator as Navigator & { connection?: NetworkInfo }).connection;
  if (conn?.saveData) return null;
  const type = conn?.effectiveType ?? "4g";
  if (type === "slow-2g" || type === "2g") return null;
  if (type === "3g") return heroLow.url;
  return heroHigh.url;
}

/**
 * Latar hero: video diputar tiga kali dengan transisi fade antar putaran,
 * lalu berhenti pada gambar cadangan. Resolusi menyesuaikan kondisi jaringan;
 * jaringan lambat / hemat data / prefers-reduced-motion hanya memakai gambar.
 */
export default function HeroVideoBg({ className }: Props) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [src, setSrc] = useState<string | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    setSrc(pickSource());
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || !src) return;

    let loops = 0;
    let timer: ReturnType<typeof setTimeout> | undefined;

    const onPlaying = () => setVisible(true);

    const onEnded = () => {
      loops += 1;
      setVisible(false);
      if (loops >= LOOPS) return;
      timer = setTimeout(() => {
        video.currentTime = 0;
        void video.play().catch(() => {});
      }, FADE_MS);
    };

    video.addEventListener("playing", onPlaying);
    video.addEventListener("ended", onEnded);
    void video.play().catch(() => {});

    return () => {
      if (timer) clearTimeout(timer);
      video.removeEventListener("playing", onPlaying);
      video.removeEventListener("ended", onEnded);
    };
  }, [src]);

  return (
    <div className={className} aria-hidden="true">
      <img src={heroPoster.url} alt="" className="absolute inset-0 size-full object-cover" />
      {src && (
        <video
          ref={videoRef}
          src={src}
          poster={heroPoster.url}
          muted
          playsInline
          preload="auto"
          className="absolute inset-0 size-full object-cover transition-opacity ease-in-out"
          style={{ opacity: visible ? 1 : 0, transitionDuration: `${FADE_MS}ms` }}
        />
      )}
    </div>
  );
}
