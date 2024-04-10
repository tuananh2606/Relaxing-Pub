// import NextAuth from 'next-auth';
// import authConfig from '~/auth.config';
import { DEFAULT_LOGIN_REDIRECT, apiAuthPrefix, authRoutes, publicRoutes } from '~/routes';
// import { JWT, getToken, encode, decode } from '@auth/core/jwt';

import { fetcher } from './lib/utils';
import { getToken, encode, type JWT } from 'next-auth/jwt';
import { NextMiddleware, NextRequest, NextResponse } from 'next/server';

export const SIGNIN_SUB_URL = '/auth/login';
export const SESSION_TIMEOUT = 60 * 60 * 24 * 30; // 30 days
export const TOKEN_REFRESH_BUFFER_SECONDS = 100;
export const SESSION_SECURE = process.env.NEXTAUTH_URL?.startsWith('https://');
export const SESSION_COOKIE = SESSION_SECURE ? '__Secure-next-auth.session-token' : 'next-auth.session-token';
// const { auth } = NextAuth(authConfig);

interface BackendTokens {
  access_token: string;
  refresh_token: string;
  expires_at: number;
}

export function shouldUpdateToken(token: JWT): boolean {
  const timeInSeconds = Math.floor(Date.now() / 1000);

  if (timeInSeconds >= token.expires_at) return true;
  return false;
}

async function refreshToken(token: JWT): Promise<BackendTokens> {
  const res = await fetcher<BackendTokens>({
    url: `${process.env.NEXTAUTH_URL}/api/auth/refresh`,
    options: {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token.refresh_token}`,
      },
    },
  });

  if (res.statusCode == 403) {
    throw new Error('RefreshTokenError');
  }

  console.log('refreshed', res);

  return res;
}
function signOut(request: NextRequest) {
  let response = NextResponse.next();
  request.cookies.getAll().forEach((cookie) => {
    if (cookie.name.includes('next-auth')) response.cookies.delete(cookie.name);
  });

  return response;
}

export function updateCookie(
  sessionToken: string | null,
  request: NextRequest,
  response: NextResponse,
): NextResponse<unknown> {
  /*
   * BASIC IDEA:
   *
   * 1. Set request cookies for the incoming getServerSession to read new session
   * 2. Updated request cookie can only be passed to server if it's passed down here after setting its updates
   * 3. Set response cookies to send back to browser
   */

  if (sessionToken) {
    // Set the session token in the request and response cookies for a valid session
    request.cookies.set(SESSION_COOKIE, sessionToken);
    response = NextResponse.next({
      request: {
        headers: request.headers,
      },
    });
    response.cookies.set(SESSION_COOKIE, sessionToken, {
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60 * 1000,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
    });
  } else {
    request.cookies.delete(SESSION_COOKIE);
    return NextResponse.redirect(new URL(SIGNIN_SUB_URL, request.url));
  }

  return response;
}

// export async function refreshAccessToken(token: JWT): Promise<JWT> {
//   if (isRefreshing) {
//     return token;
//   }

//   const timeInSeconds = Math.floor(Date.now() / 1000);
//   isRefreshing = true;

//   try {
//     const response = await fetch(process.env.AUTH_ENDPOINT + '/o/token/', {
//       headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
//       body: new URLSearchParams({
//         client_id: process.env.CLIENT_ID,
//         client_secret: process.env.CLIENT_SECRET,
//         grant_type: 'refresh_token',
//         refresh_token: token?.refresh_token,
//       }),

//       credentials: 'include',
//       method: 'POST',
//     });

//     const newTokens = await response.json();

//     if (!response.ok) {
//       throw new Error(`Token refresh failed with status: ${response.status}`);
//     }

//     return {
//       ...token,
//       access_token: newTokens?.access_token ?? token?.access_token,
//       expires_at: newTokens?.expires_in + timeInSeconds,
//       refresh_token: newTokens?.refresh_token ?? token?.refresh_token,
//     };
//   } catch (e) {
//     console.error(e);
//   } finally {
//     isRefreshing = false;
//   }

//   return token;
// }

// export const config = {
//   matcher: ['/((?!.+\\.[\\w]+$|_next).*)', '/', '/(api|trpc)(.*)'],
// };

export { default } from 'next-auth/middleware';

export const config = {
  matcher: ['/((?!.+\\.[\\w]+$|_next).*)', '/', '/(api|trpc)(.*)'],
};

export const middleware: NextMiddleware = async (req: NextRequest) => {
  const { nextUrl } = req;
  const token = await getToken({ req });
  const isLoggedIn = !!token;
  const isApiAuthRoute = nextUrl.pathname.startsWith(apiAuthPrefix);
  const isPublicRoute = publicRoutes.includes(nextUrl.pathname);
  const isAuthRoute = authRoutes.includes(nextUrl.pathname);

  console.log('Get Token: ', token);
  let response = NextResponse.next();

  if (isApiAuthRoute) {
    //Lỗi thư viện auth.js, bản update sau fix
    if (nextUrl.pathname.startsWith('/api/auth/auth/') && nextUrl.searchParams.get('error')) {
      return Response.redirect(new URL(`/auth/login${nextUrl.search}`, nextUrl.origin));
    }

    return;
  }

  if (isAuthRoute) {
    if (isLoggedIn) {
      return Response.redirect(new URL(DEFAULT_LOGIN_REDIRECT, nextUrl));
    }
    return;
  }

  if (!isLoggedIn && !isPublicRoute) {
    let callbackUrl = nextUrl.pathname;
    if (nextUrl.search) {
      callbackUrl += nextUrl.search;
    }

    console.log(callbackUrl);

    const encodedCallbackUrl = encodeURIComponent(callbackUrl);

    return Response.redirect(new URL(`/auth/login?callbackUrl=${encodedCallbackUrl}`, nextUrl));
  }

  if (token && shouldUpdateToken(token)) {
    try {
      const newToken = await refreshToken(token);
      const { name, email, picture, sub, username, role } = token;
      const newSessionToken = await encode({
        secret: process.env.NEXTAUTH_SECRET!,
        token: {
          sub,
          name,
          email,
          picture,
          username,
          role,
          ...newToken,
        },
        maxAge: SESSION_TIMEOUT,
      });
      response = updateCookie(newSessionToken, req, response);
    } catch (error) {
      console.log('Error refreshing token: ', error);
      return updateCookie(null, req, response);
    }
  }
  return response;
};

// export default auth((request) => {
//   const token = getToken({
//     req: request,
//     secret: process.env.JWT_SECRET as string,
//     salt: sessionCookie,
//   });
//   console.log(token);

//   const { nextUrl } = request;
//   const isLoggedIn = !!request.auth;
//   const isApiAuthRoute = nextUrl.pathname.startsWith(apiAuthPrefix);
//   const isPublicRoute = publicRoutes.includes(nextUrl.pathname);
//   const isAuthRoute = authRoutes.includes(nextUrl.pathname);

//   if (isApiAuthRoute) {
//     //Lỗi thư viện auth.js, bản update sau fix
//     if (nextUrl.pathname.startsWith('/api/auth/auth/') && nextUrl.searchParams.get('error')) {
//       return Response.redirect(new URL(`/auth/login${nextUrl.search}`, nextUrl.origin));
//     }

//     return;
//   }

//   if (isAuthRoute) {
//     if (isLoggedIn) {
//       return Response.redirect(new URL(DEFAULT_LOGIN_REDIRECT, nextUrl));
//     }
//     return;
//   }

//   if (!isLoggedIn && !isPublicRoute) {
//     let callbackUrl = nextUrl.pathname;
//     if (nextUrl.search) {
//       callbackUrl += nextUrl.search;
//     }

//     const encodedCallbackUrl = encodeURIComponent(callbackUrl);

//     return Response.redirect(new URL(`/auth/login?callbackUrl=${encodedCallbackUrl}`, nextUrl));
//   }

//   return;
// });
