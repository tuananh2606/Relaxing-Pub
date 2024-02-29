import dynamic from 'next/dynamic';
import { getWatchEpisode } from '~/services/tmdb/tmdb.server';
const GlobalPlayer = dynamic(() => import('~/components/player/GlobalPlayer'), { ssr: false });

const WatchPage = async ({ searchParams }: { searchParams: { [key: string]: string | string[] | undefined } }) => {
  const id = searchParams.id as string;
  const episodeId = searchParams.episodeId as string;
  const provider = searchParams.provider as string;
  let streamLink;
  if (provider === 'Flixhq') streamLink = await getWatchEpisode(id, episodeId);
  console.log(streamLink);
  return (
    <div className="h-screen max-h-screen w-full">
      <GlobalPlayer item={streamLink} />
    </div>
  );
};

export default WatchPage;
