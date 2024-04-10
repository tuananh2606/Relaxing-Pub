import MediaList from '~/components/media/MediaList';
import { getAiringToday } from '~/services/tmdb/tmdb.server';

const AiringTodayPage = async ({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) => {
  const currentPage = Number(searchParams.page) || 1;
  const res = await getAiringToday(currentPage);

  return (
    <section className="px-2 py-4">
      <MediaList items={res} title="Airing Today" />
    </section>
  );
};

export default AiringTodayPage;
