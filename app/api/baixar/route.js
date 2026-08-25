export async function POST(req) {
  try {
    const { videoId } = await req.json();

    // 1. Pega o link real
    const r = await fetch("https://api.cobalt.tools/api/json", {
      method: "POST",
      headers: { "Content-Type": "application/json", "Accept": "application/json" },
      body: JSON.stringify({
        url: `https://www.youtube.com/watch?v=${videoId}`,
        vQuality: "720",
        vCodec: "h264"
      })
    });
    const j = await r.json();
    if (!j.url) return Response.json({ erro: j }, { status: 500 });

    // 2. Baixa de verdade e devolve como stream (não corrompe mais)
    const video = await fetch(j.url);
    
    return new Response(video.body, {
      headers: {
        "Content-Type": "video/mp4",
        "Content-Disposition": `attachment; filename="corte.mp4"`,
      }
    });

  } catch (e) {
    return Response.json({ erro: e.message }, { status: 500 });
  }
}
