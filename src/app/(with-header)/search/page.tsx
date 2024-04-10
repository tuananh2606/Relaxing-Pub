import { IMediaList } from '~/services/tmdb/tmdb.types';
import { getSearchAll, getSearchMovies, getSearchTv } from '~/services/tmdb/tmdb.server';
import MediaList from '~/components/media/MediaList';

const Search = async ({ searchParams }: { searchParams: { [key: string]: string | string[] | undefined } }) => {
  const query = searchParams.q as string;
  const page = Number(searchParams.page);
  const res: IMediaList = await getSearchAll(query, page);

  return <MediaList items={res} />;
};
export default Search;
