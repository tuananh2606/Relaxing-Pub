'use client';
import { NextUIProvider } from '@nextui-org/react';
import React from 'react';
import { ThemeProvider as NextThemesProvider } from 'next-themes';
import { useRouter } from 'next-nprogress-bar';

const Providers = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();
  return (
    <NextUIProvider navigate={router.push}>
      <NextThemesProvider
        storageKey="theme"
        attribute="class"
        defaultTheme="dark"
        enableSystem
        disableTransitionOnChange
      >
        {children}
      </NextThemesProvider>
    </NextUIProvider>
  );
};
export default Providers;
