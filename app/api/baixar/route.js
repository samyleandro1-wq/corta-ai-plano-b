export const dynamic = 'force-dynamic';

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const videoId = searchParams.get("videoId");

  const resCobalt = await fetch("https://api.cobalt.tools/api/json", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Accept": "application/json"
    },
    body: JSON.stringify({
      url: `https://www.youtube.com/watch?v=${videoId}`,
      vQuality: "720"
    })
  });

  const data = await resCobalt.json();

  // Joga o MP4 direto pro download do PC/Android
  return Response.redirect(data.url, 302);
}
