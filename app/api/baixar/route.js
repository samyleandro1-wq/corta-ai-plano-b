export const dynamic = 'force-dynamic';

const SERVERS = [
  "https://co.wuk.sh/api/json",
  "https://api.cobalt.tools/api/json",
  "https://cobaltdl.nadeko.net/api/json"
];

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const videoId = searchParams.get("videoId");
    const querJson = searchParams.get("json") === "1";
    if (!videoId) return new Response(JSON.stringify({ error: "sem videoId" }), { status: 400, headers: { "Content-Type": "application/json" } });

    const ytUrl = `https://www.youtube.com/watch?v=${videoId}`;
    let mp4Url = null;
    let lastError = "";

    for (const server of SERVERS) {
      try {
        const r = await fetch(server, {
          method: "POST",
          headers: { "Content-Type": "application/json", "Accept": "application/json" },
          body: JSON.stringify({ url: ytUrl, vQuality: "720", filenamePattern: "basic" }),
        });
        if (!r.ok) { lastError = await r.text(); continue; }
        const data = await r.json();
        if (data.url) { mp4Url = data.url; break; }
        if (data.picker) {
          const item = data.picker.find(p=>p.type==="video") || data.picker[0];
          if(item?.url) { mp4Url = item.url; break; }
        }
        lastError = JSON.stringify(data);
      } catch (e) {
        lastError = e.message;
      }
    }

    if (!mp4Url) {
      return new Response(JSON.stringify({ error: "YouTube bloqueou. Tente outro video.", details: lastError, videoId }), { status: 500, headers: { "Content-Type": "application/json" } });
    }

    if (querJson) {
      return new Response(JSON.stringify({ url: mp4Url }), { headers: { "Content-Type": "application/json" } });
    }
    return Response.redirect(mp4Url, 302);
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500, headers: { "Content-Type": "application/json" } });
  }
}
