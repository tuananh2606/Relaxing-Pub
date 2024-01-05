import type { Dispatch, SetStateAction } from 'react';
import type Artplayer from 'artplayer';

function PlayerHotKey(art: Artplayer) {
  // https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/keyCode
  // art.hotkey.add(109, () => {
  //   // NumpadSubtract
  //   if (art.playbackRate > 0.25) {
  //     art.playbackRate -= 0.25;
  //     art.notice.show = `Speed ${art.playbackRate.toFixed(2)}x`;
  //   } else {
  //     art.notice.show = 'Min speed';
  //   }
  // });
  // art.hotkey.add(107, () => {
  //   // NumpadAdd
  //   if (art.playbackRate < 2) {
  //     art.playbackRate += 0.25;
  //     art.notice.show = `Speed ${art.playbackRate.toFixed(2)}x`;
  //   } else {
  //     art.notice.show = 'Max speed';
  //   }
  // });

  art.hotkey.add(77, () => {
    // Key M
    art.muted = !art.muted;
    if (art.muted) {
      art.notice.show = 'Mute';
    } else {
      art.notice.show = 'Unmute';
    }
  });
  art.hotkey.add(76, () => {
    // Key L
    art.forward = 10;
    art.notice.show = 'Forward 10s';
  });
  art.hotkey.add(75, () => {
    // Key K
    if (art.playing) {
      art.pause();
      art.notice.show = 'Pause';
    } else {
      art.play();
      art.notice.show = 'Play';
    }
  });
  art.hotkey.add(74, () => {
    // Key J
    art.backward = 10;
    art.notice.show = 'Backward 10s';
  });
  art.hotkey.add(70, () => {
    // Key F
    art.fullscreen = !art.fullscreen;
    if (art.fullscreen) {
      art.notice.show = 'Fullscreen';
    } else {
      art.notice.show = 'Exit fullscreen';
    }
  });
  art.hotkey.add(57, () => {
    // Key 9
    art.seek = Number(art.duration) * 0.9;
  });
  art.hotkey.add(56, () => {
    // Key 8
    art.seek = Number(art.duration) * 0.8;
  });
  art.hotkey.add(55, () => {
    // Key 7
    art.seek = Number(art.duration) * 0.7;
  });
  art.hotkey.add(54, () => {
    // Key 6
    art.seek = Number(art.duration) * 0.6;
  });
  art.hotkey.add(53, () => {
    // Key 5
    art.seek = Number(art.duration) * 0.5;
  });
  art.hotkey.add(52, () => {
    // Key 4
    art.seek = Number(art.duration) * 0.4;
  });
  art.hotkey.add(51, () => {
    // Key 3
    art.seek = Number(art.duration) * 0.3;
  });
  art.hotkey.add(50, () => {
    // Key 2
    art.seek = Number(art.duration) * 0.2;
  });
  art.hotkey.add(49, () => {
    // Key 1
    art.seek = Number(art.duration) * 0.1;
  });
  art.hotkey.add(48, () => {
    // Key 0
    art.seek = 0;
  });
  art.hotkey.add(36, () => {
    // Key Home
    art.seek = 0;
    art.notice.show = 'Seek to start';
  });
  art.hotkey.add(35, () => {
    // Key End
    art.seek = art.duration;
    art.notice.show = 'Seek to end';
  });
}

export default PlayerHotKey;
