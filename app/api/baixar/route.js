export const dynamic = 'force-dynamic';

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) return new Response("sem id", { status: 400 });

    const invidious = [
      "https://inv.nadeko.net",
      "https://invidious.privacydev.net",
      "https://iv.ggtyler.dev"
    ];

    for (const server of invidious) {
      try {
        const r = await fetch(`${server}/api/v1/videos/${id}`, {
          cache: "no-store",
          signal: AbortSignal.timeout(10000)
        });
        if (!r.ok) continue;
        const data = await r.json();
        const format = data.formatStreams?.find(f => f.type?.includes("mp4")) 
                    || data.adaptiveFormats?.find(f => f.type?.includes("mp4") && f.encoding?.includes("avc"));
        
        if (!format?.url) continue;

        const videoRes = await fetch(format.url, { signal: AbortSignal.timeout(15000) });
        if (!videoRes.ok || !videoRes.body) continue;

        return new Response(videoRes.body, {
          headers: {
            "Content-Type": "video/mp4",
            "Content-Disposition": `attachment; filename="corte-${id}.mp4"`,
          },
        });
      } catch(e){ continue; }
    }

    return new Response(JSON.stringify({ error: "youtube bloqueou temporariamente" }), { status: 500 });
  } catch (e) {
    return new Response(JSON.stringify({ error: e.message }), { status: 500 });
  }
}
