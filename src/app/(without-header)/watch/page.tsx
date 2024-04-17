import dynamic from 'next/dynamic';
import { getWatchEpisode } from '~/services/tmdb/tmdb.server';
const GlobalPlayer = dynamic(() => import('~/components/player/GlobalPlayer'), { ssr: false });

const WatchPage = async ({ searchParams }: { searchParams: { [key: string]: string | string[] | undefined } }) => {
  const id = searchParams.id as string;
  const episodeId = searchParams.episodeId as string;
  const provider = searchParams.provider as string;
  const mediaType = id.split('/')[0];
  const url = mediaType === 'movie' ? `https://vidsrc.to/embed/movie/${episodeId}` : 'https://vidsrc.to/embed/tv/{id}';

  let streamLink;
  if (provider === 'Flixhq') streamLink = await getWatchEpisode(id, episodeId);

  return (
    <div className="h-screen max-h-screen w-full">
      {streamLink ? <GlobalPlayer item={streamLink} /> : <GlobalPlayer url={url} item={streamLink} />}
    </div>
  );
};

export default WatchPage;
