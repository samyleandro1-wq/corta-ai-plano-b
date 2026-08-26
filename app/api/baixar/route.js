export const dynamic = 'force-dynamic';

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const videoId = searchParams.get("videoId");
  const querJson = searchParams.get("json") === "1";

  if (!videoId) {
    return Response.json({ error: "sem videoId" }, { status: 400 });
  }

  try {
    const r = await fetch("https://api.cobalt.tools/api/json", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
      },
      body: JSON.stringify({
        url: `https://www.youtube.com/watch?v=${videoId}`,
        vQuality: "720",
        isAudioOnly: false
      }),
    });

    const data = await r.json();

    if (!data.url) {
      return Response.json({ error: "cobalt não retornou url", data }, { status: 500 });
    }

    // SE FOR VER -> retorna JSON pro player tocar
    if (querJson) {
      return Response.json({ url: data.url });
    }

    // SE FOR BAIXAR -> baixa pro PC/Android
    return Response.redirect(data.url, 302);

  } catch (e) {
    return Response.json({ error: e.message }, { status: 500 });
  }
}
