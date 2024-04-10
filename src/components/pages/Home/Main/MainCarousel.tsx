'use client';
import React, { useState } from 'react';
import Image from 'next/image';
import { Card, CardBody, CardFooter, Image as NextUIImage } from '@nextui-org/react';

import { IMedia } from '~/types/media';
import { PreviewModal } from '~/components/dialog';
import { Dialog, DialogContent, DialogTrigger } from '~/components/elements/Dialog';
import { Carousel, CarouselItem } from '~/components/elements/Carousel';
import { IMediaList } from '~/services/tmdb/tmdb.types';
import HoverCard from '~/components/elements/HoverCard';

type Props = {
  items: IMediaList | undefined;
  title: string;
  to?: string;
};

export type IMediaState = Pick<IMedia, 'id' | 'mediaType'>;

const MainCarousel = ({ items, title, to }: Props) => {
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
            carouselWrapper: 'no-scrollbar gap-3',
          }}
          to={to}
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
                className="basis-2/5 cursor-pointer md:basis-1/4 lg:basis-[182px]"
                isSnapPoint={isSnapPoint}
              >
                <Card isHoverable>
                  <CardBody className="p-0">
                    <NextUIImage
                      as={Image}
                      alt="Anh"
                      src={item.posterPath}
                      width={0}
                      height={0}
                      draggable="false"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      fallbackSrc="/placeholder-gray.jpg"
                      className="h-auto !max-h-[299px] w-full rounded-lg object-cover"
                      classNames={{
                        wrapper: '!max-w-none',
                        img: 'aspect-[2/3]',
                      }}
                    />
                  </CardBody>
                  <CardFooter className="min-h-[72px]">
                    <h3 className="mx-2 line-clamp-2 text-foreground">{item?.title as string}</h3>
                  </CardFooter>
                </Card>

                {/* <HoverCard key={idx} item={item} /> */}
                {/* <NextUIImage
                  as={Image}
                  alt="Anh"
                  src={item.posterPath || ''}
                  width={0}
                  height={0}
                  draggable="false"
                  priority={idx === 0}
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  fallbackSrc="/placeholder-gray.jpg"
                  className="h-full w-full rounded-lg object-cover"
                  classNames={{
                    wrapper: '!max-w-full !max-h-[299px]',
                    img: 'aspect-[2/3]',
                  }}
                />
                <h3 className="m-2 line-clamp-1 text-foreground">{item?.title as string}</h3> */}
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

export default MainCarousel;
