import type { Metadata } from 'next';
import Link from 'next/link';
import Logo from '~/components/ui/logo';
import '~/app/globals.scss';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative flex min-h-screen flex-col">
      <div className="fixed inset-0 z-0 h-full w-full bg-cover" style={{ backgroundImage: `url(/bg-login.jpg)` }}></div>
      <Link className="absolute left-0 top-0 z-40 flex items-center" href="/">
        <Logo />
      </Link>
      {children}
    </div>
  );
}
