import Google from 'next-auth/providers/google';
import bcrypt from 'bcryptjs';
import NextAuth, { NextAuthOptions } from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import { PrismaAdapter } from '@auth/prisma-adapter';
import type { Adapter } from 'next-auth/adapters';
import { UserRole } from '@prisma/client';

import prisma from '~/lib/db';
import { loginSchema } from '~/schemas/auth';
import { getUserByEmail, getUserById } from '~/actions/user';
import { requestRefreshToken, signJwtAccessToken, signJwtRefreshToken } from '~/lib/jwt';
import { JWT } from 'next-auth/jwt';

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma) as Adapter,
  pages: {
    signIn: '/auth/login',
    error: '/auth/error',
  },
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),

    Credentials({
      name: 'Credentials',
      credentials: {},
      async authorize(credentials) {
        try {
          const validatedFields = loginSchema.safeParse(credentials);

          if (validatedFields.success) {
            const { email } = validatedFields.data;

            const existingUser = await getUserByEmail(email);

            if (!existingUser || !existingUser.password) return null;

            const passwordsMatch = await bcrypt.compare(validatedFields.data.password, existingUser.password);

            const { password, emailVerified, ...newUser } = existingUser;
            const access_token = signJwtAccessToken(newUser, { expiresIn: '1m' });
            const refresh_token = signJwtRefreshToken(newUser, { expiresIn: '7d' });
            const expires_at = Math.floor(Date.now() / 1000 + 60 * 1);
            const user = { ...newUser, access_token, refresh_token, expires_at };

            if (passwordsMatch) return user;
          }
        } catch (error) {
          throw new Error('Invalid Credentials');
        }
        return null;
      },
    }),
  ],
  events: {
    async linkAccount({ user }) {
      await prisma.user.update({
        where: { id: user.id },
        data: { emailVerified: new Date() },
      });
    },
  },
  callbacks: {
    async signIn({ account }) {
      if (account?.provider !== 'credentials') return true;
      return true;
    },

    async redirect({ url, baseUrl }) {
      // Allows relative callback URLs
      if (url.startsWith('/')) return `${baseUrl}${url}`;
      // Allows callback URLs on the same origin
      else if (new URL(url).origin === baseUrl) return url;
      return baseUrl;
    },

    async session({ token, session }) {
      if (token.sub && session.user) {
        session.user.id = token.sub;
        session.user.username = token.username as string;
        session.access_token = token.access_token;
      }

      if (token.role && session.user) {
        session.user.role = token.role as UserRole;
      }
      if (session.user) {
        session.user.isTwoFactorEnabled = token.isTwoFactorEnabled as boolean;
      }

      if (session.user) {
        session.user.name = token.name;
        session.user.isOAuth = token.isOAuth as boolean;
      }
      session.error = token.error;

      return session;
    },
    async jwt({ token, user }) {
      if (!token.sub) return token;
      if (user) {
        const existingUser = await getUserById(token.sub);
        if (!existingUser) return token;
        const newToken: JWT = {
          ...token,
          username: existingUser.username,
          role: existingUser.role,
          access_token: user.access_token,
          refresh_token: user.refresh_token,
          expires_at: user.expires_at,
        };
        return newToken;
      }

      if (Date.now() < token.expires_at * 1000) {
        // If the access token has not expired yet, return it
        console.log('token is valid');
        return token;
      }
      return requestRefreshToken(token);
      // console.log('New Token: ', newToken);
    },
  },
  session: {
    strategy: 'jwt',
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };

// export const {
//   handlers: { GET, POST },
//   auth,
//   signIn,
//   signOut,
// } = NextAuth(authOptions);
//export { GET, POST } from '~/auth';
