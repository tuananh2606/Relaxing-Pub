'use client';
import { useState, useRef } from 'react';
import { isDesktop, isMobile, isMobileOnly } from 'react-device-detect';
import type Artplayer from 'artplayer';
import Hls from 'hls.js';
import artplayerPluginHlsQuality from 'artplayer-plugin-hls-quality';
import { ISource } from '@consumet/extensions';
import { useSearchParams } from 'next/navigation';

import ArtPlayer from './ArtPlayer';
import PlayerHotKey from './PlayerHotkey';
import PlayerError from './PlayerError';
import { createPortal } from 'react-dom';
import PlayerSettings from './PlayerSettings';
import { IEpisodeVideo } from '~/services/kisskh/kisskh.types';

async function playM3u8(video: HTMLMediaElement, url: string, art: Artplayer) {
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
  item: ISource | IEpisodeVideo | undefined;
}

interface ISubtitleState {
  html: string;
  url: string;
}

const GlobalPlayer = (props: IGlobalPlayerProps) => {
  const { url, item } = props;
  const [artPlayer, setArtPlayer] = useState<Artplayer | null>(null);

  const [isSettingsOpen, setSettingsOpen] = useState(false);

  const searchParams = useSearchParams();
  const provider = searchParams.get('provider');

  console.log(item);

  return (
    <>
      {item ? (
        <ArtPlayer
          option={{
            container: '.artplayer-app',
            url:
              provider === 'Loklok'
                ? (item as ISource)?.sources?.find((item) => Number(item.quality) === 720)?.url ||
                  ((item as ISource)?.sources && (item as ISource).sources[0]?.url)
                : provider === 'Flixhq'
                  ? (item as ISource).sources?.find((item) => item.quality === 'auto')?.url ||
                    ((item as ISource).sources && (item as ISource).sources[0]?.url)
                  : provider === 'Gogo' || provider === 'Zoro'
                    ? (item as ISource).sources?.find((item) => item.quality === 'default')?.url ||
                      ((item as ISource).sources && (item as ISource).sources[0]?.url)
                    : provider === 'Bilibili'
                      ? (item as ISource).sources && (item as ISource).sources[0]?.url
                      : provider === 'KissKh'
                        ? (item as IEpisodeVideo) && (item as IEpisodeVideo).Video
                        : provider === 'test'
                          ? (item as ISource).sources?.find((source) => Number(source.quality) === 720)?.url
                          : (item as ISource).sources?.find((item) => item.quality === 'default')?.url ||
                            ((item as ISource).sources && (item as ISource).sources[0]?.url) ||
                            '',
            id: 'your-url-id',
            volume: 1,
            isLive: false,
            muted: false,
            autoplay: false,
            pip: false,
            autoSize: true,
            autoMini: true,
            setting: false,
            fastForward: true,
            lock: true,
            playbackRate: true,
            aspectRatio: false,
            fullscreen: true,
            fullscreenWeb: false,
            subtitleOffset: true,
            miniProgressBar: false,
            mutex: true,
            backdrop: true,
            hotkey: true,
            playsInline: true,
            autoPlayback: true,
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
            moreVideoAttr: isDesktop
              ? {
                  crossOrigin: 'anonymous',
                }
              : {
                  'x5-video-player-type': 'h5',
                  'x5-video-player-fullscreen': false,
                  'x5-video-orientation': 'portrait',
                  preload: 'metadata',
                },
            subtitle: {
              url:
                provider === 'Loklok'
                  ? (item as ISource).subtitles?.find((item: { lang: string; url: string }) =>
                      item.lang.includes('English'),
                    )?.url
                  : provider === 'Flixhq'
                    ? (item as ISource).subtitles?.find((item: { lang: string; url: string }) =>
                        item.lang.includes('English'),
                      )?.url || ''
                    : provider === 'KissKh'
                      ? (item as ISource).subtitles?.find(
                          (item: { lang: string; url: string; default?: boolean }) => item.default,
                        )?.url || ''
                      : provider === 'test'
                        ? (item as ISource).subtitles?.find((item: { lang: string; url: string }) =>
                            item.lang.includes('ch-jp'),
                          )?.url || ''
                        : (item as ISource).subtitles?.find((item: { lang: string; url: string }) =>
                            item.lang.includes('English'),
                          )?.url || '',
              type:
                provider === 'Flixhq' || provider === 'Loklok' || provider === 'Bilibili'
                  ? 'vtt'
                  : provider === 'KissKh'
                    ? 'srt'
                    : '',
              encoding: 'utf-8',
              escape: true,
              style: {
                color: '#fff',
                'font-size': '22px',
              },
            },
            // settings: [
            //   {
            //     width: 200,
            //     html: 'Subtitle',
            //     tooltip: 'Bilingual',
            //     icon: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
            //         <path d="M21 3C21.5523 3 22 3.44772 22 4V20C22 20.5523 21.5523 21 21 21H3C2.44772 21 2 20.5523 2 20V4C2 3.44772 2.44772 3 3 3H21ZM20 5H4V19H20V5ZM9 8C10.1045 8 11.1049 8.44841 11.829 9.173L10.4153 10.5866C10.0534 10.2241 9.55299 10 9 10C7.895 10 7 10.895 7 12C7 13.105 7.895 14 9 14C9.5525 14 10.0525 13.7762 10.4144 13.4144L11.828 14.828C11.104 15.552 10.104 16 9 16C6.792 16 5 14.208 5 12C5 9.792 6.792 8 9 8ZM16 8C17.1045 8 18.1049 8.44841 18.829 9.173L17.4153 10.5866C17.0534 10.2241 16.553 10 16 10C14.895 10 14 10.895 14 12C14 13.105 14.895 14 16 14C16.5525 14 17.0525 13.7762 17.4144 13.4144L18.828 14.828C18.104 15.552 17.104 16 16 16C13.792 16 12 14.208 12 12C12 9.792 13.792 8 16 8Z" fill="white"/>
            //       </svg>`,
            //     selector: [
            //       {
            //         html: 'Display',
            //         tooltip: 'Show',
            //         switch: true,
            //         onSwitch: function (item: any) {
            //           item.tooltip = item.switch ? 'Hide' : 'Show';
            //           artPlayer!.subtitle.show = !item.switch;
            //           return !item.switch;
            //         },
            //       },
            //       {
            //         default: true,
            //         html: 'Bilingual',
            //         url: '/assets/sample/subtitle.srt',
            //       },
            //       {
            //         html: 'Chinese',
            //         url: '/assets/sample/subtitle.cn.srt',
            //       },
            //       {
            //         html: 'Japanese',
            //         url: '/assets/sample/subtitle.jp.srt',
            //       },
            //     ],
            //     onSelect: function (item: any) {
            //       artPlayer!.subtitle.switch(item.url, {
            //         name: item.html,
            //       });
            //       return item.html;
            //     },
            //   },
            // ],
            // controls: [
            //   {
            //     position: 'right',
            //     name: 'subtitles',
            //     html: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
            //         <path d="M21 3C21.5523 3 22 3.44772 22 4V20C22 20.5523 21.5523 21 21 21H3C2.44772 21 2 20.5523 2 20V4C2 3.44772 2.44772 3 3 3H21ZM20 5H4V19H20V5ZM9 8C10.1045 8 11.1049 8.44841 11.829 9.173L10.4153 10.5866C10.0534 10.2241 9.55299 10 9 10C7.895 10 7 10.895 7 12C7 13.105 7.895 14 9 14C9.5525 14 10.0525 13.7762 10.4144 13.4144L11.828 14.828C11.104 15.552 10.104 16 9 16C6.792 16 5 14.208 5 12C5 9.792 6.792 8 9 8ZM16 8C17.1045 8 18.1049 8.44841 18.829 9.173L17.4153 10.5866C17.0534 10.2241 16.553 10 16 10C14.895 10 14 10.895 14 12C14 13.105 14.895 14 16 14C16.5525 14 17.0525 13.7762 17.4144 13.4144L18.828 14.828C18.104 15.552 17.104 16 16 16C13.792 16 12 14.208 12 12C12 9.792 13.792 8 16 8Z" fill="white"/>
            //       </svg>`,
            //     index: 1,
            //     selector: item.subtitles?.map((item) => {
            //       const modifiedLang = item.lang.replace(/\s*-\s*/g, ',').split(',');
            //       if (modifiedLang[0] === modifiedLang[1]) {
            //         if (modifiedLang[0] === 'English') return { html: modifiedLang[0], default: true, url: item.url };
            //         return { html: modifiedLang[0], url: item.url };
            //       } else return { html: item.lang, url: item.url };
            //     }),
            //     onSelect: function (item: any) {
            //       console.log(artPlayer);

            //       artPlayer && artPlayer.subtitle.switch(item.url);
            //     },
            //   },
            // ],
            controls: [
              {
                position: 'right',
                name: 'settings',
                html: '',
                tooltip: 'Settings',
              },
            ],
            customType:
              provider === 'Bilibili'
                ? {
                    mpd: async (video: HTMLMediaElement, url: string) => {
                      const { default: dashjs } = await import('dashjs');
                      const player = dashjs.MediaPlayer().create();
                      player.initialize(video, url, false);
                    },
                  }
                : {
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
            art.on('ready', async () => {
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
            art.on('destroy', () => {
              setArtPlayer(null);
            });
          }}
        />
      ) : (
        <PlayerError title="Video not found" message="The video you are trying to watch is not available." />
      )}
      {artPlayer && isDesktop
        ? createPortal(<PlayerSettings artPlayer={artPlayer} />, artPlayer.controls.settings)
        : null}
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
