import { Dispatch, SetStateAction, useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { fetcher } from '~/utils/fetcher';
import type { Provider } from '~/services/providers.server';

interface ISelectProvidersDialog {
  id: string;
  visible: boolean;
  setIsOpenProviderModal: Dispatch<SetStateAction<boolean>>;
  setIsPlaying: Dispatch<SetStateAction<boolean>>;
  type: 'movie' | 'tv' | 'anime' | 'people';
  title: string;
  origTitle: string;
  year: number;
  season?: number;
  episode?: number;
  animeType?: string;
  isEnded?: boolean;
  tmdbId?: number;
}

const SelectProvidersDialog = (props: ISelectProvidersDialog) => {
  const {
    id,
    visible,
    setIsOpenProviderModal,
    setIsPlaying,
    type,
    title,
    origTitle,
    year,
    tmdbId,
    isEnded,
    season,
    episode,
    animeType,
  } = props;

  const [provider, setProvider] = useState<Provider[]>([]);
  const router = useRouter();

  useEffect(() => {
    const getProviders = async () => {
      if (type === 'movie') {
        const res: Provider[] = await fetcher({
          url: `/api/provider?title=${title}&type=${type}&origTitle=${origTitle}&year=${year}&isEnded=${isEnded}&tmdbId=${tmdbId}`,
        });
        setProvider(res);
      }
      if (type === 'tv') {
        const res: Provider[] = await fetcher({
          url: `/api/provider?title=${title}&type=${type}&origTitle=${origTitle}&year=${year}&season=${season}&isEnded=${isEnded}&tmdbId=${tmdbId}`,
        });
        setProvider(res);
      }
      if (type === 'anime') {
        const res: Provider[] = await fetcher({
          url: `/api/provider?title=${title}&type=${type}&origTitle=${origTitle}&year=${year}&aid=${tmdbId}&animeType=${animeType}&isEnded=${isEnded}`,
        });
        setProvider(res);
      }
    };
    if (visible) {
      getProviders();
    }
  }, []);

  const handleProvider = (item: Provider) => {
    closePreviewModal();
    if (type === 'movie') router.push(`/watch?id=${item.id}&episodeId=${id}&provider=${item.provider}`);
    if (type === 'tv')
      router.push(`/tv-shows/${id}/season/${season}/episode/${episode}/watch?provider=${item.provider}&id=${item.id}`);
    if (type === 'anime')
      router.push(`/anime/${id}/episode/${episode}/watch?provider=${item.provider}&id=${item.id}&episode=${episode}`);
  };

  const closePreviewModal = useCallback(() => {
    setIsOpenProviderModal(false);
    setIsPlaying(true);
  }, []);

  return (
    <div className="absolute top-[2em] mx-4 w-96 max-w-[850px] animate-scale-in-center rounded-md bg-[#181818] pb-9 md:mx-8">
      <div className="close-btn absolute right-0 top-0 m-[1em]">
        <button className="rounded-full bg-[#181818] p-[2px]" onClick={closePreviewModal}>
          <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 25" fill="none">
            <path
              d="M12.0007 10.9002L16.9504 5.95044L18.3646 7.36465L13.4149 12.3144L18.3646 17.2641L16.9504 18.6783L12.0007 13.7286L7.05093 18.6783L5.63672 17.2641L10.5865 12.3144L5.63672 7.36465L7.05093 5.95044L12.0007 10.9002Z"
              fill="white"
            />
          </svg>
        </button>
      </div>
      <div className="mt-4 flex w-full flex-col items-center justify-center">
        {provider && Array.isArray(provider)
          ? provider.map((item) => (
              <button key={item.id} onClick={() => handleProvider(item)}>
                {item.provider}
              </button>
            ))
          : null}
        {/* {globalState === 'loading' ? (
          <div role="status" className="max-w-sm animate-pulse">
            <div className="mb-4 h-2.5 w-48 rounded-full bg-gray-200 dark:bg-gray-700" />
            <div className="mb-4 h-2.5 w-48 rounded-full bg-gray-200 dark:bg-gray-700" />
            <div className="mb-4 h-2.5 w-48 rounded-full bg-gray-200 dark:bg-gray-700" />
            <span className="sr-only">Loading...</span>
          </div>
        ) : null} */}
      </div>
    </div>
  );
};

export default SelectProvidersDialog;
