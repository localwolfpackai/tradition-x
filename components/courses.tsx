import { COURSES } from "@/lib/data";
import { renderRich } from "@/lib/rich-text";

export default function Courses() {
  return (
    <section id="courses" className="sec">
      <div className="sec-inner">
        <div className="sec-head">
          <div className="sec-eyebrow">The Battlefield</div>
          <h2 className="sec-title">
            The <em>Courses</em>
          </h2>
          <p className="sec-sub">Four tracks. Four chances to be a hero or a headline.</p>
        </div>

        <div className="course-grid">
          {COURSES.map((c) => (
          <article key={c.round} className="course in">
            <div className="course-top">
              <div className="round-medal">{c.round}</div>
              <div className="course-id">
                <div className="course-name">{c.name}</div>
                <div className="course-meta">
                  {c.loc} &nbsp;·&nbsp; {c.designer}
                </div>
              </div>
            </div>
            <div className="stat-row">
              {c.stats.map(([k, v]) => (
                <div key={k} className="stat">
                  <div className="k">{k}</div>
                  <div className="v">{v}</div>
                </div>
              ))}
            </div>
            <p className="blurb">{renderRich(c.blurb)}</p>
            <a className="tee-link" href={c.url} target="_blank" rel="noopener noreferrer">
              <span>Tee Sheet &amp; Course Info</span>
              <span className="arr">&rarr;</span>
            </a>
          </article>
        ))}
        </div>
      </div>
    </section>
  );
}
