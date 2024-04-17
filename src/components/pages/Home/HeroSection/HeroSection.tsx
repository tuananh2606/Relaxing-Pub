'use client';
import { useState, useEffect } from 'react';
import { IAnimeInfo, IMovieInfo } from '@consumet/extensions';
import Link from 'next/link';
import { Button, Card, CardBody, CardHeader, Chip, Image as NextUIImage } from '@nextui-org/react';
import Image from '~/components/elements/Image';
import { Swiper as SwiperReact, SwiperSlide } from 'swiper/react';
import { Navigation, Autoplay, Thumbs } from 'swiper/modules';
import type Swiper from 'swiper';
import { AnimatePresence, motion } from 'framer-motion';
import { useMeasure, useMediaQuery } from '@react-hookz/web';
import { useRouter } from 'next-nprogress-bar';

import { IVideos, ICredit, IMovieDetail, ITvShowDetail, IMediaList } from '~/services/tmdb/tmdb.types';
import { IMedia } from '~/types/media';
import AspectRatio from '~/components/shared/AspectRatio';
import 'swiper/css';
import 'swiper/css/thumbs';
import 'swiper/css/navigation';
import { Carousel, CarouselItem } from '~/components/elements/Carousel';

interface IHeroSection {
  data: IMediaList;
  items: {
    listGenresTv: { [id: string]: string };
    listGenresMovie: { [id: string]: string };
  };
}

const HeroSection = ({ items, data }: IHeroSection) => {
  const [thumbsSwiper, setThumbsSwiper] = useState<Swiper | null>(null);
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const router = useRouter();
  const { listGenresTv, listGenresMovie } = items;
  const { results } = data;

  const [size, bannerRef] = useMeasure<HTMLDivElement>();

  const isMd = useMediaQuery('(max-width: 960px)', { initializeWithValue: false });

  const variants = {
    inView: { opacity: 1, x: 0 },
    outView: { opacity: 0, x: 40 },
  };

  useEffect(() => {
    if (isMd) setThumbsSwiper(null);
  }, [isMd]);

  return (
    <>
      {isMd ? (
        <div className="relative h-auto">
          <AspectRatio ratio={16 / 9}>
            <Carousel<IMedia>
              classNames={{
                control: 'hidden md:flex',
                carouselWrapper: 'no-scrollbar',
              }}
              navigation={false}
              items={data?.results?.slice(0, 10)}
              renderItem={({ item, isSnapPoint, idx }) => (
                <CarouselItem key={idx} className="h-full w-full !snap-center px-2" isSnapPoint={isSnapPoint}>
                  <Card className="h-full w-full">
                    <CardHeader
                      onClick={() => router.push(`${item.mediaType}/${item.id}`)}
                      className="absolute bottom-0 z-20 flex flex-col"
                    >
                      <div className="flex h-full w-full">
                        <div className="flex w-full flex-col items-start justify-center gap-4 px-10">
                          <h1 className="!line-clamp-2 text-2xl font-bold drop-shadow-xl md:text-3xl">
                            {(item!.title as string) || (item!.name as string)}
                          </h1>
                          <div className="flex">
                            {item.mediaType === 'movie'
                              ? item.genreIds!.slice(0, 3).map((ele, idx) => (
                                  <Chip key={idx} size="sm" className="mr-1 cursor-pointer select-none font-bold">
                                    {listGenresMovie[ele]}
                                  </Chip>
                                ))
                              : item.genreIds!.slice(0, 3).map((ele, idx) => (
                                  <Chip key={idx} size="sm" className="mr-1 cursor-pointer select-none font-bold">
                                    {listGenresTv[ele]}
                                  </Chip>
                                ))}
                          </div>
                        </div>
                      </div>
                    </CardHeader>
                    <CardBody className="p-0">
                      <Image
                        alt="Anh"
                        src={item.backdropPath || ''}
                        width={0}
                        height={0}
                        fallbackSrc="placeholder-gray.jpg"
                        sizes="100vw"
                        priority
                        draggable="false"
                        className="h-auto w-full object-cover"
                        classNames={{
                          wrapper: '!max-w-none',
                        }}
                      />
                    </CardBody>
                  </Card>
                </CarouselItem>
              )}
            />
          </AspectRatio>
        </div>
      ) : null}

      {!isMd ? (
        <>
          <SwiperReact
            centeredSlides
            spaceBetween={10}
            thumbs={{ swiper: thumbsSwiper, multipleActiveThumbs: false }}
            modules={[Thumbs, Autoplay]}
            autoplay={{
              delay: 8000,
              disableOnInteraction: false,
            }}
            onActiveIndexChange={(swiper) => {
              setActiveIndex(swiper.realIndex);
            }}
          >
            {results &&
              results.length > 0 &&
              results?.map((item, idx) => (
                <SwiperSlide key={idx} className="relative">
                  {({ isActive }) => (
                    <AspectRatio ratio={16 / 8} ref={bannerRef}>
                      <Card className="h-full w-full rounded-none border-0">
                        <CardHeader className="absolute z-30 flex h-full flex-row items-center justify-start gap-5 md:gap-7 lg:gap-9 xl:justify-center">
                          <div className="relative h-full w-full">
                            <div className="absolute bottom-0 left-0 h-1/2 w-full md:h-full">
                              <div className="flex h-full w-full">
                                <div className="flex w-full flex-col items-start justify-center gap-4 px-10 md:w-3/4 lg:w-3/6">
                                  <motion.h1
                                    key="title"
                                    layout
                                    className="!line-clamp-2 text-2xl font-bold drop-shadow-xl md:text-3xl"
                                    animate={isActive ? 'inView' : 'outView'}
                                    transition={{ duration: 0.5 }}
                                    variants={variants}
                                  >
                                    {(item!.title as string) || (item!.name as string)}
                                  </motion.h1>
                                  <motion.div
                                    layout
                                    animate={isActive ? 'inView' : 'outView'}
                                    initial={{ opacity: 0, x: 40 }}
                                    transition={
                                      isActive ? { duration: 0.5, delay: 0.15 } : { duration: 0.5, delay: 0.15 }
                                    }
                                    variants={variants}
                                    className="flex"
                                  >
                                    {item.mediaType === 'movie'
                                      ? item.genreIds!.slice(0, 3).map((ele, idx) => (
                                          <Chip
                                            key={idx}
                                            size="sm"
                                            className="mr-2 cursor-pointer select-none font-bold"
                                          >
                                            {listGenresMovie[ele]}
                                          </Chip>
                                        ))
                                      : item.genreIds!.slice(0, 3).map((ele, idx) => (
                                          <Chip
                                            key={idx}
                                            size="sm"
                                            className="mr-2 cursor-pointer select-none font-bold"
                                          >
                                            {listGenresTv[ele]}
                                          </Chip>
                                        ))}
                                  </motion.div>
                                  <div className="hidden md:block">
                                    <motion.p
                                      key="overview"
                                      layout
                                      className="!line-clamp-6 text-justify"
                                      initial={{ opacity: 0, x: 40 }}
                                      animate={isActive ? 'inView' : 'outView'}
                                      exit={{ opacity: 0, x: 40 }}
                                      transition={
                                        isActive ? { duration: 0.5, delay: 0.3 } : { duration: 0.5, delay: 0.3 }
                                      }
                                      variants={variants}
                                    >
                                      {item?.overview}
                                    </motion.p>
                                  </div>
                                  <div className="hidden md:block">
                                    <motion.div
                                      layout
                                      key="details-btn"
                                      initial={{ opacity: 0, x: 40 }}
                                      animate={isActive ? 'inView' : 'outView'}
                                      exit={{ opacity: 0, x: 40 }}
                                      transition={
                                        isActive ? { duration: 0.5, delay: 0.45 } : { duration: 0.5, delay: 0.45 }
                                      }
                                      variants={variants}
                                      className="actions-btn mt-[1.5vw] flex items-center"
                                    >
                                      <Link href={`${item.mediaType}/${item.id}`}>
                                        <Button
                                          size="lg"
                                          radius="sm"
                                          className="flex min-w-fit items-center justify-center bg-secondary px-2 py-2 transition  md:px-7 "
                                        >
                                          <span>
                                            <svg
                                              xmlns="http://www.w3.org/2000/svg"
                                              className="h-6 w-6 md:h-8 md:w-8"
                                              viewBox="0 0 24 25"
                                              fill="none"
                                            >
                                              <path
                                                d="M12 22.3137C6.47715 22.3137 2 17.8365 2 12.3137C2 6.79087 6.47715 2.31372 12 2.31372C17.5228 2.31372 22 6.79087 22 12.3137C22 17.8365 17.5228 22.3137 12 22.3137ZM12 20.3137C16.4183 20.3137 20 16.732 20 12.3137C20 7.89544 16.4183 4.31372 12 4.31372C7.58172 4.31372 4 7.89544 4 12.3137C4 16.732 7.58172 20.3137 12 20.3137ZM11 7.31372H13V9.31372H11V7.31372ZM11 11.3137H13V17.3137H11V11.3137Z"
                                                fill="white"
                                              />
                                            </svg>
                                          </span>
                                          <span className="ml-1 text-sm text-white md:text-lg">Thông tin khác</span>
                                        </Button>
                                      </Link>
                                    </motion.div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </CardHeader>
                        <CardBody className="m-0 overflow-hidden p-0">
                          <div className="absolute bottom-0 left-0 z-20 h-[150px] w-full bg-gradient-to-b from-transparent to-background 2xl:h-[250px]"></div>
                          <AnimatePresence>
                            <motion.div
                              initial={{ opacity: 0, scale: 1.2, y: 40 }}
                              animate={isActive ? { opacity: 1, scale: 1, y: 0 } : { opacity: 0.3, scale: 1.2, y: 40 }}
                              exit={{ opacity: 0, scale: 1.2, y: 40 }}
                              transition={{ duration: 0.8, ease: 'easeIn' }}
                              style={{ overflow: 'hidden' }}
                            >
                              <Image
                                src={item.backdropPath!}
                                width={0}
                                height={0}
                                priority={idx === 0}
                                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                className="h-auto w-full rounded-none object-cover !opacity-90"
                                classNames={{
                                  wrapper: '!max-w-none !rounded-none',
                                }}
                                alt={`${item.name || item.title} Backdrop Image`}
                              />
                            </motion.div>
                          </AnimatePresence>
                        </CardBody>
                      </Card>
                    </AspectRatio>
                  )}
                </SwiperSlide>
              ))}
          </SwiperReact>
          <SwiperReact
            onSwiper={setThumbsSwiper}
            grabCursor
            spaceBetween={10}
            slidesPerView="auto"
            slidesPerGroup={1}
            slidesPerGroupAuto
            watchSlidesProgress
            modules={[Navigation, Thumbs]}
            className="absolute bottom-[60px] left-0 !hidden min-h-[150px] w-full xl:!block"
          >
            {results &&
              results.length > 0 &&
              results?.map((item, idx) => (
                <SwiperSlide
                  key={idx}
                  className={`!h-[135px] !w-[240px] overflow-hidden rounded-xl border-4 opacity-100 transition-opacity duration-300 ease-out ${
                    activeIndex === idx ? 'border-primary' : 'border-transparent hover:border-primary/70'
                  }`}
                >
                  <Image
                    src={item.backdropPath!}
                    width={0}
                    height={0}
                    priority={idx < 6}
                    sizes="100vw"
                    className="h-auto min-h-[135px] w-full min-w-[240px] object-cover"
                    alt={`${(item!.title as string) || (item!.name as string)} Backdrop Image`}
                  />
                </SwiperSlide>
              ))}
          </SwiperReact>
        </>
      ) : null}
    </>
  );
};
export default HeroSection;
