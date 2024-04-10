import { ExclamationTriangleIcon } from '@radix-ui/react-icons';
import { Card, CardHeader, CardBody, CardFooter } from '@nextui-org/react';
import Link from 'next/link';

const AuthErrorPage = () => {
  return (
    <div className="m-auto grid justify-center">
      <Card>
        <CardHeader>
          <p className="text-md">Oops! Something went wrong!</p>
        </CardHeader>
        <CardBody>
          <div className="flex w-full items-center justify-center">
            <ExclamationTriangleIcon className="text-destructive" />
          </div>
        </CardBody>
        <CardFooter>
          <Link href="/auth/login">Back to login</Link>
        </CardFooter>
      </Card>
    </div>
  );
};

export default AuthErrorPage;
