'use server';

import prisma from '~/lib/db';

export const getVerificationTokenByToken = async (token: string) => {
  try {
    const verificationToken = await prisma.verificationToken.findUnique({
      where: { token },
    });

    return verificationToken;
  } catch (err) {
    throw err;
  }
};

export const getVerificationTokenByEmail = async (email: string) => {
  try {
    const verificationToken = await prisma.verificationToken.findFirst({
      where: { email },
    });

    return verificationToken;
  } catch (err) {
    throw err;
  }
};

export const deleteVerificationTokenById = async (id: string) => {
  try {
    await prisma.verificationToken.delete({
      where: {
        id: id,
      },
    });
  } catch (err) {
    throw err;
  }
};
