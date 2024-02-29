import { useState } from 'react';
import ReactPlayer from 'react-player/lazy';

import VideoSkeleton from '../ui/Skeleton/VideoSkeleton';
import AspectRatio from '../shared/AspectRatio';
import ImageWithFallback from '../shared/ImageWithFallback';

interface IHeroPlayer {
  url: string;
  isMuted: boolean;
  playing: boolean;
  backdropPath: string;
}

const HeroPlayer = ({ isMuted, url, playing, backdropPath }: IHeroPlayer) => {
  const [isEnded, setEndedVideo] = useState<boolean>(false);
  return (
    <AspectRatio ratio={16 / 9}>
      {!isEnded && url ? (
        <ReactPlayer
          className="pointer-events-none "
          playing={playing}
          volume={0.5}
          muted={isMuted}
          url={`https://youtube.com/embed/${url}`}
          width="100%"
          height="100%"
          fallback={<VideoSkeleton />}
          onEnded={() => {
            setEndedVideo(true);
          }}
          config={{
            youtube: {
              playerVars: {
                disablekb: 1,
                rel: 0,
                iv_load_policy: 3,
                enablejsapi: window.location.href,
                origin: 1,
              },
            },
          }}
        />
      ) : (
        <ImageWithFallback
          src={backdropPath}
          fill={true}
          alt={'Backdrop Image'}
          className="xl:!h-[100lvh] xl:!w-[100lvw]"
        />
      )}
    </AspectRatio>
  );
};

export default HeroPlayer;
