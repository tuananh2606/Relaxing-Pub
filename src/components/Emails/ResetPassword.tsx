import { Body, Button, Container, Head, Html, Img, Link, Preview, Section, Text } from '@react-email/components';
import * as React from 'react';

interface ResetPasswordProps {
  token: string;
  name: string | null;
}

export const ResetPassword = ({ token, name }: ResetPasswordProps) => {
  return (
    <Html>
      <Head />
      <Preview>Reset Your Password</Preview>
      <Body style={main}>
        <Container style={container}>
          {/* <Img src={`${baseUrl}/static/dropbox-logo.png`} width="40" height="33" alt="Dropbox" /> */}
          <Section>
            <Text style={text}>Hi {name},</Text>
            <Text style={text}>
              Someone recently requested a password change for your FilmPub account. If this was you, enter the
              following password reset code:
            </Text>
            <Text style={codeText}>{token}</Text>
            <Text style={text}>
              If you don&apos;t want to change your password or didn&apos;t request this, just ignore and delete this
              message.
            </Text>
            <Text style={text}>
              To keep your account secure, please don&apos;t forward this email to anyone. See our Help Center for{' '}
              <Link style={anchor} href="#">
                more security tips.
              </Link>
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
};

export default ResetPassword;

const main = {
  backgroundColor: '#f6f9fc',
  padding: '10px 0',
};

const container = {
  backgroundColor: '#ffffff',
  border: '1px solid #f0f0f0',
  padding: '45px',
  maxWidth: '43.75em',
};

const text = {
  fontSize: '16px',
  fontFamily:
    "'Open Sans', 'HelveticaNeue-Light', 'Helvetica Neue Light', 'Helvetica Neue', Helvetica, Arial, 'Lucida Grande', sans-serif",
  fontWeight: '300',
  color: '#404040',
  lineHeight: '26px',
};

const codeText = {
  ...text,
  fontWeight: 'bold',
  fontSize: '20px',
  padding: '14px 7px',
  width: '150px',
  textAlign: 'center' as const,
  backgroundColor: '#f2f2f2',
  borderLeft: '1px solid #ccc',
  borderRight: '1px solid #ccc',
  borderTop: '1px solid #ccc',
  borderBottom: '1px solid #ccc',
  borderRadius: '7px',
  display: 'block',
  border: '1px solid #1877f2',
  background: '#e7f3ff',
};

const anchor = {
  textDecoration: 'underline',
};
