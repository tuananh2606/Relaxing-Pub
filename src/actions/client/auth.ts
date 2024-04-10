import * as z from 'zod';

import { signIn } from 'next-auth/react';
import { loginSchema } from '~/schemas/auth';
import { getUserByEmail } from '~/actions/user';
// import { signIn } from '~/auth';
import { DEFAULT_LOGIN_REDIRECT } from '~/routes';
import { useRouter } from 'next-nprogress-bar';

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

  const res = await signIn('credentials', {
    email,
    password,
    redirect: false,
    callbackUrl: callbackUrl || DEFAULT_LOGIN_REDIRECT,
  });

  if (!res?.ok) {
    switch (res?.error) {
      case 'CredentialsSignin':
        return { error: 'Invalid credentials!' };
      default:
        return { error: 'Something went wrong!' };
    }
  } else {
    return { url: res.url };
  }
};
