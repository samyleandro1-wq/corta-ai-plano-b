export async function GET(request) {
  const { searchParams } = new URL(request.url)
  const id = searchParams.get("id")
  if (!id) return new Response("sem id", { status: 400 })

  // 100% GRÁTIS E ILIMITADO - sem limite de 1 por dia
  return Response.redirect(`https://loader.to/api/button/?url=https://www.youtube.com/watch?v=${id}&f=mp4_720`)
}
