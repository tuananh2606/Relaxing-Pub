'use client';
import { useState, useTransition } from 'react';
import * as z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { signIn } from 'next-auth/react';
import { FaArrowLeft } from 'react-icons/fa6';
import { useSearchParams } from 'next/navigation';
import { PiEyeSlashFill, PiEyeFill } from 'react-icons/pi';
import { FcGoogle } from 'react-icons/fc';
import { Card, CardHeader, CardBody, Button, Input } from '@nextui-org/react';
import { useRouter } from 'next-nprogress-bar';
import Link from 'next/link';

import { Form, FormControl, FormField, FormItem } from '../../ui/form';
import { loginSchema } from '~/schemas/auth';
import { FormError } from '../../elements/Form/FormError';
import { FormSuccess } from '../../elements/Form/FormSuccess';
import { login } from '~/actions/client/auth';
import { DEFAULT_LOGIN_REDIRECT } from '~/routes';

const LoginForm = () => {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | undefined>('');
  const [success, setSuccess] = useState<string | undefined>('');
  const [isVisible, setIsVisible] = useState(false);
  const searchParams = useSearchParams();
  const urlError =
    searchParams.get('error') === 'OAuthAccountNotLinked' ? 'Email đã đăng nhập bằng tài khoản liên kết khác' : '';
  const callbackUrl = searchParams.get('callbackUrl');
  const router = useRouter();

  const toggleVisibility = () => setIsVisible(!isVisible);

  const form = useForm<z.infer<typeof loginSchema>>({
    mode: 'onTouched',
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
    setError('');
    setSuccess('');
    startTransition(async () => {
      const res = await login(values, callbackUrl);

      if (res.error) {
        setError(res.error);
      }
      if (res.url) {
        router.push(res.url);
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
      callbackUrl: DEFAULT_LOGIN_REDIRECT,
    });
  };

  return (
    <section className="relative h-screen max-w-[500px]">
      <Card className="h-full w-auto space-y-8 rounded-none px-12 pb-8 pt-12" isBlurred shadow="lg">
        <Button isIconOnly aria-label="go-back" className="bg-transparent" onClick={() => router.back()}>
          <FaArrowLeft className="z-10" size="1.5em" />
        </Button>

        <CardHeader className="flex flex-col gap-3">
          <div className="flex flex-col justify-start">
            <h1 className="text-4xl font-semibold md:text-5xl">Welcome back</h1>
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
        <div className="relative">
          {/* <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t" />
          </div> */}

          <div className="relative flex items-center justify-center ">
            <span className="w-full border-t border-white/70" />
            <span className="whitespace-nowrap px-2 text-xs uppercase text-white">Or continue with</span>
            <span className="w-full border-t border-white/70" />
          </div>
        </div>
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
                                {!isVisible ? (
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
                <Link href="/auth/forgot-password" className="ml-1 text-xs text-blue-700 hover:text-blue-700/70">
                  Quên mật khẩu?
                </Link>
                <FormError message={error || urlError} />
                <FormSuccess message={success} />
                <div className="mt-2 w-full">
                  <Button
                    aria-disabled={isPending || !form.formState.isValid}
                    isDisabled={isPending || !form.formState.isValid}
                    isLoading={isPending}
                    className="w-full bg-orange-500"
                    type="submit"
                    variant="shadow"
                  >
                    Đăng nhập
                  </Button>
                </div>
              </div>
            </form>
            <span className="text-indigo-500 mt-4 text-center text-xs">
              Chưa có tài khoản?
              <Link href="/auth/register" className="ml-1 text-blue-700 hover:underline">
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
