import { fetcher } from '~/lib/utils';

import type { IBilibiliEpisode, IBilibiliInfo, IBilibiliSearch } from './bilibili.types';
import Bilibili from './utils.server';

export const getBilibiliSearch = async (query: string): Promise<IBilibiliSearch | undefined> => {
  try {
    const fetched = await fetcher<IBilibiliSearch>({
      url: Bilibili.animeSearchUrl(query),
    });
    return fetched;
  } catch (error) {
    console.log(error);
  }
};

export const getBilibiliInfo = async (id: number): Promise<IBilibiliInfo | undefined> => {
  try {
    const fetched = await fetcher<IBilibiliInfo>({
      url: Bilibili.animeInfoUrl(id),
    });
    return fetched;
  } catch (error) {
    console.log(error);
  }
};

export const getBilibiliEpisode = async (episodeId: number): Promise<IBilibiliEpisode | undefined> => {
  try {
    const fetched = await fetcher<IBilibiliEpisode>({
      url: Bilibili.animeEpisodeUrl(episodeId),
    });
    return fetched;
  } catch (error) {
    console.log(error);
  }
};
