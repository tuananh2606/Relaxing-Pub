'use client';
import { Button } from '@nextui-org/react';
import { signOut } from 'next-auth/react';

const LogoutButton = () => {
  return (
    <Button variant="ghost" size="lg" className="float-right !mb-10" onClick={() => signOut({ callbackUrl: '/' })}>
      Logout
    </Button>
  );
};
export default LogoutButton;
