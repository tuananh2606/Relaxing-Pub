'use client';
import { Session } from 'next-auth';
import { SessionProvider } from 'next-auth/react';
import React, { ReactNode } from 'react';

interface Props {
  session: Session | null;
  children: ReactNode;
}
function Providers({ session, children }: Props) {
  return <SessionProvider session={session}>{children}</SessionProvider>;
}

export default Providers;
