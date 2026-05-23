import { ROSTER } from "@/lib/data";

export default function Roster() {
  const vip = ROSTER.find((p) => p.vip);
  const rest = ROSTER.filter((p) => !p.vip);

  return (
    <section id="roster" className="sec">
      <div className="sec-head">
        <div className="sec-eyebrow">The Field</div>
        <h2 className="sec-title">
          The <em>Roster</em>
        </h2>
        <p className="sec-sub">Fourteen deep. One host. One sandbagger. Twelve hopefuls.</p>
      </div>

      {vip && (
        <div className="vip">
          <div className="num-badge">{vip.num}</div>
          <div className="who">
            <span className="vip-tag">★ VIP · Host</span>
            <div className="name">{vip.name}</div>
            <div className="role">{vip.role || "Host"}</div>
          </div>
        </div>
      )}

      <div className="roster-grid">
        {rest.map((p) => (
          <div key={p.num} className={`player${p.low ? " low" : ""}`}>
            <div className="pn">{p.num}</div>
            <div className="pinfo">
              <div className="pname">{p.name}</div>
              <div className="plabel">{p.low ? "★ Lowest Handicap" : "The Field"}</div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
