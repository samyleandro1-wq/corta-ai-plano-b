export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) return Response.json({ error: "sem id" }, { status: 400 });

    // tenta 2 servidores piped
    const bases = ["https://pipedapi.kavin.rocks", "https://api.piped.private.coffee"];
    let data = null;
    for (let base of bases) {
      try {
        const r = await fetch(`${base}/streams/${id}`, { next: { revalidate: 0 } });
        if (r.ok) { data = await r.json(); break; }
      } catch(e){}
    }
    if (!data) return Response.json({ error: "piped off" }, { status: 500 });

    const stream = data.videoStreams
     .filter(s => s.mimeType.includes("mp4") &&!s.videoOnly)
     .sort((a,b) => b.height - a.height)[0] || data.videoStreams[0];

    // redireciona pro mp4 de verdade - o navegador baixa
    return Response.redirect(stream.url, 302);
  } catch (e) {
    return Response.json({ error: "erro baixar" }, { status: 500 });
  }
}
