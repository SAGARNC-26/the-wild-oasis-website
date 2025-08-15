import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import { createGuest, getGuest } from "./data-service";

const authConfig = {
  providers: [
    Google({
      clientId: process.env.AUTH_GOOGLE_ID,
      clientSecret: process.env.AUTH_GOOGLE_SECRET,
    }),
  ],
  callbacks: {
    authorized({ auth, request }) {
      return !!auth?.user;
    },
    async signIn({ user, account, profile }) {
      // Custom sign-in logic can be added here
      try {
        const existingUser = await getGuest(user.email);
        if (!existingUser) {
          // If the user does not exist, you can create a new guest user
          await createGuest({ email: user.email, fullName: user.name });
        }
        return true;
      } catch {
        return false;
      }
    },

    async jwt({ token, user }) {
      if (user?.email) {
        token.email = user.email;
      }
      //console.log("JWT token:", token);
      return token;
    },
    async session({ session, token }) {
      if (session?.user && token?.email) {
        const guest = await getGuest(token.email);
        session.user.guestId = guest?.id;
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
};
export const {
  auth,
  signIn,
  signOut,
  handlers: { GET, POST },
} = NextAuth(authConfig);
