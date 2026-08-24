export const dynamic = 'force-dynamic';

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) return new Response("sem id", { status: 400 });

    const youtubeUrl = `https://www.youtube.com/watch?v=${id}`;

    // LISTA DE CONVERSORES - se um cair vai pro outro
    const cobaltServers = [
      "https://api.cobalt.tools",
      "https://co.wuk.sh",
      "https://api.ia.sav-a.com"
    ];

    for (const server of cobaltServers) {
      try {
        const r = await fetch(`${server}/`, {
          method: "POST",
          headers: { "Content-Type": "application/json", "Accept": "application/json" },
          body: JSON.stringify({ url: youtubeUrl, vCodec: "h264", vQuality: "720", filenamePattern: "basic" }),
          signal: AbortSignal.timeout(15000)
        });
        if (!r.ok) continue;
        const data = await r.json();
        const downloadUrl = data.url || data.stream;
        if (!downloadUrl) continue;

        const videoRes = await fetch(downloadUrl, { signal: AbortSignal.timeout(20000) });
        if (!videoRes.ok || !videoRes.body) continue;

        return new Response(videoRes.body, {
          headers: {
            "Content-Type": "video/mp4",
            "Content-Disposition": `attachment; filename="corta-ai-${id}.mp4"`,
            "Cache-Control": "no-cache"
          },
        });
      } catch (e) { continue; }
    }

    return new Response(JSON.stringify({ error: "todos os conversores off, tente em 1 min" }), {
      status: 500, headers: { "Content-Type": "application/json" }
    });

  } catch (e) {
    return new Response(JSON.stringify({ error: e.message }), { status: 500 });
  }
}
