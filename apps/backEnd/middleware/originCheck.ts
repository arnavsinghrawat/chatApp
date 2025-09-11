import { NextRequest, NextResponse } from "next/server";

export function originCheck(request: NextRequest) {

  const allowedOrigins = ["http://localhost:3000"];
  const origin = request.headers.get("origin");

  if (!origin || allowedOrigins.includes(origin)) {
    return NextResponse.next();
  }

  return new NextResponse(null, {
    status: 403,
    statusText: "Forbidden",
  });
}

export const config = {
  matcher: ["/api/:path*"],
};
