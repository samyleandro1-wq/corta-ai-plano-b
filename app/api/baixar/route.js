import ytdl from "@distube/ytdl-core"

export async function GET(request) {
  const { searchParams } = new URL(request.url)
  const id = searchParams.get("id")
  if (!id) return new Response("sem id", { status: 400 })

  try {
    const url = `https://www.youtube.com/watch?v=${id}`
    const info = await ytdl.getInfo(url)
    
    // Pega o melhor mp4 que já vem com áudio
    const format = ytdl.chooseFormat(info.formats, { 
      quality: "highest",
      filter: f => f.hasAudio && f.hasVideo && f.container === "mp4"
    })

    if (!format?.url) throw new Error("sem formato")

    const res = await fetch(format.url)
    
    return new Response(res.body, {
      headers: {
        "Content-Type": "video/mp4",
        "Content-Disposition": `attachment; filename="corte-${id}.mp4"`,
      }
    })
  } catch (e) {
    console.log(e)
    return new Response("Erro: " + e.message, { status: 500 })
  }
}
