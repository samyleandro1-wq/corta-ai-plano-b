export async function GET(request) {
  const { searchParams } = new URL(request.url)
  const id = searchParams.get("id")
  if (!id) return new Response("sem id", { status: 400 })

  try {
    // Pega o link direto do vídeo - funciona no Brasil
    const res = await fetch(`https://pipedapi.kavin.rocks/streams/${id}`, {
      headers: { "User-Agent": "Mozilla/5.0" }
    })
    const data = await res.json()

    // Pega o melhor MP4 com áudio (720p ou 360p)
    const video = data.videoStreams?.find(v => v.mimeType?.includes("mp4") && v.quality?.includes("720p")) 
               || data.videoStreams?.find(v => v.mimeType?.includes("mp4"))
               || data.audioStreams?.[0]

    if (video?.url) {
      return Response.redirect(video.url)
    }
  } catch (e) {
    console.log("erro piped", e)
  }

  // Se falhar, manda pra um que NUNCA é bloqueado no Brasil
  return Response.redirect(`https://en.savefrom.net/1-youtube-video-downloader-8/?url=https://www.youtube.com/watch?v=${id}`)
}
