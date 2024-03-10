'use client';

import { FC, useEffect, useState, useTransition } from 'react';
import * as z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { signIn } from 'next-auth/react';
import { ReloadIcon } from '@radix-ui/react-icons';
import { useSearchParams } from 'next/navigation';
import { Card, CardHeader, CardBody, CardFooter, Divider, Image } from '@nextui-org/react';
import { loginSchema } from '~/schemas/auth';
import { FcGoogle } from 'react-icons/fc';
import { PiEyeSlashFill, PiEyeFill } from 'react-icons/pi';
import Link from 'next/link';
import { Button, Input } from '@nextui-org/react';

const LoginForm: FC = () => {
  const [isPending, startTransiton] = useTransition();
  const [isVisible, setIsVisible] = useState(false);
  const searchParams = useSearchParams();
  const urlError =
    searchParams.get('error') === 'OAuthAccountNotLinked' ? 'Email đã đăng nhập bằng tài khoản liên kết khác' : '';
  const callbackUrl = searchParams.get('callbackUrl');

  const toggleVisibility = () => setIsVisible(!isVisible);

  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: '',
      password: '',
    },
  });

  //   useEffect(() => {
  //     if (urlError !== '') {
  //       toast.error(urlError);
  //     }
  //   }, [urlError]);

  function onSubmit(values: z.infer<typeof loginSchema>) {
    startTransiton(async () => {
      //   const res = await login(values, callbackUrl);
      //   if (res.code !== 200) {
      //     toast.error(res.message);
      //   } else {
      //     toast.success(res.message);
      //   }
    });
  }

  const {
    register,
    handleSubmit,
    control,
    watch,
    reset,
    formState: { errors, isSubmitting },
    getValues,
  } = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: '',
      password: '',
    },
  });

  const onClick = (provider: 'google') => {
    signIn(provider, {
      callbackUrl: '/',
    });
  };

  return (
    <section className="relative h-screen max-w-[500px]">
      <Card className="h-full w-auto space-y-8 rounded-none px-12 pb-8 pt-12" isBlurred shadow="lg">
        <CardHeader className="flex flex-col gap-3">
          <div className="flex flex-col justify-start">
            <h1 className="text-5xl font-semibold">Welcome back</h1>
            <p className="text-sm">Đăng nhập vào tài khoản của bạn</p>
          </div>

          <Button
            className="mt-8 flex w-full items-center gap-3 bg-background"
            size={'lg'}
            onClick={() => onClick('google')}
          >
            <FcGoogle className="text-lg" /> Đăng nhập với Google
          </Button>
        </CardHeader>
        <Divider />
        <CardBody>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <Input
              {...register('username', { required: true })}
              type="text"
              label="Username"
              isRequired
              autoFocus
              autoComplete="username"
              classNames={{
                label: 'text-black/50 dark:text-white/90',
                input: ['text-black/90 dark:text-white/90'],
              }}
            />
            {errors.username && <p className="text-red-500">{`${errors.username.message}`}</p>}
            <Input
              {...register('password')}
              label="Password"
              className="mt-2"
              classNames={{
                label: 'text-black/50 dark:text-white/90',
                input: ['text-black/90 dark:text-white/90'],
              }}
              autoComplete="current-password"
              isRequired
              endContent={
                <div className="flex h-full items-center justify-center">
                  <button className="focus:outline-none" type="button" onClick={toggleVisibility}>
                    {isVisible ? (
                      <PiEyeSlashFill className="pointer-events-none text-2xl text-default-400" />
                    ) : (
                      <PiEyeFill className="pointer-events-none text-2xl text-default-400" />
                    )}
                  </button>
                </div>
              }
              type={isVisible ? 'text' : 'password'}
            />
            {errors.password && <p className="text-red-500">{`${errors.password.message}`}</p>}
            <div className="mt-2 w-full">
              <Button disabled={isSubmitting} className="bg-orange-500 w-full" type="submit" variant="shadow">
                Đăng nhập
              </Button>
            </div>
          </form>
          <span className="text-indigo-500 mt-2 text-center text-xs">
            Chưa có tài khoản?
            <Link href="/register" className="ml-1 hover:underline">
              Đăng ký
            </Link>
          </span>
        </CardBody>
      </Card>
    </section>
  );
};

export default LoginForm;
