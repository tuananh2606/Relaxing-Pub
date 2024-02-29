import {
  getTrending,
  getVideos,
  getInfoWithProvider,
  getCredits,
  getMovieDetail,
  getTvShowDetail,
} from '~/services/tmdb/tmdb.server';
import dynamic from 'next/dynamic';
import HeroSection from '~/components/Home/HeroSection/HeroSection';
import { IMedia } from '~/types/media';
import TrendingCarousel from '~/components/Home/Main/TrendingCarousel';

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

  return (
    <main className="my-16 lg:mt-0">
      {/* <HeroVideo items={data} /> */}
      <HeroSection items={data} />
      <div className="">
        <TrendingCarousel items={items} />
      </div>
    </main>
  );
}
