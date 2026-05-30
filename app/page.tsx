import BottomNav from "@/components/bottom-nav";
import CaddyPoll from "@/components/caddy-poll";
import Courses from "@/components/courses";
import Hero from "@/components/hero";
import InstallHint from "@/components/install-hint";
import QuoteWall from "@/components/quote-wall";
import Roster from "@/components/roster";
import Schedule from "@/components/schedule";
import Scoreboard from "@/components/scoreboard";
import SideBets from "@/components/side-bets";
import SwRegister from "@/components/sw-register";
import Yearbook from "@/components/yearbook";

export default function Home() {
  return (
    <div className="stage">
      <div className="app">
        <Hero />
        <div className="scallop" />
        <InstallHint />
        <Schedule />
        <div className="scallop" />
        <Courses />
        <div className="scallop up" />
        <Roster />
        <div className="scallop" />
        <CaddyPoll />
        <div className="scallop up-paper" />
        <SideBets />
        <div className="scallop up" />
        <Scoreboard />
        <div className="scallop" />
        <QuoteWall />
        <div className="scallop" />
        <Yearbook />
        <footer className="footer">
          <div className="fm">See you on the first tee</div>
          <div className="fl">Tradition XI · Denver · MMXXVI</div>
        </footer>
      </div>
      <BottomNav />
      <SwRegister />
    </div>
  );
}
