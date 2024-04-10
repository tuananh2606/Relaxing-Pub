'use client';
import { useEffect, useState, useTransition } from 'react';
import { useRouter } from 'next-nprogress-bar';
import * as z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { FaArrowLeft } from 'react-icons/fa6';
import { Card, CardHeader, CardBody, Divider, Button, Input, CircularProgress, Checkbox } from '@nextui-org/react';
import { motion } from 'framer-motion';
import { Zoom, toast } from 'react-toastify';

import { verifyTokenByEmail } from '~/actions/auth';
import { getUserByEmail, updatePassword } from '~/actions/user';
import { Form, FormControl, FormField, FormItem } from '../../ui/form';
import { forgotPasswordSchema } from '~/schemas/auth';
import { FormError } from '../../elements/Form/FormError';
import { FormSuccess } from '../../elements/Form/FormSuccess';
import { cn } from '~/lib/utils';
import { sendPasswordResetEmail } from '~/lib/mails';
import { Toast } from '~/components/elements/Toast';

type Inputs = z.infer<typeof forgotPasswordSchema>;

let steps = [
  {
    id: 'Step 1',
    name: 'Enter Account',
    fields: ['email'],
    success: false,
  },
  {
    id: 'Step 2',
    name: 'Security Verification',
    fields: ['code'],
    success: false,
  },
  { id: 'Step 3', name: 'Set Password', fields: ['newPassword, confirmPassword'], success: false },
];

const ForgotPasswordForm = () => {
  const [isPending, startTransition] = useTransition();
  const [isLoading, startSendCodeTransition] = useTransition();
  const [error, setError] = useState<string | undefined>('');
  const [success, setSuccess] = useState<string | undefined>('');
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const [isSend, setIsSend] = useState<boolean>(false);
  const [previousStep, setPreviousStep] = useState(0);
  const [currentStep, setCurrentStep] = useState(0);
  const [counter, setCounter] = useState<number>(60);
  const delta = currentStep - previousStep;

  const router = useRouter();

  const form = useForm<z.infer<typeof forgotPasswordSchema>>({
    mode: 'onTouched',
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: '',
      code: '',
      newPassword: '',
      confirmPassword: '',
    },
  });

  type FieldName = keyof Inputs;

  const lastStep = currentStep === steps.length - 1;

  const next = async () => {
    const fields = steps[currentStep].fields;
    const output = await form.trigger(fields as FieldName[], { shouldFocus: true });

    if (!output) return;

    if (currentStep < steps.length - 1) {
      if (currentStep === 0) {
        startTransition(() => {
          getUserByEmail(form.getValues('email')).then((result) => {
            if (!result) toast('Email does not exist', { type: 'error' });
            else {
              steps[currentStep].success = true;
              setCurrentStep((step) => step + 1);
            }
          });
        });
      } else if (currentStep === 1) {
        startTransition(() => {
          verifyTokenByEmail(form.getValues('email'), form.getValues('code')).then((result) => {
            if (result) toast(result?.error as string, { type: 'error' });
            else {
              steps[currentStep].success = true;
              setCurrentStep((step) => step + 1);
            }
          });
        });
      } else setCurrentStep((step) => step + 1);
      setPreviousStep(currentStep);
    }
  };

  const prev = () => {
    if (currentStep > 0) {
      setPreviousStep(currentStep);
      setCurrentStep((step) => step - 1);
      steps[previousStep].success = false;
    }
  };

  const handleSendCode = async () => {
    const check = await form.trigger('email');
    if (check) {
      startSendCodeTransition(() => {
        sendPasswordResetEmail(form.getValues('email')).then((result) => {
          if (result) toast(result?.error as string, { type: 'error' });
          else setIsSend(true);
        });
      });
    }
  };

  const toggleVisibility = () => setIsVisible(!isVisible);

  function onSubmit(values: z.infer<typeof forgotPasswordSchema>) {
    setError('');
    setSuccess('');
    startTransition(async () => {
      const res = await updatePassword(values);
      if (res) {
        setError(res.error);
      }

      if (res?.success) {
        form.reset();
        setSuccess(res.success);
      }
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
      <Toast
        position="bottom-right"
        autoClose={4000}
        closeOnClick
        limit={1}
        stacked={false}
        transition={Zoom}
        pauseOnFocusLoss
        theme="light"
      />
      <Card className="h-full w-full space-y-8 rounded-none px-12 pb-8 pt-12" isBlurred shadow="lg">
        <Button isIconOnly aria-label="go-back" className="bg-transparent" onClick={() => router.back()}>
          <FaArrowLeft className="z-10" size="1.5em" />
        </Button>

        <CardHeader className="flex flex-col gap-3">
          <div className="flex flex-col justify-start">
            <h1 className="text-4xl font-semibold md:text-5xl">Quên mật khẩu?</h1>
            <div className="mt-6">
              <div className="flex w-full whitespace-nowrap">
                {steps.map((ele, idx) => (
                  <div className="relative inline-block shrink basis-[220px]" key={ele.id}>
                    <div className="relative w-full text-center">
                      <div
                        className={cn(
                          'absolute -right-1/2 left-1/2 top-[11px] mx-[30px] my-0 h-[2px] bg-background',
                          idx === 2 ? 'hidden' : '',
                        )}
                      />
                      <div className="relative inline-flex h-6 w-6 items-center justify-center rounded-full border-solid bg-black">
                        {ele.success ? (
                          <i>
                            <svg
                              width="15"
                              height="15"
                              viewBox="0 0 15 15"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                d="M11.4669 3.72684C11.7558 3.91574 11.8369 4.30308 11.648 4.59198L7.39799 11.092C7.29783 11.2452 7.13556 11.3467 6.95402 11.3699C6.77247 11.3931 6.58989 11.3355 6.45446 11.2124L3.70446 8.71241C3.44905 8.48022 3.43023 8.08494 3.66242 7.82953C3.89461 7.57412 4.28989 7.55529 4.5453 7.78749L6.75292 9.79441L10.6018 3.90792C10.7907 3.61902 11.178 3.53795 11.4669 3.72684Z"
                                fill="currentColor"
                                fillRule="evenodd"
                                clipRule="evenodd"
                              ></path>
                            </svg>
                          </i>
                        ) : (
                          idx + 1
                        )}
                      </div>
                    </div>
                    <div className="mt-2 text-center text-sm">{ele.name}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </CardHeader>
        <Divider />
        <CardBody className="no-scrollbar">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              {currentStep === 0 && (
                <motion.div
                  initial={{ x: delta >= 0 ? '50%' : '-50%', opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ duration: 0.3, ease: 'easeInOut' }}
                >
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
                </motion.div>
              )}

              {currentStep === 1 && (
                <motion.div
                  initial={{ x: delta >= 0 ? '50%' : '-50%', opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ duration: 0.3, ease: 'easeInOut' }}
                >
                  <p>Please enter the email verification code to verify your identity</p>
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
                                      <button className="text-sm text-blue-600  hover:text-blue-600/70">Gửi mã</button>
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
                      </FormItem>
                    )}
                  />
                </motion.div>
              )}
              {currentStep === 2 && (
                <div className="space-y-4">
                  <input type="text" hidden name="username" autoComplete="username" />
                  <FormField
                    control={form.control}
                    name="newPassword"
                    render={({ field, formState: { errors } }) => (
                      <FormItem>
                        <FormControl>
                          <Input
                            {...field}
                            isDisabled={isPending}
                            isRequired
                            type={isVisible ? 'text' : 'password'}
                            autoComplete="new-password"
                            label="New Password"
                            errorMessage={errors.newPassword && String(errors.newPassword.message)}
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
                            isDisabled={isPending}
                            isRequired
                            type={isVisible ? 'text' : 'password'}
                            autoComplete="confirm-password"
                            label="Confirm Password"
                            errorMessage={errors.confirmPassword && String(errors.confirmPassword.message)}
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
                </div>
              )}
              <FormError message={error} />
              <FormSuccess message={success} />
              <div className="mt-4 flex justify-end">
                <Button onClick={prev} isDisabled={currentStep === 0} type="button" variant="shadow">
                  Lùi lại
                </Button>
                <Button
                  type={lastStep ? 'submit' : 'button'}
                  onClick={next}
                  variant="shadow"
                  className="ml-2 bg-orange-500"
                >
                  {isPending ? (
                    <CircularProgress size="sm" aria-label="submit-loading" />
                  ) : lastStep ? (
                    'Xác nhận'
                  ) : (
                    'Tiếp theo'
                  )}
                </Button>
              </div>
            </form>
          </Form>
        </CardBody>
      </Card>
    </section>
  );
};

export default ForgotPasswordForm;
