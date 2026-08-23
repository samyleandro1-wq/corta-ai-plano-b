"use client";
import { useState, useEffect } from "react";

const EMAILS_VITALICIOS = ["samyleandro1@gmail.com"]
const LINK_PAGAMENTO = "https://payment-link-v3.stone.com.br/pl_JZqWpY3oz7PaYgmf86hxb9w6LeyBKRGA"
const LINK_MAKE = "https://hook.us2.make.com/1fz4oz342xcd3yjc"

export default function Page() {
  const [url, setUrl] = useState("");
  const [cuts, setCuts] = useState([]);
  const [id, setId] = useState("");
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
   const [isPago, setIsPago] = useState(false);
  const [corteAtual, setCorteAtual] = useState(null);
  useEffect(() => {
    if(!email) return;
    fetch(`/api/pagos?email=${email}`)
   .then(r => r.json())
   .then(d => {
        if(d.liberado) setIsPago(true);
      });
  }, [email]);

  function pegarID(link){
    let v =link;
    if(v.includes("v=")) v = v.split("v=")[1].split("&")[0];
    if(v.includes("youtu.be/")) v = v.split("youtu.be/")[1].split("?")[0];
    return v.trim();
  }

  async function cortarReal(){
    if(!url) return alert("Cola o link do YouTube");
    if(!email) return alert("Cola seu email pra receber o corte");
    setLoading(true);
    const videoId = pegarID(url);
    setId(videoId);
const isVitalicio = EMAILS_VITALICIOS.includes(email.toLowerCase().trim());   
  const totalCortes = (isVitalicio || isPago) ? 10 : 1;    
    const novosCortes = Array.from({ length: totalCortes }).map((_, i) => {
      const inicio = Math.floor(Math.random() * 1200);
      return {
        inicio: inicio,
        fim: inicio + 60,
        titulo: `Corte ${i+1} - 1 minuto`,
        link: `https://www.youtube.be/${videoId}&t=${inicio}s`
      }
    });
    setCuts(novosCortes);
    setLoading(false);
  }
function copiarLink(corte) {
  // AGORA cada corte é um link DIFERENTE mesmo
  const linkDoCorte = `https://www.youtube.com/embed/${videoId}?start=${corte.inicio}&end=${corte.fim}`;
  navigator.clipboard.writeText(linkDoCorte);
  alert(`Corte ${corte.titulo} copiado! É só esse 1 minuto, sem YouTube.`);
}

function abrirCorte(corte) {
  // NÃO manda pro YouTube, abre o player AQUI dentro do CortaAI
  const player = document.getElementById('player-do-corte');
  if(player){
    player.src = `https://www.youtube.com/embed/${videoId}?start=${corte.inicio}&end=${corte.fim}&autoplay=1`;
    player.scrollIntoView({behavior: 'smooth'});
  }
}
  return (
    <div className="min-h-screen bg-[#0a0614] text-white">
      <header className="flex justify-between items-center p-4 max-w-6xl mx-auto">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">✂️</div>
          <span className="font-bold text-xl">Corta<span className="text-purple-400">AI</span></span>
        </div>
<div className="flex gap-2 items-center">
  <input 
    value={email} 
    onChange={(e)=>setEmail(e.target.value)} 
    placeholder="Seu email" 
    className="px-4 py-2 rounded-full bg-white/10 border border-white/20 text-white text-sm w-40" 
  />
  <button 
    onClick={()=>document.getElementById('corte')?.scrollIntoView()} 
    className="px-5 py-2 rounded-full bg-white text-black font-bold text-sm"
  >
    Entrar
  </button>
</div>
</header>
<main className="max-w-6xl mx-auto px-4 text-center mt-12">
<div className="inline-block bg-white/10 px-4 py-1 rounded-full text-sm mb-6">✨ IA de última geração</div>
<h1 className="text-5xl md:text-7xl font-black leading-tight">Transforme videos<br/>longos em cortes virais</h1>
<div className="flex flex-col gap-4 max-w-sm mx-auto mt-8">
<button onClick={cortarReal} className="bg-gradient-to-r from-purple-500 to-pink-500 py-4 rounded-xl font-bold">⚡ Testar Grátis 1 Corte</button>
<a href={LINK_PAGAMENTO} target="_blank" className="border border-white/20 py-4 rounded-xl font-bold block">💎 Assinar Agora R$9,90/m</a>
</div>
<div id="corte" className="mt-16 bg-white/5 p-6 rounded-2xl max-w-2xl mx-auto border border-white/10">
<input value={email} onChange={(e)=>setEmail(e.target.value)} placeholder="Seu email" className="w-full p-4 rounded-xl bg-black/50 border border-white/10 mb-3"/>
<input value={url} onChange={(e)=>setUrl(e.target.value)} placeholder="Cole o link do YouTube aqui" className="w-full p-4 rounded-xl bg-black/50 border border-white/10 mb-3"/>
<button onClick={cortarReal} disabled={loading} className="w-full mt-3 bg-white text-black py-4 rounded-xl font-black">{loading ? "CORTANDO..." : "ENVIAR PRO CORTE REAL"}</button>
{corteAtual && (
  <div className="mt-6 aspect-video bg-black rounded-2xl overflow-hidden border border-white/20">
    <iframe 
      key={`${id}-${corteAtual.inicio}`}
      className="w-full h-full" 
      src={`https://www.youtube.com/embed/${id || pegarID(url)}?start=${corteAtual.inicio || corteAtual.start || 0}&end=${corteAtual.fim || corteAtual.end || 60}&autoplay=1&rel=0`} 
      allowFullScreen>
    </iframe>
    <p className="text-center text-white/60 text-xs mt-2">Tocando corte de {corteAtual.inicio}s até {corteAtual.fim}s</p>
  </div>
)}
<div className="mt-6 grid gap-3">{cuts.map((c,i)=>(
<div key={i} className="bg-black/50 p-3 rounded-xl text-left">
<p className="font-bold text-white">{c.titulo} - {c.inicio} até {c.fim}</p>
<div className="flex gap-2 mt-2">
<button onClick={()=>setCorteAtual(c)} className="bg-white text-black px-3 py-2 rounded-lg text-sm font-bold">ABRIR</button>
<button onClick={()=>copiarLink(c.link)} className="bg-purple-600 text-white px-3 py-2 rounded-lg text-sm font-bold">COPIAR LINK</button>
</div>
</div>
))}</div>
</div>
</main>
</div>
);
}
