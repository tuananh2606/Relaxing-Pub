import { useLocalStorageValue } from '@react-hookz/web';

function useFilmPubSettings() {
  const currentSubtitleFontColor = useLocalStorageValue('filmpub_settings-subtitle-font_color', {
    defaultValue: 'White',
  });
  const currentSubtitleFontSize = useLocalStorageValue('filmpub_settings-subtitle-font_size', {
    defaultValue: '100%',
  });
  const currentSubtitleBackgroundColor = useLocalStorageValue('filmpub_settings-subtitle-background_color', {
    defaultValue: 'Black',
  });
  const currentSubtitleBackgroundOpacity = useLocalStorageValue('filmpub_settings-subtitle-background_opacity', {
    defaultValue: '0%',
  });
  const currentSubtitleWindowColor = useLocalStorageValue('filmpub_settings-subtitle-window_color', {
    defaultValue: 'Black',
  });
  const currentSubtitleWindowOpacity = useLocalStorageValue('filmpub_settings-subtitle-window_opacity', {
    defaultValue: '0%',
  });
  const currentSubtitleTextEffects = useLocalStorageValue('filmpub_settings-subtitle-text_effect', {
    defaultValue: 'Outline',
  });
  const autoShowSubtitle = useLocalStorageValue('filmpub_settings-subtitle-auto_show', {
    defaultValue: false,
  });
  // const showFilter = useLocalStorageValue('filmpub_settings-layout-show-filter', {
  //   defaultValue: false,
  //   initializeWithValue: false,
  // });
  const isMutedTrailer = useLocalStorageValue('filmpub_settings-list-mute_trailer', {
    defaultValue: true,
    initializeWithValue: false,
  });
  const isPlayTrailer = useLocalStorageValue('filmpub_settings-list-play_trailer', {
    defaultValue: false,
    initializeWithValue: false,
  });
  const isFetchLogo = useLocalStorageValue('filmpub_settings-list-fetch_logo', {
    defaultValue: false,
  });
  const isShowSpotlight = useLocalStorageValue('filmpub_settings-list-show_spotlight', {
    defaultValue: false,
  });
  const isAutoSize = useLocalStorageValue('filmpub_settings-player-auto_size', {
    defaultValue: false,
  });
  const isPicInPic = useLocalStorageValue('filmpub_settings-player-pic_in_pic', {
    defaultValue: true,
  });
  const isMuted = useLocalStorageValue('filmpub_settings-player-mute', {
    defaultValue: false,
  });
  const isAutoPlay = useLocalStorageValue('filmpub_settings-player-auto_play', {
    defaultValue: false,
  });
  const isAutoMini = useLocalStorageValue('filmpub_settings-player-auto_mini', {
    defaultValue: false,
  });
  const isLoop = useLocalStorageValue('filmpub_settings-player-loop', {
    defaultValue: false,
  });
  const isScreenshot = useLocalStorageValue('filmpub_settings-player-screenshot', {
    defaultValue: true,
  });
  const isMiniProgressBar = useLocalStorageValue('filmpub_settings-player-mini_progress_bar', {
    defaultValue: true,
  });
  const isAutoPlayback = useLocalStorageValue('filmpub_settings-player-auto_playback', {
    defaultValue: true,
  });
  const isAutoPlayNextEpisode = useLocalStorageValue('filmpub_settings-player-auto_play_next_episode', {
    defaultValue: true,
  });
  const isShowSkipOpEdButton = useLocalStorageValue('filmpub_settings-player-show_skip_op_ed_button', {
    defaultValue: true,
  });
  const isAutoSkipOpEd = useLocalStorageValue('filmpub_settings-player-auto_skip_op_ed', {
    defaultValue: false,
  });
  const isFastForward = useLocalStorageValue('filmpub_settings-player-fast_forward', {
    defaultValue: true,
  });
  // const isSwipeFullscreen = useLocalStorageValue('filmpub_settings_player-gestures_swipe-fullscreen', {
  //   defaultValue: false,
  // });
  const sidebarStyleMode = useLocalStorageValue('filmpub_settings-layout-sidebar-style_mode', {
    defaultValue: 'rounded-all',
  });
  const sidebarMiniMode = useLocalStorageValue('filmpub_settings-layout-sidebar-mini_mode', {
    defaultValue: false,
    initializeWithValue: false,
  });
  const sidebarHoverMode = useLocalStorageValue('filmpub_settings-layout-sidebar-hover_mode', {
    defaultValue: false,
    initializeWithValue: false,
  });
  const sidebarBoxedMode = useLocalStorageValue('filmpub_settings-layout-sidebar-boxed_mode', {
    defaultValue: false,
    initializeWithValue: false,
  });
  const sidebarSheetMode = useLocalStorageValue('filmpub_settings-layout-sidebar-sheet_mode', {
    defaultValue: false,
    initializeWithValue: false,
  });
  const listViewType = useLocalStorageValue<'table' | 'card' | 'detail'>('filmpub_settings-layout-list_view', {
    defaultValue: 'card',
    initializeWithValue: false,
  });
  const listLoadingType = useLocalStorageValue('filmpub_settings-layout-list-loading_type', {
    defaultValue: 'pagination',
    initializeWithValue: false,
  });
  const autoSwitchSubtitle = useLocalStorageValue('filmpub_settings-subtitle-auto_switch', {
    defaultValue: true,
  });
  const isShowBreadcrumb = useLocalStorageValue('filmpub_settings-layout-header-show_breadcrumb', {
    defaultValue: true,
    initializeWithValue: false,
  });
  const isShowTopPagination = useLocalStorageValue('filmpub_settings-layout-list-show-top-pagination', {
    defaultValue: false,
    initializeWithValue: false,
  });
  const isLightDarkThemeOnly = useLocalStorageValue('filmpub_settings-layout-theme-light_dark_only', {
    defaultValue: true,
  });
  const currentThemeColor = useLocalStorageValue('filmpub_settings-layout-theme-color', {
    defaultValue: 'blue',
    initializeWithValue: false,
  });

  return {
    currentSubtitleFontColor,
    currentSubtitleFontSize,
    currentSubtitleBackgroundColor,
    currentSubtitleBackgroundOpacity,
    currentSubtitleWindowColor,
    currentSubtitleWindowOpacity,
    autoShowSubtitle,
    // showFilter,
    isMutedTrailer,
    isPlayTrailer,
    isAutoSize,
    isPicInPic,
    isMuted,
    isAutoPlay,
    isAutoMini,
    isLoop,
    isScreenshot,
    isMiniProgressBar,
    isAutoPlayback,
    isAutoPlayNextEpisode,
    isShowSkipOpEdButton,
    isAutoSkipOpEd,
    isFastForward,
    // isSwipeFullscreen,
    currentSubtitleTextEffects,
    sidebarStyleMode,
    sidebarMiniMode,
    sidebarHoverMode,
    sidebarBoxedMode,
    sidebarSheetMode,
    listViewType,
    listLoadingType,
    autoSwitchSubtitle,
    isShowBreadcrumb,
    isShowTopPagination,
    isLightDarkThemeOnly,
    currentThemeColor,
    isFetchLogo,
    isShowSpotlight,
  };
}

export { useFilmPubSettings };
