'use client';
import { useEffect, useState, useTransition } from 'react';
import * as z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Checkbox } from '@nextui-org/react';
import { useSearchParams } from 'next/navigation';
import { Card, CardHeader, CardBody, CardFooter, Divider, Button, Input } from '@nextui-org/react';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '../ui/form';
import { registerSchema } from '~/schemas/auth';
import { register } from '~/actions/auth';
import { FormError } from '../elements/Form/FormError';
import { FormSuccess } from '../elements/Form/FormSuccess';

const RegisterForm = () => {
  const [isPending, startTransition] = useTransition();
  const [isVisible, setIsVisible] = useState(false);
  const [error, setError] = useState<string | undefined>('');
  const [success, setSuccess] = useState<string | undefined>('');
  const searchParams = useSearchParams();
  const urlError =
    searchParams.get('error') === 'OAuthAccountNotLinked' ? 'Email đã đăng nhập bằng tài khoản liên kết khác' : '';
  const callbackUrl = searchParams.get('callbackUrl');

  const toggleVisibility = () => setIsVisible(!isVisible);

  const form = useForm<z.infer<typeof registerSchema>>({
    mode: 'onChange',
    resolver: zodResolver(registerSchema),
    defaultValues: {
      email: '',
      username: '',
      password: '',
      confirmPassword: '',
    },
  });

  //   useEffect(() => {
  //     if (urlError !== '') {
  //       toast.error(urlError);
  //     }
  //   }, [urlError]);

  function onSubmit(values: z.infer<typeof registerSchema>) {
    setError('');
    setSuccess('');

    startTransition(() => {
      register(values).then((data) => {
        setError(data.error);
        setSuccess(data.success);
      });
    });
  }

  return (
    <section className="relative h-screen max-w-[500px]">
      <Card className="h-full w-auto space-y-8 rounded-none px-12 pb-8 pt-12" isBlurred shadow="lg">
        <CardHeader className="flex flex-col gap-3">
          <div className="flex flex-col justify-start">
            <h1 className="text-4xl font-semibold">Create new user</h1>
            {/* <p className="text-sm">Đăng nhập vào tài khoản của bạn</p> */}
          </div>
        </CardHeader>
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
                  name="username"
                  render={({ field, formState: { errors } }) => (
                    <FormItem>
                      <FormControl>
                        <Input
                          {...field}
                          isRequired
                          autoFocus
                          type="text"
                          autoComplete="username"
                          label="Username"
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
                          autoComplete="current-password"
                          errorMessage={errors.password && String(errors.password.message)}
                          type={isVisible ? 'text' : 'password'}
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
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <Checkbox onClick={toggleVisibility}>Show password</Checkbox>
                <FormError message={error} />
                <FormSuccess message={success} />
                <div className="mt-2 w-full">
                  <Button className="w-full bg-orange-500" type="submit" variant="shadow">
                    Đăng ký
                  </Button>
                </div>
              </div>
            </form>
          </Form>
        </CardBody>
      </Card>
    </section>
  );
};

export default RegisterForm;
