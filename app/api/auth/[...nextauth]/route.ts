import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import {PrismaAdapter} from '@next-auth/prisma-adapter';
import { PrismaClient } from '@prisma/client';
import type { NextAuthOptions } from "next-auth";

const client = new PrismaClient(); 

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(client),
  providers: [
    GoogleProvider({
        clientId: process.env.GOOGLE_CLIENT_ID as string,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET as string
      })
  ],
  secret: process.env.NEXTAUTH_SECRET as string
}

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }