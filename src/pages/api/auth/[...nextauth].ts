import NextAuth, { DefaultSession, NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import prisma from "../../../lib/db";

declare module "next-auth" {
  interface Session extends DefaultSession {
    user: {
      id: string;
      // ...other properties
      // role: UserRole;
    } & DefaultSession["user"];
  }

  // interface User {
  //   // ...other properties
  //   // role: UserRole;
  // }
}

const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      type: "credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },

      async authorize(credentials, req) {
        const user = await prisma.account.findFirst({
          where: { email: credentials?.email, password: credentials?.password },
        });

        if (user) {
          return user;
        } else {
          return null;
        }
      },
    }),
  ],
  callbacks: {
    session({ session, user }) {
      return session;
    },
  },
};

export default NextAuth(authOptions);
