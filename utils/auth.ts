import { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import SpotifyProvider from "next-auth/providers/spotify";
import type { SpotifyProfile } from "next-auth/providers/spotify";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import type { Adapter, AdapterAccount } from "next-auth/adapters";
import prisma from "@/utils/db";
import bcrypt from "bcryptjs";

/**
 * Spotify's `id` is no longer guaranteed stable (May 2026). Use `account_id` for
 * providerAccountId going forward. When a returning user signs in with a new id,
 * replace their existing Spotify Account row in place instead of creating a duplicate.
 */
function createAdapter(): Adapter {
  const adapter = PrismaAdapter(prisma);

  return {
    ...adapter,
    async linkAccount(account: AdapterAccount) {
      if (account.provider === "spotify" && account.userId) {
        const existing = await prisma.account.findFirst({
          where: { userId: account.userId, provider: "spotify" },
        });

        if (existing && existing.providerAccountId !== account.providerAccountId) {
          await prisma.$transaction(async (tx) => {
            await tx.account.delete({
              where: {
                provider_providerAccountId: {
                  provider: "spotify",
                  providerAccountId: existing.providerAccountId,
                },
              },
            });
            await tx.account.create({ data: account });
          });
          return;
        }
      }

      return adapter.linkAccount!(account);
    },
  };
}

export const authOptions: NextAuthOptions = {
    adapter: createAdapter(),
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
        },
        // Required so existing users can re-link when Spotify rotates `id` → `account_id`.
        // Spotify verifies emails; only enabled for this provider.
        allowDangerousEmailAccountLinking: true,
        profile(profile: SpotifyProfile & { account_id?: string }) {
          return {
            id: profile.account_id ?? profile.id,
            name: profile.display_name,
            email: profile.email,
            image: profile.images?.[0]?.url,
          };
        },
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