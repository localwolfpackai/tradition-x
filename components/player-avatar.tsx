"use client";

import { useEffect, useState } from "react";

type Props = {
  slug: string;
  name: string;
  /** "lg" = roster card (84px), "sm" = scoreboard row (32px) */
  size?: "lg" | "sm";
  highlight?: boolean;
};

function initials(name: string) {
  return name
    .split(/\s+/)
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

export default function PlayerAvatar({ slug, name, size = "lg", highlight = false }: Props) {
  const [hasPhoto, setHasPhoto] = useState(false);
  const src = `/images/players/${slug}.jpg`;

  useEffect(() => {
    const img = new window.Image();
    img.onload = () => setHasPhoto(true);
    img.onerror = () => setHasPhoto(false);
    img.src = src;
  }, [src]);

  return (
    <div
      className={`pavatar-disc pavatar-disc-${size}${highlight ? " is-low" : ""}`}
      aria-hidden="true"
    >
      {hasPhoto ? (
        /* eslint-disable-next-line @next/next/no-img-element */
        <img src={src} alt="" />
      ) : (
        <span className="pavatar-initials">{initials(name)}</span>
      )}
    </div>
  );
}
