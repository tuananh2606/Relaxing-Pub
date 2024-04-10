'use server';
import { Resend } from 'resend';
import { generateVerificationToken } from './tokens';
import nodemailer from 'nodemailer';
import VerifyEmail from '~/components/Emails/VerifyEmail';
import ResetPassword from '~/components/Emails/ResetPassword';
import { render } from '@react-email/render';
import { getUserByEmail } from '~/actions/user';

interface IMail {
  to: string;
  subject: string;
  text?: string;
  html?: string;
}

export async function sendMail({ to, subject, text, html }: IMail) {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.NODEMAILER_EMAIL,
      pass: process.env.NODEMAILER_PW,
    },
  });

  const mailOptions = {
    from: `FilmPub <${process.env.NODEMAILER_EMAIL}>`,
    to: to,
    subject: subject,
    text: text,
    html: html,
  };

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      throw error;
    } else {
      console.log('Email Sent!');
      return true;
    }
  });
}

const resend = new Resend(process.env.RESEND_API_KEY);

const domain = process.env.NEXT_PUBLIC_APP_URL;

export const sendTwoFactorTokenEmail = async (email: string, token: string) => {
  await resend.emails.send({
    from: 'filmpub.services@gmail.com',
    to: email,
    subject: '2FA Code',
    html: `<p>Your 2FA code: ${token}</p>`,
  });
};

export const sendPasswordResetEmail = async (email: string) => {
  const user = await getUserByEmail(email);
  if (!user) {
    return { error: 'Email này không tồn tại!' };
  }
  const { token } = await generateVerificationToken(email);
  const emailHtml = render(<ResetPassword token={token} name={user!.name} />);

  await sendMail({ to: email, subject: 'Reset Your Password', html: emailHtml });
};

// export const sendVerificationEmail = async (email: string, token: string) => {
//   const confirmLink = `${domain}/auth/verification?token=${token}`;

//   await resend.emails.send({
//     from: 'onboarding@resend.dev',
//     to: email,
//     subject: 'Confirm your email',
//     html: `<p>Click <a href="${confirmLink}">here</a> to confirm email.</p>`,
//   });
// };

export const sendVerificationCodeEmail = async (email: string) => {
  const user = await getUserByEmail(email);
  if (user) {
    return { error: 'Email đã tồn tại ở một tài khoản khác' };
  }

  const { token } = await generateVerificationToken(email);

  const emailHtml = render(<VerifyEmail verificationCode={token} />);

  await sendMail({ to: email, subject: 'Verify Your Email Address', html: emailHtml });
};
