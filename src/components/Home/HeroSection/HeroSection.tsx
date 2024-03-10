'use client';
import { useState } from 'react';
import { IAnimeInfo, IMovieInfo } from '@consumet/extensions';
import Link from 'next/link';
import { Button, Chip } from '@nextui-org/react';
import Image from 'next/image';
import { Image as NextUIImage } from '@nextui-org/react';

import { IVideos, ICredit, IMovieDetail, ITvShowDetail } from '~/services/tmdb/tmdb.types';
import { IMedia } from '~/types/media';
import { TMDB } from '~/services/tmdb/utils.server';
import { Dialog, DialogContent, DialogTrigger } from '~/components/elements/Dialog';
import SelectProvidersDialog from '~/components/dialog/SelectProvidersDialog';
import AspectRatio from '~/components/shared/AspectRatio';

interface IHeroSection {
  items: {
    videos: IVideos | undefined;
    media: IMedia | undefined;
    mediaInfo: IMovieInfo | IAnimeInfo | undefined;
    credits: ICredit | undefined;
    details: IMovieDetail | ITvShowDetail | undefined;
  };
}
const HeroSection = ({ items }: IHeroSection) => {
  const [isOpenModal, setIsOpenModal] = useState<boolean>(false);
  const [isOpenProviderModal, setShowProviderModal] = useState<boolean>(false);
  const { videos, media, mediaInfo, credits, details } = items;

  const { status } = details as IMovieDetail | ITvShowDetail;
  const id = (mediaInfo as IMovieInfo | IAnimeInfo)?.episodeId;
  const title = (details as IMovieDetail)?.title || (details as ITvShowDetail)?.name || '';
  const type = (media as IMedia)?.mediaType || '';
  const orgTitle = (details as IMovieDetail)?.original_title || (details as ITvShowDetail)?.original_name || '';
  const backdropPath = TMDB?.backdropUrl((details as IMovieDetail | ITvShowDetail)?.backdrop_path!);
  const genres = (details as IMovieDetail | ITvShowDetail)?.genres;

  const releaseYear = new Date(
    (details as IMovieDetail)?.release_date ?? ((details as ITvShowDetail)?.first_air_date || ''),
  ).getFullYear();
  const tmdbId = (details as IMovieDetail | ITvShowDetail)?.id;
  const openProviderModalHandle = () => {
    setShowProviderModal((prev) => !prev);
  };

  return (
    <div className="relative h-auto">
      <AspectRatio ratio={16 / 9}>
        <Image src={backdropPath} fill className="xl:!w-[100lvw]" priority alt={'Backdrop Image'} />
      </AspectRatio>

      <div className="absolute inset-0">
        <div className="relative h-full w-full">
          <Link className="absolute block h-full w-full md:hidden" href={`${type}/${details?.id}`} />
          <div className="absolute bottom-0 left-0 h-1/2 w-full md:h-full">
            <div className="flex h-full w-full">
              <div className="flex w-5/6 flex-col items-start justify-center gap-4 px-10 md:w-3/4 lg:w-2/3">
                <h1 className=" line-clamp-2 text-2xl font-bold drop-shadow-xl md:text-3xl ">{title}</h1>
                <div>
                  {genres!.map((ele, idx) => (
                    <Chip key={idx} size="sm" className="mr-2 cursor-pointer select-none">
                      {ele.name}
                    </Chip>
                  ))}
                </div>
                <div className="hidden md:block">
                  <p className="mt-[1.5vw] !line-clamp-2 animate-fade-bottom text-sm drop-shadow-xl md:text-lg">
                    {details?.overview}
                  </p>
                </div>
                <div className="hidden md:block">
                  <div className="actions-btn mt-[1.5vw] flex  items-center  ">
                    {(status === 'Released' || status === 'Ended' || status === 'Returning Series') && (
                      <Dialog open={isOpenProviderModal} onOpenChange={openProviderModalHandle}>
                        <DialogTrigger asChild>
                          <Button
                            size="lg"
                            radius="sm"
                            className="mr-3 flex items-center justify-center bg-white px-2 py-2 transition md:px-7"
                          >
                            <span>
                              <svg
                                className="h-6 w-6 md:h-8 md:w-8"
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 24 24"
                                fill="none"
                              >
                                <path
                                  d="M19.376 12.4158L8.77735 19.4816C8.54759 19.6348 8.23715 19.5727 8.08397 19.3429C8.02922 19.2608 8 19.1643 8 19.0656V4.93408C8 4.65794 8.22386 4.43408 8.5 4.43408C8.59871 4.43408 8.69522 4.4633 8.77735 4.51806L19.376 11.5838C19.6057 11.737 19.6678 12.0474 19.5146 12.2772C19.478 12.3321 19.4309 12.3792 19.376 12.4158Z"
                                  fill="black"
                                />
                              </svg>
                            </span>
                            <span className="ml-1 text-sm text-black md:text-lg">Play</span>
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <SelectProvidersDialog
                            id={id}
                            visible={isOpenProviderModal}
                            setIsOpenProviderModal={setShowProviderModal}
                            type={type}
                            title={title}
                            origTitle={orgTitle}
                            year={releaseYear}
                            tmdbId={tmdbId}
                            {...(type === 'tv' && { season: 1, episode: 1, isEnded: status === 'Ended' })}
                            {...(type === 'movie' && { isEnded: status === 'Released' })}
                          />
                        </DialogContent>
                      </Dialog>
                    )}

                    <Link href={`${type}/${details?.id}`}>
                      <Button
                        size="lg"
                        radius="sm"
                        className="flex min-w-fit items-center justify-center bg-secondary px-2 py-2 transition  md:px-7 "
                      >
                        <span>
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-6 w-6 md:h-8 md:w-8"
                            viewBox="0 0 24 25"
                            fill="none"
                          >
                            <path
                              d="M12 22.3137C6.47715 22.3137 2 17.8365 2 12.3137C2 6.79087 6.47715 2.31372 12 2.31372C17.5228 2.31372 22 6.79087 22 12.3137C22 17.8365 17.5228 22.3137 12 22.3137ZM12 20.3137C16.4183 20.3137 20 16.732 20 12.3137C20 7.89544 16.4183 4.31372 12 4.31372C7.58172 4.31372 4 7.89544 4 12.3137C4 16.732 7.58172 20.3137 12 20.3137ZM11 7.31372H13V9.31372H11V7.31372ZM11 11.3137H13V17.3137H11V11.3137Z"
                              fill="white"
                            />
                          </svg>
                        </span>
                        <span className="ml-1 text-sm text-white md:text-lg">Thông tin khác</span>
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default HeroSection;
