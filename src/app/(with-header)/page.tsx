import {
  getTrending,
  getVideos,
  getInfoWithProvider,
  getCredits,
  getMovieDetail,
  getTvShowDetail,
  getLatest,
} from '~/services/tmdb/tmdb.server';
import HeroSection from '~/components/Home/HeroSection/HeroSection';
import { IMedia } from '~/types/media';
import MainCarousel from '~/components/Home/Main/MainCarousel';
import LatestMedia from '~/components/Home/Main/LatestMedia';

export default async function Home() {
  const trending = await getTrending('all', 'day');

  let media: IMedia | undefined;

  media = trending.results ? trending.results[Math.floor(Math.random() * trending.results.length)] : undefined;
  const videoData = getVideos(media!.mediaType as any, media!.id as number);
  const mediaInfoData = getInfoWithProvider(media!.id as string, media!.mediaType as any);
  const creditsData = getCredits(media!.mediaType as any, media?.id as number);
  const detailsData =
    media?.mediaType === 'movie' ? getMovieDetail(media?.id as number) : getTvShowDetail(media?.id as number);
  const latestMoviesData = getLatest('movie');
  const latestTvShowsData = getLatest('tv');

  const [videos, mediaInfo, credits, details, latestMovies, latestTvShows] = await Promise.all([
    videoData,
    mediaInfoData,
    creditsData,
    detailsData,
    latestMoviesData,
    latestTvShowsData,
  ]);

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
      <div className="space-y-8">
        <MainCarousel key="trending" title="Trending" items={trending} />
        <MainCarousel key="latestMovies" title="Latest Movies" items={latestMovies} />
        <MainCarousel key="latestTvShows" title="Latest TvShows" items={latestTvShows} />
        {/* <LatestMedia title="Latest Movies" items={latestMovies} />
        <LatestMedia title="Latest TvShows" items={latestTvShows} /> */}
      </div>
    </main>
  );
}
