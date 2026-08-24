const baixarCorte = async (videoId) => {
  try {
    // Tenta direto do navegador, sem passar pela Vercel
    const res = await fetch(`https://inv.nadeko.net/api/v1/videos/${videoId}`);
    const data = await res.json();
    
    // Pega o link mp4 com áudio
    const link = data.formatStreams?.[0]?.url;
    
    if(link){
      // Abre e já baixa como .mp4 na pasta Downloads
      window.open(link, '_blank');
    } else {
      alert("Link expirado, gera o corte de novo");
    }
  } catch(e){
    // Fallback 2 - se o primeiro cair
    window.open(`https://inv.vern.cc/latest_version?id=${videoId}&itag=22`, '_blank');
  }
}
