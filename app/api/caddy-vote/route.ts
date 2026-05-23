import { getState, mutateState, tallyVotes, type CaddyVote } from "@/lib/store";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET() {
  const s = await getState();
  return Response.json(tallyVotes(s.votes));
}

export async function POST(req: Request) {
  const body = (await req.json().catch(() => ({}))) as { deviceId?: string; choice?: CaddyVote };
  const { deviceId, choice } = body;

  if (!deviceId || (choice !== "fox" && choice !== "duff" && choice !== null)) {
    return Response.json({ error: "bad request" }, { status: 400 });
  }

  const s = await mutateState((st) => {
    if (choice === null) delete st.votes[deviceId];
    else st.votes[deviceId] = choice;
  });

  return Response.json(tallyVotes(s.votes));
}
