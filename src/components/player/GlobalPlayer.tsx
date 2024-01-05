'use client';
import { useState, useRef, useEffect } from 'react';
import ArtPlayer from './ArtPlayer';
import type Artplayer from 'artplayer';
import Hls from 'hls.js';
import artplayerPluginHlsQuality from 'artplayer-plugin-hls-quality';
import PlayerHotKey from './PlayerHotkey';
import { ISource } from '@consumet/extensions';
import PlayerError from './PlayerError';
import { INSPECT_MAX_BYTES } from 'buffer';

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
  url?: string;
  item: ISource | undefined;
}

interface ISubtitleState {
  html: string;
  url: string;
}

const GlobalPlayer = (props: IGlobalPlayerProps) => {
  const { url, item } = props;
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
      {item ? (
        <ArtPlayer
          option={{
            container: '.artplayer-app',
            url: item.sources?.find((source) => Number(source.quality) === 720)?.url,
            id: 'your-url-id',
            volume: 1,
            isLive: false,
            muted: false,
            autoplay: false,
            pip: false,
            autoSize: true,
            autoMini: true,
            setting: true,
            fastForward: true,
            lock: true,
            playbackRate: true,
            aspectRatio: false,
            fullscreen: true,
            fullscreenWeb: false,
            subtitleOffset: true,
            miniProgressBar: true,
            mutex: true,
            backdrop: true,
            hotkey: true,
            playsInline: true,
            autoPlayback: true,
            moreVideoAttr: {
              crossOrigin: 'anonymous',
            },
            icons: {
              play: `
            <svg width="23px" height="23px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M21.4086 9.35258C23.5305 10.5065 23.5305 13.4935 21.4086 14.6474L8.59662 21.6145C6.53435 22.736 4 21.2763 4 18.9671L4 5.0329C4 2.72368 6.53435 1.26402 8.59661 2.38548L21.4086 9.35258Z" fill="#ffffff"></path> </g></svg>
          `,
              pause: `
            <svg  width="24" height="24" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
              <path d="M10.65 19.11V4.89C10.65 3.54 10.08 3 8.64 3H5.01C3.57 3 3 3.54 3 4.89V19.11C3 20.46 3.57 21 5.01 21H8.64C10.08 21 10.65 20.46 10.65 19.11Z" fill="currentColor"/>
              <path d="M21.0016 19.11V4.89C21.0016 3.54 20.4316 3 18.9916 3H15.3616C13.9316 3 13.3516 3.54 13.3516 4.89V19.11C13.3516 20.46 13.9216 21 15.3616 21H18.9916C20.4316 21 21.0016 20.46 21.0016 19.11Z" fill="currentColor"/>
            </svg>
          `,
              setting: `
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M3.33946 17.0002C2.90721 16.2515 2.58277 15.4702 2.36133 14.6741C3.3338 14.1779 3.99972 13.1668 3.99972 12.0002C3.99972 10.8345 3.3348 9.824 2.36353 9.32741C2.81025 7.71651 3.65857 6.21627 4.86474 4.99001C5.7807 5.58416 6.98935 5.65534 7.99972 5.072C9.01009 4.48866 9.55277 3.40635 9.4962 2.31604C11.1613 1.8846 12.8847 1.90004 14.5031 2.31862C14.4475 3.40806 14.9901 4.48912 15.9997 5.072C17.0101 5.65532 18.2187 5.58416 19.1346 4.99007C19.7133 5.57986 20.2277 6.25151 20.66 7.00021C21.0922 7.7489 21.4167 8.53025 21.6381 9.32628C20.6656 9.82247 19.9997 10.8336 19.9997 12.0002C19.9997 13.166 20.6646 14.1764 21.6359 14.673C21.1892 16.2839 20.3409 17.7841 19.1347 19.0104C18.2187 18.4163 17.0101 18.3451 15.9997 18.9284C14.9893 19.5117 14.4467 20.5941 14.5032 21.6844C12.8382 22.1158 11.1148 22.1004 9.49633 21.6818C9.55191 20.5923 9.00929 19.5113 7.99972 18.9284C6.98938 18.3451 5.78079 18.4162 4.86484 19.0103C4.28617 18.4205 3.77172 17.7489 3.33946 17.0002ZM8.99972 17.1964C10.0911 17.8265 10.8749 18.8227 11.2503 19.9659C11.7486 20.0133 12.2502 20.014 12.7486 19.9675C13.1238 18.8237 13.9078 17.8268 14.9997 17.1964C16.0916 16.5659 17.347 16.3855 18.5252 16.6324C18.8146 16.224 19.0648 15.7892 19.2729 15.334C18.4706 14.4373 17.9997 13.2604 17.9997 12.0002C17.9997 10.74 18.4706 9.5632 19.2729 8.6665C19.1688 8.4405 19.0538 8.21822 18.9279 8.00021C18.802 7.78219 18.667 7.57148 18.5233 7.36842C17.3457 7.61476 16.0911 7.43414 14.9997 6.80405C13.9083 6.17395 13.1246 5.17768 12.7491 4.03455C12.2509 3.98714 11.7492 3.98646 11.2509 4.03292C10.8756 5.17671 10.0916 6.17364 8.99972 6.80405C7.9078 7.43447 6.65245 7.61494 5.47428 7.36803C5.18485 7.77641 4.93463 8.21117 4.72656 8.66637C5.52881 9.56311 5.99972 10.74 5.99972 12.0002C5.99972 13.2604 5.52883 14.4372 4.72656 15.3339C4.83067 15.5599 4.94564 15.7822 5.07152 16.0002C5.19739 16.2182 5.3324 16.4289 5.47612 16.632C6.65377 16.3857 7.90838 16.5663 8.99972 17.1964ZM11.9997 15.0002C10.3429 15.0002 8.99972 13.6571 8.99972 12.0002C8.99972 10.3434 10.3429 9.00021 11.9997 9.00021C13.6566 9.00021 14.9997 10.3434 14.9997 12.0002C14.9997 13.6571 13.6566 15.0002 11.9997 15.0002ZM11.9997 13.0002C12.552 13.0002 12.9997 12.5525 12.9997 12.0002C12.9997 11.4479 12.552 11.0002 11.9997 11.0002C11.4474 11.0002 10.9997 11.4479 10.9997 12.0002C10.9997 12.5525 11.4474 13.0002 11.9997 13.0002Z" fill="white"/>
            </svg>
         
          `,
              volume: `
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M2 16.0001H5.88889L11.1834 20.3319C11.2727 20.405 11.3846 20.4449 11.5 20.4449C11.7761 20.4449 12 20.2211 12 19.9449V4.05519C12 3.93977 11.9601 3.8279 11.887 3.73857C11.7121 3.52485 11.3971 3.49335 11.1834 3.66821L5.88889 8.00007H2C1.44772 8.00007 1 8.44778 1 9.00007V15.0001C1 15.5524 1.44772 16.0001 2 16.0001ZM23 12C23 15.292 21.5539 18.2463 19.2622 20.2622L17.8445 18.8444C19.7758 17.1937 21 14.7398 21 12C21 9.26016 19.7758 6.80629 17.8445 5.15557L19.2622 3.73779C21.5539 5.75368 23 8.70795 23 12ZM18 12C18 10.0883 17.106 8.38548 15.7133 7.28673L14.2842 8.71584C15.3213 9.43855 16 10.64 16 12C16 13.36 15.3213 14.5614 14.2842 15.2841L15.7133 16.7132C17.106 15.6145 18 13.9116 18 12Z" fill="white"/>
            </svg>
          `,
              volumeClose: `
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M5.88889 16.0001H2C1.44772 16.0001 1 15.5524 1 15.0001V9.00007C1 8.44778 1.44772 8.00007 2 8.00007H5.88889L11.1834 3.66821C11.3971 3.49335 11.7121 3.52485 11.887 3.73857C11.9601 3.8279 12 3.93977 12 4.05519V19.9449C12 20.2211 11.7761 20.4449 11.5 20.4449C11.3846 20.4449 11.2727 20.405 11.1834 20.3319L5.88889 16.0001ZM20.4142 12.0001L23.9497 15.5356L22.5355 16.9498L19 13.4143L15.4645 16.9498L14.0503 15.5356L17.5858 12.0001L14.0503 8.46454L15.4645 7.05032L19 10.5859L22.5355 7.05032L23.9497 8.46454L20.4142 12.0001Z" fill="white"/>
            </svg>
          `,
              pip: `
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
              <path d="M16.19 2H7.81C4.17 2 2 4.17 2 7.81V16.18C2 19.83 4.17 22 7.81 22H16.18C19.82 22 21.99 19.83 21.99 16.19V7.81C22 4.17 19.83 2 16.19 2ZM18.5 16.4C18.5 17.9 17.9 18.5 16.4 18.5H12.6C11.1 18.5 10.5 17.9 10.5 16.4V14.6C10.5 13.1 11.1 12.5 12.6 12.5H16.4C17.9 12.5 18.5 13.1 18.5 14.6V16.4Z" fill="currentColor"/>
            </svg>
          `,
              fullscreenOn: `
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M16 3H22V9H20V5H16V3ZM2 3H8V5H4V9H2V3ZM20 19V15H22V21H16V19H20ZM4 19H8V21H2V15H4V19Z" fill="white"/>
            </svg>
          `,
              fullscreenOff: `
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M18 7H22V9H16V3H18V7ZM8 9H2V7H6V3H8V9ZM18 17V21H16V15H22V17H18ZM8 15V21H6V17H2V15H8Z" fill="white"/>
            </svg>
          `,
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
              url:
                item.subtitles && item.subtitles.length > 0
                  ? item.subtitles?.find((subtitle) => subtitle.lang.includes('English'))?.url
                  : '',
              type: 'vtt',
              encoding: 'utf-8',
              escape: true,
              style: {
                color: '#fff',
                'font-size': '20px',
              },
            },
            settings: [
              {
                width: 200,
                html: 'Subtitle',
                tooltip: 'Bilingual',
                icon: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <path d="M21 3C21.5523 3 22 3.44772 22 4V20C22 20.5523 21.5523 21 21 21H3C2.44772 21 2 20.5523 2 20V4C2 3.44772 2.44772 3 3 3H21ZM20 5H4V19H20V5ZM9 8C10.1045 8 11.1049 8.44841 11.829 9.173L10.4153 10.5866C10.0534 10.2241 9.55299 10 9 10C7.895 10 7 10.895 7 12C7 13.105 7.895 14 9 14C9.5525 14 10.0525 13.7762 10.4144 13.4144L11.828 14.828C11.104 15.552 10.104 16 9 16C6.792 16 5 14.208 5 12C5 9.792 6.792 8 9 8ZM16 8C17.1045 8 18.1049 8.44841 18.829 9.173L17.4153 10.5866C17.0534 10.2241 16.553 10 16 10C14.895 10 14 10.895 14 12C14 13.105 14.895 14 16 14C16.5525 14 17.0525 13.7762 17.4144 13.4144L18.828 14.828C18.104 15.552 17.104 16 16 16C13.792 16 12 14.208 12 12C12 9.792 13.792 8 16 8Z" fill="white"/>
                  </svg>`,
                selector: [
                  {
                    html: 'Display',
                    tooltip: 'Show',
                    switch: true,
                    onSwitch: function (item: any) {
                      item.tooltip = item.switch ? 'Hide' : 'Show';
                      artPlayer!.subtitle.show = !item.switch;
                      return !item.switch;
                    },
                  },
                  {
                    default: true,
                    html: 'Bilingual',
                    url: '/assets/sample/subtitle.srt',
                  },
                  {
                    html: 'Chinese',
                    url: '/assets/sample/subtitle.cn.srt',
                  },
                  {
                    html: 'Japanese',
                    url: '/assets/sample/subtitle.jp.srt',
                  },
                ],
                onSelect: function (item: any) {
                  artPlayer!.subtitle.switch(item.url, {
                    name: item.html,
                  });
                  return item.html;
                },
              },
            ],
            controls: [
              {
                position: 'right',
                name: 'subtitles',
                html: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <path d="M21 3C21.5523 3 22 3.44772 22 4V20C22 20.5523 21.5523 21 21 21H3C2.44772 21 2 20.5523 2 20V4C2 3.44772 2.44772 3 3 3H21ZM20 5H4V19H20V5ZM9 8C10.1045 8 11.1049 8.44841 11.829 9.173L10.4153 10.5866C10.0534 10.2241 9.55299 10 9 10C7.895 10 7 10.895 7 12C7 13.105 7.895 14 9 14C9.5525 14 10.0525 13.7762 10.4144 13.4144L11.828 14.828C11.104 15.552 10.104 16 9 16C6.792 16 5 14.208 5 12C5 9.792 6.792 8 9 8ZM16 8C17.1045 8 18.1049 8.44841 18.829 9.173L17.4153 10.5866C17.0534 10.2241 16.553 10 16 10C14.895 10 14 10.895 14 12C14 13.105 14.895 14 16 14C16.5525 14 17.0525 13.7762 17.4144 13.4144L18.828 14.828C18.104 15.552 17.104 16 16 16C13.792 16 12 14.208 12 12C12 9.792 13.792 8 16 8Z" fill="white"/>
                  </svg>`,
                index: 1,
                selector: [
                  {
                    default: true,
                    html: '<span style="color:red">subtitle 01</span>',
                  },
                  {
                    html: '<span style="color:yellow">subtitle 02</span>',
                  },
                ],
              },
            ],
            customType: {
              m3u8: playM3u8,
            },
            plugins: [
              artplayerPluginHlsQuality({
                // Show quality in control
                control: false,

                // Show quality in setting
                setting: true,

                // Get the resolution text from level
                getResolution: (level) => level.height + 'P',

                // I18n
                title: 'Quality',
                auto: 'Auto',
              }),
            ],
            // layers: [
            //   {
            //     html: '',
            //     style: {
            //       position: 'absolute',
            //       left: 0,
            //       top: 0,
            //       right: 0,
            //       bottom: 0,
            //       width: '33%',
            //       height: '100%',
            //     },
            //     disable: !artPlayer?.utils.isMobile,
            //     click: function () {
            //       if (ldb.dblclick()) art.backward = artPlayer.SEEK_STEP;
            //     },
            //   },
            // ],
          }}
          className="artplayer-app [&>.art-video-player]:!h-full"
          style={{
            width: '100%',
            height: '100%',
          }}
          getInstance={(art) => {
            art.on('ready', () => {
              PlayerHotKey(art);
              setArtPlayer(art);
            });
            art.on('video:loadedmetadata', () => {
              /* Adding highlights in player's progress bar */
              // if (highlights) {
              //   const $highlight = art.query('.art-progress-highlight');
              //   // @ts-ignore
              //   const { append, createElement, setStyles } = art.constructor.utils;
              //   for (let index = 0; index < highlights.length; index += 1) {
              //     const item = highlights[index];
              //     const left = (item.start / art.duration) * 100;
              //     const width = ((item.end - item.start) / art.duration) * 100;
              //     const $item = createElement('span');
              //     $item.dataset.text = item.text;
              //     setStyles($item, {
              //       left: `${left}%`,
              //       width: `${width}%`,
              //       backgroundColor: 'hsl(var(--theme-secondary)) !important',
              //     });
              //     append($highlight, $item);
              //   }
              // }
            });
          }}
        />
      ) : (
        <PlayerError title="Video not found" message="The video you are trying to watch is not available." />
      )}
    </>
  );
};

// class doubleClick {
//   dblclick() {
//     const now = Date.now();
//     const result = this.timestamp && now - this.timestamp <= Artplayer.DBCLICK_TIME;
//     this.timestamp = now;
//     return result;
//   }
// }

// const ldb = new doubleClick();

export default GlobalPlayer;
