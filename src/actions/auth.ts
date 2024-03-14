'use server';
import bcrypt from 'bcryptjs';
import * as z from 'zod';
import AuthError from 'next-auth';
import prisma from '~/lib/db';
import Haikunator from 'haikunator';

import { signOut } from '~/auth';
import { loginSchema, registerSchema } from '~/schemas/auth';
import { getUserByEmail } from '~/prisma/queries/user';
import { signIn } from '~/auth';
import { DEFAULT_LOGIN_REDIRECT } from '~/routes';
// import { getTwoFactorTokenByEmail } from '~/data/two-factor-token';
// import { sendVerificationEmail, sendTwoFactorTokenEmail } from '~/lib/mail';
// import { generateVerificationToken, generateTwoFactorToken } from '~/lib/tokens';
// import { getTwoFactorConfirmationByUserId } from '~/data/two-factor-confirmation';

export const login = async (values: z.infer<typeof loginSchema>, callbackUrl?: string | null) => {
  const validatedFields = loginSchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: 'Invalid fields!' };
  }

  const { email, password } = validatedFields.data;

  const existingUser = await getUserByEmail(email);

  if (!existingUser || !existingUser.email || !existingUser.password) {
    return { error: 'Email does not exist!' };
  }
  // if (!existingUser.emailVerified) {
  //   const verificationToken = await generateVerificationToken(existingUser.email);

  //   await sendVerificationEmail(verificationToken.email, verificationToken.token);

  //   return { success: 'Confirmation email sent!' };
  // }

  // if (existingUser.isTwoFactorEnabled && existingUser.email) {
  //   if (code) {
  //     const twoFactorToken = await getTwoFactorTokenByEmail(existingUser.email);

  //     if (!twoFactorToken) {
  //       return { error: 'Invalid code!' };
  //     }

  //     if (twoFactorToken.token !== code) {
  //       return { error: 'Invalid code!' };
  //     }

  //     const hasExpired = new Date(twoFactorToken.expires) < new Date();

  //     if (hasExpired) {
  //       return { error: 'Code expired!' };
  //     }

  //     await db.twoFactorToken.delete({
  //       where: { id: twoFactorToken.id },
  //     });

  //     const existingConfirmation = await getTwoFactorConfirmationByUserId(existingUser.id);

  //     if (existingConfirmation) {
  //       await db.twoFactorConfirmation.delete({
  //         where: { id: existingConfirmation.id },
  //       });
  //     }

  //     await db.twoFactorConfirmation.create({
  //       data: {
  //         userId: existingUser.id,
  //       },
  //     });
  //   } else {
  //     const twoFactorToken = await generateTwoFactorToken(existingUser.email);
  //     await sendTwoFactorTokenEmail(twoFactorToken.email, twoFactorToken.token);

  //     return { twoFactor: true };
  //   }
  // }

  try {
    await signIn('credentials', {
      email,
      password,
      redirectTo: callbackUrl || DEFAULT_LOGIN_REDIRECT,
    });
  } catch (error) {
    // if (error instanceof AuthError) {
    //   switch (error) {
    //     case 'CredentialsSignin':
    //       return { error: 'Invalid credentials!' };
    //     default:
    //       return { error: 'Something went wrong!' };
    //   }
    // }

    throw error;
  }
};

export const register = async (values: z.infer<typeof registerSchema>) => {
  const validatedFields = registerSchema.safeParse(values);

  const haikunator = new Haikunator({
    adjectives: ['custom', 'adjectives'],
    nouns: ['custom', 'nouns'],
    seed: 'custom-seed',
    defaults: {
      // class defaults
      tokenLength: 6,
    },
  });

  if (!validatedFields.success) {
    return { error: 'Invalid fields!' };
  }

  const { email, password, username } = validatedFields.data;

  const existingUser = await getUserByEmail(email);

  if (existingUser) {
    return { error: 'Email already in use!' };
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  await prisma.user.create({
    data: {
      username,
      name: haikunator.haikunate({ tokenHex: true }),
      email,
      password: hashedPassword,
    },
  });

  //   const verificationToken = await generateVerificationToken(email);
  //   await sendVerificationEmail(verificationToken.email, verificationToken.token);

  return { success: 'Confirmation email sent!' };
};

export const logout = async () => {
  await signOut();
};
