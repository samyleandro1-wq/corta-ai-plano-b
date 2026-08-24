export const dynamic = 'force-dynamic';

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  try {
    const r = await fetch(`https://inv.nadeko.net/api/v1/videos/${id}`, { cache: "no-store" });
    const data = await r.json();
    const videoUrl = data.formatStreams?.[0]?.url || data.adaptiveFormats?.find(f=>f.type?.includes("mp4"))?.url;
    if (!videoUrl) return new Response("sem link", {status:500});
    
    // Redireciona direto pro link do YouTube - baixa na hora
    return Response.redirect(videoUrl, 302);
  } catch(e){
    return new Response(JSON.stringify({error:e.message}), {status:500});
  }
}
