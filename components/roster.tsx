import { ROSTER, type Player } from "@/lib/data";
import PlayerAvatar from "./player-avatar";

function PlayerCard({ p }: { p: Player }) {
  return (
    <div className={`player${p.low ? " low" : ""}`}>
      <div className="pavatar">
        <PlayerAvatar slug={p.slug} name={p.name} size="lg" highlight={p.low} />
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
