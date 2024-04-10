// import Google from 'next-auth/providers/google';
// import bcrypt from 'bcryptjs';
// import type { NextAuthConfig } from 'next-auth';
// import Credentials from 'next-auth/providers/credentials';

// import { loginSchema } from './schemas/auth';
// import { getUserByEmail } from './actions/user';
// import { signJwtAccessToken, signJwtRefreshToken } from './lib/jwt';

// export default {
//   providers: [
//     Google({
//       clientId: process.env.GOOGLE_CLIENT_ID!,
//       clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
//     }),
//     Credentials({
//       name: 'Credentials',

//       //@ts-ignore
//       async authorize(credentials: any) {
//         const validatedFields = loginSchema.safeParse(credentials);

//         if (validatedFields.success) {
//           const { email } = validatedFields.data;

//           const existingUser = await getUserByEmail(email);

//           if (!existingUser || !existingUser.password) return null;

//           const passwordsMatch = await bcrypt.compare(validatedFields.data.password, existingUser.password);

//           const { password, emailVerified, ...newUser } = existingUser;
//           const access_token = signJwtAccessToken(newUser, { expiresIn: '1m' });
//           const refresh_token = signJwtRefreshToken(newUser, { expiresIn: '7d' });
//           const expires_at = Math.floor(Date.now() / 1000 + 60 * 1);
//           const user = { ...newUser, access_token, refresh_token, expires_at };

//           if (passwordsMatch) return user;
//         }
//         return null;
//       },
//     }),
//   ],
// } satisfies NextAuthConfig;
