'use client';
import { Card, CardHeader, CardBody, Listbox, ListboxItem } from '@nextui-org/react';
import { useState, useMemo } from 'react';
import type { Selection } from '@nextui-org/react';
import { SidebarNav } from '~/components/elements/Sidebar';
import { useSearchParams } from 'next/navigation';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const [selectedKeys, setSelectedKeys] = useState<Selection>(new Set(['']));
  const searchParams = useSearchParams();
  const query = searchParams.get('q');
  const page = searchParams.get('page');

  const sidebarNavItems = [
    {
      title: 'Movie',
      href: `/search/movie?q=${query}`,
    },
    {
      title: 'Tv Show',
      href: `/search/tv?q=${query}`,
    },
  ];

  if (page) {
    sidebarNavItems.forEach((ele) => {
      ele.href += `&page=${page}`;
    });
  }

  return (
    <section className="mt-[var(--navbar-height)] grid grid-cols-[300px_1fr] gap-5 px-10 py-8 grid-areas-search">
      <div className="flex flex-col items-center rounded-lg grid-in-sidebar">
        {/* <Card>
          <CardHeader>
            <h1 className="text-3xl font-bold">Search Results</h1>
          </CardHeader>
          <CardBody>
            <Listbox
              aria-label="Single selection example"
              variant="flat"
              disallowEmptySelection
              selectionMode="single"
              selectedKeys={selectedKeys}
              onSelectionChange={setSelectedKeys}
            >
              <ListboxItem key="movie">Movie</ListboxItem>
              <ListboxItem key="tv">TV Shows</ListboxItem>
            </Listbox>
          </CardBody>
        </Card> */}
        <SidebarNav items={sidebarNavItems} />
      </div>
      <div className="grid-in-results">{children}</div>
    </section>
  );
}
