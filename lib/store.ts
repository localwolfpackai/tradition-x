import { promises as fs } from "node:fs";
import path from "node:path";

/**
 * Minimal shared-state store for the Tradition XI app.
 *
 * Persists a single JSON blob to disk. In Vercel functions /tmp is writeable
 * and persists for the lifetime of the warm instance, which is plenty for a
 * 14-man weekend group. For a more durable backing, swap STATE_FILE for
 * Vercel KV / Upstash Redis without changing the rest of the codebase.
 */

const STATE_FILE = process.env.VERCEL
  ? "/tmp/tradition-xi-state.json"
  : path.join(process.cwd(), ".data", "state.json");

export type CaddyVote = "fox" | "duff";

export type Quote = {
  id: string;
  text: string;
  by: string;
  ts: number;
};

export type Scores = Record<string, Record<string, number>>;
// { roundIndex: { playerNum: score } }  e.g. { "0": { "1": 78, "2": 74 } }

export type State = {
  votes: Record<string, CaddyVote>; // deviceId -> choice
  scores: Scores;
  quotes: Quote[];
};

const SEED: State = {
  votes: { seed_fox_1: "fox", seed_fox_2: "fox", seed_fox_3: "fox", seed_duff_1: "duff", seed_duff_2: "duff" },
  scores: {},
  quotes: [
    {
      id: "seed-1",
      text: "I didn't come 1,500 miles to lay up.",
      by: "Wade",
      ts: Date.now() - 1000 * 60 * 60 * 24,
    },
  ],
};

let memCache: State | null = null;
let writeLock: Promise<void> = Promise.resolve();

async function ensureDir(file: string) {
  await fs.mkdir(path.dirname(file), { recursive: true });
}

async function readFromDisk(): Promise<State> {
  try {
    const raw = await fs.readFile(STATE_FILE, "utf8");
    return { ...SEED, ...JSON.parse(raw) };
  } catch {
    return structuredClone(SEED);
  }
}

async function writeToDisk(s: State): Promise<void> {
  await ensureDir(STATE_FILE);
  await fs.writeFile(STATE_FILE, JSON.stringify(s));
}

export async function getState(): Promise<State> {
  if (!memCache) memCache = await readFromDisk();
  return memCache;
}

export async function mutateState(fn: (s: State) => void | Promise<void>): Promise<State> {
  // Serialize writes so concurrent route handlers don't clobber each other.
  let release: () => void = () => {};
  const next = new Promise<void>((res) => (release = res));
  const prev = writeLock;
  writeLock = next;
  await prev;
  try {
    const s = await getState();
    await fn(s);
    await writeToDisk(s);
    return s;
  } finally {
    release();
  }
}

/* ===== TALLIES ===== */

export function tallyVotes(votes: State["votes"]): { fox: number; duff: number; total: number } {
  let fox = 0;
  let duff = 0;
  for (const v of Object.values(votes)) {
    if (v === "fox") fox++;
    else if (v === "duff") duff++;
  }
  return { fox, duff, total: fox + duff };
}
