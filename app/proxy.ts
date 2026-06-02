import { NextResponse, type NextRequest } from "next/server";

export function proxy(request: NextRequest) {
  if (
    process.env.NODE_ENV === "production" &&
    process.env.DEAL_FINDER_ADMIN_ENABLED !== "true"
  ) {
    return new NextResponse("Admin routes are disabled in production.", {
      status: 404
    });
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"]
};
