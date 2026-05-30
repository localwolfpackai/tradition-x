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

        <div className="eyebrow">2026</div>
        <h1 className="wordmark">
          Tradition
          <span className="num">— XI —</span>
        </h1>

        <div className="rule">
          <span>Denver</span>
        </div>

        <Countdown targetIso={TRIP_START_ISO} />

        <div className="scroll-hint">Scroll · The Boys Are Back</div>
      </div>
    </section>
  );
}
