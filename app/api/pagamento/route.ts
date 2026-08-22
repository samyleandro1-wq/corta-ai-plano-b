import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const data = await req.json();
    console.log("STONE PAGOU:", data);

    // Por enquanto só loga que pagou
    // Depois a gente liga no banco pra liberar automático

    return NextResponse.json({ ok: true, recebido: true });
  } catch (e) {
    return NextResponse.json({ ok: true });
  }
}

export async function GET() {
  return NextResponse.json({ status: "Webhook da Stone OK! Aguardando pagamento..." });
}
