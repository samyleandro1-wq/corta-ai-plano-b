export async function POST(req) {
  const { videoId } = await req.json();

  const r = await fetch("https://api.cobalt.tools/api/json", {
    method: "POST",
    headers: { "Content-Type": "application/json", "Accept": "application/json" },
    body: JSON.stringify({
      url: `https://www.youtube.com/watch?v=${videoId}`,
      vQuality: "720"
    })
  });

  const data = await r.json();
  const video = await fetch(data.url);

  // ISSO AQUI É O VÍDEO DE VERDADE, NÃO FAKE
  return new Response(video.body, {
    headers: {
      "Content-Type": "video/mp4",
      "Content-Disposition": `attachment; filename="corte.mp4"`
    }
  });
}
