import ytdl from '@distube/ytdl-core';

export async function GET(req){
  const { searchParams } = new URL(req.url);
  const url = searchParams.get('url');
  const start = searchParams.get('start');
  const end = searchParams.get('end');

  if(!url) return new Response('Sem URL', {status:400});

  try{
    const info = await ytdl.getInfo(url);
    const format = ytdl.chooseFormat(info.formats, { quality: '18' });
    
    const stream = ytdl.downloadFromInfo(info, { format });

    return new Response(stream, {
      headers: {
        'Content-Type': 'video/mp4',
        'Content-Disposition': `attachment; filename="corte-${start}-${end}.mp4"`,
      }
    });
  }catch(e){
    return new Response('Erro: '+e.message, {status:500});
  }
}
