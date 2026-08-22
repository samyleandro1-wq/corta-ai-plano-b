"use client";
import { useState, useEffect } from "react";

const EMAILS_VITALICIOS = ["samyleandro1@gmail.com"];
const LINK_PAGAMENTO = "https://payment-link-v3.stone.com.br/pl_JZqWpY3oz7PaYgmf86hxb9w6LeyBKRGA";
const OWNER_EMAIL = "samyleandro1@gmail.com";
const PRICE = "R$ 27";
const LS = { users: "corta_users", clips: "corta_clips", session: "corta_session" };

// Componentes simples pra não precisar de pasta components
const Button = ({children, onClick, style, disabled}) => <button onClick={onClick} disabled={disabled} style={{padding:'12px 20px',borderRadius:'10px',border:'none',cursor:'pointer',fontWeight:'bold',background:'#a855f7',color:'white',...style}}>{children}</button>;
const Card = ({children, style}) => <div style={{background:'#111',border:'1px solid #222',borderRadius:'16px',padding:'20px',...style}}>{children}</div>;

export default function Page(){
  const [route, setRoute] = useState('landing');
  const [url, setUrl] = useState("");
  const [videoId, setVideoId] = useState("");
  const [cuts, setCuts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [duracaoMin, setDuracaoMin] = useState("");
  const [users, setUsers] = useState([]);
  const [session, setSession] = useState(null);

  useEffect(()=>{
    const u = JSON.parse(localStorage.getItem(LS.users) || "[]");
    const s = JSON.parse(localStorage.getItem(LS.session) || "null");
    setUsers(u);
    setSession(s);
    if(s) setRoute('dashboard');
  },[]);

  function pegarID(link){
    let v = link.trim();
    if(v.includes("v=")) v = v.split("v=")[1].split("&")[0];
    if(v.includes("youtu.be/")) v = v.split("youtu.be/")[1].split("?")[0];
    if(v.includes("shorts/")) v = v.split("shorts/")[1].split("?")[0];
    return v;
  }

  // ===== 10 CORTES DE 1 MINUTO ALEATÓRIO QUE PARA DE VERDADE =====
  function cortarReal(){
    if(!url.trim()) return alert("Cola o link do YouTube");
    const id = pegarID(url);
    if(id.length < 5) return alert("Link inválido");
    setLoading(true);
    setVideoId(id);

    let duracaoTotal = 3600; // 1 hora padrão
    if(duracaoMin) duracaoTotal = parseInt(duracaoMin) * 60;

    const novos = [];
    const bloco = Math.floor(duracaoTotal / 10);

    for(let i=0; i<10; i++){
      let inicio;
      if(i===0){
        inicio = 0; // primeiro começa no zero e para no 60
      } else {
        const iniBloco = i * bloco;
        const fimBloco = iniBloco + bloco - 65;
        inicio = Math.floor(Math.random() * (fimBloco - iniBloco + 1)) + iniBloco;
        if(inicio < 0) inicio = iniBloco;
      }
      const fim = inicio + 60; // PARA EXATAMENTE EM 1 MINUTO
      novos.push({
        id: Math.random().toString(36).slice(2,9),
        titulo: `Melhor Momento #${i+1}`,
        inicio,
        fim,
        inicioF: `${Math.floor(inicio/60)}:${String(inicio%60).padStart(2,'0')}`,
        fimF: `${Math.floor(fim/60)}:${String(fim%60).padStart(2,'0')}`,
        score: 88 + Math.floor(Math.random()*12),
      });
    }
    setCuts(novos);
    setLoading(false);
    setRoute('result');
  }

  // ===== TELAS =====
  if(route === 'landing'){
    return (
      <div style={{background:'#0A0A0A',color:'#fff',minHeight:'100vh',fontFamily:'sans-serif'}}>
        <div style={{maxWidth:'900px',margin:'0 auto',padding:'40px 20px',textAlign:'center'}}>
          <h1 style={{fontSize:'56px',fontWeight:'900'}}>CORTA<span style={{color:'#a855f7'}}>AI</span></h1>
          <p style={{opacity:0.7,marginTop:'10px',fontSize:'18px'}}>Transforme vídeos longos em 10 cortes virais de 1 minuto em 1 clique</p>
          <p style={{opacity:0.5,fontSize:'13px',marginTop:'5px'}}>Cada corte começa e PARA sozinho depois de 60s</p>

          <Card style={{maxWidth:'600px',margin:'30px auto',textAlign:'left'}}>
            <input value={url} onChange={e=>setUrl(e.target.value)} placeholder="Cole o link do YouTube" style={{width:'100%',padding:'14px',borderRadius:'10px',border:'none',color:'#000',fontSize:'16px'}}/>
            <div style={{display:'flex',gap:'10px',marginTop:'12px'}}>
              <input value={duracaoMin} onChange={e=>setDuracaoMin(e.target.value)} placeholder="Duração em min (ex: 20) opcional" type="number" style={{flex:1,padding:'12px',borderRadius:'10px',border:'none',color:'#000'}}/>
              <Button onClick={cortarReal} disabled={loading}>{loading? 'CORTANDO...' : 'GERAR 10 CORTES'}</Button>
            </div>
          </Card>

          <div style={{marginTop:'20px'}}>
            <a href={LINK_PAGAMENTO} target="_blank" style={{background:'#fff',color:'#000',padding:'14px 28px',borderRadius:'12px',fontWeight:'900',textDecoration:'none',display:'inline-block'}}>ASSINAR {PRICE}/MÊS</a>
            <div style={{marginTop:'15px',display:'flex',gap:'10px',justifyContent:'center'}}>
              <Button style={{background:'#222'}} onClick={()=>setRoute('login')}>Entrar</Button>
              <Button style={{background:'#222'}} onClick={()=>setRoute('register')}>Criar conta</Button>
            </div>
          </div>
          <p style={{marginTop:'30px',fontSize:'11px',opacity:0.3}}>Email vitalício: {EMAILS_VITALICIOS[0]}</p>
        </div>
      </div>
    )
  }

  if(route === 'result'){
    return (
      <div style={{background:'#050505',color:'#fff',minHeight:'100vh',padding:'20px',fontFamily:'sans-serif'}}>
        <div style={{maxWidth:'800px',margin:'0 auto'}}>
          <Button style={{background:'#222'}} onClick={()=>setRoute('landing')}>← Voltar</Button>
          <h2 style={{textAlign:'center',margin:'20px 0'}}>10 Cortes de 1 Minuto - Aleatórios no Vídeo Inteiro</h2>
          <div style={{display:'grid',gap:'20px'}}>
            {cuts.map(c=>(
              <Card key={c.id} style={{padding:'0',overflow:'hidden'}}>
                <div style={{padding:'12px 16px',display:'flex',justifyContent:'space-between',background:'#151515'}}>
                  <b>{c.titulo} - {c.inicioF} até {c.fimF}</b>
                  <span style={{background:'#a855f7',padding:'4px 10px',borderRadius:'20px',fontSize:'12px'}}>{c.score}% viral</span>
                </div>
                <iframe width="100%" height="220" src={`https://www.youtube.com/embed/${videoId}?start=${c.inicio}&end=${c.fim}&rel=0`} frameBorder="0" allowFullScreen></iframe>
                <div style={{padding:'8px',fontSize:'11px',opacity:0.5,textAlign:'center'}}>Começa em {c.inicio}s e PARA em {c.fim}s (1 minuto exato)</div>
              </Card>
            ))}
          </div>
        </div>
      </div>
    )
  }

  if(route === 'login' || route === 'register'){
    return (
      <div style={{background:'#0A0A0A',color:'#fff',minHeight:'100vh',display:'grid',placeItems:'center',fontFamily:'sans-serif'}}>
        <Card style={{width:'100%',maxWidth:'380px'}}>
          <h2 style={{textAlign:'center',fontSize:'24px',fontWeight:'bold'}}>{route==='login'?'Entrar':'Criar conta'}</h2>
          <input placeholder="email" id="email" style={{width:'100%',marginTop:'20px',padding:'12px',borderRadius:'10px',border:'none',color:'#000'}}/>
          <input placeholder="senha" id="pass" type="password" style={{width:'100%',marginTop:'10px',padding:'12px',borderRadius:'10px',border:'none',color:'#000'}}/>
          <Button style={{width:'100%',marginTop:'15px'}} onClick={()=>{
            const email = document.getElementById('email').value;
            const pass = document.getElementById('pass').value;
            if(!email||!pass) return alert('Preencha tudo');
            if(route==='register'){
              const nu = [...users, {email, password:pass, paid: EMAILS_VITALICIOS.includes(email), createdAt: new Date().toISOString()}];
              localStorage.setItem(LS.users, JSON.stringify(nu));
              setUsers(nu);
            }
            localStorage.setItem(LS.session, JSON.stringify({email}));
            setSession({email});
            setRoute('dashboard');
          }}>{route==='login'?'Entrar':'Criar conta grátis'}</Button>
          <div style={{textAlign:'center',marginTop:'12px',fontSize:'13px',opacity:0.6}}>
            <span style={{cursor:'pointer',color:'#a855f7'}} onClick={()=>setRoute(route==='login'?'register':'login')}>{route==='login'?'Não tem conta? Criar':'Já tem conta? Entrar'}</span>
            <br/><br/><span style={{cursor:'pointer'}} onClick={()=>setRoute('landing')}>← Voltar pra home</span>
          </div>
        </Card>
      </div>
    )
  }

  if(route === 'dashboard'){
    return (
      <div style={{background:'#0A0A0A',color:'#fff',minHeight:'100vh',padding:'20px',fontFamily:'sans-serif'}}>
        <div style={{maxWidth:'800px',margin:'0 auto',display:'flex',justifyContent:'space-between'}}>
          <h1 style={{fontWeight:'900'}}>CORTA<span style={{color:'#a855f7'}}>AI</span> - {session?.email}</h1>
          <Button style={{background:'#222'}} onClick={()=>{localStorage.removeItem(LS.session); setRoute('landing');}}>Sair</Button>
        </div>
        <div style={{maxWidth:'800px',margin:'20px auto'}}>
          <Card>
            <h3>Gerar Novos Cortes</h3>
            <div style={{display:'flex',gap:'10px',marginTop:'12px'}}>
              <input value={url} onChange={e=>setUrl(e.target.value)} placeholder="https://youtube.com/watch?v=..." style={{flex:1,padding:'12px',borderRadius:'10px',border:'none',color:'#000'}}/>
              <Button onClick={cortarReal}>Gerar 10 Cortes</Button>
            </div>
          </Card>
          {cuts.length>0 && <div style={{marginTop:'20px'}}><Button style={{background:'#222',marginBottom:'10px'}} onClick={()=>setRoute('result')}>Ver últimos 10 cortes gerados →</Button></div>}
          <Card style={{marginTop:'20px'}}><p style={{opacity:0.5}}>Seus cortes ficam salvos aqui. Gere um novo pra ver o player que para em 1 minuto!</p></Card>
        </div>
      </div>
    )
  }
  return null;
}
