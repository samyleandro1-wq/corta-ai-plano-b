export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const videoId = searchParams.get("videoId");
  const inicio = searchParams.get("inicio") || "0";
  const fim = searchParams.get("fim") || "30";

  if (!videoId) return new Response("sem id", { status: 400 });

  try {
    // Pega o MP4 original do YouTube (já sem ser YouTube)
    const invRes = await fetch(`https://inv.nadeko.net/api/v1/videos/${videoId}`, {
      headers: { "User-Agent": "Mozilla/5.0" }
    });
    const invData = await invRes.json();
    const format = invData.formatStreams?.find(f => f.itag === "18") || invData.formatStreams?.[0];
    if (!format?.url) throw new Error("sem mp4");

    const videoRes = await fetch(format.url);
    const blob = await videoRes.arrayBuffer();

    // Aqui ele já devolve como ARQUIVO MP4, não como página do YouTube
    return new Response(blob, {
      headers: {
        "Content-Type": "video/mp4",
        // Esse attachment faz cair na Galeria / Downloads
        "Content-Disposition": `attachment; filename="corte-${inicio}-${fim}-${videoId}.mp4"`,
      },
    });
  } catch (e) {
    return new Response("erro ao cortar mp4: " + e.message, { status: 500 });
  }
}

export async function POST(req) {
  const { videoId, inicio, fim } = await req.json();
  return Response.json({ 
    url: `/api/baixar?videoId=${videoId}&inicio=${inicio}&fim=${fim}` 
  });
}
