/**
 * TRADITION XI — STATIC DATA
 * All editable lists in one place. Server-imported into components.
 */

export type Course = {
  round: number;
  name: string;
  loc: string;
  designer: string;
  stats: [string, string][];
  url: string;
  blurb: string;
};

export const COURSES: Course[] = [
  {
    round: 1,
    name: "CommonGround",
    loc: "Aurora, CO",
    designer: "Tom Doak · 2009",
    stats: [
      ["Par", "72"],
      ["Style", "Links"],
      ["Vibe", "Opener"],
    ],
    url: "https://www.commongroundgc.com/",
    blurb:
      "Tom Doak's CommonGround is the kind of course that humbles you <i>politely</i> — an Aurora muni built to feel like a 1920s heirloom. Wide fairways that whisper \"go ahead, swing hard\" right before the native grass eats your Pro V1. <b>We open here. Set the tone, or get told.</b>",
  },
  {
    round: 2,
    name: "Fossil Trace",
    loc: "Golden, CO",
    designer: "Jim Engh · 2003",
    stats: [
      ["Par", "72"],
      ["Elev.", "Foothills"],
      ["Vibe", "Scenic Trap"],
    ],
    url: "https://fossiltrace.com/",
    blurb:
      "Fossil Trace has actual dinosaur tracks on the back nine — fitting, since that's roughly how long ago you last broke 90. Engh carved it out of an old clay quarry and the views will distract you straight into a double. <b>Gorgeous, sneaky, and happy to call your money a souvenir.</b>",
  },
  {
    round: 3,
    name: "Red Hawk Ridge",
    loc: "Castle Rock, CO",
    designer: "Jim Engh · 1999",
    stats: [
      ["Par", "72"],
      ["Yards", "6,942"],
      ["Vibe", "Target Golf"],
    ],
    url: "https://redhawkridge.com/",
    blurb:
      "Engh's other masterpiece, and it does <i>not</i> care about your feelings. Tight, tumbling target golf where \"lay up\" becomes a personality trait by hole four. <b>Play smart, it rewards you. Play hero ball and it mails the wreckage to the group chat.</b>",
  },
  {
    round: 4,
    name: "Bear Dance",
    loc: "Larkspur, CO",
    designer: "Championship Track · 2002",
    stats: [
      ["Par", "72"],
      ["Length", "Longest in CO"],
      ["Vibe", "The Closer"],
    ],
    url: "https://www.beardancegolf.com/",
    blurb:
      "Bear Dance will eat your lunch and post the receipt. The longest course in Colorado, parked at 6,800 feet where every drive thinks it's a hero and every approach comes up short anyway. Rated the state's best public track for a decade-plus — <b>and it knows it. Survive it, the trophy's yours.</b>",
  },
];

export type TeamId = "nate" | "matt";

export type TeamMeta = {
  id: TeamId;
  name: string;
  captainName: string;
};

/* The 6v6 split. Order here drives the order of the team blocks on the roster. */
export const TEAMS: TeamMeta[] = [
  { id: "nate", name: "Team Nate", captainName: "Nate" },
  { id: "matt", name: "Team Matt", captainName: "Matt" },
];

export type Player = {
  num: number;
  name: string;
  slug: string;
  team: TeamId;
  captain?: boolean;
  role?: string;
};

/* Two teams, six a side. Captains lead each block. Drop a photo named after the
   slug into public/images/players/ (jpg or png, e.g. nate.jpg) and the card
   swaps from the team-tinted placeholder to the photo. */
export const ROSTER: Player[] = [
  // Team Nate
  { num: 1, name: "Nate", slug: "nate", team: "nate", captain: true },
  { num: 2, name: "Lupo", slug: "lupo", team: "nate" },
  { num: 3, name: "Kyle", slug: "kyle", team: "nate" },
  { num: 4, name: "Wade", slug: "wade", team: "nate" },
  { num: 5, name: "Steve", slug: "steve", team: "nate" },
  { num: 6, name: "Brian", slug: "brian", team: "nate" },
  // Team Matt
  { num: 7, name: "Matt", slug: "matt", team: "matt", captain: true },
  { num: 8, name: "Josh", slug: "josh", team: "matt" },
  { num: 9, name: "Dan", slug: "dan", team: "matt" },
  { num: 10, name: "Austin", slug: "austin", team: "matt" },
  { num: 11, name: "Bobby", slug: "bobby", team: "matt" },
  { num: 12, name: "Coomes", slug: "coomes", team: "matt" },
];

export const TOASTS = {
  general: [
    "You're a sick pup.",
    "Yeah, you'd tap that.",
    "Bold. Respect the conviction.",
    "Locked in. The boys saw that.",
    "Noted. This goes in the group chat.",
    "Elite taste, you degenerate.",
    "Big swing. We love to see it.",
    "Your wife is getting a phone call.",
  ],
  fox: [
    "Megan Fox. Predictable. Correct.",
    "The Transformers era never let you go, huh.",
    "A man who knows what he wants. Gross, but bold.",
  ],
  duff: [
    "Hilary Duff? A man of culture and chaos.",
    "Lizzie McGuire core. We see the whole you.",
    "Wholesome on the outside. We know better.",
  ],
};

/* ===== SCHEDULE — Tradition XI weekend itinerary ===== */
export type DayPlan = {
  name: string;
  date: string;
  rows: { time: string; title: string; sub?: string }[];
};

export const SCHEDULE: DayPlan[] = [
  {
    name: "Thursday",
    date: "Aug 13 · Arrival",
    rows: [
      { time: "All day", title: "Fly into DEN", sub: "Convoy SUVs → Colorado Springs" },
      { time: "5:30 PM", title: "Check-in & beers on the deck", sub: "House HQ" },
      { time: "7:30 PM", title: "Opening dinner", sub: "Wade's call — steakhouse downtown" },
      { time: "10:00 PM", title: "Cigars + handicaps roast", sub: "Mandatory attendance" },
    ],
  },
  {
    name: "Friday",
    date: "Aug 14 · Round 1",
    rows: [
      { time: "6:30 AM", title: "Coffee + range", sub: "Wake the legs up" },
      { time: "8:00 AM", title: "Tee time — CommonGround", sub: "Aurora · Tom Doak links" },
      { time: "2:00 PM", title: "Lunch at the turn-house", sub: "Beers · scorecards in" },
      { time: "8:00 PM", title: "Group dinner + skins payout", sub: "Day 1 leader buys a round" },
    ],
  },
  {
    name: "Saturday",
    date: "Aug 15 · Double Header",
    rows: [
      { time: "7:00 AM", title: "Tee time — Fossil Trace", sub: "Golden · dinosaur tracks back-9" },
      { time: "1:30 PM", title: "Tee time — Red Hawk Ridge", sub: "Castle Rock · the gauntlet" },
      { time: "7:30 PM", title: "Steaks on the grill", sub: "House HQ · Hilary or Megan?" },
      { time: "Late", title: "Caddy vote results", sub: "Toasts. Roasts. Receipts." },
    ],
  },
  {
    name: "Sunday",
    date: "Aug 16 · The Closer",
    rows: [
      { time: "7:30 AM", title: "Tee time — Bear Dance", sub: "Larkspur · longest in CO" },
      { time: "2:00 PM", title: "Trophy ceremony", sub: "Lowest aggregate wins the jacket" },
      { time: "4:00 PM", title: "Wrap-up + travel", sub: "Hugs. Lies. Next year already booked." },
    ],
  },
];

/* ===== SIDE BETS ===== */
export type Bet = {
  name: string;
  buyIn: string;
  desc: string;
};

export const BETS: Bet[] = [
  {
    name: "Skins (each round)",
    buyIn: "$20",
    desc:
      "Lowest score on a hole wins the skin. Ties carry over. <b>Hot hand pays.</b> Settled at the 19th hole, each round.",
  },
  {
    name: "Closest to the Pin",
    buyIn: "$10",
    desc:
      "One par-3 per round, called by the commissioner. <b>Marker stays.</b> Bring proof or it didn't happen.",
  },
  {
    name: "Longest Drive",
    buyIn: "$10",
    desc:
      "One par-5 per round. In the fairway only — rough doesn't count and we will fact-check.",
  },
  {
    name: "Snake / Wolf",
    buyIn: "$5",
    desc:
      "Three-putt anywhere = you hold the snake. Whoever's holding it at the end of the round buys the next round.",
  },
  {
    name: "Aggregate (4-Round)",
    buyIn: "$50",
    desc:
      "Lowest total across all four rounds takes the jacket. <b>Sandbagging will be loudly discussed.</b>",
  },
];

/* ===== Trip start (for the countdown) — Aug 13, 2026 ===== */
export const TRIP_START_ISO = "2026-08-13T08:00:00-06:00";
