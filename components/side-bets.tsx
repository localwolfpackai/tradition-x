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
      <div className="sec-inner">
        <div className="sec-head">
          <h2 className="sec-title">
            Up for <em>Debate</em>
          </h2>
        </div>

        <div className="bet-grid">
          {BETS.map((bet) => (
            <div key={bet.name} className="bet">
              <div className="bet-name">{bet.name}</div>
              <div className="bet-buyin">{bet.buyIn}</div>
              <div className="bet-desc">{renderRich(bet.desc)}</div>
            </div>
          ))}
        </div>

        <p className="sec-sub">
          Nothing&apos;s locked till the group agrees. Every call greenlit: <b>${total}</b> a man, per round where it applies.
        </p>
      </div>
    </section>
  );
}
