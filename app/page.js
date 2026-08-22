"use client";
import { useState } from "react";

export default function Home() {
  const [link, setLink] = useState("");
  return (
    <div style={{background:"black", color:"white", minHeight:"100vh", padding:"20px", textAlign:"center"}}>
      <h1 style={{fontSize:"40px", fontWeight:"bold", marginTop:"50px"}}>CORTA AI ✂️</h1>
      <p style={{marginTop:"20px", color:"#aaa"}}>Cole o link do seu vídeo</p>
      <input 
        value={link}
        onChange={(e)=>setLink(e.target.value)}
        placeholder="https://..."
        style={{width:"100%", maxWidth:"400px", padding:"15px", marginTop:"20px", borderRadius:"10px", border:"none"}}
      />
      <br/>
      <button style={{background:"#ff0050", color:"white", padding:"15px 30px", marginTop:"20px", borderRadius:"10px", border:"none", fontWeight:"bold", fontSize:"18px"}}>
        GERAR CORTES VIRAL
      </button>
      <p style={{marginTop:"30px", color:"#555"}}>Site funcionando! ✅</p>
    </div>
  )
}
