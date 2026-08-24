export async function GET(request) {
  const { searchParams } = new URL(request.url)
  const id = searchParams.get("id")
  if (!id) return new Response("sem id", { status: 400 })

  try {
    // API que pega o link direto do YouTube (googlevideo.com) - não é bloqueada
    const res = await fetch("https://api.cobalt.tools/api/json", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json"
      },
      body: JSON.stringify({
        url: `https://www.youtube.com/watch?v=${id}`,
        vQuality: "720",
        filenamePattern: "basic"
      })
    })

    const data = await res.json()
    
    // Se pegou o link direto, já manda baixar
    if (data.url) {
      return Response.redirect(data.url)
    }
  } catch (e) {
    console.log("erro cobalt", e)
  }

  // Plano B se falhar - outro servidor que não é bloqueado
  try {
    const res2 = await fetch("https://co.wuk.sh/api/json", {
      method: "POST",
      headers: { "Content-Type": "application/json", "Accept": "application/json" },
      body: JSON.stringify({ url: `https://www.youtube.com/watch?v=${id}` })
    })
    const data2 = await res2.json()
    if (data2.url) return Response.redirect(data2.url)
  } catch (e) {}

  // Último backup
  return Response.redirect(`https://www.youtube.com/watch?v=${id}`)
}
