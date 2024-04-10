import MediaList from '~/components/media/MediaList';
import { getOnTheAir } from '~/services/tmdb/tmdb.server';

const OnTheAirPage = async ({ searchParams }: { searchParams: { [key: string]: string | string[] | undefined } }) => {
  const currentPage = Number(searchParams.page) || 1;
  const res = await getOnTheAir(currentPage);

  return (
    <section className="px-2 py-4">
      <MediaList items={res} title="On The Air" />
    </section>
  );
};

export default OnTheAirPage;
