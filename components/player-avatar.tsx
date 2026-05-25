"use client";

import { useEffect, useState } from "react";
import type { TeamId } from "@/lib/data";

type Props = {
  slug: string;
  name: string;
  /** Which side they're on — drives the placeholder tint so the two teams read apart. */
  team: TeamId;
  /** "lg" = roster card (84px), "sm" = scoreboard row (32px) */
  size?: "lg" | "sm";
  highlight?: boolean;
  /** Unfilled roster spot — renders a muted "?" disc instead of a player. */
  placeholder?: boolean;
};

/* One tint per team so the 6v6 split reads at a glance: the house emerald for
   Team Nate, a contrasting clay for Team Matt. Both stay dark/saturated enough
   to keep the gold initials legible. Captains get the gold ring via `highlight`. */
const TEAM_TINT: Record<TeamId, [string, string]> = {
  nate: ["#1d6b4c", "#0c3b2a"], // house emerald
  matt: ["#b8503a", "#4a1c14"], // clay
};

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
  team,
  size = "lg",
  highlight = false,
  placeholder = false,
}: Props) {
  const [photoSrc, setPhotoSrc] = useState<string | null>(null);

  useEffect(() => {
    if (placeholder) {
      setPhotoSrc(null);
      return;
    }
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
  }, [slug, placeholder]);

  const [light, dark] = TEAM_TINT[team];

  return (
    <div
      className={`pavatar-disc pavatar-disc-${size}${highlight ? " is-captain" : ""}${
        placeholder ? " is-tbd" : ""
      }`}
      style={
        placeholder
          ? undefined
          : { background: `radial-gradient(circle at 38% 32%, ${light}, ${dark})` }
      }
      aria-hidden="true"
    >
      {placeholder ? (
        <span className="pavatar-initials">?</span>
      ) : photoSrc ? (
        /* eslint-disable-next-line @next/next/no-img-element */
        <img src={photoSrc} alt="" />
      ) : (
        <span className="pavatar-initials">{initials(name)}</span>
      )}
    </div>
  );
}
