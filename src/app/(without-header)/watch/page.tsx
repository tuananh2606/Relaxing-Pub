import dynamic from 'next/dynamic';
import { getInfoWithProvider, getWatchEpisode } from '~/services/tmdb/tmdb.server';
const Player = dynamic(() => import('~/components/player/Player'), { ssr: false });
const GlobalPlayer = dynamic(() => import('~/components/player/GlobalPlayer'), { ssr: false });

const WatchPage = async ({ searchParams }: { searchParams: { [key: string]: string | string[] | undefined } }) => {
  const id = searchParams.id as string;
  const episodeId = searchParams.episodeId as string;
  const source = await getWatchEpisode(id, episodeId);

  return (
    <div className="h-screen max-h-screen w-full">
      <GlobalPlayer item={source} />
      {/* <Player /> */}
    </div>
  );
};

export default WatchPage;
