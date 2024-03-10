import type { Metadata } from 'next';
import '~/app/globals.css';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return <div className="flex min-h-screen flex-col">{children}</div>;
}
