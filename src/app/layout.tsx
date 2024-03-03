'use client';
import { Inter } from 'next/font/google';
import './globals.css';
import { ProviderTopLoader, Providers } from '~/utils';
import { Suspense } from 'react';

const inter = Inter({ subsets: ['latin', 'vietnamese'] });

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${inter.className} dark`}>
        <Providers>
          <Suspense>
            <ProviderTopLoader>{children}</ProviderTopLoader>
          </Suspense>
        </Providers>
      </body>
    </html>
  );
}
