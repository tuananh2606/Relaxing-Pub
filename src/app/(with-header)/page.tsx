import { getTrending, getLatest, getListGenre } from '~/services/tmdb/tmdb.server';
import HeroSection from '~/components/pages/Home/HeroSection/HeroSection';
import MainCarousel from '~/components/pages/Home/Main/MainCarousel';

export default async function Home() {
  const trendingData = getTrending('all', 'day');
  const latestMoviesData = getLatest('movie');
  const latestTvShowsData = getLatest('tv');
  const listGenresMoviesData = getListGenre('movie');
  const listGenresTvData = getListGenre('tv');

  const [trending, latestMovies, latestTvShows, listGenresMovies, listGenresTv] = await Promise.all([
    trendingData,
    latestMoviesData,
    latestTvShowsData,
    listGenresMoviesData,
    listGenresTvData,
  ]);

  const data = {
    listGenresTv: listGenresTv,
    listGenresMovie: listGenresMovies,
  };

  return (
    <main className="my-16 lg:mt-0">
      <HeroSection items={data} data={trending} />
      <div className="mt-4 space-y-8">
        <MainCarousel key="trending" title="Trending" items={trending} to="/trending" />
        <MainCarousel key="latestMovies" title="Latest Movies" items={latestMovies} to="/lastest-movie" />
        <MainCarousel key="latestTvShows" title="Latest TvShows" items={latestTvShows} to="/" />
      </div>
    </main>
  );
}
