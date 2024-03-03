'use client';
import { useState } from 'react';
import Image from 'next/image';
import { Image as NextUIImage } from '@nextui-org/react';
import { Carousel, CarouselSlide } from '~/components/elements/Carousel';
import { IMedia } from '~/types/media';
import { PreviewModal } from '~/components/dialog';
import { Dialog, DialogContent, DialogTrigger } from '~/components/elements/Dialog';

type Props = {
  items: IMedia[] | undefined;
};

export type IMediaState = Pick<IMedia, 'id' | 'mediaType'>;

const TrendingCarousel = (props: Props) => {
  const { items } = props;
  const [media, setMedia] = useState<IMediaState>();
  const [isOpenModal, setIsOpenModal] = useState<boolean>(false);
  const handleOpenModal = () => {
    setIsOpenModal((prev) => !prev);
  };

  return (
    <Dialog open={isOpenModal} onOpenChange={handleOpenModal}>
      <div className="m-3">
        <Carousel className="mt-4" options={{ align: 'start', loop: false, dragFree: true }}>
          {items?.map((slide, idx) => (
            <CarouselSlide key={idx}>
              <div className="h-full ">
                <DialogTrigger asChild>
                  <div
                    onClick={() =>
                      setMedia({
                        id: slide.id,
                        mediaType: slide.mediaType,
                      })
                    }
                  >
                    <NextUIImage
                      key={slide.id}
                      as={Image}
                      alt="Anh"
                      src={slide.posterPath || ''}
                      width={0}
                      height={0}
                      sizes="100vw"
                      fallbackSrc="https://via.placeholder.com/300x200"
                      className="h-auto w-full rounded-lg"
                      classNames={{
                        img: 'aspect-[2/3]',
                      }}
                    />
                  </div>
                </DialogTrigger>
                <h3 className="m-2 line-clamp-1 text-white">{slide?.title as string}</h3>
              </div>
            </CarouselSlide>
          ))}
        </Carousel>
      </div>
      <DialogContent className="w-11/12 overflow-x-hidden rounded-lg !p-0 md:w-4/5">
        <PreviewModal media={media} />
      </DialogContent>
    </Dialog>
  );
};

export default TrendingCarousel;
