import { IMovieInfo, IMovieResult, ISearch, ISource, MOVIES, StreamingServers } from '@consumet/extensions';

let goku = new MOVIES.Goku();

export const getGokuSearch = async (query: string, page?: number): Promise<ISearch<IMovieResult> | undefined> => {
  try {
    const res = await goku.search(query, page);
    return res;
  } catch (error) {
    console.log(error);
  }
};

export const getGokuInfo = async (mediaId: string): Promise<IMovieInfo | undefined> => {
  try {
    const res = await goku.fetchMediaInfo(mediaId);
    return res;
  } catch (error) {
    console.log(error);
  }
};

export const getGokuEpisodeSource = async (
  episodeId: string,
  mediaId: string,
  server?: StreamingServers,
): Promise<ISource | undefined> => {
  try {
    const res = await goku.fetchEpisodeSources(episodeId, mediaId, server);
    return res;
  } catch (error) {
    console.log(error);
  }
};

export const getGokuRecentMovies = async (): Promise<IMovieResult[] | undefined> => {
  try {
    const res = await goku.fetchRecentMovies();
    return res;
  } catch (error) {
    console.log(error);
  }
};

export const getGokuRecentTvShows = async (): Promise<IMovieResult[] | undefined> => {
  try {
    const res = await goku.fetchRecentTvShows();
    return res;
  } catch (error) {
    console.log(error);
  }
};

export const getGokuTrendingMovies = async (): Promise<IMovieResult[] | undefined> => {
  try {
    const res = await goku.fetchTrendingMovies();
    return res;
  } catch (error) {
    console.log(error);
  }
};

export const getGokuTrendingTvShows = async (): Promise<IMovieResult[] | undefined> => {
  try {
    const res = await goku.fetchTrendingTvShows();
    return res;
  } catch (error) {
    console.log(error);
  }
};
