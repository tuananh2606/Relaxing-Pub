import { env } from 'process';

export default class KissKh {
  static readonly API_BASE_URL = env.NEXT_KISSKH_URL;

  /**
   * It fetches a list of movies from the TMDB API, and returns a list of movies
   * @param query The query to search for
   * @param type The type of media to search for (0: All, 1: TV Series, 2: Movie, 3: Anime, 4: Hollywood)
   * @returns string
   * query: string
   * type: number | undefined
   */
  static searchUrl = (query: string, type?: number): string =>
    `${KissKh.API_BASE_URL}/DramaList/Search?q=${query}&type=${type || 0}`;

  static infoUrl = (id: string): string => `${KissKh.API_BASE_URL}/DramaList/Drama/${id}?isq=false`;

  static episodeUrl = (episodeId: string): string =>
    `${KissKh.API_BASE_URL}/DramaList/Episode/${episodeId}.png?err=false&ts=&time=`;

  static subUrl = (episodeId: string): string => `${KissKh.API_BASE_URL}/Sub/${episodeId}`;
}
