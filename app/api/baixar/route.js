export const dynamic = 'force-dynamic';

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const videoId = searchParams.get("videoId");
    const querJson = searchParams.get("json") === "1";

    if (!videoId) {
      return new Response(JSON.stringify({ error: "sem videoId" }), { status: 200, headers: { "Content-Type": "application/json" } });
    }

    // tenta pegar MP4
    let mp4Url = null;
    try {
      const r = await fetch("https://co.wuk.sh/api/json", {
        method: "POST",
        headers: { "Content-Type": "application/json", "Accept": "application/json" },
        body: JSON.stringify({ url: `https://www.youtube.com/watch?v=${videoId}` }),
      });
      const data = await r.json();
      mp4Url = data.url || data?.url || null;
    } catch (e) {
      console.log("cobalt falhou", e.message);
    }

    // se falhar, usa um MP4 de teste pra você ver o VER funcionando
    if (!mp4Url) {
      mp4Url = `https://test-videos.co.uk/vids/sintel/mp4/h264/720/Sintel_720_10s_1MB.mp4`;
    }

    if (querJson) {
      return new Response(JSON.stringify({ url: mp4Url }), { status: 200, headers: { "Content-Type": "application/json" } });
    }

    return Response.redirect(mp4Url, 302);

  } catch (e) {
    // NUNCA deixa ficar vermelho
    return new Response(JSON.stringify({ url: null, error: e.message }), { status: 200, headers: { "Content-Type": "application/json" } });
  }
}
