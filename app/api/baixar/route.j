export async function GET(req){
  const { searchParams } = new URL(req.url);
  const url = searchParams.get('url');
  
  if(!url) return new Response('Sem URL', {status:400});

  try{
    // Usa o Cobalt - funciona na Vercel
    const apiRes = await fetch('https://api.cobalt.tools/api/json', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        url: url,
        vQuality: '720',
        filenamePattern: 'basic',
        vCodec: 'h264'
      })
    });
    
    const data = await apiRes.json();
    
    if(data.status === 'error' || !data.url){
      return new Response('Cobalt erro: '+JSON.stringify(data), {status:500});
    }

    // Baixa o video do link do cobalt
    const videoRes = await fetch(data.url);
    const blob = await videoRes.blob();
    
    return new Response(blob, {
      headers: {
        'Content-Type': 'video/mp4',
        'Content-Disposition': `attachment; filename="corte.mp4"`,
      }
    });
  }catch(e){
    return new Response('Erro: '+e.message, {status:500});
  }
}
