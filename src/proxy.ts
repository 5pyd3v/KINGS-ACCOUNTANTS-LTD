import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";

/**
 * Gate every /admin route except the sign-in page itself.
 */
export default auth((request) => {
  const { pathname } = request.nextUrl;

  if (pathname === "/admin/login") {
    if (request.auth) {
      return NextResponse.redirect(new URL("/admin", request.nextUrl));
    }
    return NextResponse.next();
  }

  if (!request.auth) {
    const signInUrl = new URL("/admin/login", request.nextUrl);
    signInUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(signInUrl);
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/admin/:path*"],
};
