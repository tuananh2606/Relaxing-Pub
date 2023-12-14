import Image from 'next/image';
import styles from './preview-modal.module.scss';
import { Dispatch, SetStateAction } from 'react';
import { getCredits, getMovieDetail } from '~/services/tmdb/tmdb.server';
import { ICredit, IMovieDetail, ITvShowDetail } from '~/services/tmdb/tmdb.types';
import { Suspense } from 'react';
import PreviewModalSkeleton from '../ui/skeleton/PreviewModalSkeleton';
import ImageWithFallback from '../shared/ImageWithFallback';

export const preload = (id: number, mediaType: any) => {
  void getCredits(mediaType, id);
  void getMovieDetail(id);
};

interface IPreviewModal {
  items: {
    credits: ICredit | undefined;
    details: IMovieDetail | ITvShowDetail | undefined;
  };

  setIsOpenModal: Dispatch<SetStateAction<boolean>>;
  setIsPlaying: Dispatch<SetStateAction<boolean>>;
}

const PreviewModal = ({ setIsOpenModal, setIsPlaying, items }: IPreviewModal) => {
  const { credits, details } = items;
  const releaseYear = new Date(
    (details as IMovieDetail)?.release_date || (details as ITvShowDetail)?.first_air_date || '',
  ).getFullYear();
  const url = `${process.env.NEXT_PUBLIC_URL_IMAGES}/${details?.backdrop_path}`;
  return (
    <div className="w-[850px] min-w-[850px] animate-scale-in-center rounded-md bg-[#181818]">
      <div className="image-wrapper relative block w-full">
        <Suspense fallback={<PreviewModalSkeleton />}>
          <ImageWithFallback
            src={url}
            alt="Anh"
            width="0"
            height="0"
            sizes="100vw"
            className="h-auto w-full rounded-t-md"
          />
        </Suspense>

        <div className={`${styles.imageWrapper} absolute top-0 h-full w-full`}></div>
      </div>
      <div className="close-btn absolute right-0 top-0 m-[1em]">
        <button
          className="rounded-full bg-[#181818] p-[2px]"
          onClick={() => {
            setIsOpenModal(false);
            setIsPlaying(true);
          }}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="25" viewBox="0 0 24 25" fill="none">
            <path
              d="M12.0007 10.9002L16.9504 5.95044L18.3646 7.36465L13.4149 12.3144L18.3646 17.2641L16.9504 18.6783L12.0007 13.7286L7.05093 18.6783L5.63672 17.2641L10.5865 12.3144L5.63672 7.36465L7.05093 5.95044L12.0007 10.9002Z"
              fill="white"
            />
          </svg>
        </button>
      </div>
      <div className="px-12 py-3">
        <div className="grid grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
          <div className="">
            <span>{releaseYear}</span>
            <span> ‧ Action/Sci-fi</span>
            <span> ‧ 2h 20m</span>
            <p className="mt-3">{details?.overview}</p>
          </div>
          <div className="">
            <ul>
              <li>
                <span className="text-sm text-[#777777]">Dien vien:</span>
              </li>
              <li>
                <span className="text-sm text-[#777777]">The loai:</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PreviewModal;
