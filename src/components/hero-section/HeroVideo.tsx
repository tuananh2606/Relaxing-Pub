'use client';
import { useState, useEffect } from 'react';
import HeroPlayer from '../player/HeroPlayer';
import PreviewModal from '../preview-modal/PreviewModal';
import styles from './hero-video.module.scss';
import { redirect, useRouter } from 'next/navigation';
import { preload } from '../preview-modal/PreviewModal';
import { IVideos, ICredit, IMovieDetail, ITvShowDetail } from '~/services/tmdb/tmdb.types';
import { IAnimeInfo, IMovieInfo } from '@consumet/extensions';
import { Suspense } from 'react';
import PreviewModalSkeleton from '../ui/skeleton/PreviewModalSkeleton';
import Link from 'next/link';

interface IHeroVideo {
  items: {
    videos: IVideos | undefined;
    mediaInfo: IMovieInfo | IAnimeInfo | undefined;
    credits: ICredit | undefined;
    details: IMovieDetail | ITvShowDetail | undefined;
  };
}

const HeroVideo = ({ items }: IHeroVideo) => {
  const [isMuted, setVideoMuted] = useState<boolean>(true);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [isOpenModal, setIsOpenModal] = useState<boolean>(false);
  const [trailerVideo, setTrailerVideo] = useState<any>();
  const [idMedia, setIdMedia] = useState<{ id: string; episodeId: string }>();
  const router = useRouter();
  const { videos, mediaInfo, credits, details } = items;

  const title = (details as IMovieDetail)?.title || (details as ITvShowDetail)?.name || '';

  useEffect(() => {
    if (videos) {
      const { results } = videos;
      const video = results.filter((ele) => ele.type === 'Trailer').shift();
      setTrailerVideo(video);
    }
    if (mediaInfo) {
      if (mediaInfo.type === 'Movie') {
        setIdMedia({
          id: mediaInfo.id,
          episodeId: mediaInfo.episodeId as string,
        });
      }
    }
  }, [videos, mediaInfo]);
  const muteHandler = () => {
    setVideoMuted(!isMuted);
  };

  const openModalHandle = () => {
    setIsOpenModal(true);
    setIsPlaying(false);
  };
  const navigate = () => {
    // if (idMedia) redirect(`/watch?id=${idMedia.id}&episodeId=${idMedia.episodeId}`);
  };

  // preload(items?.id as number, items?.mediaType);

  return (
    <div className="relative h-[56.25vw] max-h-[100dvh]">
      <HeroPlayer isMuted={isMuted} playing={isPlaying} url={trailerVideo?.key} />
      {isOpenModal && (
        <div className="previewMpdel-backdrop fixed inset-0 z-30 h-full w-full bg-black opacity-70"></div>
      )}
      <div className="absolute bottom-[10%] left-[5%] flex w-[60%] flex-col justify-end md:w-[36%]">
        <h1 className=" text-base drop-shadow-xl md:text-2xl">{title}</h1>
        <div className="mt-[1.5vw] animate-fade-bottom text-sm drop-shadow-xl md:text-lg">
          <div className="overflow-hidden">{details?.overview}</div>
        </div>
        <div className="actions-btn mt-[1.5vw] flex items-center">
          <Link href={`/watch?id=${idMedia?.id}&episodeId=${idMedia?.episodeId}`}>
            <button
              onClick={navigate}
              className="mr-3 flex items-center justify-center rounded-[4px] bg-white px-2 py-2 transition hover:bg-[rgba(255,255,255,0.75)] md:px-7"
            >
              <span>
                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M19.376 12.4158L8.77735 19.4816C8.54759 19.6348 8.23715 19.5727 8.08397 19.3429C8.02922 19.2608 8 19.1643 8 19.0656V4.93408C8 4.65794 8.22386 4.43408 8.5 4.43408C8.59871 4.43408 8.69522 4.4633 8.77735 4.51806L19.376 11.5838C19.6057 11.737 19.6678 12.0474 19.5146 12.2772C19.478 12.3321 19.4309 12.3792 19.376 12.4158Z"
                    fill="black"
                  />
                </svg>
              </span>
              <span className="ml-1 text-sm text-black md:text-lg">Play</span>
            </button>
          </Link>

          <button
            onClick={openModalHandle}
            className="flex min-w-fit items-center justify-center rounded-[4px] bg-secondary px-2 py-2 transition hover:bg-[rgba(109,109,110,0.4)] md:px-7 "
          >
            <span>
              <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 25" fill="none">
                <path
                  d="M12 22.3137C6.47715 22.3137 2 17.8365 2 12.3137C2 6.79087 6.47715 2.31372 12 2.31372C17.5228 2.31372 22 6.79087 22 12.3137C22 17.8365 17.5228 22.3137 12 22.3137ZM12 20.3137C16.4183 20.3137 20 16.732 20 12.3137C20 7.89544 16.4183 4.31372 12 4.31372C7.58172 4.31372 4 7.89544 4 12.3137C4 16.732 7.58172 20.3137 12 20.3137ZM11 7.31372H13V9.31372H11V7.31372ZM11 11.3137H13V17.3137H11V11.3137Z"
                  fill="white"
                />
              </svg>
            </span>
            <span className="ml-1 text-sm text-white md:text-lg">Thông tin khác</span>
          </button>
        </div>
      </div>

      <div className="absolute bottom-[10%] right-[5%]">
        <button className="rounded-full border p-2" onClick={muteHandler}>
          {isMuted ? (
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path
                d="M10 7.22056L6.60282 10.0001H3V14.0001H6.60282L10 16.7796V7.22056ZM5.88889 16.0001H2C1.44772 16.0001 1 15.5524 1 15.0001V9.00007C1 8.44778 1.44772 8.00007 2 8.00007H5.88889L11.1834 3.66821C11.3971 3.49335 11.7121 3.52485 11.887 3.73857C11.9601 3.8279 12 3.93977 12 4.05519V19.9449C12 20.2211 11.7761 20.4449 11.5 20.4449C11.3846 20.4449 11.2727 20.405 11.1834 20.3319L5.88889 16.0001ZM20.4142 12.0001L23.9497 15.5356L22.5355 16.9498L19 13.4143L15.4645 16.9498L14.0503 15.5356L17.5858 12.0001L14.0503 8.46454L15.4645 7.05032L19 10.5859L22.5355 7.05032L23.9497 8.46454L20.4142 12.0001Z"
                fill="white"
              />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 22 18" fill="none">
              <path
                d="M5.60282 7.0001L9 4.22056V13.7796L5.60282 11.0001H2V7.0001H5.60282ZM1 13.0001H4.88889L10.1834 17.3319C10.2727 17.405 10.3846 17.4449 10.5 17.4449C10.7761 17.4449 11 17.2211 11 16.9449V1.05519C11 0.93977 10.9601 0.8279 10.887 0.73857C10.7121 0.52485 10.3971 0.49335 10.1834 0.66821L4.88889 5.00007H1C0.44772 5.00007 0 5.44778 0 6.00007V12.0001C0 12.5524 0.44772 13.0001 1 13.0001ZM22 9C22 12.292 20.5539 15.2463 18.2622 17.2622L16.8445 15.8444C18.7758 14.1937 20 11.7398 20 9C20 6.26016 18.7758 3.80629 16.8445 2.15557L18.2622 0.73779C20.5539 2.75368 22 5.70795 22 9ZM17 9C17 7.0883 16.106 5.38548 14.7133 4.28673L13.2842 5.71584C14.3213 6.43855 15 7.64 15 9C15 10.36 14.3213 11.5614 13.2842 12.2841L14.7133 13.7132C16.106 12.6145 17 10.9116 17 9Z"
                fill="white"
              />
            </svg>
          )}
        </button>
      </div>
      {isOpenModal && (
        <div className="absolute left-0 top-0 z-40 flex h-full w-full justify-center">
          <PreviewModal
            items={{ credits: credits, details: details }}
            setIsOpenModal={setIsOpenModal}
            setIsPlaying={setIsPlaying}
          />
        </div>
      )}
    </div>
  );
};

export default HeroVideo;
