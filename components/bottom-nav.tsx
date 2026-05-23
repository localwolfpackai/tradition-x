"use client";

import { useEffect, useState } from "react";

type Item = { id: string; label: string; icon: React.ReactNode };

const ITEMS: Item[] = [
  {
    id: "schedule",
    label: "Plan",
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <rect x="3.5" y="5" width="17" height="15" rx="2.5" />
        <path d="M3.5 9.5h17" />
        <path d="M8 3v4M16 3v4" />
      </svg>
    ),
  },
  {
    id: "courses",
    label: "Courses",
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M6 21V3" />
        <path d="M6 3.6h12l-3.4 3.9L18 11.4H6" />
      </svg>
    ),
  },
  {
    id: "roster",
    label: "Roster",
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <circle cx="9" cy="8.4" r="3.2" />
        <path d="M3.5 19.5c0-3.1 2.5-5.2 5.5-5.2s5.5 2.1 5.5 5.2" />
        <path d="M15.6 6.1a3.2 3.2 0 0 1 0 6.1" />
        <path d="M15.2 14.4c2.8.2 4.9 2.4 4.9 5.1" />
      </svg>
    ),
  },
  {
    id: "caddy",
    label: "Caddy",
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <rect x="6.6" y="7.6" width="8" height="12.8" rx="3.4" />
        <path d="M9 7.6V3M11 7.6V2M13 7.6V3.6" />
        <path d="M14.6 11.6h2.3a1.6 1.6 0 0 1 1.6 1.6v3.5" />
      </svg>
    ),
  },
  {
    id: "bets",
    label: "Bets",
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <circle cx="12" cy="12" r="8.5" />
        <path d="M12 7v10M9 9.5h4a2 2 0 0 1 0 4H9.5a2 2 0 0 0 0 4H15" />
      </svg>
    ),
  },
  {
    id: "score",
    label: "Score",
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <rect x="3.5" y="4" width="17" height="16" rx="2.5" />
        <path d="M7 9h10M7 13h10M7 17h6" />
      </svg>
    ),
  },
  {
    id: "quotes",
    label: "Quotes",
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M7 9.5C7 8 8 7 9.5 7h1A2.5 2.5 0 0 1 13 9.5v.5c0 3-2 4-4 4" />
        <path d="M14 9.5C14 8 15 7 16.5 7h1A2.5 2.5 0 0 1 20 9.5v.5c0 3-2 4-4 4" />
      </svg>
    ),
  },
  {
    id: "yearbook",
    label: "Lookbook",
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <rect x="4" y="3.5" width="16" height="17" rx="2" />
        <path d="M8 3.5v17" />
        <circle cx="14.5" cy="9.5" r="1.2" />
        <path d="M10.5 17l3-3.5 2 2 2.5-3" />
      </svg>
    ),
  },
];

export default function BottomNav() {
  const [activeId, setActiveId] = useState("courses");

  useEffect(() => {
    const ids = ITEMS.map((i) => i.id);
    const sections = ids
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => !!el);
    if (!sections.length) return;

    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActiveId(e.target.id);
        });
      },
      { rootMargin: "-45% 0px -45% 0px" },
    );
    sections.forEach((s) => obs.observe(s));
    return () => obs.disconnect();
  }, []);

  const go = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <nav className="nav" aria-label="Sections">
      {ITEMS.map((it) => (
        <button
          key={it.id}
          type="button"
          className={activeId === it.id ? "active" : ""}
          onClick={() => go(it.id)}
        >
          {it.icon}
          <span>{it.label}</span>
        </button>
      ))}
    </nav>
  );
}
