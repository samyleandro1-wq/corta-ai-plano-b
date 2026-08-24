export async function GET(req){
  const {searchParams} = new URL(req.url)
  const id = searchParams.get("id")
  if(!id) return new Response("sem id", {status:400})

  // Tenta baixar rápido via API grátis
  try{
    const r = await fetch("https://api.cobalt.tools/api/json",{
      method:"POST",
      headers:{"Content-Type":"application/json","Accept":"application/json"},
      body: JSON.stringify({url:`https://youtube.com/watch?v=${id}`, vQuality:"720"})
    })
    const j = await r.json()
    if(j.url) return Response.redirect(j.url)
  }catch(e){}

  // Se falhar, vai pro loader que é mais rápido que o yout.com
  return Response.redirect(`https://loader.to/api/button/?url=https://youtube.com/watch?v=${id}&f=mp4&c=720p`)
}
