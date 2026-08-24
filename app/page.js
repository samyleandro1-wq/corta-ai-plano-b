"use client";
import { useState, useEffect } from "react";

const EMAILS_VITALICIOS = ["samyleandro1@gmail.com"]
const LINK_PAGAMENTO = "https://payment-link-v3.stone.com.br/pl_JZqWpY3oz7PaYgmf86hxb9w6LeyBKRGA"
const LINK_MAKE = "https://hook.us2.make.com/1fz4oz342xcd3yjc"

export default function Page() {
  const [url, setUrl] = useState("");"use client";
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
    if(!email) return alert("Cola seu email pra receber o corte");
    setLoading(true);
    const videoId=pegarID(url);
    setId(videoId);
    const isVitalicio=EMAILS_VITALICIOS.map(e=>e.toLowerCase()).includes(email.toLowerCase().trim());
    const totalCortes=(isVitalicio || isPago)? 10 : 1;
    const novosCortes=Array.from({length: totalCortes}).map((_, i)=>{
      const inicio=60+(i*150)+Math.floor(Math.random()*100);
      return { id:i, inicio, fim:inicio+60, titulo:`Corte ${i+1} - 1 minuto`, link:`https://www.youtube.com/embed/${videoId}?start=${inicio}&end=${inicio+60}` }
    });
    setCuts(novosCortes);
    setLoading(false);
  }

  function abrirCorte(corte){
    setCorteAtual(corte);
    setTimeout(()=>{
      const player=document.getElementById('player-do-corte');
      if(player){
        player.src=`https://www.youtube.com/embed/${id}?start=${corte.inicio}&end=${corte.fim}&autoplay=1`;
        player.scrollIntoView({behavior:'smooth'});
      }
    },100)
  }

  return (
    <div className="min-h-screen bg-[#0a0614] text-white">
      <header className="flex justify-between items-center p-4 max-w-6xl mx-auto">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">✂️</div>
          <span className="font-bold text-xl">Corta<span className="text-purple-400">AI</span></span>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 text-center mt-12">
        <div className="inline-block bg-white/10 px-4 py-1 rounded-full text-sm mb-6">✨ IA de última geração</div>
        <h1 className="text-5xl md:text-7xl font-black leading-tight">Transforme videos<br/>longos em cortes virais</h1>

        {/* OS 2 BOTÕES QUE FALTAVAM - VOLTEI */}
        <div className="flex flex-col gap-4 max-w-sm mx-auto mt-8">
          <button onClick={cortarReal} className="bg-gradient-to-r from-purple-500 to-pink-500 py-4 rounded-xl font-bold">⚡ Testar Grátis 1 Corte</button>
          <a href={LINK_PAGAMENTO} target="_blank" className="bg-white/10 border border-white/20 py-4 rounded-xl font-bold">🔓 Desbloquear 10 cortes - R$ 9,90</a>
        </div>

        <div id="corte" className="mt-16 bg-white/5 p-6 rounded-2xl max-w-2xl mx-auto border border-white/10">
          <input value={email} onChange={e=>setEmail(e.target.value)} placeholder="Seu email" className="w-full p-3 rounded-lg bg-black/50 border border-white/10 text-white mb-3" type="email"/>
          <input value={url} onChange={e=>setUrl(e.target.value)} placeholder="Cole o link do YouTube aqui" className="w-full p-4 rounded-xl bg-black/50 border border-white/10 mb-3"/>
          <button onClick={cortarReal} disabled={loading} className="w-full mt-3 bg-white text-black py-4 rounded-xl font-black">{loading? "CORTANDO..." : "ENVIAR PRO CORTE REAL"}</button>

          {cuts.length>0 && (
            <div className="mt-6 grid gap-3 text-left">
              {cuts.map(corte=>(
                <div key={corte.id} className="bg-black/50 p-4 rounded-xl flex justify-between items-center">
                  <span>{corte.titulo}</span>
                  <div className="flex gap-2">
                    <button onClick={()=>abrirCorte(corte)} className="bg-purple-600 px-3 py-1 rounded">Ver</button>
                    <a href={`/api/baixar?id=${id}&start=${corte.inicio}`} className="bg-green-600 px-3 py-1 rounded">Baixar</a>
                  </div>
                </div>
              ))}
            </div>
          )}

          {corteAtual && (
            <iframe id="player-do-corte" className="w-full h-[350px] mt-8 rounded-xl" src={`https://www.youtube.com/embed/${id}?start=${corteAtual.inicio}&end=${corteAtual.fim}`} allowFullScreen></iframe>
          )}
        </div>
      </main>
    </div>
  );
}
  const [cuts, setCuts] = useState([]);
  const [id, setId] = useState("");
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [isPago, setIsPago] = useState(false);
  const [corteAtual, setCorteAtual] = useState(null);

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
    if(!email) return alert("Cola seu email pra receber o corte");
    setLoading(true);
    const videoId=pegarID(url);
    setId(videoId);
    const isVitalicio=EMAILS_VITALICIOS.map(e=>e.toLowerCase()).includes(email.toLowerCase().trim());
    const totalCortes=(isVitalicio || isPago)? 10 : 1;
    const novosCortes=Array.from({length: totalCortes}).map((_, i)=>{
      const inicio=60+(i*150)+Math.floor(Math.random()*100);
      return { id:i, inicio, fim:inicio+60, titulo:`Corte ${i+1} - 1 minuto`, link:`https://www.youtube.com/embed/${videoId}?start=${inicio}&end=${inicio+60}` }
    });
    setCuts(novosCortes);
    setLoading(false);
  }

  function abrirCorte(corte){
    setCorteAtual(corte);
    setTimeout(()=>{
      const player=document.getElementById('player-do-corte');
      if(player){
        player.src=`https://www.youtube.com/embed/${id}?start=${corte.inicio}&end=${corte.fim}&autoplay=1`;
        player.scrollIntoView({behavior:'smooth'});
      }
    },100)
  }

  return (
    <div className="min-h-screen bg-[#0a0614] text-white">
      <header className="flex justify-between items-center p-4 max-w-6xl mx-auto">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">✂️</div>
          <span className="font-bold text-xl">Corta<span className="text-purple-400">AI</span></span>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 text-center mt-12">
        <div className="inline-block bg-white/10 px-4 py-1 rounded-full text-sm mb-6">✨ IA de última geração</div>
        <h1 className="text-5xl md:text-7xl font-black leading-tight">Transforme videos<br/>longos em cortes virais</h1>

        {/* OS 2 BOTÕES QUE FALTAVAM - VOLTEI */}
        <div className="flex flex-col gap-4 max-w-sm mx-auto mt-8">
          <button onClick={cortarReal} className="bg-gradient-to-r from-purple-500 to-pink-500 py-4 rounded-xl font-bold">⚡ Testar Grátis 1 Corte</button>
          <a href={LINK_PAGAMENTO} target="_blank" className="bg-white/10 border border-white/20 py-4 rounded-xl font-bold">🔓 Desbloquear 10 cortes - R$ 9,90</a>
        </div>

        <div id="corte" className="mt-16 bg-white/5 p-6 rounded-2xl max-w-2xl mx-auto border border-white/10">
          <input value={email} onChange={e=>setEmail(e.target.value)} placeholder="Seu email" className="w-full p-3 rounded-lg bg-black/50 border border-white/10 text-white mb-3" type="email"/>
          <input value={url} onChange={e=>setUrl(e.target.value)} placeholder="Cole o link do YouTube aqui" className="w-full p-4 rounded-xl bg-black/50 border border-white/10 mb-3"/>
          <button onClick={cortarReal} disabled={loading} className="w-full mt-3 bg-white text-black py-4 rounded-xl font-black">{loading? "CORTANDO..." : "ENVIAR PRO CORTE REAL"}</button>

          {cuts.length>0 && (
            <div className="mt-6 grid gap-3 text-left">
              {cuts.map(corte=>(
                <div key={corte.id} className="bg-black/50 p-4 rounded-xl flex justify-between items-center">
                  <span>{corte.titulo}</span>
                  <div className="flex gap-2">
                    <button onClick={()=>abrirCorte(corte)} className="bg-purple-600 px-3 py-1 rounded">Ver</button>
                   async function baixarVideo(videoId) {
  try {
    alert("Preparando download...")

    // Pega link direto do YouTube (não usa site bloqueado)
    const res = await fetch(`https://pipedapi.kavin.rocks/streams/${videoId}`)
    const data = await res.json()

    // Pega um mp4 com áudio
    const stream = data.videoStreams.find(s => !s.videoOnly && s.mimeType.includes("mp4")) 
                || data.videoStreams[0]

    if (!stream?.url) {
      alert("Erro ao pegar vídeo, tentando outro servidor...")
      // tenta segundo servidor
      const res2 = await fetch(`https://pipedapi.adminforge.de/streams/${videoId}`)
      const data2 = await res2.json()
      const stream2 = data2.videoStreams.find(s => !s.videoOnly)
      if (!stream2?.url) throw new Error("sem link")
      
      window.location.href = stream2.url
      return
    }

    // Força o download
    const a = document.createElement("a")
    a.href = stream.url
    a.download = `corte-${videoId}.mp4`
    a.target = "_blank"
    document.body.appendChild(a)
    a.click()
    a.remove()

  } catch (e) {
    console.error(e)
    // Último backup que funciona mesmo com DNS bloqueado
    window.open(`https://piped.video/watch?v=${videoId}`, "_blank")
  }
} 
                  </div>
                </div>
              ))}
            </div>
          )}

          {corteAtual && (
            <iframe id="player-do-corte" className="w-full h-[350px] mt-8 rounded-xl" src={`https://www.youtube.com/embed/${id}?start=${corteAtual.inicio}&end=${corteAtual.fim}`} allowFullScreen></iframe>
          )}
        </div>
      </main>
    </div>
  );
}
