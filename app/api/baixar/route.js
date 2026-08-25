export async function POST(req) {
  try {
    const { videoId } = await req.json();

    const cobaltRes = await fetch("https://api.cobalt.tools/api/json", {
      method: "POST",
      headers: { "Accept": "application/json", "Content-Type": "application/json" },
      body: JSON.stringify({
        url: `https://www.youtube.com/watch?v=${videoId}`,
        vQuality: "720",
        filenamePattern: "basic"
      })
    });

    const cobaltData = await cobaltRes.json();
    
    if (!cobaltData.url) {
      return Response.json({ error: "YouTube bloqueou", details: cobaltData }, { status: 500 });
    }

    const videoRes = await fetch(cobaltData.url);
    const buffer = await videoRes.arrayBuffer();

    return new Response(buffer, {
      headers: {
        "Content-Type": "video/mp4",
        "Content-Disposition": `attachment; filename="corte.mp4"`,
        "Content-Length": buffer.byteLength.toString()
      }
    });

  } catch (e) {
    return Response.json({ error: e.message }, { status: 500 });
  }
}
