  async function abrirCorte(corte){
    setCorteAtual(corte);
    setPlayerSrc("");
    try {
      const res = await fetch(`/api/baixar?videoId=${corte.videoId}&json=1`);
      const data = await res.json();
      console.log("MP4 URL:", data.url); // pra você ver no console
      if(!data.url) throw new Error("sem url");
      setPlayerSrc(`${data.url}#t=${corte.inicio},${corte.fim}`);
    } catch(e) {
      alert("Erro ao carregar MP4: " + e.message + " - verifica seu /api/baixar/route.js");
    }
  }
