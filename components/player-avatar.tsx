"use client";

import { useEffect, useState } from "react";

type Props = {
  slug: string;
  name: string;
  /** Roster number (1..N) — drives the placeholder tint so each player reads distinct. */
  num: number;
  /** "lg" = roster card (84px), "sm" = scoreboard row (32px) */
  size?: "lg" | "sm";
  highlight?: boolean;
};

/* Deep, distinct tones so the initials discs read as 12 individual avatars
   rather than one identical green. Gold/cream initials sit on the light center,
   so every base stays dark/saturated enough to keep them legible. */
const PALETTE: [string, string][] = [
  ["#1d6b4c", "#0c3b2a"], // emerald
  ["#1b6b6b", "#0a3838"], // teal
  ["#1f5a8a", "#0c2c47"], // ocean
  ["#3b3f8f", "#181a47"], // indigo
  ["#5b3b8f", "#241547"], // violet
  ["#7a2f6b", "#331533"], // plum
  ["#8a2f3f", "#421521"], // wine
  ["#9c4a35", "#4a1f15"], // brick
  ["#4f5a22", "#232c0e"], // olive
  ["#2f6b3b", "#143319"], // forest
  ["#3f5a6b", "#1a2933"], // slate
  ["#9c2f4a", "#471523"], // crimson
];

/* Photo drop-in formats, tried in order. First hit wins; falls back to the tint. */
const EXTS = ["jpg", "png"];

function initials(name: string) {
  return name
    .split(/\s+/)
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

export default function PlayerAvatar({
  slug,
  name,
  num,
  size = "lg",
  highlight = false,
}: Props) {
  const [photoSrc, setPhotoSrc] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    let i = 0;
    const tryNext = () => {
      if (i >= EXTS.length) {
        if (!cancelled) setPhotoSrc(null);
        return;
      }
      const candidate = `/images/players/${slug}.${EXTS[i++]}`;
      const img = new window.Image();
      img.onload = () => {
        if (!cancelled) setPhotoSrc(candidate);
      };
      img.onerror = tryNext;
      img.src = candidate;
    };
    tryNext();
    return () => {
      cancelled = true;
    };
  }, [slug]);

  const [light, dark] = PALETTE[(num - 1) % PALETTE.length];

  return (
    <div
      className={`pavatar-disc pavatar-disc-${size}${highlight ? " is-low" : ""}`}
      style={{ background: `radial-gradient(circle at 38% 32%, ${light}, ${dark})` }}
      aria-hidden="true"
    >
      {photoSrc ? (
        /* eslint-disable-next-line @next/next/no-img-element */
        <img src={photoSrc} alt="" />
      ) : (
        <span className="pavatar-initials">{initials(name)}</span>
      )}
    </div>
  );
}
