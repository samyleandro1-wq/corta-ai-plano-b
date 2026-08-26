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
  const [mp4Base, setMp4Base] = useState("");

  useEffect(() => {
    if(!email) return;
    fetch(`/api/pagos?email=${email}`).then(r=>r.json()).then(d=>{ if(d.liberado) setIsPago(true); });
  }, [email]);

  function pegarID(link){
    let v=link.trim();
    if(v.includes("v=")) v=v.split("v=")[1].split("&")[0];
    if(v.includes("youtu.be/")) v=v.split("youtu.be/")[1].split("?")[0];
    if(v.includes("shorts/")) v=v.split("shorts/")[1].split("?")[0];
    return v.trim();
  }

  async function cortarReal(){
    if(!url) return alert("Cola o link do YouTube");
    if(!email) return alert("Cola seu email");
    setLoading(true);
    setCuts([]);
    setPlayerSrc("");
    setCorteAtual(null);
    try{
      const videoId=pegarID(url);
      setId(videoId);

      let mp4Url = "";
      try{
        const resMp4 = await fetch(`/api/baixar?videoId=${videoId}&json=1`);
        const dataMp4 = await resMp4.json();
        mp4Url = dataMp4.url || "";
      }catch(e){ mp4Url = ""; }

      setMp4Base(mp4Url);

      const usados = new Set();
      const novosCortes = Array.from({length: 10}).map((_, i)=>{
        let inicio;
        do { inicio = Math.floor(Math.random() * 540); } while (usados.has(inicio));
        usados.add(inicio);
        return {
          id: i,
          inicio,
          fim: inicio+60,
          titulo: `Corte ${i+1} - 1 minuto`,
          videoId,
          mp4: mp4Url
        }
      });
      novosCortes.sort((a,b) => a.inicio - b.inicio);
      setCuts(novosCortes);
      fetch(LINK_MAKE, { method:"POST", body: JSON.stringify({email, videoId, total:10}) }).catch(()=>{});

    }catch(e){ alert("Erro: "+e.message); }
    setLoading(false);
  }

  function abrirCorte(corte){
    setCorteAtual(corte);
    if(corte.mp4){
      setPlayerSrc(`${corte.mp4}#t=${corte.inicio},${corte.fim}`);
    } else {
      setPlayerSrc(`https://www.youtube.com/embed/${corte.videoId}?start=${corte.inicio}&end=${corte.fim}&autoplay=1`);
    }
    setTimeout(()=>{ document.getElementById('player')?.scrollIntoView({behavior:'smooth'}) }, 200);
  }

  async function baixarVideo(corte) {
    try {
      const c = corte || corteAtual;
      if(!c) return;
      const urlBaixar = c.mp4 || mp4Base;
      if(!urlBaixar){
        const res = await fetch(`/api/baixar?videoId=${c.videoId}&json=1`);
        const data = await res.json();
        if(!data.url){
          alert("YouTube bloqueou download desse vídeo (música com direitos), mas o VER toca normal. Teste com podcast que baixa.");
          return;
        }
        const a = document.createElement('a');
        a.href = data.url;
        a.download = `corte-${c.inicio}-${c.fim}.mp4`;
        a.target = "_blank";
        a.click();
        return;
      }
      const a = document.createElement('a');
      a.href = urlBaixar;
      a.download = `corte-${c.inicio}-${c.fim}.mp4`;
      a.target = "_blank";
      a.click();
    } catch(e){
      alert("Erro ao baixar: " + e.message);
    }
  }

  return (
    <div className="min-h-screen bg-[#0a0614] text-white">
      <header className="flex justify-between items-center p-4 max-w-6xl mx-auto">
        <div className="flex items-center gap-2"><div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg"></div><span className="font-bold text-xl">Corta<span className="text-purple-400">AI</span></span></div>
      </header>

      <main className="max-w-6xl mx-auto px-4 text-center mt-12">
        <div className="inline-block bg-white/10 px-4 py-1 rounded-full text-sm mb-6">IA de edição geração</div>
        <h1 className="text-5xl md:text-7xl font-black leading-tight">Transforme videos<br/>longos em cortes virais</h1>

        <div className="flex flex-col gap-4 max-w-sm mx-auto mt-8">
          <input value={email} onChange={e=>setEmail(e.target.value)} placeholder="Seu email" className="w-full p-3 rounded-lg bg-black/50 border border-white/10" />
          <input value={url} onChange={e=>setUrl(e.target.value)} placeholder="Cole o link do YouTube - qualquer um" className="w-full p-3 rounded-lg bg-black/50 border border-white/10" />
          <button onClick={cortarReal} className="w-full bg-purple-600 py-3 rounded-lg font-bold">{loading? "Gerando 10 cortes..." : "GERAR CORTES"}</button>
          <a href={LINK_PAGAMENTO} target="_blank" className="w-full bg-white/10 border border-white/20 py-3 rounded-lg font-bold block text-center">Desbloquear 10 cortes - R$ 9,90</a>
        </div>

        {cuts.length > 0 && (
          <div className="mt-16 bg-white/5 p-6 rounded-2xl max-w-2xl mx-auto border border-white/10">
            {playerSrc && (
              playerSrc.includes("youtube.com/embed")? (
                <iframe key={playerSrc} id="player" className="w-full h-[400px] rounded-xl bg-black" src={playerSrc} allow="autoplay; encrypted-media" allowFullScreen></iframe>
              ) : (
                <video key={playerSrc} id="player" controls autoPlay playsInline className="w-full rounded-xl bg-black" src={playerSrc} />
              )
            )}

            <div className="mt-6 grid gap-2">
              {cuts.map((corte) => (
                <div key={corte.id} className="flex justify-between items-center bg-black/30 p-3 rounded-lg border border-white/10">
                  <span className="text-sm text-left">{corte.titulo} ({corte.inicio}s - {corte.fim}s)</span>
                  <div className="flex gap-2">
                    <button onClick={()=>abrirCorte(corte)} className="bg-white/10 px-3 py-1 rounded text-sm">VER</button>
                    <button onClick={()=>baixarVideo(corte)} className="bg-purple-600 px-3 py-1 rounded text-sm">BAIXAR</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
