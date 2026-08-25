export async function POST(req) {
  try {
    const { videoId } = await req.json();
    
    const cobalt = await fetch("https://api.cobalt.tools/api/json", {
      method: "POST",
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        url: `https://www.youtube.com/watch?v=${videoId}`,
        vQuality: "720",
        filenamePattern: "basic"
      })
    });

    const data = await cobalt.json();
    
    if (!data.url) {
      return Response.json({ error: "não gerou link" }, { status: 500 });
    }

    return Response.json({ url: data.url });

  } catch (e) {
    return Response.json({ error: e.message }, { status: 500 });
  }
}
