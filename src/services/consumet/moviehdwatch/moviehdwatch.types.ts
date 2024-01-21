import { IMovieResult, ISubtitle, IVideo } from '@consumet/extensions';
import { IMedia } from '~/types/media';

export interface IMovieSearch {
  currentPage?: number;
  hasNextPage?: boolean;
  results: IMovieResult[] | IMedia[];
  totalPages?: number;
  totalResults?: number;
}

export interface IEpisodeSource {
  subtitles?: ISubtitle[];
  sources: IVideo[];
  download?: string;
  embedURL?: string;
}
