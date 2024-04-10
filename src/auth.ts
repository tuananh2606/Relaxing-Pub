// import NextAuth from 'next-auth';
// import { PrismaAdapter } from '@auth/prisma-adapter';
// import { UserRole } from '@prisma/client';
// import { JWT } from '@auth/core/jwt';

// import authConfig from '~/auth.config';
// import prisma from '~/lib/db';
// import { getAccountByUserId } from './actions/account';
// import { getUserById } from './actions/user';
// import { requestRefreshToken, verifyJwt, signJwtAccessToken, signJwtRefreshToken } from './lib/jwt';

// export const {
//   handlers: { GET, POST },
//   auth,
//   signIn,
//   signOut,
// } = NextAuth({
//   ...authConfig,
//   secret: process.env.NEXTAUTH_SECRET,
//   pages: {
//     signIn: '/auth/login',
//     error: '/auth/error',
//   },
//   events: {
//     async linkAccount({ user }) {
//       await prisma.user.update({
//         where: { id: user.id },
//         data: { emailVerified: new Date() },
//       });
//     },
//   },
//   callbacks: {
//     async signIn({ user, account }) {
//       // Allow OAuth without email verification
//       if (account?.provider !== 'credentials') return true;

//       const existingUser = await getUserById(user.id as string);

//       // if (existingUser.isTwoFactorEnabled) {
//       //   const twoFactorConfirmation = await getTwoFactorConfirmationByUserId(existingUser.id);

//       //   if (!twoFactorConfirmation) return false;

//       //   // Delete two factor confirmation for next sign in
//       //   await db.twoFactorConfirmation.delete({
//       //     where: { id: twoFactorConfirmation.id },
//       //   });
//       // }

//       return true;
//     },
//     async session({ token, session }) {
//       if (token.sub && session.user) {
//         session.user.id = token.sub;
//         session.user.username = token.username as string;
//         session.access_token = token.access_token;
//       }

//       if (token.role && session.user) {
//         session.user.role = token.role as UserRole;
//       }
//       if (session.user) {
//         session.user.isTwoFactorEnabled = token.isTwoFactorEnabled as boolean;
//       }

//       if (session.user) {
//         session.user.name = token.name;
//         session.user.isOAuth = token.isOAuth as boolean;
//       }
//       session.error = token.error;

//       return session;
//     },
//     async jwt({ token, user }) {
//       if (!token.sub) return token;
//       if (user) {
//         const existingUser = await getUserById(token.sub);
//         if (!existingUser) return token;
//         delete token.iat;
//         delete token.exp;
//         const newToken: JWT = {
//           ...token,
//           username: existingUser.username,
//           role: existingUser.role,
//           access_token: user.access_token,
//           refresh_token: user.refresh_token,
//           expires_at: user.expires_at,
//         };
//         return newToken;
//       }

//       if (Date.now() < token.expires_at * 1000) {
//         // If the access token has not expired yet, return it
//         console.log('token is valid');
//         return token;
//       }
//       const newToken = await requestRefreshToken(token);
//       // console.log('New Token: ', newToken);

//       return newToken;
//     },
//   },
//   adapter: PrismaAdapter(prisma),
//   session: { strategy: 'jwt' },
// });

import type { GetServerSidePropsContext, NextApiRequest, NextApiResponse } from 'next';
import type { NextAuthOptions } from 'next-auth';
import { getServerSession } from 'next-auth';
import { authOptions } from '~/app/api/auth/[...nextauth]/route';

// You'll need to import and pass this
// to `NextAuth` in `app/api/auth/[...nextauth]/route.ts`
export const config = {
  ...authOptions, // rest of your config
} satisfies NextAuthOptions;

// Use it in server contexts
export function auth(
  ...args: [GetServerSidePropsContext['req'], GetServerSidePropsContext['res']] | [NextApiRequest, NextApiResponse] | []
) {
  return getServerSession(...args, config);
}
