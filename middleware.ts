import NextAuth from "next-auth";
import type { NextAuthConfig } from "next-auth";

const authConfig = {
  providers: [],
  callbacks: {
    authorized({ request, auth }: any) {
      const protectedPaths = [
        /\/shipping/,
        /\/payment/,
        /\/place-order/,
        /\/profile/,
        /\/order\/(.*)/,
        /\/admin/,
      ];
      const { pathname } = request.nextUrl;
      if (protectedPaths.some((p) => p.test(pathname)))
        return Boolean(auth?.user);
      return true;
    },
  },
} satisfies NextAuthConfig;

export const authMiddleware = NextAuth(authConfig);
export const middleware = authMiddleware.auth;

export const config = {
  runtime: "edge",
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
