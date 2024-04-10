import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next-nprogress-bar';
import Image from 'next/image';
import { Button, Image as NextUIImage, Skeleton } from '@nextui-org/react';

import { ConvertToHourAndMinutes } from '~/lib/utils';
import styles from './preview-modal.module.scss';
import { ICredit, IMovieDetail, ITvShowDetail } from '~/services/tmdb/tmdb.types';
import { IMediaState } from '~/components/pages/Home/Main/MainCarousel';
import { getCredits, getMovieDetail, getTvShowDetail } from '~/services/tmdb/tmdb.server';
import { TMDB } from '~/services/tmdb/utils.server';

interface IPreviewModal {
  media: IMediaState | undefined;
}

const PreviewModal = ({ media }: IPreviewModal) => {
  const [credits, setCredits] = useState<ICredit>();
  const [details, setDetails] = useState<IMovieDetail | ITvShowDetail>();
  const { cast } = credits ?? {};
  const { genres } = details ?? {};
  const router = useRouter();

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
  const backdropPath = details && TMDB.backdropUrl((details as IMovieDetail | ITvShowDetail).backdrop_path!, 'w1280');

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

  return (
    <div className="h-full w-full">
      <div className="relative min-h-[220px] md:min-h-[400px]">
        {backdropPath ? (
          <NextUIImage
            as={Image}
            src={backdropPath}
            alt="Anh"
            width={0}
            height={0}
            radius="none"
            sizes="100vw"
            className="h-auto w-full rounded-t-md"
            classNames={{
              wrapper: '!max-w-full',
            }}
          />
        ) : (
          <Skeleton className="mb-4 min-h-[400px]" />
        )}

        <div className="absolute bottom-[5%] left-[5%] z-30">
          <Button
            size="lg"
            radius="sm"
            className="flex min-w-fit items-center justify-center bg-secondary px-2 py-1 transition md:px-7"
            onPress={() => router.push(`${media?.mediaType}/${details?.id}`)}
          >
            <span>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 md:h-8 md:w-8" viewBox="0 0 24 25" fill="none">
                <path
                  d="M12 22.3137C6.47715 22.3137 2 17.8365 2 12.3137C2 6.79087 6.47715 2.31372 12 2.31372C17.5228 2.31372 22 6.79087 22 12.3137C22 17.8365 17.5228 22.3137 12 22.3137ZM12 20.3137C16.4183 20.3137 20 16.732 20 12.3137C20 7.89544 16.4183 4.31372 12 4.31372C7.58172 4.31372 4 7.89544 4 12.3137C4 16.732 7.58172 20.3137 12 20.3137ZM11 7.31372H13V9.31372H11V7.31372ZM11 11.3137H13V17.3137H11V11.3137Z"
                  fill="white"
                />
              </svg>
            </span>
            <span className="text-sm text-white md:text-lg">Thông tin khác</span>
          </Button>
        </div>

        <div className={`${styles.imageWrapper} absolute top-0 z-20 h-full w-full`}></div>
      </div>
      {details ? (
        <div className=" px-8 py-3">
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
            <p className="my-3 text-sm">{details?.overview}</p>
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
        <div role="status" className="w-full animate-pulse p-2">
          <Skeleton className="mb-2 h-4 w-60 rounded-xl" />
          <Skeleton className="mb-2 h-12 w-72 rounded-xl" />
          <Skeleton className="mb-2 h-4 w-60 rounded-xl" />
          <span className="sr-only">Loading...</span>
        </div>
      )}
    </div>
  );
};

export default PreviewModal;
