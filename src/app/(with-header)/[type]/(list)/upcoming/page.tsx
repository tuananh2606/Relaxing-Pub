import MediaList from '~/components/media/MediaList';
import { getUpcoming } from '~/services/tmdb/tmdb.server';

const UpcomingPage = async ({ searchParams }: { searchParams: { [key: string]: string | string[] | undefined } }) => {
  const currentPage = Number(searchParams.page) || 1;
  const res = await getUpcoming('movie', currentPage);

  return (
    <div className="px-2 py-4">
      <MediaList items={res} title="Upcoming" />
    </div>
  );
};

export default UpcomingPage;
