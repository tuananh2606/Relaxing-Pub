import {
  getTrending,
  getVideos,
  getInfoWithProvider,
  getCredits,
  getMovieDetail,
  getTvShowDetail,
  getLatest,
  getListGenre,
} from '~/services/tmdb/tmdb.server';
import HeroSection from '~/components/pages/Home/HeroSection/HeroSection';
import { IMedia } from '~/types/media';
import MainCarousel from '~/components/pages/Home/Main/MainCarousel';

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
  const listGenresMoviesData = getListGenre('movie');
  const listGenresTvData = getListGenre('tv');

  const [videos, mediaInfo, credits, details, latestMovies, latestTvShows, listGenresMovies, listGenresTv] =
    await Promise.all([
      videoData,
      mediaInfoData,
      creditsData,
      detailsData,
      latestMoviesData,
      latestTvShowsData,
      listGenresMoviesData,
      listGenresTvData,
    ]);

  const data = {
    videos: videos,
    media: media,
    mediaInfo: mediaInfo,
    credits: credits,
    details: details,
    listGenresTv: listGenresTv,
    listGenresMovie: listGenresMovies,
  };

  return (
    <main className="my-16 lg:mt-0">
      {/* <HeroVideo items={data} /> */}
      <HeroSection items={data} data={trending} />
      <div className="mt-4 space-y-8">
        <MainCarousel key="trending" title="Trending" items={trending} to="/trending" />
        <MainCarousel key="latestMovies" title="Latest Movies" items={latestMovies} to="/lastest-movie" />
        <MainCarousel key="latestTvShows" title="Latest TvShows" items={latestTvShows} to="/" />
      </div>
    </main>
  );
}
