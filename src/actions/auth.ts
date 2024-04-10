'use server';
import bcrypt from 'bcryptjs';
import * as z from 'zod';
import AuthError from 'next-auth';
import prisma from '~/lib/db';
import Haikunator from 'haikunator';

import { signIn } from 'next-auth/react';
// import { signOut } from '~/auth';
import { loginSchema, registerSchema } from '~/schemas/auth';
import { getUserByEmail, getUserByUsername } from '~/actions/user';
// import { signIn } from '~/auth';
import { DEFAULT_LOGIN_REDIRECT } from '~/routes';
import { deleteVerificationTokenById, getVerificationTokenByEmail } from './token';

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
    console.log(error);

    // if (error instanceof AuthError) {
    //   switch (error.type) {
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
  try {
    const validatedFields = registerSchema.safeParse(values);

    const haikunator = new Haikunator({
      defaults: {
        tokenLength: 6,
      },
    });

    if (!validatedFields.success) {
      return { error: 'Các trường không hợp lệ!' };
    }

    const { email, password, username, code } = validatedFields.data;

    const getEmail = getUserByEmail(email);
    const getUserName = getUserByUsername(username);

    const [existingEmail, existingUsername] = await Promise.all([getEmail, getUserName]).then();

    if (existingEmail) {
      return { error: 'Email đã được sử dụng!' };
    }

    if (existingUsername) {
      return { error: 'Username đã được sử dụng!' };
    }
    const verficationToken = await getVerificationTokenByEmail(email);

    if (verficationToken?.token === code) {
      const hashedPassword = await bcrypt.hash(password, 10);
      await prisma.user.create({
        data: {
          username,
          name: haikunator.haikunate({ tokenHex: true }),
          email,
          password: hashedPassword,
          emailVerified: new Date(),
        },
      });
      await deleteVerificationTokenById(verficationToken.id);
      return { success: 'Đăng ký thành công!' };
    } else {
      return { error: 'Mã xác nhận không chính xác' };
    }
  } catch (err) {
    return { error: 'Something went wrong!' };
  }
};

// export const logout = async () => {
//   await signOut();
// };

export const verifyTokenByEmail = async (email: string, code: string) => {
  try {
    const existingToken = await prisma.verificationToken.findFirst({
      where: { email },
    });

    if (!existingToken) {
      return { error: 'Invalid Code!' };
    }

    if (existingToken?.token !== code) {
      return { error: 'Wrong code!' };
    } else {
      const hasExpired = new Date(existingToken.expires) < new Date();
      if (hasExpired) {
        return { error: 'Code has expired!' };
      }
    }
  } catch (err) {
    throw err;
  }
};
