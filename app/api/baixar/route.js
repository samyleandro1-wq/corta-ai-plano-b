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
      body: JSON.stringify({ url: youtubeUrl, vQuality: "720", filenamePattern: "basic" }),
    });

    const data = await cobaltRes.json();
    
    if (!data.url) {
      console.log(data);
      return new Response("Cobalt erro: " + JSON.stringify(data), { status: 500 });
    }

    // NÃO FAZ FETCH NO VIDEO, SÓ REDIRECIONA - RESOLVE O FETCH FAILED
    return Response.redirect(data.url, 302);

  } catch (e) {
    return new Response("Erro baixar: " + e.message, { status: 500 });
  }
}
