export const dynamic = 'force-dynamic';

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const videoId = searchParams.get("videoId");
  const querJson = searchParams.get("json") === "1";
  if (!videoId) return Response.json({ error: "sem videoId" }, { status: 400 });

  try {
    const ytRes = await fetch("https://www.youtube.com/youtubei/v1/player?key=AIzaSyA8eiZmM1FaDVjRy-df2KTyQ_vz_yYM39", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        context: { client: { clientName: "ANDROID", clientVersion: "19.09.37", androidSdkVersion: 30 } },
        videoId
      }),
      next: { revalidate: 0 }
    });
    const data = await ytRes.json();
    const all = [...(data?.streamingData?.formats || []),...(data?.streamingData?.adaptiveFormats || [])];
    const mp4 = all.find(f => f.mimeType?.includes("video/mp4") && f.url) || all.find(f => f.url);

    if (!mp4?.url) {
      return Response.json({ error: "bloqueado", url: null, videoId, precisaTrocarDeVideo: true }, { status: 200 });
    }
    if (querJson) return Response.json({ url: mp4.url });
    return Response.redirect(mp4.url, 302);
  } catch (e) {
    return Response.json({ error: e.message, url: null }, { status: 500 });
  }
}
