export async function POST(req){
  try{
    const { videoId, index } = await req.json();
    
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

    const videoRes = await fetch(data.url);
    const arrayBuffer = await videoRes.arrayBuffer();

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
