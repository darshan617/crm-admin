import { NextResponse } from "next/server";

export function proxy(request) {
  const token = request.cookies.get("CRM_USER")?.value;
  const { pathname } = request.nextUrl;
  const authRoutes = ["/auth/login"];
  const isAuthRoute = authRoutes.includes(pathname);

  if (!token) {
    return isAuthRoute
      ? NextResponse.next()
      : NextResponse.redirect(new URL("/auth/login", request.url));
  }

  if (authRoutes.includes(pathname)) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  if (pathname === "/") {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next|api|favicon.ico|images|icons|assets).*)"],
};
