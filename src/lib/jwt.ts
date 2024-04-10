import jwt, { JwtPayload } from 'jsonwebtoken';
import { JWT } from '@auth/core/jwt';

interface SignOption {
  expiresIn?: string | number;
}

const DEFAULT_SIGN_OPTION: SignOption = {
  expiresIn: '1h',
};

export function signJwtAccessToken(payload: JwtPayload, options?: SignOption) {
  const secret_key = process.env.JWT_SECRET;
  const accessToken = jwt.sign(payload, secret_key!, options);
  return accessToken;
}

export function signJwtRefreshToken(payload: JwtPayload, options?: SignOption) {
  const secret_key = process.env.JWT_REFRESH_SECRET;
  const refresshToken = jwt.sign(payload, secret_key!, options);
  return refresshToken;
}

export const requestRefreshToken = async (token: any) => {
  try {
    if (token) {
      const decoded = await verifyJwt(token.refresh_token);
      delete (decoded as JwtPayload).iat;
      delete (decoded as JwtPayload).exp;

      const newAccessToken = signJwtAccessToken(decoded as JwtPayload, { expiresIn: '5m' });
      const newRefreshToken = signJwtRefreshToken(decoded as JwtPayload, { expiresIn: '7d' });
      const expiresAt = Math.floor(Date.now() / 1000 + 60 * 5);
      return {
        ...(decoded as JwtPayload),
        access_token: newAccessToken,
        refresh_token: newRefreshToken,
        expires_at: expiresAt,
      } as JWT;
    }

    // const { iat, exp, ...rest } = decoded as JwtPayload;
  } catch (error) {
    console.error('Error refreshing access token', error);
    return {
      ...token,
      error: 'RefreshTokenTokenError' as const,
    };
  }
};

export async function verifyJwt(refreshToken: string) {
  try {
    const secret_key = process.env.JWT_REFRESH_SECRET;
    const decoded = jwt.verify(refreshToken, secret_key!);
    return decoded as JwtPayload;
  } catch (error) {
    console.log(error);
    return error;
  }
}
