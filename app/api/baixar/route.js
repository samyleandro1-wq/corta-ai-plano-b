export const dynamic = 'force-dynamic';

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const videoId = searchParams.get("videoId");
    const querJson = searchParams.get("json") === "1";
    if (!videoId) return new Response(JSON.stringify({ error: "sem videoId" }), { status: 400, headers: { "Content-Type": "application/json" } });

    let mp4Url = null;

    // TENTATIVA 1: Invidious (mais forte na Vercel)
    try {
      const r = await fetch(`https://inv.nadeko.net/api/v1/videos/${videoId}`, { headers: { "User-Agent": "Mozilla/5.0" } });
      if (r.ok) {
        const data = await r.json();
        const stream = data.formatStreams?.find(s => s.container === "mp4" && s.qualityLabel?.includes("720")) || data.formatStreams?.[0] || data.adaptiveFormats?.find(f=>f.type?.includes("video/mp4"));
        if (stream?.url) mp4Url = stream.url;
      }
    } catch(e){}

    // TENTATIVA 2: Piped
    if (!mp4Url) {
      try {
        const r = await fetch(`https://pipedapi.kavin.rocks/streams/${videoId}`);
        if (r.ok) {
          const data = await r.json();
          const v = data.videoStreams?.find(s=>s.mimeType==="video/mp4" && s.quality==="720p") || data.videoStreams?.[0];
          if (v?.url) mp4Url = v.url;
        }
      } catch(e){}
    }

    // TENTATIVA 3: Cobalt
    if (!mp4Url) {
      try {
        const r = await fetch("https://co.wuk.sh/api/json", {
          method: "POST",
          headers: { "Content-Type": "application/json", "Accept": "application/json" },
          body: JSON.stringify({ url: `https://www.youtube.com/watch?v=${videoId}`, vQuality: "720" }),
        });
        const d = await r.json();
        if (d.url) mp4Url = d.url;
      } catch(e){}
    }

    if (!mp4Url) {
      return new Response(JSON.stringify({ error: "API não retornou URL", videoId, dica: "Tente o video jNQXAC9IVRw que sempre funciona" }), { status: 500, headers: { "Content-Type": "application/json" } });
    }

    if (querJson) {
      return new Response(JSON.stringify({ url: mp4Url }), { headers: { "Content-Type": "application/json" } });
    }
    return Response.redirect(mp4Url, 302);

  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500, headers: { "Content-Type": "application/json" } });
  }
}
