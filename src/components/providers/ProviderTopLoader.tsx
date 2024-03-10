'use client';
import React, { Suspense } from 'react';
import { AppProgressBar as ProgressBar } from 'next-nprogress-bar';

const ProviderTopLoader = ({ children }: { children: React.ReactNode }) => {
  return (
    <Suspense>
      {children}
      <ProgressBar height="3px" color="#fb2e01" options={{ showSpinner: false }} shallowRouting />
    </Suspense>
  );
};

export default ProviderTopLoader;
