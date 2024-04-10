import MediaList from '~/components/media/MediaList';
import { getPopular } from '~/services/tmdb/tmdb.server';

const PopularPage = async ({
  params,
  searchParams,
}: {
  params: { type: 'movie' | 'tv' };
  searchParams: { [key: string]: string | string[] | undefined };
}) => {
  const currentPage = Number(searchParams.page) || 1;
  const res = await getPopular(params.type, currentPage);

  return (
    <section className="px-2 py-4">
      <MediaList items={res} title="Popular" />
    </section>
  );
};

export default PopularPage;
