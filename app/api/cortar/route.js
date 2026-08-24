import { exec } from "child_process";
import fs from "fs";
import path from "path";

export async function POST(req){
  const { videoId, inicio } = await req.json();
  
  // 1. Pega link do vídeo
  const r = await fetch("https://co.wuk.sh/api/json",{
    method:"POST",
    headers:{"Content-Type":"application/json"},
    body: JSON.stringify({url:`https://www.youtube.com/watch?v=${videoId}`,vQuality:"720"})
  });
  const data = await r.json();
  if(!data.url) return Response.json({erro:"sem url"}, {status:500});

  const tmpVideo = `/tmp/${videoId}.mp4`;
  const tmpCorte = `/tmp/corte-${Date.now()}.mp4`;

  // 2. Baixa video completo no /tmp
  const videoRes = await fetch(data.url);
  const buffer = Buffer.from(await videoRes.arrayBuffer());
  fs.writeFileSync(tmpVideo, buffer);

  // 3. Corta 60 segundos com ffmpeg (Vercel já tem ffmpeg)
  await new Promise((resolve, reject)=>{
    exec(`ffmpeg -y -ss ${inicio} -i ${tmpVideo} -t 60 -c:v libx264 -c:a aac ${tmpCorte}`, (err)=>{
      if(err) reject(err); else resolve();
    });
  });

  const corteBuffer = fs.readFileSync(tmpCorte);
  
  return new Response(corteBuffer, {
    headers:{
      "Content-Type":"video/mp4",
      "Content-Disposition":`attachment; filename="corte-${inicio}.mp4"`
    }
  });
}
