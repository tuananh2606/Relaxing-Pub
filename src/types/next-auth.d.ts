import { UserRole } from '@prisma/client';
import NextAuth, { type DefaultSession, type User } from 'next-auth';
import { DefaultJWT } from 'next-auth/jwt';
export type ExtendedUser = DefaultSession['user'] & {
  id: string;
  username: string;
  role: UserRole;
  isTwoFactorEnabled: boolean;
  isOAuth: boolean;
  accessToken: string;
};

export type User = Pick<ExtendedUser, 'email' | 'name' | 'image' | 'username'>;

declare module 'next-auth' {
  interface Session {
    user: ExtendedUser;
    token: JWT | undefined;
    access_token: string;
    refresh_token: string;
    error?: string;
  }
  interface User {
    access_token: string;
    refresh_token: string;
    expires_at: number;
  }
}
declare module 'next-auth/jwt' {
  interface JWT extends DefaultJWT {
    access_token: string;
    refresh_token: string;
    expires_at: number;
    error?: string;
  }
}
