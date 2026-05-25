"use client";

import { useEffect, useState } from "react";
import {
  BookOpen,
  CalendarDays,
  Coins,
  Flag,
  ListChecks,
  MessageSquareQuote,
  Trophy,
  Users,
  type LucideIcon,
} from "lucide-react";

type Item = { id: string; label: string; Icon: LucideIcon };

const ITEMS: Item[] = [
  { id: "schedule", label: "Plan", Icon: CalendarDays },
  { id: "courses", label: "Courses", Icon: Flag },
  { id: "roster", label: "Roster", Icon: Users },
  { id: "caddy", label: "Caddy", Icon: ListChecks },
  { id: "bets", label: "Debate", Icon: Coins },
  { id: "score", label: "Score", Icon: Trophy },
  { id: "quotes", label: "Quotes", Icon: MessageSquareQuote },
  { id: "yearbook", label: "Lookbook", Icon: BookOpen },
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
      {ITEMS.map(({ id, label, Icon }) => (
        <button
          key={id}
          type="button"
          className={activeId === id ? "active" : ""}
          onClick={() => go(id)}
        >
          <Icon aria-hidden="true" strokeWidth={1.9} />
          <span>{label}</span>
        </button>
      ))}
    </nav>
  );
}
