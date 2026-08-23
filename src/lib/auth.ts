import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { z } from "zod";
import { dbConnect } from "@/lib/db";
import { AdminUser } from "@/models";

const credentialsSchema = z.object({
  email: z.email(),
  password: z.string().min(1),
});

export const { handlers, auth, signIn, signOut } = NextAuth({
  session: { strategy: "jwt" },
  pages: {
    signIn: "/admin/login",
  },
  providers: [
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(rawCredentials) {
        const parsed = credentialsSchema.safeParse(rawCredentials);
        if (!parsed.success) return null;

        if (!process.env.MONGODB_URI) {
          console.error("[auth] MONGODB_URI is not configured — cannot authenticate.");
          return null;
        }

        await dbConnect();
        const user = await AdminUser.findOne({ email: parsed.data.email.toLowerCase() });
        if (!user) return null;

        const valid = await user.comparePassword(parsed.data.password);
        if (!valid) return null;

        user.lastLoginAt = new Date();
        await user.save();

        return {
          id: String(user._id),
          email: user.email,
          name: user.name ?? user.email,
          role: user.role,
        };
      },
    }),
  ],
  callbacks: {
    jwt({ token, user }) {
      if (user) token.role = (user as { role?: string }).role ?? "admin";
      return token;
    },
    session({ session, token }) {
      if (session.user) {
        (session.user as { role?: string }).role = token.role as string | undefined;
      }
      return session;
    },
  },
});
