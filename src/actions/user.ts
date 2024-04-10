'use server';
import * as z from 'zod';
import bcrypt from 'bcryptjs';

import { personalInfoSchema, accountSchema } from '~/schemas/settings';
import { forgotPasswordSchema } from '~/schemas/auth';
import { getVerificationTokenByEmail } from './token';
import prisma from '~/lib/db';

export const getUserByEmail = async (email: string) => {
  try {
    const user = await prisma.user.findUnique({ where: { email } });
    return user;
  } catch (err) {
    throw err;
  }
};

export const getUserByUsername = async (username: string) => {
  try {
    const user = await prisma.user.findUnique({ where: { username } });
    return user;
  } catch (err) {
    throw err;
  }
};

export const getUserById = async (id: string) => {
  try {
    const user = await prisma.user.findUnique({ where: { id } });
    return user;
  } catch (err) {
    throw err;
  }
};

export const updatePassword = async (values: z.infer<typeof forgotPasswordSchema>) => {
  try {
    const validatedFields = forgotPasswordSchema.safeParse(values);

    if (!validatedFields.success) {
      return { error: 'Invalid fields!' };
    }

    const { email, newPassword } = validatedFields.data;

    const existingUser = await getUserByEmail(email);
    if (!existingUser) {
      return null;
    }
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    const verficationToken = await getVerificationTokenByEmail(email);
    if (!verficationToken) {
      return null;
    }
    await prisma.user.update({
      where: { id: existingUser.id },
      data: { password: hashedPassword },
    });

    await prisma.verificationToken.delete({
      where: { id: verficationToken.id },
    });

    return { success: 'Password updated!' };
  } catch (error) {
    throw error;
  }
};

export const changePassword = async (values: z.infer<typeof accountSchema>, email: string) => {
  try {
    const validatedFields = accountSchema.safeParse(values);

    if (!validatedFields.success) {
      return { error: 'Invalid fields!' };
    }

    const { currentPassword, newPassword } = validatedFields.data;

    const existingUser = await getUserByEmail(email);
    if (!existingUser) {
      throw new Error('Sonething Wrong!');
    }

    const validPassword = await bcrypt.compare(currentPassword, existingUser.password as string);
    if (!validPassword) {
      return { error: 'Sai mật khẩu hiện tại' };
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await prisma.user.update({
      where: { id: existingUser.id },
      data: { password: hashedPassword },
    });

    return { success: 'Password updated successfully!' };
  } catch (error) {
    throw error;
  }
};

export const updateNameUser = async (values: z.infer<typeof personalInfoSchema>) => {
  try {
    const validatedFields = personalInfoSchema.safeParse(values);
    if (!validatedFields.success) {
      return { error: 'Invalid fields!' };
    }
    const { name, username } = validatedFields.data;
    const existingUser = await getUserByUsername(username);
    if (!existingUser) {
      throw new Error('Sonething Wrong!');
    }
    await prisma.user.update({
      where: { id: existingUser.id },
      data: { name: name },
    });
    return { success: 'Name changed successfully!' };
  } catch (err) {
    throw err;
  }
};
