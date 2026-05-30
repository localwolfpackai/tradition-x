import { promises as fs } from "node:fs";
import path from "node:path";
import { Redis } from "@upstash/redis";

/**
 * Shared-state store for the Tradition XI app.
 *
 * Backing storage is auto-detected:
 *   1. If Upstash Redis env vars are present, state is persisted there.
 *      - UPSTASH_REDIS_REST_URL + UPSTASH_REDIS_REST_TOKEN (direct Upstash), or
 *      - KV_REST_API_URL + KV_REST_API_TOKEN (Vercel KV provides these).
 *   2. Otherwise, falls back to a single JSON blob on disk.
 *      - Local dev:   .data/state.json
 *      - On Vercel:   /tmp/tradition-xi-state.json (per warm instance — NOT durable;
 *        every cold start wipes the file, so quotes/scores/votes disappear).
 *
 * To make production durable: create a free Upstash Redis at upstash.com, add the
 * two REST env vars to the Vercel project, and redeploy. No code change required —
 * the Redis branch lights up automatically once the vars are present.
 */

const STATE_KEY = "tradition-xi:state";

const STATE_FILE = process.env.VERCEL
  ? "/tmp/tradition-xi-state.json"
  : path.join(process.cwd(), ".data", "state.json");

const REDIS_URL =
  process.env.UPSTASH_REDIS_REST_URL || process.env.KV_REST_API_URL;
const REDIS_TOKEN =
  process.env.UPSTASH_REDIS_REST_TOKEN || process.env.KV_REST_API_TOKEN;

const redis: Redis | null =
  REDIS_URL && REDIS_TOKEN
    ? new Redis({ url: REDIS_URL, token: REDIS_TOKEN })
    : null;

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
      text: "Ya, let's fly to another state to play someone else's ball.",
      by: "Wade",
      ts: Date.now() - 1000 * 60 * 60 * 24,
    },
  ],
};

// In-process cache + write lock — only useful with the /tmp fallback. With Redis
// we always read fresh because other lambda instances can have written between
// calls.
let memCache: State | null = null;
let writeLock: Promise<void> = Promise.resolve();

async function ensureDir(file: string): Promise<void> {
  await fs.mkdir(path.dirname(file), { recursive: true });
}

async function readFromStore(): Promise<State> {
  if (redis) {
    const data = await redis.get<Partial<State>>(STATE_KEY);
    if (!data) return structuredClone(SEED);
    return { ...SEED, ...data };
  }
  try {
    const raw = await fs.readFile(STATE_FILE, "utf8");
    return { ...SEED, ...JSON.parse(raw) };
  } catch {
    return structuredClone(SEED);
  }
}

async function writeToStore(s: State): Promise<void> {
  if (redis) {
    await redis.set(STATE_KEY, s);
    return;
  }
  await ensureDir(STATE_FILE);
  await fs.writeFile(STATE_FILE, JSON.stringify(s));
}

export async function getState(): Promise<State> {
  if (redis) return readFromStore();
  if (!memCache) memCache = await readFromStore();
  return memCache;
}

export async function mutateState(fn: (s: State) => void | Promise<void>): Promise<State> {
  // Serialize writes per-instance. With Redis backing, simultaneous writes from
  // different lambda instances last-write-wins — acceptable for a 12-person
  // group where contention is vanishingly rare.
  let release: () => void = () => {};
  const next = new Promise<void>((res) => (release = res));
  const prev = writeLock;
  writeLock = next;
  await prev;
  try {
    const s = await readFromStore();
    await fn(s);
    await writeToStore(s);
    if (!redis) memCache = s;
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
