import { IMovieInfo, IMovieResult, MOVIES } from '@consumet/extensions';
import type { IEpisodeSource, IMovieSearch } from './moviehdwatch.types';

export const getMoviesHdSearch = async (query: string): Promise<IMovieSearch | undefined> => {
  const moviesHd = new MOVIES.MovieHdWatch();
  try {
    const res = await moviesHd.search(query);
    return res;
  } catch (error) {
    console.log(error);
  }
};

export const getMoviesHdInfo = async (id: string): Promise<IMovieInfo | undefined> => {
  const moviesHd = new MOVIES.MovieHdWatch();
  try {
    const res = await moviesHd.fetchMediaInfo(id);
    return res;
  } catch (error) {
    console.log(error);
  }
};

export const getEpisodeSource = async (mediaId: string, episodeId: string): Promise<IEpisodeSource | undefined> => {
  const moviesHd = new MOVIES.MovieHdWatch();
  try {
    const res = await moviesHd.fetchEpisodeSources(episodeId, mediaId);
    return res;
  } catch (error) {
    console.log(error);
  }
};
export const getTrendingMovies = async (): Promise<IMovieResult[] | undefined> => {
  const moviesHd = new MOVIES.MovieHdWatch();
  try {
    const res = await moviesHd.fetchTrendingMovies();
    return res;
  } catch (error) {
    console.log(error);
  }
};
