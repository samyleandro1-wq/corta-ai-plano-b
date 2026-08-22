import { NextResponse } from 'next/server'

export async function POST(req){
 try{
  const { videoId } = await req.json()
  if(!videoId) return NextResponse.json({ error: "sem videoId" }, { status: 400 })
  
  const ytUrl = `https://www.youtube.com/watch?v=${videoId}`;
  const apiRes = await fetch('https://api.cobalt.tools/api/json', {
   method: 'POST',
   headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
   body: JSON.stringify({ url: ytUrl, vQuality: '1080', filenameStyle: 'basic' })
  })
  const data = await apiRes.json()
  if(!apiRes.ok) return NextResponse.json({ error: data.text || "erro cobalt" }, { status: 500 })
  
  const finalUrl = data.url || data?.picker?.[0]?.url
  return NextResponse.json({ url: finalUrl })
 } catch(e){
  return NextResponse.json({ error: e.message }, { status: 500 })
 }
}