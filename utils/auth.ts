import { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import SpotifyProvider from "next-auth/providers/spotify";
import {PrismaAdapter} from '@next-auth/prisma-adapter';
import prisma from "@/utils/db";
import bcrypt from "bcryptjs";

export const authOptions: NextAuthOptions = {
    adapter: PrismaAdapter(prisma),
    providers: [
      GoogleProvider({
          clientId: process.env.GOOGLE_CLIENT_ID as string,
          clientSecret: process.env.GOOGLE_CLIENT_SECRET as string
        }),
      SpotifyProvider({
        clientId: process.env.SPOTIFY_CLIENT_ID as string,
        clientSecret: process.env.SPOTIFY_CLIENT_SECRET as string,
        authorization: {
          params: {
            scope: 'playlist-modify-public playlist-modify-private user-read-email'
          }
        }
      }),
      CredentialsProvider({
        name: "credentials",
        credentials: {
          email: { label: "Email", type: "email" },
          password: { label: "Password", type: "password" }
        },
        async authorize(credentials) {
          if (!credentials?.email || !credentials?.password) {
            throw new Error("Invalid credentials");
          }

          const user = await prisma.user.findUnique({
            where: {
              email: credentials.email
            },
          });

          if (!user || !user.password) {
            throw new Error("Invalid credentials");
          }

          const isCorrectPassword = await bcrypt.compare(
            credentials.password,
            user.password
          );

          if (!isCorrectPassword) {
            throw new Error("Invalid credentials");
          }

          return user;
        }
      })
    ],
    session: {
      strategy: "jwt"
    },
    secret: process.env.NEXTAUTH_SECRET as string,
    pages: {
      signIn: "/login",
    },
    callbacks: {
      async session({ token, session }) {
        if (token && session.user) {
          (session.user as any).id = token.id as string;
          session.user.name = token.name as string;
          session.user.email = token.email as string;
          session.user.image = token.picture as string;
          if (token.accessToken) {
            (session as any).accessToken = token.accessToken;
          }
          if (token.refreshToken) {
            (session as any).refreshToken = token.refreshToken;
          }
          if (token.expiresAt) {
            (session as any).expiresAt = token.expiresAt;
          }
        }
        return session;
      },
      async jwt({ token, user, account, profile }) {
        // Handle Spotify access token and refresh token
        if (account && account.provider === 'spotify') {
          token.accessToken = account.access_token;
          token.refreshToken = account.refresh_token;
          token.expiresAt = account.expires_at;
        }
        // If signing in with Google, update the image from the provider profile
        if (account && profile && account.provider === 'google') {
          token.picture = (profile as any).picture || undefined;
        } else if (user && user.image) {
          // For credentials or other providers, use the user image if available
          token.picture = user.image;
        }
        if (user) {
          token.id = user.id;
        }
        // Always update the rest of the token fields from the database if possible
        let dbUser = null;
        if (token.email) {
          dbUser = await prisma.user.findFirst({
            where: { email: token.email as string },
          });
        }
        if (!dbUser && token.id) {
          dbUser = await prisma.user.findUnique({
            where: { id: token.id as string },
          });
        }
        if (!dbUser) {
          return token;
        }
        return {
          id: dbUser.id,
          name: dbUser.name,
          email: dbUser.email,
          picture: (typeof token.picture === 'string' ? token.picture : dbUser.image) || dbUser.image || undefined,
          accessToken: token.accessToken,
          refreshToken: token.refreshToken,
          expiresAt: token.expiresAt,
        };
      },
      async redirect({ url, baseUrl }) {
        // Allows relative callback URLs
        if (url.startsWith("/")) return `${baseUrl}${url}`
        // Allows callback URLs on the same origin
        else if (new URL(url).origin === baseUrl) return url
        return baseUrl
      },
    },
}