async function baixarVideo(videoId, inicio, idx){
  try{
    setBaixandoId(videoId+"-"+idx);
    const res = await fetch("/api/baixar",{
      method:"POST",
      headers:{"Content-Type":"application/json"},
      body:JSON.stringify({videoId})
    });
    const data = await res.json();
    const a=document.createElement("a");
    a.href=data.url;
    a.download=`corte-${idx+1}-1min.mp4`;
    document.body.appendChild(a);
    a.click();
    a.remove();
  }catch(e){ alert("Erro"); }
  finally{ setBaixandoId(null); }
}
