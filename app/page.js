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

  // CÓDIGO NOVO JÁ NO LUGAR CERTO - SUBSTITUI O DAS 2:28
  async function baixarVideo(videoId) {
    try {
      setBaixandoId(videoId);
      window.open(`/api/baixar?id=${videoId}`, "_blank");
      setTimeout(()=> setBaixandoId(null), 2000);
    } catch (e) {
      window.open(`https://piped.video/watch?v=${videoId}`, "_blank");
      setBaixandoId(null);
    }
  }

  return (
    <div className="min-h-screen bg-[#0a0614] text-white p-4">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-6">CORTA AI - PLANO B</h1>
        <input value={email} onChange={e=>setEmail(e.target.value)} placeholder="Seu email" className="w-full p-3 rounded-lg bg-black/50 border border-white/10 mb-3 text-white"/>
        <input value={url} onChange={e=>setUrl(e.target.value)} placeholder="Link YouTube" className="w-full p-3 rounded-lg bg-black/50 border border-white/10 mb-3 text-white"/>
        <button onClick={cortarReal} className="w-full bg-purple-600 py-3 rounded-xl font-bold">{loading?"CORTANDO...":"GERAR CORTES"}</button>

        {cuts.map(corte=>(
          <div key={corte.id} className="mt-3 bg-white/5 p-4 rounded-xl flex justify-between items-center">
            <span>{corte.titulo}</span>
            <div className="flex gap-2">
              <button onClick={()=>abrirCorte(corte)} className="bg-white/20 px-3 py-1 rounded">Ver</button>
              <button onClick={()=>baixarVideo(id)} className="bg-[#00ffaa] text-black px-3 py-1 rounded font-bold">{baixandoId === id ? "Baixando..." : "Baixar"}</button>
            </div>
          </div>
        ))}
        {corteAtual && <iframe id="player-do-corte" className="w-full aspect-video mt-5 rounded-xl" allowFullScreen></iframe>}
      </div>
    </div>
  );
}
