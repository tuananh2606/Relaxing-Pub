'use client';
import { useEffect, useState } from 'react';
import { Carousel, CarouselSlide } from '~/components/elements/Carousel';
import { IMedia } from '~/types/media';
import ImageWithFallback from '~/components/shared/ImageWithFallback';
import { PreviewModal } from '~/components/dialog';
import { fetcher } from '~/utils/fetcher';
import { getCredits, getMovieDetail, getTvShowDetail } from '~/services/tmdb/tmdb.server';
import { ICredit, IMovieDetail, ITvShowDetail } from '~/services/tmdb/tmdb.types';

type Props = {
  items: IMedia[] | undefined;
};

type IMediaState = Pick<IMedia, 'id' | 'mediaType'>;

const TrendingCarousel = (props: Props) => {
  const { items } = props;
  const [media, setMedia] = useState<IMediaState>();
  const [credits, setCredits] = useState<ICredit>();
  const [details, setDetails] = useState<IMovieDetail | ITvShowDetail>();
  const [isOpenModal, setIsOpenModal] = useState<boolean>(false);
  const handleOpenModal = (id: number | string | undefined, mediaType: 'movie' | 'tv' | 'anime' | 'people') => {
    setMedia({
      id: id,
      mediaType: mediaType,
    });

    setIsOpenModal((prev) => !prev);
  };

  useEffect(() => {
    const getData = () => {
      if (media) {
        const creditsData = getCredits(media?.mediaType as any, media?.id as number);
        const detailsData =
          media?.mediaType === 'movie' ? getMovieDetail(media?.id as number) : getTvShowDetail(media?.id as number);

        Promise.all([creditsData, detailsData])
          .then(([credits, details]) => {
            setCredits(credits);
            setDetails(details);
          })
          .catch((error) => {
            console.log(error);
          });
      }
    };

    getData();
  }, [media]);

  return (
    <div className="m-3">
      <Carousel className="mt-4" options={{ align: 'start', loop: false, dragFree: true }}>
        {items?.map((slide, idx) => (
          <CarouselSlide key={idx} className=" !flex-[0_0_220px]">
            <div onClick={() => handleOpenModal(slide.id, slide.mediaType)}>
              <ImageWithFallback
                alt="Anh"
                src={slide.posterPath || ''}
                width={0}
                height={0}
                sizes="100vw"
                className="h-full w-full rounded-lg"
              />
            </div>
            <h3 className="m-2 line-clamp-1 text-white">{slide?.title as string}</h3>
          </CarouselSlide>
        ))}
      </Carousel>
      {isOpenModal && <PreviewModal items={{ credits: credits, details: details }} setIsOpenModal={setIsOpenModal} />}
    </div>
  );
};

export default TrendingCarousel;
