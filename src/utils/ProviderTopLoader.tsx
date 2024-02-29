'use client';

import { AppProgressBar as ProgressBar } from 'next-nprogress-bar';
import React from 'react';

const ProviderTopLoader = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      {children}
      <ProgressBar height="3px" color="#fb2e01" options={{ showSpinner: false }} shallowRouting />
    </>
  );
};

export default ProviderTopLoader;
