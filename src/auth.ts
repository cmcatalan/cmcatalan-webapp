import NextAuth, { User } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { userApi } from "@/types";
import { decodeJwt } from "jose";
import { loginSchema } from "./lib/zod";
import { ZodError } from "zod";

const maxAgeSeconds = 86400; // 24h

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      credentials: {
        email: {},
        password: {},
      },
      async authorize(credentials) {
        try {
          if (!credentials.email || !credentials.password) {
            return null;
          }

          const { email, password } = await loginSchema.parseAsync(credentials);

          const loginResponse = await userApi.POST("/api/Auth/Login", {
            body: {
              email: email,
              password: password,
            },
          });

          const jwtToken = loginResponse?.data?.accessToken;
          if (!jwtToken) {
            return null;
          }

          const decodedToken = decodeJwt(jwtToken);

          if (decodedToken === null) {
            return null;
          }

          return {
            id: decodedToken.sub,
            name: decodedToken.name,
            company: decodedToken.company,
            email: decodedToken.email,
            roles: (decodedToken.roles as string).split(","),
            token: jwtToken,
          } as User;
        } catch (error) {
          if (error instanceof ZodError) {
            return null;
          }
          throw new Error("Something went wrong in the login process");
        }
      },
    }),
  ],
  pages: {
    signIn: "/login",
  },
  session: {
    maxAge: maxAgeSeconds,
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.company = user.company;
        token.roles = user.roles;
        token.token = user.token;
      }
      return token;
    },
    async session({ session, token }) {
      session.user.id = token.id as string;
      session.user.company = token.company as string;
      session.user.roles = token.roles as string[];
      session.user.token = token.token as string;
      return session;
    },
  },
});
