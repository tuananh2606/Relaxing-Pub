'use client';
import React, { useState } from 'react';
import Image from 'next/image';
import { Card, CardBody, CardFooter, Image as NextUIImage } from '@nextui-org/react';

import { IMedia } from '~/types/media';
import { Carousel, CarouselItem } from '~/components/elements/Carousel';
import { IPeople } from '~/services/tmdb/tmdb.types';
import { TMDB } from '~/services/tmdb/utils.server';

interface ICast {
  items: IPeople[] | undefined;
  title: string;
}

interface IRecommendations {
  items: IMedia[] | undefined;
  title: string;
}

export type IMediaState = Pick<IMedia, 'id' | 'mediaType'>;

const MediaCarousel = ({ items, title }: ICast | IRecommendations) => {
  const data = items?.slice(0, 12);
  return (
    <div className="m-3">
      <Carousel<IPeople | IMedia>
        title={title}
        items={data}
        classNames={{
          control: 'hidden md:flex',
          carouselWrapper: 'no-scrollbar',
        }}
        renderItem={({ item, isSnapPoint }) => (
          <CarouselItem
            key={item.id}
            className="basis-2/5 px-2 md:basis-1/4 lg:basis-[182px]"
            isSnapPoint={isSnapPoint}
          >
            <Card>
              <CardBody className="overflow-visible !p-0">
                <NextUIImage
                  as={Image}
                  alt="Anh"
                  src={(item as IMedia).posterPath || TMDB?.profileUrl((item as IPeople).profile_path, 'w185')}
                  width={0}
                  height={0}
                  draggable="false"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  fallbackSrc="https://via.placeholder.com/300x200"
                  className="h-full w-full rounded-lg object-cover"
                  classNames={{
                    wrapper: '!max-w-full !max-h-[299px]',
                    img: 'aspect-[2/3]',
                  }}
                />
              </CardBody>
              <CardFooter className="min-h-[5.875rem] flex-col items-start px-2">
                {(item as IPeople).character ? (
                  <>
                    <p className="line-clamp-2 font-bold">{(item as IPeople).name}</p>
                    <p className="line-clamp-2 text-sm text-foreground/60">{(item as IPeople).character}</p>
                  </>
                ) : (
                  <h3 className="line-clamp-2 text-white">{(item as IMedia).title as string}</h3>
                )}
              </CardFooter>
            </Card>
          </CarouselItem>
        )}
      />
    </div>
  );
};

export default MediaCarousel;
