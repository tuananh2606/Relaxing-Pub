import { CSSProperties, useEffect, useState } from 'react';
import Link from 'next/link';
import { ConvertToHourAndMinutes } from '~/utils';
import styles from './preview-modal.module.scss';
import { ICredit, IMovieDetail, ITvShowDetail } from '~/services/tmdb/tmdb.types';
import Image from 'next/image';
import { Image as NextUIImage } from '@nextui-org/react';
import { IMediaState } from '~/components/Home/Main/TrendingCarousel';
import { getCredits, getMovieDetail, getTvShowDetail } from '~/services/tmdb/tmdb.server';
import { useMeasure } from '@react-hookz/web';

interface IPreviewModal {
  media: IMediaState | undefined;
}

const PreviewModal = ({ media }: IPreviewModal) => {
  const [credits, setCredits] = useState<ICredit>();
  const [details, setDetails] = useState<IMovieDetail | ITvShowDetail>();
  const [sizeWrapper, wrapperRef] = useMeasure<HTMLDivElement>();
  const [size, backgroundRef] = useMeasure<HTMLDivElement>();
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
  const url = details?.backdrop_path ? `${process.env.NEXT_PUBLIC_URL_IMAGES}${details?.backdrop_path}` : '';

  useEffect(() => {
    const getData = () => {
      if (media) {
        const creditsData = getCredits(media?.mediaType as any, media?.id as number);
        const detailsData =
          media?.mediaType === 'movie' ? getMovieDetail(media?.id as number) : getTvShowDetail(media?.id as number);

        Promise.all([creditsData, detailsData])
          .then(([credits, details]) => {
            setCredits(credits);
            setDetails(details);
          })
          .catch((error) => {
            console.log(error);
          });
      }
    };

    getData();
  }, [media]);
  const sizeContent = sizeWrapper && size && sizeWrapper.height - size.height;

  return (
    <div className="h-full w-full" ref={wrapperRef}>
      <div className="relative" ref={backgroundRef}>
        {url && (
          <NextUIImage
            as={Image}
            src={url}
            alt="Anh"
            width={0}
            height={0}
            radius="none"
            sizes="100vw"
            fallbackSrc="https://via.placeholder.com/300x200"
            className="h-auto w-full rounded-t-md"
            classNames={{
              wrapper: '!max-w-full',
            }}
          />
        )}

        <div className={`${styles.imageWrapper} absolute top-0 h-full w-full`}></div>
      </div>
      {details && sizeContent ? (
        <div
          className="min-h-[300px] overflow-y-auto scroll-smooth px-8 py-3 md:min-h-fit"
          style={
            {
              '--height-bg-movie': sizeContent,
              height: `${sizeContent + 'px'}`,
            } as CSSProperties
          }
        >
          <div className="flex flex-col ">
            <div>
              <span>{releaseYear}</span>

              {runtime ? (
                <span> ‧ {ConvertToHourAndMinutes(runtime)}</span>
              ) : (
                <>
                  <span> ‧ {episodes > 0 ? episodes + ' episodes' : episodes + ' episode'} </span>
                  <span> ‧ {seasons > 0 ? seasons + ' seasons' : seasons + ' season'}</span>
                </>
              )}
            </div>
            <p className="mt-3 text-sm">{details?.overview}</p>
            <div>
              <ul>
                <li>
                  <span className="text-sm text-[#777777]">Diễn viên: </span>
                  {someActors?.slice(0, 3).map((ele, idx) => (
                    <span key={idx} className="comma text-sm">
                      <Link href="#" className="hover:underline">
                        {ele}
                      </Link>
                    </span>
                  ))}
                </li>
                <li>
                  <span className="text-sm text-[#777777]">Thể loại: </span>
                  {someGenres?.slice(0, 3).map((ele, idx) => (
                    <span key={idx} className="comma text-sm">
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
      ) : (
        <div role="status" className="mt-5 max-w-sm animate-pulse">
          <div className="mb-4 h-14 w-full rounded-xl bg-gray-200 dark:bg-gray-700" />
          <div className="mb-2 h-12 w-full rounded-xl bg-gray-200 dark:bg-gray-700" />
          <div className="mb-2 h-12 w-full rounded-xl bg-gray-200 dark:bg-gray-700" />
          <span className="sr-only">Loading...</span>
        </div>
      )}
    </div>
  );
};

export default PreviewModal;
