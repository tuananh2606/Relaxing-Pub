import {
  getTrending,
  getVideos,
  getInfoWithProvider,
  getCredits,
  getMovieDetail,
  getTvShowDetail,
} from '~/services/tmdb/tmdb.server';
import dynamic from 'next/dynamic';
const HeroVideo = dynamic(() => import('~/components/hero-section/HeroVideo'), { ssr: false });
import { Suspense } from 'react';
import { IMedia } from '~/types/media';
import { Carousel, CarouselSlide, CarouselParallax } from '~/components/elements/Carousel';
import Image from 'next/image';

export default async function Home() {
  const { items } = await getTrending('all', 'day');

  let media: IMedia | undefined;

  media = items ? items[Math.floor(Math.random() * items.length)] : undefined;
  const videoData = getVideos(media!.mediaType as any, media!.id as number);
  const mediaInfoData = getInfoWithProvider(media!.id as string, media!.mediaType as any);
  const creditsData = getCredits(media!.mediaType as any, media?.id as number);
  const detailsData =
    media?.mediaType === 'movie' ? getMovieDetail(media?.id as number) : getTvShowDetail(media?.id as number);

  const [videos, mediaInfo, credits, details] = await Promise.all([videoData, mediaInfoData, creditsData, detailsData]);

  const data = {
    videos: videos,
    media: media,
    mediaInfo: mediaInfo,
    credits: credits,
    details: details,
  };

  console.log(items);

  return (
    <main className="min-h-screen">
      <HeroVideo items={data} />
      <Carousel options={{ loop: true, dragFree: true }}>
        {items?.map((slide, idx) => (
          <CarouselSlide key={idx} className=" !flex-[0_0_220px]">
            <Image
              alt="Anh"
              src={slide.posterPath || ''}
              width={0}
              height={0}
              sizes="100vw"
              className="h-full w-full rounded-lg"
            />
            <h3 className="overflow-auto text-white">{slide.originalTitle}</h3>
          </CarouselSlide>
        ))}
      </Carousel>
    </main>
  );
}
