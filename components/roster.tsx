import { ROSTER, TEAMS, type Player } from "@/lib/data";
import PlayerAvatar from "./player-avatar";

function PlayerCard({ p, badge }: { p: Player; badge: string | null }) {
  return (
    <div className={`player team-${p.team}${p.captain ? " is-captain" : ""}${p.tbd ? " is-tbd" : ""}`}>
      <div className="pavatar">
        <PlayerAvatar
          slug={p.slug}
          name={p.name}
          team={p.team}
          size="lg"
          highlight={p.captain}
          placeholder={p.tbd}
        />
        {badge !== null && (
          <span className="pavatar-num" aria-hidden="true">
            {badge}
          </span>
        )}
      </div>
      <div className="pinfo">
        <div className="pname">{p.name}</div>
        <div className="plabel">{p.captain ? "★ Captain" : p.tbd ? "Open Slot" : "The Field"}</div>
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
          <p className="sec-sub">Two teams. Six a side. One jacket.</p>
        </div>

        {TEAMS.map((t) => {
          const members = ROSTER.filter((p) => p.team === t.id);
          let n = 0;
          return (
            <div key={t.id} className={`team-block team-${t.id}`}>
              <div className="team-head">
                <span className="team-dot" aria-hidden="true" />
                <span className="team-name">{t.name}</span>
                <span className="team-cap">Captain · {t.captainName}</span>
              </div>
              <div className="roster-grid">
                {members.map((p) => (
                  <PlayerCard
                    key={p.num}
                    p={p}
                    badge={p.captain ? "C" : p.tbd ? null : String(++n)}
                  />
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
