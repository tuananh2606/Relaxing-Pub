import { IMediaList } from '~/services/tmdb/tmdb.types';
import { getSearchMovies, getSearchTv } from '~/services/tmdb/tmdb.server';
import MediaList from '~/components/media/MediaList';

const Search = async ({
  params,
  searchParams,
}: {
  params: { type: 'movie' | 'tv' };
  searchParams: { [key: string]: string | string[] | undefined };
}) => {
  const query = searchParams.q as string;
  const page = Number(searchParams.page);

  let res: IMediaList;
  switch (params.type) {
    case 'movie':
      res = await getSearchMovies(query, page);
      break;
    case 'tv':
      res = await getSearchTv(query, page);
      break;
  }

  return <MediaList items={res} />;
};
export default Search;
