export async function POST(req) {
  try {
    const { videoId } = await req.json();
    
    // API que retorna link .mp4 direto
    const cobaltRes = await fetch("https://api.cobalt.tools/api/json", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        url: `https://www.youtube.com/watch?v=${videoId}`,
        vCodec: "h264",
        vQuality: "720"
      })
    });

    const cobaltData = await cobaltRes.json();

    // Se conseguiu o link direto .mp4, retorna
    if (cobaltData.url) {
      return Response.json({ url: cobaltData.url });
    }

    // Se falhar, fallback
    return Response.json({ url: `https://www.youtube.com/watch?v=${videoId}` });

  } catch (e) {
    return Response.json({ error: "erro", details: e.message }, { status: 500 });
  }
}
