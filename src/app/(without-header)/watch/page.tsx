import { ISource } from '@consumet/extensions';
import dynamic from 'next/dynamic';
import { getWatchEpisode } from '~/services/tmdb/tmdb.server';
const Player = dynamic(() => import('~/components/player/Player'), { ssr: false });
const GlobalPlayer = dynamic(() => import('~/components/player/GlobalPlayer'), { ssr: false });

const WatchPage = async ({ searchParams }: { searchParams: { [key: string]: string | string[] | undefined } }) => {
  const id = searchParams.id as string;
  const episodeId = searchParams.episodeId as string;
  const streamLink = (await getWatchEpisode(id, episodeId)) as ISource;

  return (
    <div className="h-screen max-h-screen w-full">
      <GlobalPlayer item={streamLink} />
      {/* <Player /> */}
    </div>
  );
};

export default WatchPage;
