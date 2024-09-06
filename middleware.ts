import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

const privateRoutes = ["/profile", "/settings"];
const publicRoutes = ["/login", "/signup"];
const adminRoutes = ["/admin"];
const posterRoutes = ["/poster"];

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const token = req.cookies.get("session")?.value;

  if (publicRoutes.includes(pathname)) {
    if (token) {
      return NextResponse.redirect(new URL("/", req.url));
    }
    return NextResponse.next();
  }

  if (
    !privateRoutes.includes(pathname) &&
    !adminRoutes.some((route) => pathname.startsWith(route)) &&
    !posterRoutes.includes(pathname)
  ) {
    return NextResponse.next();
  }

  if (!token) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  try {
    const { payload } = await jwtVerify(
      token,
      new TextEncoder().encode("secret")
    );

    if (
      !payload.user ||
      !Array.isArray((payload.user as { roles?: string[] }).roles)
    ) {
      return NextResponse.redirect(new URL("/", req.url));
    }

    const userRoles =
      (payload.user as { roles?: { name: string }[] }).roles?.map(
        (role) => role.name
      ) || [];
    //console.log('User roles:', userRoles);

    if (
      posterRoutes.includes(pathname) &&
      !userRoles.includes("POSTER") &&
      !userRoles.includes("ADMIN")
    ) {
      return NextResponse.redirect(new URL("/", req.url));
    }

    if (pathname.startsWith("/admin") && !userRoles.includes("ADMIN")) {
      return NextResponse.redirect(new URL("/", req.url));
    }

    return NextResponse.next();
  } catch (error) {
    console.error("Error verifying token:", error);
    return NextResponse.redirect(new URL("/login", req.url));
  }
}
