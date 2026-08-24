export const dynamic = 'force-dynamic';

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) return new Response("sem id", { status: 400 });

    const youtubeUrl = `https://www.youtube.com/watch?v=${id}`;

    const servers = [
      "https://api.cobalt.tools/api/json",
      "https://co.wuk.sh/api/json",
      "https://api.ia.sav-a.com/api/json"
    ];

    for (const apiUrl of servers) {
      try {
        const r = await fetch(apiUrl, {
          method: "POST",
          headers: { 
            "Content-Type": "application/json", 
            "Accept": "application/json" 
          },
          body: JSON.stringify({ 
            url: youtubeUrl, 
            vCodec: "h264", 
            vQuality: "720",
            isAudioOnly: false
          }),
          signal: AbortSignal.timeout(15000)
        });
        const data = await r.json();
        const downloadUrl = data.url;
        if (!downloadUrl) continue;

        const videoRes = await fetch(downloadUrl);
        if (!videoRes.ok || !videoRes.body) continue;

        return new Response(videoRes.body, {
          headers: {
            "Content-Type": "video/mp4",
            "Content-Disposition": `attachment; filename="corte-${id}.mp4"`,
          },
        });
      } catch (e) { continue; }
    }

    return new Response(JSON.stringify({ error: "tenta de novo em 10s" }), { status: 500 });

  } catch (e) {
    return new Response(JSON.stringify({ error: e.message }), { status: 500 });
  }
}
