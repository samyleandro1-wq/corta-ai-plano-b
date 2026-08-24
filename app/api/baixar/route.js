export const dynamic = 'force-dynamic';

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) return new Response("sem id", { status: 400 });

    // Tenta 3 servidores diferentes
    const servers = [
      "https://inv.nadeko.net",
      "https://invidious.nerdvpn.de",
      "https://invidious.io.lol"
    ];

    for (const base of servers) {
      try {
        const r = await fetch(`${base}/api/v1/videos/${id}`, {
          cache: "no-store",
          headers: { "User-Agent": "Mozilla/5.0" }
        });
        if (!r.ok) continue;

        const text = await r.text();
        if (text.includes("Endpoint disabled") || text.startsWith("Endpoint")) continue;

        const data = JSON.parse(text);
        const url = data.formatStreams?.[0]?.url;
        if (!url) continue;

        // Redireciona direto - baixa instantâneo, sem travar em Baixando...
        return Response.redirect(url, 302);
      } catch(e){ continue; }
    }

    return new Response(JSON.stringify({error:"tenta de novo"}), {status:500});
  } catch(e){
    return new Response(JSON.stringify({error:e.message}), {status:500});
  }
}
