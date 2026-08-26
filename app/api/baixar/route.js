export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const videoId = searchParams.get("videoId");
  
  if (!videoId) return new Response("sem videoId", { status: 400 });

  // Redireciona direto pro baixador - sem fetch na Vercel
  // Isso funciona em PC, Android e iPhone
  const downloadUrl = `https://www.y2mate.is/youtube/${videoId}`;
  
  return Response.redirect(downloadUrl, 302);
}
