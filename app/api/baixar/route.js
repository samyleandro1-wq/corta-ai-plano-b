export async function GET(request) {
  const { searchParams } = new URL(request.url)
  const id = searchParams.get("id")
  if (!id) return new Response("sem id", { status: 400 })

  // Esse funciona no Brasil, grátis e ilimitado
  return Response.redirect(`https://www.ssyoutube.com/watch?v=${id}`)
}
