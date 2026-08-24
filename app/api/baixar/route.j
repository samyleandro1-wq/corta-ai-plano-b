export async function GET(req){
  const { searchParams } = new URL(req.url);
  const url = searchParams.get('url');
  if(!url) return new Response('Sem URL', {status:400});
  try{
    const r = await fetch('https://co.wuk.sh/api/json', {
      method:'POST',
      headers:{'Accept':'application/json','Content-Type':'application/json'},
      body: JSON.stringify({url, vQuality:'720', vCodec:'h264', filenamePattern:'basic'})
    });
    const data = await r.json();
    return Response.json(data);
  }catch(e){
    return Response.json({status:'error', text:e.message}, {status:500});
  }
}
