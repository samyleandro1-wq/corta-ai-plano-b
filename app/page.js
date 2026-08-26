"use client";
import { useState, useEffect } from "react";

const EMAILS_VITALICIOS = ["samyleandro1@gmail.com"]
const LINK_PAGAMENTO = "https://payment-link-v3.stone.com.br/pi_JZ4gW3oZ7PeYgmf8GhxBw9v6iLeyBKM6A"
const LINK_MAKE = "https://hook.us2.make.com/1fz4oz342xcd3yjc"

export default function Page() {
  const [url, setUrl] = useState("");
  const [cuts, setCuts] = useState([]);
  const [id, setId] = useState("");
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [isPago, setIsPago] = useState(false);
  const [corteAtual, setCorteAtual] = useState(null);
  const [playerSrc, setPlayerSrc] = useState("");

  useEffect(() => {
    if(!email) return;
    fetch(`/api/pagos?email=${email}`).then(r=>r.json()).then(d=>{ if(d.liberado) setIsPago(true); });
  }, [email]);

  function pegarID(link){
    let v=link;
    if(v.includes("v=")) v=v.split("v=")[1].split("&")[0];
    if(v.includes("youtu.be/")) v=v.split("youtu.be/")[1].split("?")[0];
    return v.trim();
  }

  async function cortarReal(){
    if(!url) return alert("Cola o link do YouTube");
    if(!email) return alert("Cola seu email");
    setLoading(true);
    const videoId=pegarID(url);
    setId(videoId);

    const isVitalicio=EMAILS_VITALICIOS.map(e=>e.toLowerCase()).includes(email.toLowerCase().trim());
    const totalCortes = (isVitalicio || isPago)? 10 : 1;

   const usados = new Set();
const novosCortes = Array.from({length: totalCortes}).map((_, i)=>{
  let inicio;
  do {
    inicio = Math.floor(Math.random() * 540);
  } while (usados.has(inicio));
  usados.add(inicio);
  return { id: i, inicio, fim: inicio+60, titulo: `Corte ${i+1} - 1 minuto - MP4`, videoId }
});
novosCortes.sort((a,b) => a.inicio - b.inicio);
    setCuts(novosCortes);
    setLoading(false);
    fetch(LINK_MAKE, { method:"POST", body: JSON.stringify({email, videoId, total:totalCortes}) }).catch(()=>{})
  }

function abrirCorte(corte){
  setCorteAtual(corte);
  const src=`/api/baixar?videoId=${corte.videoId}&inicio=${corte.inicio}&fim=${corte.fim}`;
  setPlayerSrc(src);
}
const baixarVideo = (corte) => {
  const ini = corte?.inicio ?? 0;
  const fim = corte?.fim ?? 60;
  const vid = corte?.videoId || id;
  window.location.href = `/api/baixar?videoId=${vid}&inicio=${ini}&fim=${fim}`;
};
 
  return (
    <div className="min-h-screen bg-[#0a0614] text-white">
      <header className="flex justify-between items-center p-4 max-w-6xl mx-auto">
        <div className="flex items-center gap-2"><div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg"></div><span className="font-bold text-xl">Corta<span className="text-purple-400">AI</span></span></div>
      </header>

      <main className="max-w-6xl mx-auto px-4 text-center mt-12">
        <div className="inline-block bg-white/10 px-4 py-1 rounded-full text-sm mb-6">IA de edição geração</div>
        <h1 className="text-5xl md:text-7xl font-black leading-tight">Transforme videos<br/>longos em cortes virais</h1>

        <div className="flex flex-col gap-4 max-w-sm mx-auto mt-8">
          <button onClick={cortarReal} className="bg-gradient-to-r from-purple-500 to-pink-500 py-4 rounded-xl font-bold">{loading? "Cortando..." : "🎬 Testar Grátis 1 Corte"}</button>
          <a href={LINK_PAGAMENTO} target="_blank" className="bg-white/10 border border-white/20 py-4 rounded-xl font-bold">🔓 Desbloquear 10 cortes - R$ 9,90</a>
        </div>

        <div id="corte" className="mt-16 bg-white/5 p-6 rounded-2xl max-w-2xl mx-auto border border-white/10">
          <input value={email} onChange={e=>setEmail(e.target.value)} placeholder="Seu email" className="w-full p-3 rounded-lg bg-black/50 border border-white/10 text-white mb-3" type="email"/>
          <input value={url} onChange={e=>setUrl(e.target.value)} placeholder="Cole o link do YouTube" className="w-full p-3 rounded-lg bg-black/50 border border-white/10 text-white mb-3"/>
          <button onClick={cortarReal} className="w-full bg-purple-600 py-3 rounded-lg font-bold">GERAR CORTES</button>
          
         {playerSrc && (
  <div id="player-do-corte" className="mt-6">
    <video 
      src={playerSrc} 
      controls 
      autoPlay 
      className="w-full h-64 rounded-xl bg-black"
    />
  </div>
)} 

          <div className="mt-6 space-y-2 text-left">
            {cuts.map(c=>(
              <div key={c.id} className="flex justify-between items-center bg-black/30 p-3 rounded-lg">
                <span>{c.titulo}</span>
                <div className="flex gap-2">
                  <button onClick={()=>abrirCorte(c)} className="bg-white/10 px-3 py-1 rounded">Ver</button>
                  <button onClick={()=>baixarVideo(c)} className="bg-purple-500 px-3 py-1 rounded">Baixar</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
