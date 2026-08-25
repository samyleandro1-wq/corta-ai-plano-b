export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const videoId = searchParams.get("videoId");

  try {
    const r = await fetch(`https://invidious.nerdvpn.de/api/v1/videos/${videoId}`);
    const data = await r.json();
    const mp4 = data.formatStreams[0];

    const video = await fetch(mp4.url);
    const buffer = await video.arrayBuffer();

    return new Response(buffer, {
      headers: {
        "Content-Type": "video/mp4",
        "Content-Disposition": `attachment; filename="video-${videoId}.mp4"`,
      }
    });
  } catch (e) {
    return new Response("erro: " + e.message, { status: 500 });
  }
}
