export async function POST(req) {
  const { videoId } = await req.json();

  const res = await fetch("https://api.cobalt.tools/api/json", {
    method: "POST",
    headers: { "Content-Type": "application/json", "Accept": "application/json" },
    body: JSON.stringify({
      url: `https://www.youtube.com/watch?v=${videoId}`,
      vQuality: "720", // <- PADRÃO: 720p = 10-15MB por minuto
      filenamePattern: "basic"
    }),
  });

  const data = await res.json();
  if (!data.url) return Response.json(data, { status: 500 });

  const video = await fetch(data.url);
  const buffer = await video.arrayBuffer();

  return new Response(buffer, {
    headers: {
      "Content-Type": "video/mp4",
      "Content-Disposition": `attachment; filename="corte-1min-720p.mp4"`,
    },
  });
}
