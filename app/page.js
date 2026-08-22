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

  function pegarID(link){
    let v = link;
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
    const isVitalicio = EMAILS_VITALICIOS.includes(email);
    const totalCortes = isVitalicio? 10 : 1;
    const novosCortes = Array.from({ length: totalCortes }).map((_, i) => {
      const inicio = Math.floor(Math.random() * 2000);
      return {
        inicio: inicio,
        fim: inicio + 60,
        titulo: `Corte ${i+1} - 1 minuto`,
        link: `https://www.youtube.com/watch?v=${videoId}&t=${inicio}s`
      }
    });
    setCuts(novosCortes);
    setLoading(false);
  }

  return (
    <div className="min-h-screen bg-[#0a0614] text-white">
      <header className="flex justify-between items-center p-4 max-w-6xl mx-auto">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">✂️</div>
          <span className="font-bold text-xl">Corta<span className="text-purple-400">AI</span></span>
        </div>
        <div className="flex gap-3">
          <button className="px-4 py-2">Entrar</button>
          <button onClick={()=>document.getElementById('corte')?.scrollIntoView()} className="bg-gradient-to-r from-purple-500 to-pink-500 px-5 py-2 rounded-full font-bold">Criar Conta</button>
        </div>
      </header>
      <main className="max-w-6xl mx-auto px-4 text-center mt-12">
        <div className="inline-block bg-white/10 px-4 py-1 rounded-full text-sm mb-6">✨ IA de última geração</div>
        <h1 className="text-5xl md:text-7xl font-black leading-tight">Transforme vídeos<br/>longos em <span className="bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">cortes</span><br/><span className="bg-gradient-to-r from-pink-400 to-orange-400 bg-clip-text text-transparent">virais</span> em 1 clique</h1>
        <div className="flex flex-col gap-4 max-w-sm mx-auto mt-8">
          <button onClick={()=>document.getElementById('corte')?.scrollIntoView()} className="bg-gradient-to-r from-purple-500 to-pink-500 py-4 rounded-xl font-bold">⚡ Testar Grátis 1 Corte</button>
          <a href={LINK_PAGAMENTO} target="_blank" className="border border-white/20 py-4 rounded-xl font-bold block">👑 Assinar Agora R$9,90</a>
        </div>
        <div id="corte" className="mt-16 bg-white/5 p-6 rounded-2xl max-w-2xl mx-auto border border-white/10">
          <input value={email} onChange={e=>setEmail(e.target.value)} placeholder="Seu email" className="w-full p-4 rounded-xl bg-black/50 border border-white/10 mb-3" />
          <input value={url} onChange={e=>setUrl(e.target.value)} placeholder="Cole o link do YouTube aqui" className="w-full p-4 rounded-xl bg-black/50 border border-white/10" />
          <button onClick={cortarReal} disabled={loading} className="w-full mt-3 bg-white text-black py-4 rounded-xl font-black">{loading? "CORTANDO..." : "ENVIAR PRO CORTE REAL"}</button>
          {id && <div className="mt-6 grid gap-3">{cuts.map((c, i) => (<div key={i} className="bg-black/50 p-3 rounded-xl text-left"><p className="font-bold">{c.titulo}</p><iframe className="w-full h-48 mt-2 rounded-xl" src={`https://www.youtube.com/embed/${id}?start=${c.inicio}`} allowFullScreen></iframe></div>))}</div>}
        </div>
      </main>
    </div>
  )
}
  return (
    <div style={{background:"#000", color:"#fff", minHeight:"100vh", fontFamily:"sans-serif"}}>
      <header style={{padding:"20px", borderBottom:"1px solid #222", display:"flex", justifyContent:"space-between", alignItems:"center"}}>
        <h1 style={{fontWeight:"900", fontSize:"24px"}}>CORTA AI ✂️</h1>
        <span style={{background:"#22c55e", color:"#000", padding:"5px 12px", borderRadius:"20px", fontSize:"12px", fontWeight:"bold"}}>BETA</span>
      </header>

      <main style={{maxWidth:"800px", margin:"0 auto", padding:"40px 20px", textAlign:"center"}}>
        <h2 style={{fontSize:"48px", fontWeight:"900", lineHeight:"1.1"}}>Transforme qualquer vídeo <br/><span style={{color:"#ff0055"}}>em cortes virais</span></h2>
        <p style={{color:"#888", marginTop:"15px"}}>Cole o link do YouTube, Podcast ou TikTok e a IA encontra os melhores momentos</p>

        <div style={{background:"#111", padding:"20px", borderRadius:"20px", marginTop:"40px", border:"1px solid #222"}}>
          <input value={link} onChange={e=>setLink(e.target.value)} placeholder="https://youtube.com/watch?v=..." style={{width:"100%", padding:"18px", borderRadius:"12px", border:"1px solid #333", background:"#000", color:"#fff", fontSize:"16px"}}/>
          <button onClick={gerar} disabled={loading} style={{width:"100%", marginTop:"15px", background: loading ? "#555" : "#ff0055", color:"#fff", padding:"18px", borderRadius:"12px", border:"none", fontWeight:"900", fontSize:"16px", cursor:"pointer"}}>
            {loading ? "ANALISANDO COM IA..." : "GERAR CORTES VIRAIS →"}
          </button>
        </div>

        {result && (
          <div style={{marginTop:"40px", textAlign:"left"}}>
            <h3 style={{fontSize:"22px", fontWeight:"bold"}}>✅ {result.title}</h3>
            {result.cortes.map((c,i)=>(
              <div key={i} style={{background:"#111", border:"1px solid #222", padding:"20px", borderRadius:"15px", marginTop:"15px", display:"flex", justifyContent:"space-between", alignItems:"center"}}>
                <div>
                  <div style={{fontWeight:"bold"}}>{c.tempo}</div>
                  <div style={{color:"#888", fontSize:"14px", marginTop:"5px"}}>{c.texto}</div>
                </div>
                <div style={{background:"#22c55e", color:"#000", padding:"8px 14px", borderRadius:"20px", fontWeight:"900"}}>{c.viral} VIRAL</div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
