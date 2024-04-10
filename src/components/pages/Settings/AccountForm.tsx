'use client';
import Link from 'next/link';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Button, Input, Card, CardBody, Checkbox } from '@nextui-org/react';

import { User } from '~/types/next-auth';
import { accountSchema, personalInfoSchema } from '~/schemas/settings';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '~/components/ui/form';
import { mungeEmailAddress } from '~/lib/utils';
import { changePassword, updateNameUser } from '~/actions/user';
import { useState, useTransition } from 'react';
import { Toast } from '~/components/elements/Toast';
import { Flip, toast } from 'react-toastify';

interface AccountFormProps {
  user: User;
}
type PersonalInfoFormValues = z.infer<typeof personalInfoSchema>;
type AccountFormValues = z.infer<typeof accountSchema>;

export function AccountForm({ user, ...props }: AccountFormProps) {
  const [isPending, startTransition] = useTransition();
  const [isAccountPending, startTransitionAccount] = useTransition();
  const [isVisible, setIsVisible] = useState<boolean>(false);

  const formPersonalInfo = useForm<PersonalInfoFormValues>({
    resolver: zodResolver(personalInfoSchema),
    defaultValues: {
      name: user.name as string,
      username: user.username,
    },
    mode: 'onChange',
  });

  const formAccount = useForm<AccountFormValues>({
    resolver: zodResolver(accountSchema),
    defaultValues: {
      currentPassword: '',
      newPassword: '',
      confirmNewPassword: '',
    },
    mode: 'onChange',
  });
  const onSubmit = (values: PersonalInfoFormValues) => {
    startTransition(() => {
      updateNameUser(values).then((data) => {
        if (data!.success) {
          toast(data?.success as string, { type: 'success' });
        } else toast(data?.error as string, { type: 'error' });
      });
    });
  };

  const onSubmitAccount = (values: AccountFormValues) => {
    startTransitionAccount(() => {
      changePassword(values, user.email as string).then((data) => {
        if (data!.success) {
          toast(data?.success as string, { type: 'success' });
          formAccount.reset();
        } else toast(data?.error as string, { type: 'error' });
      });
    });
  };

  const toggleVisibility = () => setIsVisible(!isVisible);

  return (
    <>
      <Toast
        position="top-right"
        autoClose={4000}
        closeOnClick
        limit={1}
        stacked={false}
        transition={Flip}
        pauseOnFocusLoss
        theme="light"
      />
      <Form key="personal" {...formPersonalInfo}>
        <form onSubmit={formPersonalInfo.handleSubmit(onSubmit)} className="space-y-8">
          <Card className="px-5 py-10 md:px-10">
            <CardBody className="space-y-4">
              <div className="grid grid-cols-6 justify-center gap-6 md:grid-cols-12 md:gap-10">
                <div className="relative col-span-5">
                  <div className="flex flex-col justify-center space-y-2">
                    <h1 className="text-xl font-bold md:text-2xl">Personal Information</h1>
                    <p className="text-xs text-muted-foreground md:text-sm">
                      This information is private and will not be shared with other players.
                    </p>
                  </div>
                </div>
                <div className="relative col-span-7">
                  <div className="space-y-4">
                    <FormField
                      control={formPersonalInfo.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Full Name</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormDescription>This is your public display name.</FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      name="username"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Username</FormLabel>
                          <FormControl>
                            <Input isDisabled {...field} autoComplete="username" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <Button
                    isLoading={isPending}
                    isDisabled={isPending || !formPersonalInfo.formState.isDirty}
                    className="float-end mt-8 uppercase"
                    type="submit"
                  >
                    Save Changes
                  </Button>
                </div>
              </div>
            </CardBody>
          </Card>
        </form>
      </Form>
      <Form key="account" {...formAccount}>
        <form onSubmit={formAccount.handleSubmit(onSubmitAccount)}>
          <Card className="px-5 py-10 md:px-10">
            <CardBody className="space-y-4 ">
              <div className="grid grid-cols-6 justify-center gap-6 md:grid-cols-12 md:gap-10">
                <div className="relative col-span-5">
                  <div className="flex flex-col justify-center space-y-2">
                    <h1 className="text-xl font-bold md:text-2xl">Account Sign-In</h1>
                    <p className="text-xs text-muted-foreground md:text-sm">
                      We recommend that you periodically update your password to help prevent unauthorized access to
                      your account.
                    </p>
                  </div>
                </div>
                <div className="relative col-span-7">
                  <div className="space-y-4">
                    <div>
                      <Input value={mungeEmailAddress(user.email!)} isDisabled />
                      <p className="mt-1 text-[0.8rem] text-muted-foreground">
                        You can manage verified email addresses in your{' '}
                        <Link href="/examples/forms">email settings</Link>.
                      </p>
                    </div>

                    <FormField
                      control={formAccount.control}
                      name="currentPassword"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Current Password</FormLabel>
                          <FormControl>
                            <Input {...field} type={isVisible ? 'text' : 'password'} autoComplete="current-password" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={formAccount.control}
                      name="newPassword"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>New Password</FormLabel>
                          <FormControl>
                            <Input {...field} type={isVisible ? 'text' : 'password'} autoComplete="new-password" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={formAccount.control}
                      name="confirmNewPassword"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Confirm New Password</FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              type={isVisible ? 'text' : 'password'}
                              autoComplete="confirm-new-password"
                            />
                          </FormControl>
                          <FormMessage />
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
                  </div>
                  <Button
                    isLoading={isAccountPending}
                    isDisabled={isAccountPending || !formAccount.formState.isDirty}
                    className="float-end mt-8 uppercase"
                    type="submit"
                  >
                    Save Changes
                  </Button>
                </div>
              </div>
            </CardBody>
          </Card>
        </form>
      </Form>
    </>
  );
}
