"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { TOASTS } from "@/lib/data";

type Tally = { fox: number; duff: number; total: number };
type Choice = "fox" | "duff";

const STORAGE_DEVICE_ID = "txi_device_id";
const STORAGE_MY_VOTE = "txi_my_vote";

function getDeviceId(): string {
  if (typeof window === "undefined") return "";
  let id = localStorage.getItem(STORAGE_DEVICE_ID);
  if (!id) {
    id = (crypto.randomUUID && crypto.randomUUID()) || `d_${Date.now()}_${Math.random().toString(36).slice(2)}`;
    localStorage.setItem(STORAGE_DEVICE_ID, id);
  }
  return id;
}

function fireConfetti() {
  const layer = document.createElement("div");
  layer.className = "confetti";
  const colors = ["#cda13f", "#15543c", "#f5edd6", "#a6402f", "#1d6b4c"];
  for (let i = 0; i < 28; i++) {
    const bit = document.createElement("i");
    bit.style.left = Math.random() * 100 + "%";
    bit.style.background = colors[i % colors.length];
    bit.style.animationDuration = 1.6 + Math.random() * 1.4 + "s";
    bit.style.animationDelay = Math.random() * 0.25 + "s";
    layer.appendChild(bit);
  }
  document.body.appendChild(layer);
  setTimeout(() => layer.remove(), 3400);
}

const CADDIES: { key: Choice; name: string; sub: string; mono: string; photo: string }[] = [
  { key: "fox", name: "Megan Fox", sub: "The Wildcard", mono: "MF", photo: "/images/caddy-fox.jpg" },
  { key: "duff", name: "Hilary Duff", sub: "The Sweetheart", mono: "HD", photo: "/images/caddy-duff.png" },
];

export default function CaddyPoll() {
  const [tally, setTally] = useState<Tally>({ fox: 0, duff: 0, total: 0 });
  const [vote, setVote] = useState<Choice | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  const [photosOk, setPhotosOk] = useState<Record<Choice, boolean>>({ fox: false, duff: false });
  const toastTimer = useRef<number | null>(null);
  const pollRef = useRef<number | null>(null);

  const refresh = useCallback(async () => {
    try {
      const res = await fetch("/api/caddy-vote", { cache: "no-store" });
      if (res.ok) setTally(await res.json());
    } catch {
      /* offline — keep what we have */
    }
  }, []);

  useEffect(() => {
    setVote((localStorage.getItem(STORAGE_MY_VOTE) as Choice | null) || null);
    refresh();
    pollRef.current = window.setInterval(refresh, 8000);
    return () => {
      if (pollRef.current) clearInterval(pollRef.current);
    };
  }, [refresh]);

  // probe caddy photos with HEAD requests so we know whether to show the placeholder
  useEffect(() => {
    CADDIES.forEach((c) => {
      const img = new window.Image();
      img.onload = () => setPhotosOk((p) => ({ ...p, [c.key]: true }));
      img.onerror = () => setPhotosOk((p) => ({ ...p, [c.key]: false }));
      img.src = c.photo;
    });
  }, []);

  const cast = useCallback(
    async (choice: Choice) => {
      if (vote === choice) return;
      const deviceId = getDeviceId();
      setVote(choice);
      localStorage.setItem(STORAGE_MY_VOTE, choice);
      // optimistic tally bump
      setTally((t) => {
        const next = { ...t };
        if (vote) next[vote] = Math.max(0, next[vote] - 1);
        else next.total++;
        next[choice]++;
        return next;
      });

      const pool = [...TOASTS.general, ...(TOASTS[choice] || [])];
      const msg = pool[Math.floor(Math.random() * pool.length)];
      setToast(msg);
      if (toastTimer.current) clearTimeout(toastTimer.current);
      toastTimer.current = window.setTimeout(() => setToast(null), 2600);
      fireConfetti();

      try {
        const res = await fetch("/api/caddy-vote", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ deviceId, choice }),
        });
        if (res.ok) setTally(await res.json());
      } catch {
        /* server unreachable — keep the optimistic UI */
      }
    },
    [vote],
  );

  const clearVote = useCallback(async () => {
    if (!vote) return;
    const deviceId = getDeviceId();
    const prev = vote;
    setVote(null);
    localStorage.removeItem(STORAGE_MY_VOTE);
    setTally((t) => ({ ...t, [prev]: Math.max(0, t[prev] - 1), total: Math.max(0, t.total - 1) }));
    try {
      const res = await fetch("/api/caddy-vote", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ deviceId, choice: null }),
      });
      if (res.ok) setTally(await res.json());
    } catch {
      /* offline */
    }
  }, [vote]);

  const foxPct = tally.total ? Math.round((tally.fox / tally.total) * 100) : 0;
  const duffPct = tally.total ? 100 - foxPct : 0;
  const lead =
    tally.fox === tally.duff
      ? "Dead even — the squad can't decide"
      : `${tally.fox > tally.duff ? "Fox" : "Duff"} leads the locker room`;

  return (
    <section id="caddy" className="sec">
      <div className="sec-inner sec-inner-narrow">
      <div className="sec-head">
        <div className="sec-eyebrow">Settle It</div>
        <h2 className="sec-title">
          Who&apos;s Your <em>Caddy?</em>
        </h2>
        <p className="sec-sub">Tap to vote, idiots.</p>
        <div className="live-badge">
          <span className="dot" /> Live · 12 phones
        </div>
      </div>

      <div className="caddy-grid">
        {CADDIES.map((c) => {
          const pct = c.key === "fox" ? foxPct : duffPct;
          return (
            <button
              key={c.key}
              type="button"
              className={`caddy ${vote === c.key ? "picked" : ""} ${vote ? "voted" : ""}`}
              onClick={() => cast(c.key)}
              aria-label={`Vote ${c.name}`}
            >
              <div className="caddy-photo">
                {photosOk[c.key] ? (
                  /* eslint-disable-next-line @next/next/no-img-element */
                  <img src={c.photo} alt={c.name} />
                ) : (
                  <div className="photo-fallback">
                    <div className="ph-mono">{c.mono}</div>
                    <div className="ph-name">{c.name}</div>
                    <div className="ph-sub">{c.sub}</div>
                  </div>
                )}
                <div className="gradient" />
                <div className="caddy-name">
                  <div className="cn">
                    {c.name}
                    <small>{c.sub}</small>
                  </div>
                </div>
              </div>
              <div className="caddy-foot">
                <div className="vote-cta">Tap to Vote</div>
                <div className="result">
                  <div className="bar">
                    <i style={{ width: `${pct}%` }} />
                  </div>
                  <div className="pct">{pct}%</div>
                </div>
              </div>
            </button>
          );
        })}
      </div>

      <div className="tally">
        {vote ? (
          <>
            <b>{tally.fox}</b> Fox &nbsp;·&nbsp; <b>{tally.duff}</b> Duff &nbsp;—&nbsp; {lead}
          </>
        ) : (
          "Cast your vote. The boys are watching."
        )}
      </div>
      {vote && (
        <button className="revote" onClick={clearVote} type="button">
          Change My Vote
        </button>
      )}

      {toast && (
        <div className="toast show" role="status" aria-live="polite">
          <div className="tt">Vote Logged</div>
          <div className="tm">{toast}</div>
        </div>
      )}
      </div>
    </section>
  );
}
