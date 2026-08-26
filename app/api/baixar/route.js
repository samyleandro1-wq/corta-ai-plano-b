export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const videoId = searchParams.get("videoId");
    if (!videoId) return new Response("sem videoId", { status: 400 });

    const instancias = [
      "https://invidious.nerdvpn.de",
      "https://inv.tux.pizza",
      "https://yewtu.be",
      "https://invidious.flokinet.to"
    ];

    let data = null;
    for (const base of instancias) {
      try {
        const r = await fetch(`${base}/api/v1/videos/${videoId}`, { cache: 'no-store' });
        const text = await r.text();
        if (text.startsWith("<")) continue; // veio HTML, pula
        data = JSON.parse(text);
        if (data?.formatStreams?.length) break;
      } catch {}
    }

    if (!data) return new Response("erro: nenhuma instancia retornou", { status: 500 });

    const mp4 = data.formatStreams?.[0] || data.adaptiveFormats?.find(f => f.mimeType?.includes("video/mp4") && f.url);
    if (!mp4?.url) return new Response("sem mp4 url", { status: 500 });

    const video = await fetch(mp4.url);
    const buffer = await video.arrayBuffer();

    return new Response(buffer, {
      headers: {
        "Content-Type": "video/mp4",
        "Content-Disposition": `attachment; filename="corte-${videoId}.mp4"`,
      }
    });
  } catch (e) {
    return new Response("erro: " + e.message, { status: 500 });
  }
}
