export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const videoId = searchParams.get("videoId");
    if (!videoId) return new Response("sem videoId", { status: 400 });

    const youtubeUrl = `https://www.youtube.com/watch?v=${videoId}`;

    const cobaltRes = await fetch("https://api.co.wuk.sh/api/json", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json"
      },
      body: JSON.stringify({
        url: youtubeUrl,
        vQuality: "720",
        filenamePattern: "basic",
        isAudioOnly: false
      })
    });

    const cobaltData = await cobaltRes.json();

    if (!cobaltData.url) {
      return new Response("erro cobalt: " + JSON.stringify(cobaltData), { status: 500 });
    }

    const videoRes = await fetch(cobaltData.url);
    const buffer = await videoRes.arrayBuffer();

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
