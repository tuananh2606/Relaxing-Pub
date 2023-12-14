'use client';
import { useState, useRef, useEffect } from 'react';
import ArtPlayer from './ArtPlayer';
import type Artplayer from 'artplayer';
import Hls from 'hls.js';

function playM3u8(video: HTMLMediaElement, url: string, art: Artplayer) {
  if (Hls.isSupported()) {
    const hls = new Hls();
    hls.loadSource(url);
    hls.attachMedia(video);
    // @ts-ignore
    art.hls = hls;
    art.on('destroy', () => hls.destroy());
  } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
    video.src = url;
  } else {
    art.notice.show = 'Unsupported playback format: m3u8';
  }
}

interface IGlobalPlayerProps {
  url: string;
}

interface ISubtitleState {
  html: string;
  url: string;
}

const GlobalPlayer = (props: IGlobalPlayerProps) => {
  const { url } = props;
  const [artPlayer, setArtPlayer] = useState<Artplayer | null>(null);
  const [subtitles, setSubtitles] = useState<ISubtitleState[]>([]);
  const [isSettingsOpen, setSettingsOpen] = useState(false);
  const hiddenFileInput = useRef<HTMLInputElement | null>(null);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const sub = event.target.files[0];
      const objectURL = URL.createObjectURL(sub);
      setSubtitles([
        ...subtitles,
        {
          html: 'Test',
          url: objectURL,
        },
      ]);
    }
  };
  useEffect(() => {}, [artPlayer]);
  return (
    <>
      <ArtPlayer
        option={{
          container: '.artplayer-app',
          url: url,
          id: 'your-url-id',
          volume: 1,
          isLive: false,
          muted: false,
          autoplay: false,
          pip: false,
          autoSize: true,
          autoMini: true,
          setting: false,
          playbackRate: true,
          aspectRatio: true,
          fullscreen: true,
          fullscreenWeb: true,
          subtitleOffset: true,
          miniProgressBar: false,
          mutex: true,
          backdrop: true,
          playsInline: true,
          autoPlayback: true,
          moreVideoAttr: {
            crossOrigin: 'anonymous',
          },
          // moreVideoAttr: isDesktop
          //   ? {
          //       crossOrigin: 'anonymous'
          //     }
          //   : {
          //       'x5-video-player-type': 'h5',
          //       'x5-video-player-fullscreen': false,
          //       'x5-video-orientation': 'portrait',
          //       preload: 'metadata'
          //     },
          subtitle: {
            url: 'https://cc.2cdns.com/a8/d8/a8d8c98288d4db1d6404e54c644091f5/eng-9.vtt',
            type: 'vtt',
            encoding: 'utf-8',
            escape: true,
            style: {
              color: '#03A9F4',
              'font-size': '16px',
            },
          },
          settings: [
            {
              width: 200,
              html: 'Subtitle',
              tooltip: 'English',
              icon: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" >
            <path d="M21 3C21.5523 3 22 3.44772 22 4V20C22 20.5523 21.5523 21 21 21H3C2.44772 21 2 20.5523 2 20V4C2 3.44772 2.44772 3 3 3H21ZM9 8C6.792 8 5 9.792 5 12C5 14.208 6.792 16 9 16C10.1 16 11.1 15.55 11.828 14.828L10.4144 13.4144C10.0525 13.7762 9.5525 14 9 14C7.895 14 7 13.105 7 12C7 10.895 7.895 10 9 10C9.55 10 10.0483 10.22 10.4153 10.5866L11.829 9.173C11.1049 8.44841 10.1045 8 9 8ZM16 8C13.792 8 12 9.792 12 12C12 14.208 13.792 16 16 16C17.104 16 18.104 15.552 18.828 14.828L17.4144 13.4144C17.0525 13.7762 16.5525 14 16 14C14.895 14 14 13.105 14 12C14 10.895 14.895 10 16 10C16.553 10 17.0534 10.2241 17.4153 10.5866L18.829 9.173C18.1049 8.44841 17.1045 8 16 8Z" fill="white"/>
            </svg>`,
              selector: [
                {
                  html: 'Display',
                  tooltip: 'Show',
                  switch: true,
                  onSwitch: function (item: any) {
                    console.log(artPlayer);
                    item.tooltip = item.switch ? 'Hide' : 'Show';
                    if (artPlayer) artPlayer.subtitle.show = !item.switch;
                    return !item.switch;
                  },
                },
                {
                  default: true,
                  html: 'English',
                  url: 'https://cc.2cdns.com/a8/d8/a8d8c98288d4db1d6404e54c644091f5/eng-9.vtt',
                },
                {
                  html: 'Vietnamese',
                  url: '/assets/sample/subtitle.cn.srt',
                },
                {
                  html: 'Thailand',
                  url: 'https://cc.2cdns.com/a8/d8/a8d8c98288d4db1d6404e54c644091f5/tha-31.vtt',
                },
              ],
              onSelect: function (item: any) {
                console.log(artPlayer);
                // artPlayer!.subtitle.url = item.url;
                return item.html;
              },
            },
            {
              html: 'Quality',
              width: 200,
              icon: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M21 18V21H19V18H17V15H23V18H21ZM5 18V21H3V18H1V15H7V18H5ZM11 6V3H13V6H15V9H9V6H11ZM11 11H13V21H11V11ZM3 13V3H5V13H3ZM19 13V3H21V13H19Z" fill="white"/>
            </svg>`,
              tooltip: '1080P',
              selector: [
                {
                  default: true,
                  html: '1080P',
                  url: '/assets/sample/video.mp4?id=1080',
                },
                {
                  html: '720P',
                  url: '/assets/sample/video.mp4?id=720',
                },
                {
                  html: '360P',
                  url: '/assets/sample/video.mp4?id=360',
                },
              ],
              // onSelect: function (item, $dom, event) {
              //   console.info(item, $dom, event);
              //   art.switchQuality(item.url, item.html);
              //   return item.html;
              // },
            },
          ],
          controls: [
            {
              position: 'right',
              name: 'settings',
              html: ``,
              index: 1,
              tooltip: 'Settings',
            },
            {
              position: 'right',
              html: `
                
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <path d="M11 11V5H13V11H19V13H13V19H11V13H5V11H11Z" fill="white"/>
                  </svg>`,
              index: 1,
              tooltip: 'Add subtitles',
              click: function () {
                hiddenFileInput.current!.click();
              },
            },
          ],
          customType: {
            m3u8: playM3u8,
          },
        }}
        className="artplayer-app [&>.art-video-player]:!h-full"
        style={{
          width: '100%',
          height: '100%',
        }}
        getInstance={(art) => {
          console.log(art.controls.settings);
          art.on('ready', () => setArtPlayer(art));
        }}
      />
    </>
  );
};

export default GlobalPlayer;
