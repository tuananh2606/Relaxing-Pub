import MediaList from '~/components/media/MediaList';
import { getTopRated } from '~/services/tmdb/tmdb.server';

const TopRatedPage = async ({
  params,
  searchParams,
}: {
  params: { type: 'movie' | 'tv' };
  searchParams: { [key: string]: string | string[] | undefined };
}) => {
  const currentPage = Number(searchParams.page) || 1;
  const res = await getTopRated(params.type, currentPage);

  return (
    <section className="px-2 py-4">
      <MediaList items={res} title="Top Rated" />;
    </section>
  );
};

export default TopRatedPage;
