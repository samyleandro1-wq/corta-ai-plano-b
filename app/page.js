"use client";
import { useState, useEffect } from "react";

const EMAILS_VITALICIOS = ["samyleandro1@gmail.com"]

export default function Page() {
  const [url, setUrl] = useState("");
  const [cuts, setCuts] = useState([]);
  const [id, setId] = useState("");
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [isPago, setIsPago] = useState(false);
  const [corteAtual, setCorteAtual] = useState(null);
  const [baixandoId, setBaixandoId] = useState(null);

  useEffect(() => {
    if(!email) return;
    fetch(`/api/pagos?email=${email}`).then(r=>r.json()).then(d=>{ if(d.liberado) setIsPago(true); }).catch(()=>{});
  }, [email]);

  function pegarID(link){
    let v=link;
    if(v.includes("v=")) v=v.split("v=")[1].split("&")[0];
    if(v.includes("youtu.be/")) v=v.split("youtu.be/")[1].split("?")[0];
    if(v.includes("/shorts/")) v=v.split("/shorts/")[1].split("?")[0];
    return v.trim();
  }

  async function cortarReal(){
    if(!url) return alert("Cola o link");
    if(!email) return alert("Cola o email");
    setLoading(true);
    const videoId=pegarID(url);
    setId(videoId);
    const isVitalicio=EMAILS_VITALICIOS.map(e=>e.toLowerCase()).includes(email.toLowerCase().trim());
    const total=(isVitalicio || isPago)? 10 : 1;
    const novos=Array.from({length: total}).map((_, i)=>{
      const inicio=60+(i*150)+Math.floor(Math.random()*100);
      return { id:i, inicio, fim:inicio+60, titulo:`Corte ${i+1} - 1 minuto` }
    });
    setCuts(novos);
    setLoading(false);
  }

  function abrirCorte(corte){
    setCorteAtual(corte);
    setTimeout(()=>{
      const player=document.getElementById('player-do-corte');
      if(player) player.src=`https://www.youtube.com/embed/${id}?start=${corte.inicio}&end=${corte.fim}&autoplay=1`;
    },100)
  }

  // SEU CODIGO DAS 2:28 QUE BAIXA DE VERDADE
  async function baixarVideo(videoId) {
    try {
      setBaixandoId(videoId)
      alert("Preparando download...")
      const res = await fetch(`https://pipedapi.kavin.rocks/streams/${videoId}`)
      const data = await res.json()
      const stream = data.videoStreams.find(s =>!s.videoOnly && s.mimeType.includes("mp4")) || data.videoStreams[0]
      if (!stream?.url) throw new Error("sem link")
      window.open(stream.url, "_blank")
      setBaixandoId(null)
    } catch (e) {
      console.error(e)
      window.open(`https://piped.video/watch?v=${videoId}`, "_blank")
      setBaixandoId(null)
    }
  }

  return (
    <div className="min-h-screen bg-[#0a0614] text-white p-4">
      <div className="max-w-2xl mx-auto">
        <input value={email} onChange={e=>setEmail(e.target.value)} placeholder="Seu email" className="w-full p-3 rounded-lg bg-black/50 border border-white/10 mb-3"/>
        <input value={url} onChange={e=>setUrl(e.target.value)} placeholder="Link YouTube" className="w-full p-3 rounded-lg bg-black/50 border border-white/10 mb-3"/>
        <button onClick={cortarReal} className="w-full bg-purple-600 py-3 rounded-xl font-bold">{loading?"CORTANDO...":"GERAR CORTES"}</button>

        {cuts.map(corte=>(
          <div key={corte.id} className="mt-3 bg-white/5 p-4 rounded-xl flex justify-between">
            <span>{corte.titulo}</span>
            <div className="flex gap-2">
              <button onClick={()=>abrirCorte(corte)} className="bg-white/20 px-3 py-1 rounded">Ver</button>
             <button onClick={()=>baixarVideo(id)} className="bg-[#00ffaa] text-black font-bold px-4 py-2 rounded-lg">
  {baixandoId === id? "Baixando..." : "⬇️ Baixar"}
</button> 
            </div>
          </div>
        ))}
        {corteAtual && <iframe id="player-do-corte" className="w-full aspect-video mt-5 rounded-xl" allowFullScreen></iframe>}
      </div>
    </div>
  );
}
