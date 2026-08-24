export const dynamic = 'force-dynamic';

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) return new Response("sem id", { status: 400 });

    // 1. Tenta pegar o link direto do vídeo
    const pipedServers = [
      "https://pipedapi.kavin.rocks",
      "https://api.piped.private.coffee",
      "https://pipedapi.syncpundi.com"
    ];

    let videoUrl = null;

    for (const server of pipedServers) {
      try {
        const r = await fetch(`${server}/streams/${id}`, { 
          cache: "no-store",
          signal: AbortSignal.timeout(7000)
        });
        if (!r.ok) continue;
        const data = await r.json();
        const stream = data.videoStreams?.find(s => s.mimeType?.includes("mp4") && !s.videoOnly);
        if (stream?.url) {
          videoUrl = stream.url;
          break;
        }
      } catch (e) { continue; }
    }

    if (!videoUrl) {
      return new Response(JSON.stringify({ error: "piped off no momento, tente de novo" }), {
        status: 500,
        headers: { "Content-Type": "application/json" }
      });
    }

    // 2. Baixa o vídeo no servidor e entrega como arquivo
    const videoRes = await fetch(videoUrl);
    if (!videoRes.ok || !videoRes.body) {
      return new Response("falha ao baixar video", { status: 500 });
    }

    return new Response(videoRes.body, {
      headers: {
        "Content-Type": "video/mp4",
        "Content-Disposition": `attachment; filename="corta-ai-${id}.mp4"`,
        "Cache-Control": "no-cache"
      },
    });

  } catch (e) {
    return new Response(JSON.stringify({ error: e.message }), { status: 500 });
  }
}
