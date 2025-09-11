import { NextResponse } from "next/server";

export async function GET() {
  console.log("✅ API /api/test hit");

  return NextResponse.json({ hello: "world" });
}
