import crypto from 'crypto';
import { v4 as uuidv4 } from 'uuid';
import randomize from 'randomatic';

import prisma from '~/lib/db';
import { getVerificationTokenByEmail } from '~/actions/token';

// import { getTwoFactorTokenByEmail } from '@/data/two-factor-token';

// export const generateTwoFactorToken = async (email: string) => {
//   const token = crypto.randomInt(100_000, 1_000_000).toString();
//   const expires = new Date(new Date().getTime() + 5 * 60 * 1000);

//   const existingToken = await getTwoFactorTokenByEmail(email);

//   if (existingToken) {
//     await db.twoFactorToken.delete({
//       where: {
//         id: existingToken.id,
//       },
//     });
//   }

//   const twoFactorToken = await db.twoFactorToken.create({
//     data: {
//       email,
//       token,
//       expires,
//     },
//   });

//   return twoFactorToken;
// };

export const generateVerificationToken = async (email: string) => {
  const token = randomize('0', 6);
  const expires = new Date(new Date().getTime() + 600 * 1000);

  const existingToken = await getVerificationTokenByEmail(email);

  if (existingToken) {
    await prisma.verificationToken.delete({
      where: {
        id: existingToken.id,
      },
    });
  }

  const verficationToken = await prisma.verificationToken.create({
    data: {
      email,
      token,
      expires,
    },
  });

  return verficationToken;
};
