import { fetcher } from '~/utils/fetcher';

import type { IEpisodeVideo, IItemInfo, ISearchItem, IVideoSubtitle } from './kisskh.types';
import KissKh from './utils.server';

export const getKissKhSearch = async (query: string, type?: number): Promise<ISearchItem[] | undefined> => {
  try {
    const fetched = await fetcher<ISearchItem[]>({
      url: KissKh.searchUrl(query, type),
    });
    return fetched;
  } catch (error) {
    console.log(error);
  }
};

export const getKissKhInfo = async (id: string): Promise<IItemInfo | undefined> => {
  try {
    const fetched = await fetcher<IItemInfo>({
      url: KissKh.infoUrl(id),
    });
    return fetched;
  } catch (error) {
    console.log(error);
  }
};

export const getKissKhEpisodeStream = async (id: string): Promise<IEpisodeVideo | undefined> => {
  try {
    const fetched = await fetcher<IEpisodeVideo>({
      url: KissKh.episodeUrl(id),
    });
    return fetched;
  } catch (error) {
    console.log(error);
  }
};

export const getKissKhEpisodeSubtitle = async (episodeId: string): Promise<IVideoSubtitle[] | undefined> => {
  try {
    const fetched = await fetcher<IVideoSubtitle[]>({
      url: KissKh.subUrl(episodeId),
    });
    return fetched;
  } catch (error) {
    console.log(error);
  }
};
