import { getState, mutateState, type Quote } from "@/lib/store";
import { randomUUID } from "node:crypto";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const MAX_LEN = 220;
const MAX_QUOTES = 80;

export async function GET() {
  const s = await getState();
  const sorted = [...s.quotes].sort((a, b) => b.ts - a.ts);
  return Response.json({ quotes: sorted });
}

export async function POST(req: Request) {
  const body = (await req.json().catch(() => ({}))) as { text?: string; by?: string };
  const text = (body.text || "").trim();
  const by = (body.by || "Anon").trim().slice(0, 40) || "Anon";

  if (!text || text.length > MAX_LEN) {
    return Response.json({ error: "bad text" }, { status: 400 });
  }

  const quote: Quote = { id: randomUUID(), text, by, ts: Date.now() };

  const s = await mutateState((st) => {
    st.quotes.push(quote);
    if (st.quotes.length > MAX_QUOTES) {
      st.quotes = st.quotes.slice(-MAX_QUOTES);
    }
  });

  const sorted = [...s.quotes].sort((a, b) => b.ts - a.ts);
  return Response.json({ quotes: sorted });
}

// Delete a single quote by id. Used to clear test quotes, regrettable late-night
// posts, or anything the group decides shouldn't be on the wall. No auth — this
// is a 12-friend app, friction would be more annoying than the rare misuse.
//   curl -X DELETE 'https://tradition-xi.vercel.app/api/quotes?id=<uuid>'
export async function DELETE(req: Request) {
  const id = new URL(req.url).searchParams.get("id");
  if (!id) {
    return Response.json({ error: "missing id" }, { status: 400 });
  }

  const s = await mutateState((st) => {
    st.quotes = st.quotes.filter((q) => q.id !== id);
  });

  const sorted = [...s.quotes].sort((a, b) => b.ts - a.ts);
  return Response.json({ quotes: sorted });
}
