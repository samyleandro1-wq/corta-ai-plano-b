"use client";
import { useState } from "react";

export default function Home(){
  const [link,setLink]=useState("");
  return(
    <div style={{background:"black",color:"white",minHeight:"100vh",padding:"20px",textAlign:"center"}}>
      <h1 style={{fontSize:"42px",fontWeight:"900",marginTop:"60px"}}>CORTA AI ✂️</h1>
      <p style={{color:"#888",marginTop:"10px"}}>O site voltou! Agora vamos colocar o código completo</p>
      <input value={link} onChange={e=>setLink(e.target.value)} placeholder="Cole o link aqui" style={{width:"100%",maxWidth:"400px",padding:"15px",marginTop:"30px",borderRadius:"10px",border:"none",color:"black"}}/>
      <br/>
      <button style={{background:"#ff0055",color:"white",padding:"15px 40px",marginTop:"20px",borderRadius:"10px",border:"none",fontWeight:"bold",fontSize:"18px"}}>GERAR CORTE</button>
    </div>
  )
}
