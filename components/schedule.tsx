import { SCHEDULE } from "@/lib/data";

export default function Schedule() {
  return (
    <section id="schedule" className="sec">
      <div className="sec-inner">
        <div className="sec-head">
          <div className="sec-eyebrow">The Weekend</div>
          <h2 className="sec-title">
            The <em>Plan</em>
          </h2>
          <p className="sec-sub">
            Four days. Four rounds. One trophy. Coffee at sunrise, lies by sundown.
          </p>
        </div>

        <div className="schedule-grid">
          {SCHEDULE.map((day) => (
            <div key={day.name} className="day">
              <div className="day-head">
                <div className="day-name">{day.name}</div>
                <div className="day-date">{day.date}</div>
              </div>
              {day.rows.map((row, i) => (
                <div key={i} className="day-row">
                  <div className="day-time">{row.time}</div>
                  <div className="day-event">
                    <b>{row.title}</b>
                    {row.sub ? <span>{row.sub}</span> : null}
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
