"use client";
import { useState } from "react";

export default function Home(){
  const [link, setLink] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  function gerar(){
    if(!link){ alert("Cola o link primeiro!"); return; }
    setLoading(true);
    setTimeout(()=>{
      setResult({
        title: "Vídeo processado com sucesso!",
        cortes: [
          { tempo: "00:12 - 00:45", viral: "98%", texto: "A parte que mais engaja, hook forte" },
          { tempo: "02:30 - 03:10", viral: "92%", texto: "Momento de pico emocional" },
          { tempo: "05:15 - 05:50", viral: "89%", texto: "Call to action perfeito" },
        ]
      });
      setLoading(false);
    }, 2000);
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
