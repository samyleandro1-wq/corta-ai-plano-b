export async function POST(req){
  try{
    const { videoId, index } = await req.json();
    
    // 1. Pega o link real do YouTube
    const res = await fetch("https://co.wuk.sh/api/json", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        url: `https://www.youtube.com/watch?v=${videoId}`,
        vQuality: "720"
      })
    });
    const data = await res.json();
    if(!data.url) return Response.json({erro: "sem url"}, {status: 500});

    // 2. Baixa o vídeo no servidor da Vercel
    const videoRes = await fetch(data.url);
    const arrayBuffer = await videoRes.arrayBuffer();

    // 3. Manda pro PC / Celular como arquivo pra baixar
    return new Response(arrayBuffer, {
      headers: {
        "Content-Type": "video/mp4",
        "Content-Disposition": `attachment; filename="corte-${index+1}.mp4"`,
      }
    });

  }catch(e){
    return Response.json({erro: "falhou"}, {status: 500});
  }
}
