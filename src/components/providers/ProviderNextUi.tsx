'use client';
import { NextUIProvider } from '@nextui-org/react';
import React from 'react';
import { ThemeProvider as NextThemesProvider } from 'next-themes';

const Providers = ({ children }: { children: React.ReactNode }) => {
  return (
    <NextUIProvider>
      <NextThemesProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
        {children}
      </NextThemesProvider>
    </NextUIProvider>
  );
};
export default Providers;
