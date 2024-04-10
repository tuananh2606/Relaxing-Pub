import { Metadata } from 'next';
import LogoutButton from '~/components/elements/LogoutButton';
import { SidebarNav } from '~/components/elements/Sidebar';

export const metadata: Metadata = {
  title: 'FilmPub Account',
  description: 'Manage your account settings',
};

const sidebarNavItems = [
  {
    title: 'Profile',
    href: '/profile',
  },
  {
    title: 'Account',
    href: '/account',
  },
  {
    title: 'Appearance',
    href: '/examples/forms/appearance',
  },
  {
    title: 'Notifications',
    href: '/examples/forms/notifications',
  },
  {
    title: 'Display',
    href: '/examples/forms/display',
  },
];

interface SettingsLayoutProps {
  children: React.ReactNode;
}

export default function SettingsLayout({ children }: SettingsLayoutProps) {
  return (
    <>
      <div className="relative top-[var(--navbar-height)] space-y-6 p-10 pb-16">
        <div className="space-y-0.5">
          <h2 className="text-4xl font-bold tracking-tight">Account Management</h2>
          <p className="text-muted-foreground">Manage your account settings and set e-mail preferences.</p>
        </div>

        <div className="flex flex-col space-y-8 lg:flex-row lg:space-x-12">
          <aside className="relative -mx-4 lg:w-1/5">
            <SidebarNav items={sidebarNavItems} />
          </aside>
          <div className="flex-1 lg:max-w-4xl">{children}</div>
        </div>
        <LogoutButton />
      </div>
    </>
  );
}
