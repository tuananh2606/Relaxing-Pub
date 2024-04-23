'use client';
import dynamic from 'next/dynamic';
import { useState } from 'react';
import Link from 'next/link';
import { useTheme } from 'next-themes';
import {
  Button,
  Avatar,
  Navbar,
  NavbarContent,
  NavbarBrand,
  NavbarItem,
  NavbarMenuToggle,
  NavbarMenu,
  NavbarMenuItem,
  Switch,
  User,
} from '@nextui-org/react';
import { SunIcon, MoonIcon } from '@radix-ui/react-icons';
import { useSession, signOut } from 'next-auth/react';
import { usePathname } from 'next/navigation';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from '~/components/ui/dropdown';
import Logo from '~/components/ui/logo';
import Search from '~/components/elements/Search';

const NavBar = () => {
  const { theme, setTheme } = useTheme();
  const [toggle, setToggle] = useState<boolean>(false);
  const [open, setOpen] = useState(false);
  const [isSelected, setIsSelected] = useState<boolean>(theme === 'light' ? false : true);
  const { data } = useSession();
  const pathName = usePathname();
  const menuItems = [
    {
      title: 'Trang chủ',
      href: '/',
    },
    {
      title: 'Phim',
      href: '/movie/popular',
    },
    {
      title: 'Phim T.Hình',
      href: '/tv/popular',
    },
    {
      title: 'Danh sách của tôi',
      href: '/wishlist',
    },
    {
      title: 'My Settings',
      href: '/',
    },
    {
      title: 'Log Out',
      href: '',
    },
  ];

  const handleOpen = () => {
    setToggle((p) => !p);
  };

  return (
    <Navbar
      isBlurred
      onMenuOpenChange={handleOpen}
      isMenuOpen={toggle}
      classNames={{
        wrapper: 'w-full z-50 max-w-none',
        brand: 'grow-0',
        item: [
          'flex',
          'relative',
          'h-full',
          'items-center',
          "data-[active=true]:after:content-['']",
          'data-[active=true]:after:absolute',
          'data-[active=true]:after:bottom-0',
          'data-[active=true]:after:left-0',
          'data-[active=true]:after:right-0',
          'data-[active=true]:after:h-[2px]',
          'data-[active=true]:after:rounded-[2px]',
          'data-[active=true]:after:bg-primary',
        ],
      }}
    >
      <NavbarContent className=" lg:!grow" justify="start">
        <NavbarContent className="!grow-0 lg:hidden" justify="start">
          <NavbarMenuToggle aria-label={toggle ? 'Close menu' : 'Open menu'} />
        </NavbarContent>
        <NavbarBrand className="mr-4">
          <Link className="flex items-center" href="/">
            <Logo />
          </Link>
        </NavbarBrand>
        <NavbarContent className="z-50 hidden gap-3 lg:flex">
          {menuItems.slice(0, -2).map((item, idx) => (
            <NavbarItem key={idx} isActive={pathName === item.href}>
              <Link className="transition-all hover:opacity-80" href={item.href}>
                {item.title}
              </Link>
            </NavbarItem>
          ))}
        </NavbarContent>

        <NavbarContent as="div" className="flex items-center" justify="end">
          <Search />
          {data ? (
            <DropdownMenu open={open} onOpenChange={setOpen}>
              <DropdownMenuTrigger asChild>
                <Avatar radius="sm" showFallback name={data.user.name as string} src={data.user.image as string} />
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56">
                <DropdownMenuLabel>
                  <User
                    name={data.user.name as string}
                    avatarProps={{
                      src: data.user.image as string,
                    }}
                  />
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  <DropdownMenuItem asChild>
                    <Link href="/profile">Profile</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    Billing
                    <DropdownMenuShortcut>⌘B</DropdownMenuShortcut>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    Settings
                    <DropdownMenuShortcut>⌘S</DropdownMenuShortcut>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    Keyboard shortcuts
                    <DropdownMenuShortcut>⌘K</DropdownMenuShortcut>
                  </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  <DropdownMenuItem>Team</DropdownMenuItem>
                  <DropdownMenuSub>
                    <DropdownMenuSubTrigger>Invite users</DropdownMenuSubTrigger>
                    <DropdownMenuPortal>
                      <DropdownMenuSubContent>
                        <DropdownMenuItem>Email</DropdownMenuItem>
                        <DropdownMenuItem>Message</DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem>More...</DropdownMenuItem>
                      </DropdownMenuSubContent>
                    </DropdownMenuPortal>
                  </DropdownMenuSub>
                  <DropdownMenuItem>
                    New Team
                    <DropdownMenuShortcut>⌘+T</DropdownMenuShortcut>
                  </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  <DropdownMenuSub>
                    <DropdownMenuSubTrigger>Language</DropdownMenuSubTrigger>
                    <DropdownMenuPortal>
                      <DropdownMenuSubContent>
                        <DropdownMenuItem>English</DropdownMenuItem>
                        <DropdownMenuItem>Vietnamese</DropdownMenuItem>
                      </DropdownMenuSubContent>
                    </DropdownMenuPortal>
                  </DropdownMenuSub>
                </DropdownMenuGroup>

                <DropdownMenuItem className="flex items-center justify-between" onSelect={(e) => e.preventDefault()}>
                  <span>Dark mode</span>
                  <Switch
                    size="md"
                    color="success"
                    startContent={<MoonIcon className="mr-2" />}
                    endContent={<SunIcon />}
                    isSelected={isSelected}
                    onValueChange={() => {
                      if (theme === 'dark') {
                        setIsSelected(false);
                        setTheme('light');
                      } else {
                        setIsSelected(true);
                        setTheme('dark');
                      }
                    }}
                  />
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => signOut({ callbackUrl: '/' })}>Log out</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Link href="/auth/login">
              <Button className="bg-[#ED213A] bg-gradient-to-r from-[#ED213A] to-[#93291E]">Login</Button>
            </Link>
          )}
        </NavbarContent>

        <NavbarMenu className="z-50">
          {menuItems.map((item, index) => (
            <NavbarMenuItem className="text-center" onClick={handleOpen} key={`${item}-${index}`}>
              <Link className="w-full" href={item.href}>
                {item.title}
              </Link>
            </NavbarMenuItem>
          ))}
        </NavbarMenu>
      </NavbarContent>
    </Navbar>
  );
};

export default NavBar;
