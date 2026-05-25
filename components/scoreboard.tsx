"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { COURSES, ROSTER } from "@/lib/data";
import PlayerAvatar from "./player-avatar";

type Scores = Record<string, Record<string, number>>;

const POLL_MS = 10_000;
const ROUND_COUNT = 4;

function aggregateFor(playerNum: number, scores: Scores): number {
  let total = 0;
  let any = false;
  for (let r = 0; r < ROUND_COUNT; r++) {
    const s = scores[String(r)]?.[String(playerNum)];
    if (typeof s === "number" && !Number.isNaN(s)) {
      total += s;
      any = true;
    }
  }
  return any ? total : Number.NaN;
}

export default function Scoreboard() {
  const [roundIdx, setRoundIdx] = useState(0);
  const [scores, setScores] = useState<Scores>({});
  const pollRef = useRef<number | null>(null);

  const refresh = useCallback(async () => {
    try {
      const res = await fetch("/api/scores", { cache: "no-store" });
      if (res.ok) {
        const data = (await res.json()) as { scores: Scores };
        setScores(data.scores || {});
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

  const submitScore = useCallback(
    async (playerNum: number, raw: string) => {
      const trimmed = raw.trim();
      const parsed = trimmed === "" ? null : Number(trimmed);
      const value =
        parsed === null || Number.isNaN(parsed) ? null : Math.round(parsed);

      // Optimistic update
      setScores((prev) => {
        const key = String(roundIdx);
        const nextRound = { ...(prev[key] || {}) };
        if (value === null) {
          delete nextRound[String(playerNum)];
        } else {
          nextRound[String(playerNum)] = value;
        }
        return { ...prev, [key]: nextRound };
      });

      try {
        const res = await fetch("/api/scores", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ round: roundIdx, playerNum, score: value }),
        });
        if (res.ok) {
          const data = (await res.json()) as { scores: Scores };
          setScores(data.scores || {});
        }
      } catch {
        /* offline — keep optimistic UI */
      }
    },
    [roundIdx],
  );

  // Sorted roster by aggregate ascending, NaN players at the bottom.
  const sortedRoster = useMemo(() => {
    return [...ROSTER].filter((p) => !p.tbd).sort((a, b) => {
      const aa = aggregateFor(a.num, scores);
      const bb = aggregateFor(b.num, scores);
      const aNaN = Number.isNaN(aa);
      const bNaN = Number.isNaN(bb);
      if (aNaN && bNaN) return a.num - b.num;
      if (aNaN) return 1;
      if (bNaN) return -1;
      return aa - bb;
    });
  }, [scores]);

  // Find leader info for the footer.
  const { hasAny, latestRoundWithData, leaderName, leaderGap } = useMemo(() => {
    let latest = -1;
    for (let r = 0; r < ROUND_COUNT; r++) {
      if (scores[String(r)] && Object.keys(scores[String(r)]).length > 0) {
        latest = r;
      }
    }
    if (latest < 0) {
      return {
        hasAny: false,
        latestRoundWithData: 0,
        leaderName: "",
        leaderGap: 0,
      };
    }
    // Leader = lowest aggregate among players with any score.
    let best = Number.POSITIVE_INFINITY;
    let bestName = "";
    let second = Number.POSITIVE_INFINITY;
    for (const p of ROSTER) {
      const agg = aggregateFor(p.num, scores);
      if (Number.isNaN(agg)) continue;
      if (agg < best) {
        second = best;
        best = agg;
        bestName = p.name;
      } else if (agg < second) {
        second = agg;
      }
    }
    const gap = Number.isFinite(second) ? second - best : 0;
    return {
      hasAny: true,
      latestRoundWithData: latest,
      leaderName: bestName,
      leaderGap: gap,
    };
  }, [scores]);

  const leaderPlayerNum = useMemo(() => {
    if (!hasAny) return null;
    let best = Number.POSITIVE_INFINITY;
    let num: number | null = null;
    for (const p of ROSTER) {
      const agg = aggregateFor(p.num, scores);
      if (Number.isNaN(agg)) continue;
      if (agg < best) {
        best = agg;
        num = p.num;
      }
    }
    return num;
  }, [hasAny, scores]);

  return (
    <section id="score" className="sec">
      <div className="sec-inner">
      <div className="sec-head">
        <h2 className="sec-title">
          <em>Live</em> Scoreboard
        </h2>
      </div>

      <div className="score-tabs" role="tablist">
        {COURSES.map((c, i) => (
          <button
            key={c.round}
            type="button"
            role="tab"
            aria-selected={roundIdx === i}
            className={`score-tab${roundIdx === i ? " active" : ""}`}
            onClick={() => setRoundIdx(i)}
          >
            Round {i + 1}
          </button>
        ))}
      </div>

      <div className="score-list">
        {sortedRoster.map((p, idx) => {
          const current = scores[String(roundIdx)]?.[String(p.num)];
          const inputValue =
            typeof current === "number" && !Number.isNaN(current) ? String(current) : "";
          const isLeader = leaderPlayerNum === p.num;
          return (
            <div key={p.num} className={`score-row${isLeader ? " leader" : ""}`}>
              <div className="rank">{idx + 1}</div>
              <div className="who">
                <PlayerAvatar slug={p.slug} name={p.name} team={p.team} size="sm" highlight={p.captain} />
                <span className="who-name">{p.name}</span>
              </div>
              <input
                type="number"
                inputMode="numeric"
                defaultValue={inputValue}
                key={`${roundIdx}-${p.num}-${inputValue}`}
                placeholder="--"
                onBlur={(e) => submitScore(p.num, e.currentTarget.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.currentTarget.blur();
                  }
                }}
              />
            </div>
          );
        })}
      </div>

      <div className="score-foot">
        {hasAny
          ? `Aggregate after Round ${latestRoundWithData + 1} · Leader: ${leaderName} (-${leaderGap})`
          : "Awaiting tee time."}
      </div>

      <div className="awards">
        <div className="awards-title">The Hardware</div>
        <ul className="awards-list">
          <li>
            <b>Team Win</b>
            <span>Awarded to the winning captain</span>
          </li>
          <li>
            <b>Lowest Net</b>
            <span>Best handicapped performance</span>
          </li>
          <li>
            <b>Lowest Gross</b>
            <span>No handicaps included</span>
          </li>
          <li>
            <b>MVP</b>
            <span>Voted on by the field</span>
          </li>
        </ul>
      </div>
      </div>
    </section>
  );
}
