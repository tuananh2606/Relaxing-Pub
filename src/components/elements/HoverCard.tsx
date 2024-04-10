import React from 'react';
import { Card, CardBody, CardFooter } from '@nextui-org/react';
import Image from 'next/image';
import { Image as NextUIImage } from '@nextui-org/react';

import { HoverCard as HoverCardRadix, HoverCardTrigger, HoverCardContent } from '../ui/hover-card';
import { IMedia } from '~/types/media';

interface IHoverCard {
  item: IMedia;
}

const HoverCard = ({ item }: IHoverCard) => {
  return (
    <HoverCardRadix>
      <HoverCardTrigger>
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
          <CardFooter>
            <h3 className="m-2 line-clamp-1 text-foreground">{item?.title as string}</h3>
          </CardFooter>
        </Card>
      </HoverCardTrigger>
      <HoverCardContent side="left" className="w-80 p-0">
        <div className="flex flex-col justify-between">
          <NextUIImage
            as={Image}
            alt="Anh"
            src={item.backdropPath}
            width={0}
            height={0}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            fallbackSrc="/placeholder-gray.jpg"
            className="h-auto w-full rounded-lg object-cover"
            classNames={{
              wrapper: '!max-w-none',
            }}
          />
        </div>
      </HoverCardContent>
    </HoverCardRadix>
  );
};
export default HoverCard;
