'use client';
import React, { useState } from 'react';
import Image from 'next/image';
import { Image as NextUIImage } from '@nextui-org/react';

import { IMedia } from '~/types/media';
import { PreviewModal } from '~/components/dialog';
import { Dialog, DialogContent, DialogTrigger } from '~/components/elements/Dialog';
import { Carousel, CarouselItem } from '~/components/elements/Carousel';
import { IMediaList } from '~/services/tmdb/tmdb.types';

type Props = {
  items: IMediaList | undefined;
  title: string;
};

export type IMediaState = Pick<IMedia, 'id' | 'mediaType'>;

const TrendingCarousel = ({ items, title }: Props) => {
  const [media, setMedia] = useState<IMediaState>();
  const [isOpenModal, setIsOpenModal] = useState<boolean>(false);

  const handleOpenModal = () => {
    setIsOpenModal((prev) => !prev);
  };

  return (
    <Dialog open={isOpenModal} onOpenChange={handleOpenModal}>
      <div className="m-3">
        <Carousel<IMedia>
          classNames={{
            control: 'hidden md:flex',
            carouselWrapper: 'no-scrollbar',
          }}
          title={title}
          items={items?.results}
          renderItem={({ item, isSnapPoint, idx }) => (
            <DialogTrigger key={item.id} asChild>
              <CarouselItem
                onClick={() =>
                  setMedia({
                    id: item.id,
                    mediaType: item.mediaType,
                  })
                }
                className="basis-2/5 px-2 md:basis-1/4 lg:basis-[182px]"
                isSnapPoint={isSnapPoint}
              >
                <NextUIImage
                  as={Image}
                  alt="Anh"
                  src={item.posterPath || ''}
                  width={0}
                  height={0}
                  draggable="false"
                  priority={idx === 0}
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  fallbackSrc="https://via.placeholder.com/300x200"
                  className="h-full w-full rounded-lg object-cover"
                  classNames={{
                    wrapper: '!max-w-full !max-h-[299px]',
                    img: 'aspect-[2/3]',
                  }}
                />
                <h3 className="m-2 line-clamp-1 text-white">{item?.title as string}</h3>
              </CarouselItem>
            </DialogTrigger>
          )}
        />
      </div>
      <DialogContent className="absolute top-8 z-50 w-11/12 max-w-[850px] rounded-lg !p-0 md:w-4/5">
        <PreviewModal media={media} />
      </DialogContent>
    </Dialog>
  );
};

export default TrendingCarousel;
