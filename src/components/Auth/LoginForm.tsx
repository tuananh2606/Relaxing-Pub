'use client';
import { FC, useEffect, useState, useTransition } from 'react';
import * as z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { signIn } from 'next-auth/react';
import { ReloadIcon } from '@radix-ui/react-icons';
import { useSearchParams } from 'next/navigation';
import { Card, CardHeader, CardBody, CardFooter, Divider, Button, Input } from '@nextui-org/react';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '../ui/form';
import { loginSchema } from '~/schemas/auth';
import { FcGoogle } from 'react-icons/fc';
import { PiEyeSlashFill, PiEyeFill } from 'react-icons/pi';
import Link from 'next/link';
import { FormError } from '../elements/Form/FormError';
import { FormSuccess } from '../elements/Form/FormSuccess';
import { login } from '~/actions/auth';
// import { login } from '~/actions/auth';

const LoginForm = () => {
  const [isPending, startTransiton] = useTransition();
  const [error, setError] = useState<string | undefined>('');
  const [success, setSuccess] = useState<string | undefined>('');
  const [isVisible, setIsVisible] = useState(false);
  const searchParams = useSearchParams();
  const urlError =
    searchParams.get('error') === 'OAuthAccountNotLinked' ? 'Email đã đăng nhập bằng tài khoản liên kết khác' : '';
  const callbackUrl = searchParams.get('callbackUrl');

  const toggleVisibility = () => setIsVisible(!isVisible);

  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  //   useEffect(() => {
  //     if (urlError !== '') {
  //       toast.error(urlError);
  //     }
  //   }, [urlError]);

  function onSubmit(values: z.infer<typeof loginSchema>) {
    // setError('');
    // setSuccess('');
    startTransiton(async () => {
      const res = await login(values, callbackUrl);
      if (res?.error) {
        form.reset();
        setError(res.error);
      }

      // if (res?.success) {
      //   form.reset();
      //   setSuccess(res.success);
      // }

      // if (res?.twoFactor) {
      //   setShowTwoFactor(true);
      // }
    });
  }

  const onClick = (provider: string) => {
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
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field, formState: { errors } }) => (
                    <FormItem>
                      <FormControl>
                        <Input
                          {...field}
                          isDisabled={isPending}
                          isRequired
                          autoFocus
                          type="email"
                          autoComplete="email"
                          label="Email"
                          errorMessage={errors.email && String(errors.email.message)}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field, formState: { errors } }) => (
                    <FormItem>
                      <FormControl>
                        <Input
                          {...field}
                          isDisabled={isPending}
                          isRequired
                          label="Password"
                          autoComplete="current-password"
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
                          errorMessage={errors.password && String(errors.password.message)}
                          type={isVisible ? 'text' : 'password'}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormError message={error || urlError} />
                <FormSuccess message={success} />
                <div className="mt-2 w-full">
                  <Button className="w-full bg-orange-500" type="submit" variant="shadow">
                    Đăng nhập
                  </Button>
                </div>
              </div>
            </form>
            <span className="text-indigo-500 mt-2 text-center text-xs">
              Chưa có tài khoản?
              <Link href="/auth/register" className="ml-1 hover:underline">
                Đăng ký
              </Link>
            </span>
          </Form>
        </CardBody>
      </Card>
    </section>
  );
};

export default LoginForm;
