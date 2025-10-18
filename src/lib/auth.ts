import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { DatabaseClient } from "@/lib/db-client";
import { PasswordUtil } from "@/modules/auth/utils/password.util";
import { TokenUtil } from "@/modules/auth/utils/token.util";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Email and password required");
        }

        // Find user by email
        const user = await DatabaseClient.findUserByEmail(credentials.email);

        if (!user) {
          throw new Error("Invalid credentials");
        }

        // Check if user is active
        if (!user.isActive) {
          throw new Error("Account is disabled");
        }

        // Verify password
        const isPasswordValid = await PasswordUtil.verify(
          credentials.password,
          user.password
        );

        if (!isPasswordValid) {
          throw new Error("Invalid credentials");
        }

        // Log audit
        await DatabaseClient.createAuditLog({
          userId: user.id,
          action: "login",
          resource: "auth",
          details: "User logged in successfully",
        });

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.email = token.email as string;
        session.user.role = token.role as string;
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
    error: "/login",
  },
  session: {
    strategy: "jwt",
    maxAge: 7 * 24 * 60 * 60, // 7 days
  },
  secret: process.env.NEXTAUTH_SECRET,
};
