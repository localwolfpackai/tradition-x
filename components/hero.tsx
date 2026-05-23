import Crest from "./crest";
import Countdown from "./countdown";
import { TRIP_START_ISO } from "@/lib/data";

export default function Hero() {
  return (
    <section id="top" className="hero">
      <div className="sunburst" aria-hidden="true" />
      <div className="hero-inner">
        <div className="crest-wrap">
          <Crest size={104} />
        </div>

        <div className="eyebrow">The Tradition Continues</div>
        <h1 className="wordmark">
          Tradition
          <span className="num">— XI —</span>
        </h1>

        <div className="rule">
          <span>Colorado Springs</span>
        </div>
        <p className="tag">
          12 Men · 4 Courses · <b>One Tradition</b> · 2026
        </p>

        <Countdown targetIso={TRIP_START_ISO} />

        <div className="scroll-hint">Scroll · The Boys Are Back</div>
      </div>
    </section>
  );
}
