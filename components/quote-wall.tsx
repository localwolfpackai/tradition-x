"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { Quote } from "@/lib/store";

const POLL_MS = 10_000;
const MAX_LEN = 220;

function relativeTime(ts: number): string {
  const diff = Math.max(0, Date.now() - ts);
  const sec = Math.floor(diff / 1000);
  if (sec < 45) return "just now";
  const min = Math.floor(sec / 60);
  if (min < 60) return `${min}m ago`;
  const hr = Math.floor(min / 60);
  if (hr < 24) return `${hr}h ago`;
  const day = Math.floor(hr / 24);
  return `${day}d ago`;
}

export default function QuoteWall() {
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [text, setText] = useState("");
  const [by, setBy] = useState("");
  const [sending, setSending] = useState(false);
  const pollRef = useRef<number | null>(null);

  const refresh = useCallback(async () => {
    try {
      const res = await fetch("/api/quotes", { cache: "no-store" });
      if (res.ok) {
        const data = (await res.json()) as { quotes: Quote[] };
        setQuotes(data.quotes || []);
      }
    } catch {
      /* offline — keep what we have */
    }
  }, []);

  useEffect(() => {
    refresh();
    pollRef.current = window.setInterval(refresh, POLL_MS);
    return () => {
      if (pollRef.current) clearInterval(pollRef.current);
    };
  }, [refresh]);

  const handleSubmit = useCallback(
    async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      const trimmed = text.trim();
      if (!trimmed || sending) return;
      setSending(true);
      try {
        const res = await fetch("/api/quotes", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ text: trimmed, by: by.trim() }),
        });
        if (res.ok) {
          const data = (await res.json()) as { quotes: Quote[] };
          setQuotes(data.quotes || []);
          setText("");
        }
      } catch {
        /* offline */
      } finally {
        setSending(false);
      }
    },
    [text, by, sending],
  );

  return (
    <section id="quotes" className="sec">
      <div className="sec-head">
        <div className="sec-eyebrow">Best Lines</div>
        <h2 className="sec-title">
          The <em>Quote</em> Wall
        </h2>
        <p className="sec-sub">Drop the line. Tag yourself. Future you will want this.</p>
      </div>

      <form className="quote-form" onSubmit={handleSubmit}>
        <input
          type="text"
          value={by}
          onChange={(e) => setBy(e.target.value)}
          placeholder="Your name"
          maxLength={40}
          aria-label="Your name"
        />
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Drop a quote…"
          maxLength={MAX_LEN}
          rows={2}
          aria-label="Your quote"
        />
        <button type="submit" disabled={sending || !text.trim()}>
          {sending ? "Posting…" : "Post It"}
        </button>
      </form>

      {quotes.length === 0 ? (
        <div className="quote-empty">No quotes yet. Be the first asshole to break the seal.</div>
      ) : (
        <div>
          {quotes.map((q) => (
            <div key={q.id} className="quote">
              <div className="qt">{q.text}</div>
              <div className="qm">
                — {q.by} <time dateTime={new Date(q.ts).toISOString()}>{relativeTime(q.ts)}</time>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
