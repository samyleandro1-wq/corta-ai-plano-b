import { NextResponse } from "next/server";
export async function GET(req){
  const id = new URL(req.url).searchParams.get("id");
  return NextResponse.redirect(`https://www.yout.com/watch?v=${id}`);
}
