export async function GET(request) {
  const { searchParams } = new URL(request.url)
  const id = searchParams.get("id")
  const start = searchParams.get("start")

  if (!id) return new Response("sem id", { status: 400 })

  // yout.com baixa direto
  const url = `https://yout.com/watch?v=${id}`

  return Response.redirect(url)
}
