export async function POST(req) {
  const { videoId } = await req.json();

  // 1. Pega o link do YouTube
  const res = await fetch("https://api.cobalt.tools/api/json", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Accept": "application/json",
    },
    body: JSON.stringify({
      url: `https://www.youtube.com/watch?v=${videoId}`,
      vQuality: "720",
    }),
  });

  const data = await res.json();
  
  if (!data.url) {
    return Response.json({ error: "Cobalt não retornou url", data }, { status: 500 });
  }

  // 2. Baixa o vídeo de verdade e devolve como MP4 (não como link)
  const video = await fetch(data.url);
  const buffer = await video.arrayBuffer();

  return new Response(buffer, {
    headers: {
      "Content-Type": "video/mp4",
      "Content-Disposition": `attachment; filename="corte.mp4"`,
    },
  });
}
