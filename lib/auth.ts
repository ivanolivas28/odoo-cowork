import NextAuth from "next-auth";
import { authConfig } from "@/auth.config";
import { connectMongo } from "@/lib/mongodb";
import { User } from "@/models/User";

/**
 * Full auth setup used by server routes/pages. Adds mongoose-backed callbacks
 * on top of the edge-safe authConfig. The `account` object is only populated on
 * the first sign-in (which happens on the Node.js runtime during the OAuth
 * callback), so the mongoose writes here never run on the edge.
 */
export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  callbacks: {
    ...authConfig.callbacks,
    async jwt({ token, account }) {
      // First sign-in: persist the user and their Google tokens.
      if (account) {
        await connectMongo();
        const user = await User.findOneAndUpdate(
          { googleId: token.sub },
          {
            googleId: token.sub,
            email: token.email,
            name: token.name,
            image: token.picture,
            // Google only returns a refresh token on the consent grant; keep the
            // existing one if this login didn't include it.
            ...(account.refresh_token ? { googleRefreshToken: account.refresh_token } : {}),
            googleAccessToken: account.access_token,
            googleTokenExpiry: account.expires_at ? new Date(account.expires_at * 1000) : undefined,
          },
          { upsert: true, new: true }
        );
        token.userId = user._id.toString();
      }
      return token;
    },
    async session({ session, token }) {
      if (token.userId && session.user) {
        session.user.id = token.userId as string;
      }
      return session;
    },
  },
});
