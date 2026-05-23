"use client";

import { useEffect, useState } from "react";

type CountdownProps = { targetIso: string };

function diff(target: number) {
  const ms = Math.max(0, target - Date.now());
  const days = Math.floor(ms / 86_400_000);
  const hours = Math.floor((ms % 86_400_000) / 3_600_000);
  const mins = Math.floor((ms % 3_600_000) / 60_000);
  const secs = Math.floor((ms % 60_000) / 1000);
  return { days, hours, mins, secs };
}

export default function Countdown({ targetIso }: CountdownProps) {
  const [target] = useState(() => new Date(targetIso).getTime());
  // Start at zeros so SSR and first client render match — then tick.
  const [t, setT] = useState({ days: 0, hours: 0, mins: 0, secs: 0 });

  useEffect(() => {
    setT(diff(target));
    const id = setInterval(() => setT(diff(target)), 1000);
    return () => clearInterval(id);
  }, [target]);

  return (
    <div className="countdown" aria-label="Time until Tradition XI">
      <div className="cd">
        <div className="cd-v">{String(t.days).padStart(2, "0")}</div>
        <div className="cd-k">Days</div>
      </div>
      <div className="cd">
        <div className="cd-v">{String(t.hours).padStart(2, "0")}</div>
        <div className="cd-k">Hrs</div>
      </div>
      <div className="cd">
        <div className="cd-v">{String(t.mins).padStart(2, "0")}</div>
        <div className="cd-k">Min</div>
      </div>
      <div className="cd">
        <div className="cd-v">{String(t.secs).padStart(2, "0")}</div>
        <div className="cd-k">Sec</div>
      </div>
    </div>
  );
}
