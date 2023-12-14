'use client';
import ReactPlayer from 'react-player/lazy';

const Player = () => {
  return (
    <ReactPlayer
      className="react-player"
      playing
      controls
      url="https://yot.gnicirp.com/_v10/7e0e33be706739ae6f15ae720ee477a0f4bc108abdd4a285104c51c74279644fb0e7efefa75fa3a9a77e1b42311981adf47c4a1881ed50c7a166a467a93e22741720608d25e302133f2d480b8114c24c289fd2ddd22e5b5181665d3e3670f0108d13557028ac6abb4371319891a6591c7d381914781e7cdd34a93a7b72da817664abf097d33da6788d2d03d0cc0e421a/playlist.m3u8"
      width="100%"
      height="100%"
      config={{
        file: {
          attributes: {
            crossOrigin: 'anonymous',
          },
        },
      }}
    />
  );
};

export default Player;
