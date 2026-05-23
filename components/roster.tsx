"use client";

import { useEffect, useState } from "react";
import { ROSTER, type Player } from "@/lib/data";

function initials(name: string) {
  return name
    .split(/\s+/)
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

function PlayerCard({ p }: { p: Player }) {
  const [hasPhoto, setHasPhoto] = useState(false);
  const src = `/images/players/${p.slug}.jpg`;

  useEffect(() => {
    const img = new window.Image();
    img.onload = () => setHasPhoto(true);
    img.onerror = () => setHasPhoto(false);
    img.src = src;
  }, [src]);

  return (
    <div className={`player${p.low ? " low" : ""}`}>
      <div className="pavatar">
        <div className="pavatar-disc" aria-hidden="true">
          {hasPhoto ? (
            /* eslint-disable-next-line @next/next/no-img-element */
            <img src={src} alt="" />
          ) : (
            <span className="pavatar-initials">{initials(p.name)}</span>
          )}
        </div>
        <span className="pavatar-num" aria-hidden="true">
          {p.num}
        </span>
      </div>
      <div className="pinfo">
        <div className="pname">{p.name}</div>
        <div className="plabel">{p.low ? "★ Lowest Handicap" : "The Field"}</div>
      </div>
    </div>
  );
}

export default function Roster() {
  return (
    <section id="roster" className="sec">
      <div className="sec-inner">
        <div className="sec-head">
          <div className="sec-eyebrow">The Field</div>
          <h2 className="sec-title">
            The <em>Roster</em>
          </h2>
          <p className="sec-sub">Twelve deep. One trophy. Zero excuses.</p>
        </div>

        <div className="roster-grid">
          {ROSTER.map((p) => (
            <PlayerCard key={p.num} p={p} />
          ))}
        </div>
      </div>
    </section>
  );
}
