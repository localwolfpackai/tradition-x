import { BETS } from "@/lib/data";
import { renderRich } from "@/lib/rich-text";

// NOTE: buyIn strings are formatted like "$20" / "$5" — strip the $ to total them.
function parseBuyIn(s: string): number {
  const n = Number(s.replace(/[^\d.]/g, ""));
  return Number.isFinite(n) ? n : 0;
}

export default function SideBets() {
  const total = BETS.reduce((sum, b) => sum + parseBuyIn(b.buyIn), 0);

  return (
    <section id="bets" className="sec">
      <div className="sec-head">
        <div className="sec-eyebrow">Skin In The Game</div>
        <h2 className="sec-title">
          <em>Side</em> Bets
        </h2>
        <p className="sec-sub">
          Five ways to leave Colorado with someone else&apos;s money. Bring cash. Bring excuses.
        </p>
      </div>

      <div>
        {BETS.map((bet) => (
          <div key={bet.name} className="bet">
            <div className="bet-name">{bet.name}</div>
            <div className="bet-buyin">{bet.buyIn}</div>
            <div className="bet-desc">{renderRich(bet.desc)}</div>
          </div>
        ))}
      </div>

      <p className="sec-sub">
        Total buy-in if you&apos;re all-in on every bet: <b>${total}</b> per man, per round where applicable.
      </p>
    </section>
  );
}
