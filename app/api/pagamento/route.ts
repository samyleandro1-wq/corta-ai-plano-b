import { NextResponse } from "next/server";

// Lista temporária - depois a gente liga no banco Vercel KV
// @ts-ignore
if (!globalThis.pagos) globalThis.pagos = {};

export async function POST(req: Request) {
  try {
    const data = await req.json();
    console.log("STONE PAGOU:", JSON.stringify(data));

    // Tenta pegar o e-mail de todo jeito que a Stone manda
    const email = 
      data?.customer?.email || 
      data?.buyer?.email || 
      data?.email || 
      data?.data?.customer?.email || "";

    if (email) {
      // @ts-ignore
      globalThis.pagos[email.toLowerCase().trim()] = Date.now() + 30*24*60*60*1000; // 30 dias
      console.log("LIBERADO 10 CORTES PARA:", email);
    }

    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json({ ok: true });
  }
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const email = searchParams.get("email");
  
  if (email) {
    // @ts-ignore
    const expira = globalThis.pagos?.[email.toLowerCase().trim()];
    const liberado = expira && Date.now() < expira;
    return NextResponse.json({ email, liberado, expira });
  }

  return NextResponse.json({ status: "Webhook da Stone OK! Aguardando pagamento..." });
}
