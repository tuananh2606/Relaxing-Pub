import * as z from 'zod';

const passwordValidation = new RegExp(/^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*\W)(?!.* ).{8,}$/);

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1, {
    message: 'Password is required',
  }),
});

export const registerSchema = z
  .object({
    username: z
      .string()
      .trim()
      .regex(/^[a-zA-Z0-9]*$/, { message: 'Không được có ký tự đặc biệt' })
      .min(6, { message: 'Tên người dùng phải có ít nhất 6 ký tự' }),
    email: z
      .string()
      .trim()
      .min(1, { message: 'Email không được để trống' })
      .email({ message: 'Vui lòng nhập email hợp lệ' }),
    password: z.string().min(8, { message: 'Mật khẩu phải có ít nhất 8 ký tự' }),
    confirmPassword: z.string().min(8, { message: 'Mật khẩu phải có ít nhất 8 ký tự' }),
    code: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Nhập lại mật khẩu không đúng',
    path: ['confirmPassword'],
  });
// .superRefine(({ email }, ctx) => {
//   if (email === '') {
//     ctx.addIssue({
//       code: z.ZodIssueCode.custom,
//       message: `Email không được để trống`,
//       path: ['code'],
//     });
//   } else if (!/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email)) {
//     ctx.addIssue({
//       code: z.ZodIssueCode.custom,
//       message: 'Email không hợp lệ 1',
//       path: ['code'],
//     });
//   }
// });

export const forgotPasswordSchema = z
  .object({
    email: z.string().trim().email({ message: 'Vui lòng nhập email hợp lệ' }),
    code: z.string().trim(),
    newPassword: z.string().min(8, { message: 'Mật khẩu phải có ít nhất 8 ký tự' }),
    confirmPassword: z.string().min(8, { message: 'Mật khẩu phải có ít nhất 8 ký tự' }),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: 'Nhập lại mật khẩu không đúng',
    path: ['confirmPassword'],
  });

export const newPasswordSchema = z
  .object({
    password: z.string().min(6, { message: 'Mật khẩu phải có ít nhất 6 ký tự' }),
    confirmPassword: z.string().min(6, { message: 'Mật khẩu phải có ít nhất 6 ký tự' }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Nhập lại mật khẩu không đúng',
    path: ['confirmPassword'],
  });
