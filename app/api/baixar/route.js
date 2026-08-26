export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const videoId = searchParams.get("videoId");
    const inicio = searchParams.get("inicio") || 0;
    const fim = searchParams.get("fim") || 60;

    if (!videoId) return new Response("sem videoId", { status: 400 });

    const youtubeUrl = `https://www.youtube.com/watch?v=${videoId}`;

    // 1. Pega link direto do YouTube
    const cobaltRes = await fetch("https://api.co.wuk.sh/api/json", {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify({ url: youtubeUrl, vQuality: "720" }),
    });

    const data = await cobaltRes.json();
    if (!data.url) return new Response("Erro ao pegar video", { status: 500 });

    // 2. Baixa o video e entrega pro usuário com nome certo
    const videoRes = await fetch(data.url);
    
    const fileName = `corte-${inicio}-${fim}s.mp4`;

    // Headers que funcionam em PC, Android e iPhone
    return new Response(videoRes.body, {
      headers: {
        "Content-Type": "video/mp4",
        "Content-Disposition": `attachment; filename="${fileName}"`,
        "Cache-Control": "no-cache",
      },
    });

  } catch (e) {
    return new Response("Erro baixar: " + e.message, { status: 500 });
  }
}
