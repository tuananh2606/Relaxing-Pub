import { Dispatch, SetStateAction, useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next-nprogress-bar';
import { fetcher } from '~/utils/fetcher';
import type { Provider } from '~/services/providers.server';
import { DialogHeader, DialogTitle } from '../elements/Dialog';

interface ISelectProvidersDialog {
  id: string;
  visible: boolean;
  setIsOpenProviderModal: Dispatch<SetStateAction<boolean>>;
  setIsPlaying?: Dispatch<SetStateAction<boolean>>;
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
          options: {
            headers: {
              'Content-Type': 'application/json',
            },
          },
        });
        setProvider(res);
      }
      if (type === 'tv') {
        const res: Provider[] = await fetcher({
          url: `/api/provider?title=${title}&type=${type}&origTitle=${origTitle}&year=${year}&season=${season}&isEnded=${isEnded}&tmdbId=${tmdbId}`,
          options: {
            headers: {
              'Content-Type': 'application/json',
            },
          },
        });
        setProvider(res);
      }
      if (type === 'anime') {
        const res: Provider[] = await fetcher({
          url: `/api/provider?title=${title}&type=${type}&origTitle=${origTitle}&year=${year}&aid=${tmdbId}&animeType=${animeType}&isEnded=${isEnded}`,
          options: {
            headers: {
              'Content-Type': 'application/json',
            },
          },
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
    if (type === 'movie') router.push(`/watch?id=${item.id}${id && `&episodeId=${id}`}&provider=${item.provider}`);
    if (type === 'tv')
      router.push(`/tv-shows/${id}/season/${season}/episode/${episode}/watch?provider=${item.provider}&id=${item.id}`);
    if (type === 'anime')
      router.push(`/anime/${id}/episode/${episode}/watch?provider=${item.provider}&id=${item.id}&episode=${episode}`);
  };

  const closePreviewModal = useCallback(() => {
    setIsOpenProviderModal(false);
    //setIsPlaying(true);
  }, []);

  return (
    <>
      <DialogHeader>
        <DialogTitle>Select Provider</DialogTitle>
      </DialogHeader>
      <div className="mt-4 flex w-full flex-col items-center justify-center">
        {provider && Array.isArray(provider)
          ? provider.map((item) => (
              <button
                className="rounded-md px-3 py-1 hover:bg-secondary"
                key={item.id}
                onClick={() => handleProvider(item)}
              >
                {item.provider}
              </button>
            ))
          : null}
        {!provider.length ? (
          <div role="status" className="max-w-sm animate-pulse">
            <div className="mb-4 h-2.5 w-48 rounded-full bg-gray-200 dark:bg-gray-700" />
            <div className="mb-4 h-2.5 w-48 rounded-full bg-gray-200 dark:bg-gray-700" />
            <div className="mb-4 h-2.5 w-48 rounded-full bg-gray-200 dark:bg-gray-700" />
            <span className="sr-only">Loading...</span>
          </div>
        ) : null}
      </div>
    </>
  );
};

export default SelectProvidersDialog;
