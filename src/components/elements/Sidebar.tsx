'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { cn } from '~/lib/utils';
import { buttonVariants } from '../ui/button';

interface SidebarNavProps extends React.HTMLAttributes<HTMLElement> {
  items: {
    href: string;
    title: string;
  }[];
}

export function SidebarNav({ className, items, ...props }: SidebarNavProps) {
  const pathname = usePathname();
  return (
    <nav
      className={cn(
        'sticky bottom-0 left-0 top-[calc(var(--navbar-height)_+_30px)] hidden space-x-2 lg:flex lg:flex-col lg:space-x-0 lg:space-y-1',
        className,
      )}
      {...props}
    >
      {items.map((item) => {
        const idxQuesMark = item.href.indexOf('?');
        const hrefModified = item.href.slice(0, idxQuesMark > 0 ? idxQuesMark : item.href.length);

        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              buttonVariants({ variant: 'ghost', size: 'lg' }),
              pathname === hrefModified ? 'bg-muted hover:bg-muted' : 'hover:bg-transparent hover:underline',
              'justify-start',
            )}
          >
            {item.title}
          </Link>
        );
      })}
    </nav>
  );
}
