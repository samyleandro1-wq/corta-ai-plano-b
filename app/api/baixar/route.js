export const dynamic = 'force-dynamic';

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) return new Response(JSON.stringify({error:"sem id"}), { status: 400 });

    const PIPED_SERVERS = [
      "https://pipedapi.kavin.rocks",
      "https://api.piped.private.coffee",
      "https://pipedapi.tokhmi.xyz",
      "https://pipedapi.moomoo.me",
      "https://pipedapi.syncpundi.com",
      "https://piped-api.lunar.icu"
    ];

    let data = null;
    let lastError = "";

    for (const base of PIPED_SERVERS) {
      try {
        const r = await fetch(`${base}/streams/${id}`, { cache: "no-store", signal: AbortSignal.timeout(8000) });
        if (r.ok) {
          data = await r.json();
          if (data.videoStreams?.length) break;
        }
      } catch (e) {
        lastError = e.message;
        continue;
      }
    }

    if (!data ||!data.videoStreams) {
      return new Response(JSON.stringify({ error: "piped off", detail: lastError }), {
        status: 500,
        headers: { "Content-Type": "application/json" }
      });
    }

    const stream = data.videoStreams
     .filter(s => s.mimeType.includes("mp4") &&!s.videoOnly)
     .sort((a,b) => (b.height || 0) - (a.height || 0))[0];

    if (!stream) return new Response(JSON.stringify({error:"sem mp4"}), { status: 404 });

    const videoRes = await fetch(stream.url);

    return new Response(videoRes.body, {
      headers: {
        "Content-Type": "video/mp4",
        "Content-Disposition": `attachment; filename="corta-ai-${id}.mp4"`,
      },
    });

  } catch (e) {
    return new Response(JSON.stringify({error:"erro", msg: e.message}), { status: 500 });
  }
}
