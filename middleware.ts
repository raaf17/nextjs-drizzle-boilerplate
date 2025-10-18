import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import {
  PUBLIC_ROUTES,
  AUTH_ROUTES,
  ADMIN_ROUTES,
  API_AUTH_PREFIX,
  DEFAULT_LOGIN_REDIRECT,
} from "@/constants/routes";

export default withAuth(
  function middleware(req) {
    const { pathname } = req.nextUrl;
    const token = req.nextauth.token;

    // Check if user is logged in
    const isLoggedIn = !!token;
    const isAdmin = token?.role === "admin";

    // Allow API auth routes
    if (pathname.startsWith(API_AUTH_PREFIX)) {
      return NextResponse.next();
    }

    // Redirect logged in users away from auth pages
    if (isLoggedIn && AUTH_ROUTES.includes(pathname)) {
      return NextResponse.redirect(new URL(DEFAULT_LOGIN_REDIRECT, req.url));
    }

    // Protect admin routes
    if (ADMIN_ROUTES.some((route) => pathname.startsWith(route))) {
      if (!isAdmin) {
        return NextResponse.redirect(new URL("/dashboard", req.url));
      }
    }

    // Allow public routes
    if (PUBLIC_ROUTES.includes(pathname)) {
      return NextResponse.next();
    }

    // Redirect non-logged in users to login
    if (!isLoggedIn && pathname.startsWith("/dashboard")) {
      const loginUrl = new URL("/login", req.url);
      loginUrl.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(loginUrl);
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const { pathname } = req.nextUrl;

        // Allow public routes without authentication
        if (PUBLIC_ROUTES.includes(pathname)) {
          return true;
        }

        // Allow API auth routes
        if (pathname.startsWith(API_AUTH_PREFIX)) {
          return true;
        }

        // Require authentication for all other routes
        return !!token;
      },
    },
    pages: {
      signIn: "/login",
    },
  }
);

export const config = {
  matcher: [
    /*
     * Match all request paths except for:
     * - _next/static (static files)
     * - _next/image (image optimization)
     * - favicon.ico (favicon file)
     * - public folder
     */
    "/((?!_next/static|_next/image|favicon.ico|public).*)",
  ],
};