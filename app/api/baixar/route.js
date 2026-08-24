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
