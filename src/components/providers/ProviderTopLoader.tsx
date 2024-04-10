'use client';
import React, { Suspense, useEffect } from 'react';
import NextTopLoader from 'nextjs-toploader';
import { AppProgressBar as ProgressBar } from 'next-nprogress-bar';
import { usePathname, useSearchParams } from 'next/navigation';
import NProgress from 'nprogress';

const ProviderTopLoader = ({ children }: { children: React.ReactNode }) => {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    NProgress.done();
    return () => {
      NProgress.start();
    };
  }, [pathname, searchParams]);

  return (
    <Suspense>
      {/* <NextTopLoader color="#fb2e01" showSpinner={false} /> */}
      <ProgressBar height="3px" color="#fb2e01" options={{ showSpinner: false }} shallowRouting />
      {children}
    </Suspense>
  );
};

export default ProviderTopLoader;
