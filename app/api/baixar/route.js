export async function POST(req) {
  try {
    const { videoId } = await req.json();
    const r = await fetch("https://api.cobalt.tools/api/json", {
      method: "POST",
      headers: { "Accept": "application/json", "Content-Type": "application/json" },
      body: JSON.stringify({ url: `https://www.youtube.com/watch?v=${videoId}`, vQuality: "720" })
    });
    const j = await r.json();
    if (!j.url) return Response.json(j, { status: 500 });
    const video = await fetch(j.url);
    const buf = await video.arrayBuffer();
    return new Response(buf, {
      headers: { "Content-Type": "video/mp4", "Content-Disposition": `attachment; filename="corte.mp4"` }
    });
  } catch (e) {
    return Response.json({ error: e.message }, { status: 500 });
  }
}
