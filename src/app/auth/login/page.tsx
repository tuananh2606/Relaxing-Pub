import { Metadata } from 'next';
import LoginForm from '~/components/Auth/LoginForm';

export const metadata: Metadata = {
  title: 'Login - FilmPub',
  description: 'Generated by create next app',
};

export default function LoginPage() {
  return (
    <>
      <div className="fixed inset-0 z-0 h-full w-full bg-cover" style={{ backgroundImage: `url(/bg-login.jpg)` }}></div>
      <LoginForm />
    </>
  );
}