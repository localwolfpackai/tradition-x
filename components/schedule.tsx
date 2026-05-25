import { SCHEDULE } from "@/lib/data";

export default function Schedule() {
  return (
    <section id="schedule" className="sec">
      <div className="sec-inner">
        <div className="sec-head">
          <h2 className="sec-title">
            The <em>Plan</em>
          </h2>
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

        <div className="fineprint">
          <div className="fineprint-title">The Fine Print</div>
          <ul>
            <li>Teams are drafted at the end of each Tradition for the next.</li>
            <li>Handicaps finalized the day before — established GHIN or 18Birdies required.</li>
            <li>Captains rotate; everyone serves once before repeats.</li>
            <li>
              Run by Wade. Settle up at{" "}
              <a href="https://venmo.com/u/Wade-Kegley" target="_blank" rel="noopener noreferrer">
                @Wade-Kegley
              </a>
              .
            </li>
          </ul>
        </div>
      </div>
    </section>
  );
}
