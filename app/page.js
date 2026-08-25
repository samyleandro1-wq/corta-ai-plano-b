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

    const novosCortes = Array.from({length: totalCortes}).map((_, i)=>{
      const inicio = i * 60;
      return { id: i, inicio, fim: inicio+60, titulo: `Corte ${i+1} - 1 minuto`, videoId, mp4: true }
    });

    setCuts(novosCortes);
    setLoading(false);

    // avisa o Make
    fetch(LINK_MAKE, { method:"POST", body: JSON.stringify({email, videoId, total:totalCortes}) }).catch(()=>{})
  }

  function abrirCorte(corte){
    setCorteAtual(corte);
    // AGORA SEM getElementById - usa state, não quebra mais
    const src=`https://www.youtube.com/embed/${id}?start=${corte.inicio}&end=${corte.fim}&autoplay=1`;
    setPlayerSrc(src);
    setTimeout(()=>{ document.getElementById('player-do-corte')?.scrollIntoView({behavior:'smooth'}) },150)
  }

  const baixarVideo = async (videoIdParaBaixar) => {
    try {
      const res = await fetch("/api/baixar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ videoId: videoIdParaBaixar || id })
      });
      
      // VERIFICA SE VEIO JSON MESMO
      const text = await res.text();
      if (!text) throw new Error("API retornou vazio");
      
      const data = JSON.parse(text);
      
      if (data.downloadUrl) window.open(data.downloadUrl, "_blank");
      else if (data.url) window.open(data.url, "_blank");
      else alert("Erro: " + text);
    } catch (err) {
      // PLANO B SE A API FALHAR - JÁ ABRE O DOWNLOAD DIRETO
      const vid = videoIdParaBaixar || id;
      window.open(`https://www.y2mate.is/youtube/${vid}`, "_blank");
    }
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
          <button onClick={cortarReal} className="w-full bg-purple-600 py-3 rounded-lg font-bold">Cortar Agora</button>

          {playerSrc && (
            <div className="mt-8">
              <iframe id="player-do-corte" src={playerSrc} className="w-full h-[300px] rounded-xl" allow="autoplay; encrypted-media" allowFullScreen></iframe>
            </div>
          )}

          {cuts.length > 0 && (
            <div className="mt-8 grid gap-3 text-left">
              {cuts.map((c, idx) => (
                <div key={c.id} className="flex justify-between items-center bg-black/50 p-3 rounded-lg border border-white/10">
                  <div><p className="font-bold">{c.titulo}</p><p className="text-xs text-white/50">{c.inicio}s - {c.fim}s</p></div>
                  <div className="flex gap-2">
                    <button onClick={()=>abrirCorte(c)} className="bg-white/10 px-3 py-1 rounded text-sm">Ver</button>
                    <button onClick={()=>baixarVideo(c.videoId || id)} className="bg-purple-600 px-3 py-1 rounded text-sm font-bold">Baixar</button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
