'use client';
import { Separator } from '@radix-ui/react-dropdown-menu';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ScrollArea, ScrollBar, ScrollCorner, ScrollViewport } from '~/components/ui/scroll-area';
import { Navbar, NavbarBrand, NavbarContent, NavbarItem, Button } from '@nextui-org/react';
import { cn } from '~/lib/utils';

interface MediaNavProps extends React.HTMLAttributes<HTMLDivElement> {
  items: {
    name: string;
    href: string;
  }[];
}

const MediaNav = ({ className, items, ...props }: MediaNavProps) => {
  const pathname = usePathname();
  return (
    <Navbar
      className="top-[var(--navbar-height)] justify-start"
      classNames={{
        wrapper: 'max-w-none',
      }}
    >
      <ScrollArea className="h-full w-full border-b-1 border-solid border-b-white lg:max-w-none">
        <ScrollViewport>
          <div className={cn('flex h-14 items-center ', className)} {...props}>
            {items.map((item, index) => (
              <Link
                href={item.href}
                key={index}
                className={cn(
                  'flex items-center justify-center rounded-2xl px-4 text-center text-sm transition-colors hover:text-primary md:py-2',
                  pathname?.startsWith(item.href) || (index === 0 && pathname === '/')
                    ? 'bg-muted font-medium text-primary'
                    : 'text-muted-foreground',
                )}
              >
                {item.name}
              </Link>
            ))}
          </div>
          <ScrollBar orientation="horizontal" className="invisible" />
          <ScrollCorner />
        </ScrollViewport>
      </ScrollArea>
    </Navbar>
  );
};

export default MediaNav;
