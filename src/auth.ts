import NextAuth from 'next-auth';
import { PrismaAdapter } from '@auth/prisma-adapter';

import authConfig from '~/auth.config';
import prisma from '~/lib/db';
import { getUserById } from './prisma/queries/user';

export const {
  handlers: { GET, POST },
  auth,
  signIn,
  signOut,
} = NextAuth({
  ...authConfig,
  pages: {
    signIn: '/auth/login',
    error: '/auth/error',
  },
  basePath: '/api/auth',
  // callbacks: {
  //   async signIn({ user, account }) {
  //     // Allow OAuth without email verification
  //     if (account?.provider !== 'credentials') return true;

  //     const existingUser = await getUserById(user.id as string);

  //     // Prevent sign in without email verification
  //     if (!existingUser?.emailVerified) return false;

  //     // if (existingUser.isTwoFactorEnabled) {
  //     //   const twoFactorConfirmation = await getTwoFactorConfirmationByUserId(existingUser.id);

  //     //   if (!twoFactorConfirmation) return false;

  //     //   // Delete two factor confirmation for next sign in
  //     //   await db.twoFactorConfirmation.delete({
  //     //     where: { id: twoFactorConfirmation.id },
  //     //   });
  //     // }

  //     return true;
  //   },
  //   // async session({ token, session }) {
  //   //   if (token.sub && session.user) {
  //   //     session.user.id = token.sub;
  //   //   }

  //   //   if (token.role && session.user) {
  //   //     session.user.role = token.role as UserRole;
  //   //   }

  //   //   if (session.user) {
  //   //     session.user.isTwoFactorEnabled = token.isTwoFactorEnabled as boolean;
  //   //   }

  //   //   if (session.user) {
  //   //     session.user.name = token.name;
  //   //     session.user.email = token.email;
  //   //     session.user.isOAuth = token.isOAuth as boolean;
  //   //   }

  //   //   return session;
  //   // },
  //   // async jwt({ token }) {
  //   //   if (!token.sub) return token;

  //   //   const existingUser = await getUserById(token.sub);

  //   //   if (!existingUser) return token;

  //   //   const existingAccount = await getAccountByUserId(existingUser.id);

  //   //   token.isOAuth = !!existingAccount;
  //   //   token.name = existingUser.name;
  //   //   token.email = existingUser.email;
  //   //   token.role = existingUser.role;
  //   //   token.isTwoFactorEnabled = existingUser.isTwoFactorEnabled;

  //   //   return token;
  //   // },
  // },
  adapter: PrismaAdapter(prisma),
  session: { strategy: 'jwt' },
});
