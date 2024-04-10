import { signJwtAccessToken, signJwtRefreshToken, verifyJwt } from '~/lib/jwt';
import { headers } from 'next/headers';
import { JwtPayload } from 'jsonwebtoken';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest, res: NextResponse) {
  const headersList = headers();
  const referer = headersList.get('Authorization');
  const refreshToken = referer!.split(' ')[1];

  try {
    const decoded = await verifyJwt(refreshToken);
    const { iat, exp, ...rest } = decoded as JwtPayload;
    const token = {
      access_token: signJwtAccessToken(rest, { expiresIn: '5m' }),
      refresh_token: signJwtRefreshToken(rest, { expiresIn: '7d' }),
      expires_at: Math.floor(Date.now() / 1000 + 60 * 5),
    };
    return NextResponse.json(token, {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    return NextResponse.json(
      { error: error },
      {
        status: 500,
      },
    );
  }
}
