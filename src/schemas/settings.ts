import * as z from 'zod';

const passwordValidation = new RegExp(/^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*\W)(?!.* ).{8,}$/);

export const personalInfoSchema = z.object({
  name: z.string().min(4, { message: 'Tên phải có ít nhất 4 ký tự' }).max(50, { message: 'Tên có tối đa 50 ký tự' }),
  username: z.string(),
});

export const accountSchema = z
  .object({
    currentPassword: z.string().min(8, {
      message: 'Mật khẩu phải có ít nhất 8 ký tự',
    }),
    newPassword: z.string().min(8, {
      message: 'Mật khẩu phải có ít nhất 8 ký tự',
    }),
    confirmNewPassword: z.string().min(8, {
      message: 'Mật khẩu phải có ít nhất 8 ký tự',
    }),
  })
  .refine((data) => data.currentPassword !== data.newPassword, {
    message: 'Mật khẩu mới phải khác với mật khẩu hiện tại',
    path: ['newPassword'],
  })
  .refine((data) => data.newPassword === data.confirmNewPassword, {
    message: 'Nhập lại mật khẩu không đúng',
    path: ['confirmNewPassword'],
  });
