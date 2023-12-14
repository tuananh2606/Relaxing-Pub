import ReactPlayer from 'react-player/lazy';
import VideoSkeleton from '../ui/skeleton/VideoSkeleton';
import AspectRatio from '../shared/AspectRatio';

interface IHeroPlayer {
  url: string;
  isMuted: boolean;
  playing: boolean;
}

const HeroPlayer = ({ isMuted, url, playing }: IHeroPlayer) => {
  return (
    <AspectRatio ratio={16 / 9}>
      <ReactPlayer
        className="pointer-events-none"
        playing={playing}
        volume={0.5}
        muted={isMuted}
        url={`https://www.youtube.com/embed/${url}`}
        width="100%"
        height="100%"
        fallback={<VideoSkeleton />}
        onEnded={() => {}}
        config={{
          youtube: {
            playerVars: { disablekb: 1, rel: 1, cc_load_policy: 1 },
          },
        }}
      />
    </AspectRatio>
  );
};

export default HeroPlayer;
//https://b-g-eu-15.feetcdn.com:2223/v3-hls-playback/b21df829a5e1acce9aef086b5b4786654bf01096e36b884be7652b7c347903bf782ba261a1acccd5edd37adde922f87c8cf93b32ad6ade9a45b186e01bbb16870ee49e57dac56bee240e37dfa646157aaec3903c4828fd9e3a32316395557655ea0ad4eb8932a16e342a3885e40a5c7c2d4fad7a58865f2db331cc6de910510bd3cc67bcf5c99549846b295421391af7b1ef3c286e6847b21f1e55a06a95ef604b9b2581fece61a4a516c748ec230fce/1080/index.m3u8
