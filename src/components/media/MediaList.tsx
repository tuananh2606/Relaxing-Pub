'use client';
import React, { useCallback } from 'react';
import { Pagination, Spacer } from '@nextui-org/react';

import { tv } from 'tailwind-variants';
import { usePathname, useSearchParams } from 'next/navigation';
import { useRouter } from 'next-nprogress-bar';

import { IMediaList } from '~/services/tmdb/tmdb.types';
import ListViewChangeButton from '../shared/ListViewChangeButton';
import { useFilmPubSettings } from '~/hooks/useLocalStorage';
import MediaItem from './item/MediaItem';

interface IMediaListProps {
  items: IMediaList | undefined;
  title?: string;
}

const mediaListGridStyles = tv({
  base: 'grid gap-5',
  variants: {
    listViewType: {
      table: 'grid-cols-1',
      card: 'grid-cols-2 md:grid-cols-4 xl:grid-cols-5 3xl:grid-cols-6',
      detail: 'grid-cols-1 md:grid-cols-2 3xl:grid-cols-4 3xl:gap-10',
      coverCard: 'grid-cols-1 xl:grid-cols-2 4xl:grid-cols-3',
    },
  },
  defaultVariants: {
    listViewType: 'card',
  },
});

const MediaList = (props: IMediaListProps) => {
  const { items, title } = props;
  const { listLoadingType, listViewType } = useFilmPubSettings();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();
  const currentPage = Number(searchParams.get('page')) || 1;

  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set(name, value);

      return params.toString();
    },
    [searchParams],
  );

  const handlePageChange = ({ direction, page }: { direction?: 'next' | 'prev'; page?: number }) => {
    router.push(pathname + '?' + createQueryString('page', page + ''));
  };

  return (
    <div className="px-2 py-4 lg:px-4">
      {title && <h1 className="text-3xl font-bold uppercase tracking-wider">{title}</h1>}
      <div className="mb-5 flex flex-row items-center justify-end gap-3">
        <ListViewChangeButton />
      </div>
      <div
        className={mediaListGridStyles({
          listViewType: listViewType.value,
        })}
      >
        {items?.results?.map((item, idx) => <MediaItem key={idx} item={item} />)}
      </div>
      <Spacer y={9} />
      <div className="flex items-center justify-center">
        <Pagination
          isCompact
          showControls
          total={items?.total_pages as number}
          initialPage={currentPage}
          size="lg"
          onChange={(page) => handlePageChange({ page })}
          classNames={{
            base: '',
            wrapper: '',
            item: 'w-max px-2',
            cursor: 'w-auto px-2',
          }}
          // {...(isSm && !is2Xs ? { size: 'md' } : isSm && is2Xs ? { size: 'sm' } : {})}
        />
      </div>
    </div>
  );
};
export default MediaList;
