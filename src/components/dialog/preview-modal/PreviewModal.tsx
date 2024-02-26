import { Dispatch, SetStateAction, memo, useCallback } from 'react';
import Link from 'next/link';

import ConvertToHourAndMinutes from '~/utils/ConvertToHourAndMinutes';
import styles from './preview-modal.module.scss';
import { getCredits, getMovieDetail } from '~/services/tmdb/tmdb.server';
import { ICredit, IMovieDetail, ITvShowDetail } from '~/services/tmdb/tmdb.types';
import PreviewModalSkeleton from '../../ui/skeleton/PreviewModalSkeleton';
import ImageWithFallback from '../../shared/ImageWithFallback';

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
  setIsPlaying?: Dispatch<SetStateAction<boolean>>;
}

const PreviewModal = ({ setIsOpenModal, setIsPlaying, items }: IPreviewModal) => {
  const { credits, details } = items;
  const { cast } = credits ?? {};
  const { genres } = details ?? {};

  const someActors: (string | undefined)[] = [];
  const someGenres: (string | undefined)[] = [];

  cast?.forEach((ele) => {
    someActors.push(ele.name);
  });

  genres?.forEach((ele) => {
    someGenres.push(ele.name);
  });

  const runtime = (details as IMovieDetail)?.runtime!;
  const episodes = (details as ITvShowDetail)?.number_of_episodes!;
  const seasons = (details as ITvShowDetail)?.number_of_seasons!;
  const releaseYear = new Date(
    (details as IMovieDetail)?.release_date || (details as ITvShowDetail)?.first_air_date || '',
  )
    .getFullYear()
    .toString();
  const url = `${process.env.NEXT_PUBLIC_URL_IMAGES}/${details?.backdrop_path}`;

  const closePreviewModal = useCallback(() => {
    setIsOpenModal(false);
    setIsPlaying && setIsPlaying(true);
  }, []);

  return (
    <div className="fixed left-0 top-0 z-40 flex h-full w-full items-center justify-center">
      <div className="previewMpdel-backdrop fixed inset-0 z-20 h-full w-full bg-black opacity-70 transition-opacity"></div>
      <div className="relative z-30 mx-4 h-fit w-auto max-w-[850px] animate-scale-in-center rounded-md bg-[#181818] pb-9 md:mx-8">
        <div className="image-wrapper relative  w-full ">
          <ImageWithFallback
            src={url}
            alt="Anh"
            width={0}
            height={0}
            sizes="100vw"
            className="h-auto w-full rounded-t-md"
          />
          <div className={`${styles.imageWrapper} absolute top-0 h-full w-full`}></div>
        </div>

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
        <div className="px-12 py-3">
          <div className="grid gap-4 md:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)] md:gap-8">
            <div>
              <span>{releaseYear}</span>
              {runtime ? (
                <span> ‧ {ConvertToHourAndMinutes(runtime)}</span>
              ) : <>
                  <span> ‧ {episodes > 0 ? episodes + ' episodes' : episodes + ' episode'} </span>
                  <span> ‧ {seasons > 0 ? seasons + ' seasons' : seasons + ' season'}</span>
                </> ? (
                !runtime
              ) : (
                <span></span>
              )}
              <p className="mt-3 text-sm">{details?.overview}</p>
            </div>
            <div>
              <ul>
                <li>
                  <span className="text-sm text-[#777777]">Diễn viên: </span>
                  {someActors?.slice(0, 3).map((ele, idx) => (
                    <span key={idx} className={`${styles.link} text-sm`}>
                      <Link href="#" className="hover:underline">
                        {ele}
                      </Link>
                    </span>
                  ))}
                </li>
                <li>
                  <span className="text-sm text-[#777777]">Thể loại: </span>
                  {someGenres?.slice(0, 3).map((ele, idx) => (
                    <span key={idx} className={`${styles.link} text-sm`}>
                      <Link href="#" className="hover:underline">
                        {ele}
                      </Link>
                    </span>
                  ))}
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default memo(PreviewModal);
