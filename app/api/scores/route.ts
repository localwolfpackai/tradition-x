import { getState, mutateState } from "@/lib/store";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET() {
  const s = await getState();
  return Response.json({ scores: s.scores });
}

export async function POST(req: Request) {
  const body = (await req.json().catch(() => ({}))) as {
    round?: number;
    playerNum?: number;
    score?: number | null;
  };
  const { round, playerNum, score } = body;

  if (typeof round !== "number" || round < 0 || round > 3) {
    return Response.json({ error: "bad round" }, { status: 400 });
  }
  if (typeof playerNum !== "number" || playerNum < 1 || playerNum > 14) {
    return Response.json({ error: "bad player" }, { status: 400 });
  }

  const s = await mutateState((st) => {
    const key = String(round);
    if (!st.scores[key]) st.scores[key] = {};
    if (score === null || score === undefined || Number.isNaN(score)) {
      delete st.scores[key][String(playerNum)];
    } else if (typeof score === "number" && score >= 50 && score <= 200) {
      st.scores[key][String(playerNum)] = Math.round(score);
    } else {
      throw new Error("bad score");
    }
  });

  return Response.json({ scores: s.scores });
}
