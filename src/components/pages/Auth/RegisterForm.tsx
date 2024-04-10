'use client';
import { useEffect, useState, useTransition } from 'react';
import * as z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Checkbox } from '@nextui-org/react';
import { FaArrowLeft } from 'react-icons/fa6';
import { useSearchParams } from 'next/navigation';
import { Zoom, toast } from 'react-toastify';
import { Card, CardHeader, CardBody, Button, Input, CircularProgress } from '@nextui-org/react';
import { useRouter } from 'next-nprogress-bar';

import { ScrollArea, ScrollBar, ScrollCorner, ScrollViewport } from '~/components/ui/scroll-area';
import { Form, FormControl, FormField, FormItem } from '../../ui/form';
import { registerSchema } from '~/schemas/auth';
import { register } from '~/actions/auth';
import { FormError } from '../../elements/Form/FormError';
import { FormSuccess } from '../../elements/Form/FormSuccess';
import { sendVerificationCodeEmail } from '~/lib/mails';
import { Toast } from '../../elements/Toast';
import { cn } from '~/lib/utils';

const RegisterForm = () => {
  const [isPending, startTransition] = useTransition();
  const [isLoading, startSendCodeTransition] = useTransition();
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const [isSend, setIsSend] = useState<boolean>(false);

  const [counter, setCounter] = useState<number>(60);
  const [errorState, setError] = useState<string | undefined>('');
  const [success, setSuccess] = useState<string | undefined>('');
  const searchParams = useSearchParams();
  const router = useRouter();
  const urlError =
    searchParams.get('error') === 'OAuthAccountNotLinked' ? 'Email đã đăng nhập bằng tài khoản liên kết khác' : '';
  const callbackUrl = searchParams.get('callbackUrl');

  const toggleVisibility = () => setIsVisible(!isVisible);

  const form = useForm<z.infer<typeof registerSchema>>({
    mode: 'onTouched',
    resolver: zodResolver(registerSchema),
    defaultValues: {
      email: '',
      username: '',
      password: '',
      confirmPassword: '',
      code: '',
    },
  });

  //   useEffect(() => {
  //     if (urlError !== '') {
  //       toast.error(urlError);
  //     }
  //   }, [urlError]);

  const handleSendCode = async () => {
    const check = await form.trigger('email');
    if (check) {
      startSendCodeTransition(() => {
        sendVerificationCodeEmail(form.getValues('email')).then((result) => {
          if (result) toast(result?.error as string, { type: 'error' });
          else setIsSend(true);
        });
      });
    }
  };

  function onSubmit(values: z.infer<typeof registerSchema>) {
    setError('');
    setSuccess('');

    startTransition(() => {
      register(values).then((data) => {
        setError(data!.error);
        setSuccess(data!.success);
      });
    });
  }

  useEffect(() => {
    if (isSend) {
      const interval = setInterval(() => {
        setCounter(counter - 1);
        if (counter <= 0) {
          setCounter(60);
          setIsSend(false);
        }
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [counter, isSend]);

  return (
    <section className="relative h-screen max-w-[500px]">
      <Card className="h-full w-auto space-y-8 rounded-none pb-8 pt-12" isBlurred shadow="lg">
        <Button isIconOnly aria-label="go-back" className="ml-12 bg-transparent" onClick={() => router.back()}>
          <FaArrowLeft className="z-10" size="1.5em" />
        </Button>
        <CardHeader className="!mt-2 flex flex-col px-12">
          <div className="flex flex-col justify-start">
            <h1 className="text-4xl font-semibold">Create new user</h1>
            {/* <p className="text-sm">Đăng nhập vào tài khoản của bạn</p> */}
          </div>
        </CardHeader>
        <ScrollArea>
          <ScrollViewport>
            <CardBody className="px-12">
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)}>
                  <div className="space-y-3">
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field, formState: { errors } }) => (
                        <FormItem>
                          <FormControl>
                            <Input
                              {...field}
                              isRequired
                              autoFocus
                              type="email"
                              autoComplete="email"
                              label="Email"
                              classNames={{
                                inputWrapper: ['data-[hover=true]:bg-inherit'],
                              }}
                              errorMessage={errors.email && String(errors.email.message)}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="code"
                      render={({ field, formState: { errors } }) => (
                        <FormItem>
                          <FormControl>
                            <Input
                              {...field}
                              isRequired
                              label="Verification Code"
                              autoComplete="code"
                              errorMessage={errors.code && String(errors.code.message)}
                              type="text"
                              classNames={{
                                inputWrapper: ['data-[hover=true]:bg-inherit'],
                                input: 'w-auto flex-1',
                              }}
                              endContent={
                                <>
                                  <hr className="mr-2 h-full w-[1px] bg-default-400" />
                                  {!isSend ? (
                                    <div className="flex h-full w-fit items-center" onClick={handleSendCode}>
                                      {isLoading ? (
                                        <CircularProgress aria-label="loading" size="sm" />
                                      ) : (
                                        <button className="text-sm text-blue-600  hover:text-blue-600/70">
                                          Gửi mã
                                        </button>
                                      )}
                                    </div>
                                  ) : (
                                    <button className="flex h-full w-fit items-center justify-between">
                                      <p className={cn('pointer-events-none text-sm text-default-400')}>Gửi lại mã</p>
                                      <p className="ml-1 text-sm text-default-400">{`(${counter}s)`}</p>
                                    </button>
                                  )}
                                </>
                              }
                            />
                          </FormControl>
                          <Toast
                            className="!top-2/4"
                            position="top-center"
                            autoClose={4000}
                            closeOnClick
                            limit={1}
                            stacked={false}
                            transition={Zoom}
                            pauseOnFocusLoss
                            theme="light"
                          />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="username"
                      render={({ field, formState: { errors } }) => (
                        <FormItem>
                          <FormControl>
                            <Input
                              {...field}
                              isRequired
                              type="text"
                              autoComplete="username"
                              label="Username"
                              classNames={{
                                inputWrapper: ['data-[hover=true]:bg-inherit'],
                              }}
                              errorMessage={errors.username && String(errors.username.message)}
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
                              isRequired
                              label="Password"
                              autoComplete="new-password"
                              errorMessage={errors.password && String(errors.password.message)}
                              type={isVisible ? 'text' : 'password'}
                              classNames={{
                                inputWrapper: ['data-[hover=true]:bg-inherit'],
                              }}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="confirmPassword"
                      render={({ field, formState: { errors } }) => (
                        <FormItem>
                          <FormControl>
                            <Input
                              {...field}
                              isRequired
                              label="Confirm Password"
                              autoComplete="confirm-password"
                              errorMessage={errors.confirmPassword && String(errors.confirmPassword.message)}
                              type={isVisible ? 'text' : 'password'}
                              classNames={{
                                inputWrapper: ['data-[hover=true]:bg-inherit'],
                              }}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />

                    <Checkbox
                      classNames={{
                        wrapper: 'before:!border-white',
                      }}
                      onClick={toggleVisibility}
                    >
                      Show password
                    </Checkbox>
                    <FormError message={errorState} />
                    <FormSuccess message={success} />
                    <div className="mt-2 w-full">
                      <Button
                        isDisabled={isPending || !form.formState.isValid}
                        className="w-full bg-orange-500"
                        type="submit"
                        variant="shadow"
                      >
                        Đăng ký
                      </Button>
                    </div>
                  </div>
                </form>
              </Form>
            </CardBody>
            <ScrollBar />
            <ScrollCorner />
          </ScrollViewport>
        </ScrollArea>
      </Card>
    </section>
  );
};

export default RegisterForm;
