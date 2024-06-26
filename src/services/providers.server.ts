import { type IMovieInfo } from '@consumet/extensions';

import { getAnimeEpisodeInfo } from '~/services/consumet/anilist/anilist.server';
import { getBilibiliInfo, getBilibiliSearch } from '~/services/consumet/bilibili/bilibili.server';
import type { IBilibiliResult } from '~/services/consumet/bilibili/bilibili.types';
import { getKissKhInfo, getKissKhSearch } from '~/services/kisskh/kisskh.server';
import type { ISearchItem } from '~/services/kisskh/kisskh.types';
import { getInfoWithProvider } from '~/services/tmdb/tmdb.server';
import { getMoviesHdInfo, getMoviesHdSearch } from './consumet/moviehdwatch/moviehdwatch.server';

export type Provider = {
  id?: string | number | null;
  provider: string;
  episodesCount?: number;
};

const getProviderList = async ({
  type,
  title,
  orgTitle,
  year,
  season,
  animeId,
  animeType,
  isEnded,
  tmdbId,
}: {
  /**
   * @param {string} type - movie, tv, anime
   */
  type: string;
  /**
   * @param {string} title - title of movie, tv, anime
   */
  title: string;
  /**
   * @param {string} orgTitle - original title of movie, tv, anime
   */
  orgTitle?: string | null;
  /**
   * @param {number} year - year of movie, tv, anime
   */
  year?: number | string | null;
  /**
   * @param {number} season - season of tv
   */
  season?: number | string | null;
  /**
   * @param {number} animeId - id of anime
   */
  animeId?: number;
  /**
   * @param {string} animeType - type of anime
   * @example 'tv', 'movie'
   */
  animeType?: string | null;
  /**
   * @param {boolean} isEnded - is movie, tv, anime ended or canceled
   */
  isEnded?: boolean;
  /**
   * @param {number} tmdbId - tmdb id of movie, tv
   * @description if tmdbId is provided, it will be used to get provider list
   * @example 123456
   * @default undefined
   */
  tmdbId?: number;
}): Promise<Provider[] | undefined> => {
  const getProviders = async () => {
    if (type === 'movie') {
      const [infoWithProvider] = await Promise.all([
        tmdbId ? getInfoWithProvider(tmdbId.toString(), 'movie') : undefined,
      ]);

      const provider: Provider[] = (infoWithProvider as IMovieInfo)?.episodeId
        ? [
            {
              id: (infoWithProvider as IMovieInfo).id,
              provider: 'Flixhq',
            },
          ]
        : [];

      return provider;
    }
    if (type === 'tv') {
      const [infoWithProvider] = await Promise.all([tmdbId ? getInfoWithProvider(tmdbId.toString(), 'tv') : undefined]);
      const findTvSeason = (infoWithProvider as IMovieInfo)?.seasons?.find((s) => s.season === Number(season));
      const provider: Provider[] = findTvSeason?.episodes.some((e) => e.id)
        ? [
            {
              id: (infoWithProvider as IMovieInfo).id,
              provider: 'Flixhq',
              episodesCount: findTvSeason?.episodes.filter((e) => e.id).length,
            },
          ]
        : [];

      return provider;
    }
    if (type === 'anime') {
      const [bilibiliSearch, gogoEpisodes, zoroEpisodes] = await Promise.all([
        true ? getBilibiliSearch(title) : undefined,
        getAnimeEpisodeInfo(animeId?.toString() || '', undefined, 'gogoanime'),
        getAnimeEpisodeInfo(animeId?.toString() || '', undefined, 'zoro'),
      ]);
      const provider: Provider[] = [];
      if (gogoEpisodes && gogoEpisodes.length > 0) {
        provider.push({
          id: animeId,
          provider: 'Gogo',
          episodesCount: gogoEpisodes.length,
        });
      }
      if (zoroEpisodes && zoroEpisodes.length > 0) {
        provider.push({
          id: animeId,
          provider: 'Zoro',
          episodesCount: zoroEpisodes.length,
        });
      }

      const findBilibili: IBilibiliResult | undefined = bilibiliSearch?.results.find((anime) => {
        if (anime.title.includes('×')) {
          return anime.title.replace(/×/g, 'x').toLowerCase() === title.replace(/\s/g, '').toLowerCase();
        }
        return anime.title.toLowerCase() === title.toLowerCase();
      });
      const [bilibiliDetail] = await Promise.all([
        findBilibili && findBilibili.id ? getBilibiliInfo(findBilibili.id) : undefined,
      ]);
      if (findBilibili && findBilibili.id) {
        provider.push({
          id: findBilibili.id.toString(),
          provider: 'Bilibili',
          episodesCount: bilibiliDetail?.totalEpisodes || 0,
        });
      }
      return provider;
    }
  };
  const results = await getProviders();
  // if (typeof value === 'undefined') return false;
  // return true;
  console.log(results);
  return results;
};

export default getProviderList;
