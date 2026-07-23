import NextAuth from "next-auth";
import { authConfig } from "@/auth.config";

// Runs on the edge for every matched request; the `authorized` callback in
// authConfig decides who gets through and redirects the rest to /login.
export default NextAuth(authConfig).auth;

export const config = {
  // Protect everything except NextAuth's own routes, Next internals and static files.
  matcher: ["/((?!api/auth|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)"],
};
