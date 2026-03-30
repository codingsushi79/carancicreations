import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/lib/prisma";
import { isManagerEmail } from "@/lib/managers";

export const { handlers, auth, signIn, signOut } = NextAuth({
  trustHost: true,
  secret: process.env.AUTH_SECRET,
  adapter: PrismaAdapter(prisma),
  session: { strategy: "jwt", maxAge: 30 * 24 * 60 * 60 },
  providers: [
    Google({
      clientId: process.env.AUTH_GOOGLE_ID,
      clientSecret: process.env.AUTH_GOOGLE_SECRET,
    }),
  ],
  pages: {
    signIn: "/login",
    error: "/login",
  },
  callbacks: {
    async jwt({ token, user }) {
      const sub = (user?.id ?? token.sub) as string | undefined;
      if (!sub) return token;

      try {
        if (user?.email) {
          const role = isManagerEmail(user.email) ? "MANAGER" : "USER";
          await prisma.user.update({
            where: { id: sub },
            data: { role },
          });
        }

        const dbUser = await prisma.user.findUnique({
          where: { id: sub },
          select: { role: true },
        });
        token.role = dbUser?.role ?? "USER";
      } catch (err) {
        console.error("[auth] jwt callback:", err);
        token.role =
          user?.email && isManagerEmail(user.email) ? "MANAGER" : "USER";
      }
      return token;
    },
    session({ session, token }) {
      if (session.user) {
        session.user.id = (token.sub as string) ?? "";
        session.user.role = (token.role as "USER" | "MANAGER") ?? "USER";
      }
      return session;
    },
  },
});

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role: "USER" | "MANAGER";
      name?: string | null;
      email?: string | null;
      image?: string | null;
    };
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    role?: "USER" | "MANAGER";
  }
}
