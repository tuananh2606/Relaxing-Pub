import { META, PROVIDERS_LIST } from '@consumet/extensions';

import type { IMedia } from '~/types/media';
import { fetcher } from '~/utils/fetcher';

import type {
  ICredit,
  IDetailImages,
  ILanguage,
  IList,
  IListGenre,
  IMediaList,
  IMovieDetail,
  IMovieTranslations,
  IPeopleCredits,
  IPeopleDetail,
  IPeopleExternalIds,
  IPeopleImages,
  ISeasonDetail,
  ITvShowDetail,
  IVideos,
  ListMovieType,
  ListPersonType,
  ListTvShowType,
  MediaType,
  TimeWindowType,
} from './tmdb.types';
import { postFetchDataHandler, TMDB } from './utils.server';
import useSWR from 'swr';
// reusable function
const getListFromTMDB = async (url: string, type?: 'movie' | 'tv' | 'people'): Promise<IMediaList> => {
  try {
    const fetched = await fetcher<{
      items?: IMedia[];
      page: number;
      total_pages: number;
      total_results: number;
    }>({
      url,
    });
    return {
      page: fetched.page,
      total_pages: fetched.total_pages,
      items: [...postFetchDataHandler(fetched, type)],
      total_results: fetched.total_results,
    } as IMediaList;
  } catch (error) {
    console.error(error);
    return { page: 0, total_pages: 0, items: [], total_results: 0 };
  }
};
/* ============================================Config Field=========================================== */

// export const getListLanguages = async (): Promise<ILanguage[] | undefined> => {
//   try {
//     const fetched = await fetcher<ILanguage[]>({
//       url: TMDB.languagesUrl(),
//       key: 'tmdb-languages',
//       ttl: 1000 * 60 * 60 * 24 * 30,
//       staleWhileRevalidate: 1000 * 60 * 60 * 24 * 365,
//       cache: lruCache,
//     });
//     return fetched;
//   } catch (error) {
//     console.error(error);
//   }
// };

/* =======================================End of Config Field========================================= */

/* ===========================================Trending Field========================================== */

// get a list of trending items
// export const getTrending = async (
//   mediaType: MediaType,
//   timeWindow: TimeWindowType,
//   language?: string,
//   page?: number,
// ): Promise<IMediaList> => {
//   const url = TMDB.trendingUrl(mediaType, timeWindow, language, page);
//   const res = await fetch<IMediaList>(url);
//   if (!res.ok) {
//     throw new Error('Failed to fetch data');
//   }

//   return res.json();
// };

export async function getTrending(
  mediaType: MediaType,
  timeWindow: TimeWindowType,
  language?: string,
  page?: number,
): Promise<IMediaList> {
  // Inside, we call the `fetch` function with
  // a URL and config given:
  const url = TMDB.trendingUrl(mediaType, timeWindow, language, page);
  return getListFromTMDB(url, mediaType === 'person' ? 'people' : undefined);

  // We also can use some post-response
  // data-transformations in the last `then` clause.
}

/* ======================================End of Trending Field======================================== */

/* ===========================================Movie Field============================================= */

/**
 * It fetches a list of movies from the TMDB API, and returns a list of movies
 * @param {ListMovieType} type - ListMovieType
 * @param {number} [page] - number
 * @returns An object with the following properties:
 * page: number
 * totalPages: number
 * items: IMovie[]
 */
export const getListMovies = (type: ListMovieType, language?: string, page?: number) => {
  const url = TMDB.listMoviesUrl(type, page, language);
  return getListFromTMDB(url);
};

/**
 * It fetches a movie detail from the TMDB API and returns the data if it exists, otherwise it returns
 * undefined
 * @param {number} id - number - The id of the movie you want to get the details for
 * @returns A Promise that resolves to an IMovieDetail or undefined.
 */
export const getMovieDetail = async (id: number, language?: string): Promise<IMovieDetail | undefined> => {
  try {
    const url = TMDB.movieDetailUrl(id, language);
    const res = await fetcher<IMovieDetail>({
      url,
    });
    return res;
  } catch (error) {
    console.error(error);
  }
};

/* =====================================End of Movie Field============================================ */

/* ========================================Tv Show Field============================================== */
export const getTvShowDetail = async (id: number, language?: string): Promise<ITvShowDetail | undefined> => {
  try {
    const fetched = await fetcher<ITvShowDetail>({
      url: TMDB.tvShowDetailUrl(id, language),
    });
    return fetched;
  } catch (error) {
    console.error(error);
  }
};
export const getTvSeasonDetail = async (
  tv_id: number,
  season_number: number,
  language?: string,
): Promise<ISeasonDetail | undefined> => {
  try {
    const fetched = await fetcher<ISeasonDetail>({
      url: TMDB.tvSeasonDetailUrl(tv_id, season_number, language),
    });
    return fetched;
  } catch (error) {
    console.error(error);
  }
};
/* ======================================End of Tv Show Field========================================= */

/* ==========================================People Field============================================= */
export const getPeopleDetail = async (person_id: number, language?: string): Promise<IPeopleDetail | undefined> => {
  try {
    const fetched = await fetcher<IPeopleDetail>({
      url: TMDB.personDetail(person_id, language),
    });
    if (!fetched) throw new Error('Dont have result');
    return fetched;
  } catch (error) {
    console.error(error);
  }
};
/* ======================================End of People Field========================================== */

/* ==========================================Search Field============================================= */

// export const getSearchMovies = async (
//   keyword: string,
//   page?: number,
//   language?: string,
//   include_adult?: boolean,
//   region?: string,
//   year?: number,
// ): Promise<IMediaList> => {
//   const url = TMDB.searchMovies(keyword, language, page, include_adult, region, year, undefined);
//   return getListFromTMDB(url, 'movie');
// };

/* =======================================End of Search Field========================================= */

/* =============================================UTILS================================================= */

// /**
//  * It fetches a video from the TMDB API and returns the response
//  * @param {'movie' | 'tv'} type - 'movie' | 'tv'
//  * @param {number} id - number - the id of the movie or tv show
//  * @returns The return type is a Promise of IVideos or undefined.
//  */
export const getVideos = async (type: 'movie' | 'tv', id: number): Promise<IVideos | undefined> => {
  try {
    const url = TMDB.videoUrl(type, id);
    const res = await fetcher<IVideos>({
      url,
    });
    return res;
  } catch (error) {
    console.error(error);
  }
};

// /**
//  * It fetches a credit object from the TMDB API, and returns it if it exists
//  * @param {'movie' | 'tv'} type - 'movie' | 'tv'
//  * @param {number} id - number,
//  * @returns Promise&lt;ICredit | undefined&gt;
//  */
export const getCredits = async (type: 'movie' | 'tv', id: number): Promise<ICredit | undefined> => {
  try {
    const res = await fetcher<ICredit>({
      url: TMDB.creditUrl(type, id),
    });
    return res;
  } catch (error) {
    console.error(error);
  }
};

export const getListGenre = async (type: 'movie' | 'tv', language?: string): Promise<{ [id: string]: string }> => {
  const url = TMDB.listGenre(type, language);
  try {
    const res = await fetcher<IListGenre>({
      url,
    });
    const result: { [key: string]: string } = {};

    for (let i = 0; i < res.genres.length; i += 1) {
      const genre = res.genres[i];
      result[genre.id] = genre.name;
    }
    return result;
  } catch (error) {
    console.error(error);
    return {};
  }
};

// export const getImages = async (
//   type: 'movie' | 'tv',
//   id: number,
//   language?: string,
// ): Promise<IDetailImages | undefined> => {
//   try {
//     const fetched = await fetcher<IDetailImages>({
//       url: TMDB.imagesUrl(type, id, language),
//       key: `tmdb-images-${type}-${id}-${language}`,
//       ttl: 1000 * 60 * 60 * 24 * 7,
//       staleWhileRevalidate: 1000 * 60 * 60 * 24 * 30,
//       cache: lruCache,
//     });
//     return fetched;
//   } catch (error) {
//     console.error(error);
//   }
// };
export const getInfoWithProvider = async (id: string, type: 'movie' | 'tv', provider?: string) => {
  let tmdb = new META.TMDB(TMDB.key);

  if (provider) {
    const possibleProvider = PROVIDERS_LIST.MOVIES.find((p) => p.name.toLowerCase() === provider.toLowerCase());
    if (!possibleProvider) {
      throw new Error(`Provider ${provider} not found`);
    }
    tmdb = new META.TMDB(TMDB.key, possibleProvider);
  }

  try {
    const res = await tmdb.fetchMediaInfo(id, type);
    return res;
  } catch (error) {
    console.error(error);
    return undefined;
  }
};

export const getWatchEpisode = async (id: string, episodeId: string) => {
  const tmdb = new META.TMDB(TMDB.key);
  try {
    const res = await tmdb.fetchEpisodeSources(episodeId, id);
    return res;
  } catch (error) {
    console.error(error);
    return undefined;
  }
};
