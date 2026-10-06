import { NextResponse } from "next/server";

export function proxy(request) {
  const { pathname } = request.nextUrl;
  const authRoutes = ["/auth/login", "/auth/signup"];
  // if (authRoutes.includes(pathname)) {
  //   return NextResponse.redirect(new URL("/dashboard", request.url));
  // }
  // if (authRoutes.includes(pathname)) {
  //   return NextResponse.redirect(new URL("/dashboard", request.url));
  // }
  // if (pathname === "/") {
  //   return NextResponse.redirect(new URL("/dashboard", request.url));
  // }
  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next|api|favicon.ico).*)"],
};
