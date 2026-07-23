import type { NextAuthConfig } from "next-auth";
import Google from "next-auth/providers/google";

/**
 * Edge-safe auth config: providers + route protection only, no database access.
 * The Next.js middleware imports this (it runs on the edge runtime, where
 * mongoose can't run). The full config in lib/auth.ts spreads this and adds the
 * mongoose-backed callbacks that run on the Node.js runtime during sign-in.
 */
export const authConfig: NextAuthConfig = {
  session: { strategy: "jwt" },
  pages: { signIn: "/login" },
  providers: [
    Google({
      clientId: process.env.GOOGLE_ID,
      clientSecret: process.env.GOOGLE_SECRET,
      authorization: {
        params: {
          // Identity + permission to create/write spreadsheets in the user's Drive.
          scope: "openid email profile https://www.googleapis.com/auth/spreadsheets",
          // Required to receive a refresh token we can reuse for background syncs.
          access_type: "offline",
          prompt: "consent",
        },
      },
    }),
  ],
  callbacks: {
    // Everything except the login page and NextAuth's own routes requires a session.
    authorized({ auth, request: { nextUrl } }) {
      const loggedIn = !!auth?.user;
      const isLoginPage = nextUrl.pathname === "/login";
      if (isLoginPage) return true;
      return loggedIn;
    },
  },
};
