import { auth } from '~/auth';
import { AccountForm } from '~/components/pages/Settings/AccountForm';
import { User } from '~/types/next-auth';

export default async function ProfilePage() {
  const session = await auth();

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-3xl font-bold">Profile</h3>
      </div>
      <AccountForm user={session?.user as User} />
    </div>
  );
}
