import { NextResponse, type NextRequest } from "next/server";
import { ACCESS_COOKIE_NAME, verifyAccessCookieValue } from "@/lib/access";

const protectedPaths = ["/dashboard", "/projects", "/programs"];

function isProtectedPath(pathname: string) {
  return protectedPaths.some((path) => {
    return pathname === path || pathname.startsWith(`${path}/`);
  });
}

export async function proxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl;

  if (pathname === "/access") {
    const token = request.cookies.get(ACCESS_COOKIE_NAME)?.value;
    const verified = await verifyAccessCookieValue(token);

    if (verified) {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }

    return NextResponse.next();
  }

  if (!isProtectedPath(pathname)) {
    return NextResponse.next();
  }

  const token = request.cookies.get(ACCESS_COOKIE_NAME)?.value;
  const verified = await verifyAccessCookieValue(token);

  if (verified) {
    return NextResponse.next();
  }

  const accessUrl = new URL("/access", request.url);

  if (pathname !== "/access") {
    accessUrl.searchParams.set("redirect", `${pathname}${search}`);
  }

  return NextResponse.redirect(accessUrl);
}

export const config = {
export const config = {
  matcher: ["/", "/access", "/dashboard/:path*", "/projects/:path*", "/programs/:path*"],
};