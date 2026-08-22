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
const isVitalicio = EMAILS_VITALICIOS.includes(email.toLowerCase().trim());   
  const totalCortes = (isVitalicio || isPago) ? 10 : 1;    
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
  function copiarLink(link) {
    navigator.clipboard.writeText(link);
    alert("Copiado! Já pode colar no TikTok");
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
{id && <div className="mt-6 grid gap-3">{cuts.map((c,i)=>(
<div key={i} className="bg-black/50 p-3 rounded-xl text-left">
<p className="font-bold text-white">{c.titulo} - {c.inicio}s até {c.fim}s</p>
<div className="flex gap-2 mt-2">
<a href={c.link} target="_blank" className="bg-white text-black px-3 py-2 rounded-lg text-sm font-bold">ABRIR</a>
<button onClick={()=>copiarLink(c.link)} className="bg-purple-600 text-white px-3 py-2 rounded-lg text-sm font-bold">COPIAR LINK</button>
</div>
</div>
))}</div>}          
      </main>
    </div>
  )
