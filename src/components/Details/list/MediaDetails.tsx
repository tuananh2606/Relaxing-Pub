'use client';
import { CSSProperties, useEffect, useMemo, useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useMeasure, useMediaQuery } from '@react-hookz/web';
import { Image as NextUIImage } from '@nextui-org/image';
import { Button, Chip, Tabs, Tab, Card, CardBody } from '@nextui-org/react';

import { fetcher, ConvertToHourAndMinutes } from '~/lib/utils';
import { ColorPalette } from '~/app/api/colors-palette/route';
import { ICredit, IMediaList, IMovieDetail, ITvShowDetail } from '~/services/tmdb/tmdb.types';
import { TMDB } from '~/services/tmdb/utils.server';
import tinycolor from 'tinycolor2';
import Overview from '../item/Overview';
import MediaCarousel from './MediaCarousel';

interface IMediaDetails {
  data: {
    mediaDetails: IMovieDetail | ITvShowDetail | undefined;
    credits: ICredit | undefined;
    recommendations: IMediaList;
  };

  color: string | undefined;
}

interface IMediaBackground {
  backdropPath: string | undefined;
  backgroundColor: string | undefined;
}

export const MediaDetails = (props: IMediaDetails) => {
  const {
    data: { mediaDetails, credits, recommendations },
    color,
  } = props;
  const [colorPalette, setColorPalette] = useState<ColorPalette>();
  const titleOrig =
    (mediaDetails as IMovieDetail)?.original_title || (mediaDetails as ITvShowDetail)?.original_name || '';
  const titleEng = (mediaDetails as IMovieDetail)?.title || (mediaDetails as ITvShowDetail)?.name || '';
  const posterPath = TMDB?.posterUrl((mediaDetails as IMovieDetail | ITvShowDetail)?.poster_path!, 'w342');
  const backdropPath = TMDB?.backdropUrl((mediaDetails as IMovieDetail | ITvShowDetail)?.backdrop_path!, 'w1280');
  const runtime = (mediaDetails as IMovieDetail)?.runtime!;
  const episodes = (mediaDetails as ITvShowDetail)?.number_of_episodes!;
  const seasons = (mediaDetails as ITvShowDetail)?.number_of_seasons!;
  const releaseYear = new Date(
    (mediaDetails as IMovieDetail)?.release_date || (mediaDetails as ITvShowDetail)?.first_air_date || '',
  )
    .getFullYear()
    .toString();
  const directors =
    credits && credits.crew && credits.crew.filter(({ job }) => job === 'Director' || job === 'Executive Producer');
  const brightnessColor = (tinycolor(color).getBrightness() / 255) * 100;
  const backgroundColor = useMemo(() => {
    return brightnessColor > 30
      ? tinycolor(color)
          .darken(brightnessColor - 30)
          .toString()
      : tinycolor(color)
          .lighten(30 - brightnessColor)
          .toString();
  }, [brightnessColor, color]);
  console.log(mediaDetails);

  useEffect(() => {
    const getColorsPallete = async () => {
      if (color?.startsWith('#')) {
        const res = await fetcher({
          url: `/api/colors-palette?color=${backgroundColor!.replace('#', '')}`,
        });
        setColorPalette(res.color);
      }
    };
    getColorsPallete();
  }, [backgroundColor, color]);

  return (
    <main className="min-h-screen">
      <MediaBackgroundImage backdropPath={backdropPath} backgroundColor={backgroundColor} />
      <div
        className="relative top-[-50px] w-full sm:top-[-170px]"
        style={
          {
            '--theme-movie-brand': backgroundColor,
          } as CSSProperties
        }
      >
        <div className="!to-movie-brand-color relative left-0 top-0 flex h-full w-full flex-col bg-gradient-to-b !from-transparent from-[50px] to-[50px] sm:from-[170px] sm:to-[170px]">
          <div className="grid-areas-details-mobile md:grid-areas-details relative z-10 grid w-full grid-cols-[1fr_2fr] grid-rows-[1fr_auto_auto] gap-4 px-3 pb-16 pt-5 lg:grid-rows-[auto_1fr_auto]">
            <div className="grid-in-poster z-10 flex items-center justify-center">
              <NextUIImage
                src={posterPath}
                alt={`${titleEng} Poster`}
                classNames={{
                  wrapper: 'w-full md:w-3/4 lg:w-2/4',
                  img: 'aspect-[2/3] !min-h-[auto] !min-w-[auto]',
                }}
              />
            </div>
            <div className="grid-in-title z-10 flex flex-col">
              <span className="text-3xl font-bold md:text-4xl">{titleEng}</span>
              <span className="italic">{mediaDetails?.tagline}</span>
            </div>
            <div className="grid-in-info">
              <div className="item grid-in-info z-10 flex flex-col">
                <div className="flex flex-col gap-2 md:flex-row">
                  <div
                    className="w-fit rounded-2xl px-4 py-2"
                    style={
                      colorPalette && {
                        backgroundColor: colorPalette[300],
                        borderColor: colorPalette[500],
                      }
                    }
                  >
                    <span className="rounded-md bg-[#0b2541] px-2 py-1">TMDb</span>
                    <span className="ml-1">{mediaDetails?.vote_average}</span>
                  </div>
                  <div
                    className="w-fit rounded-2xl px-4 py-2"
                    style={
                      colorPalette && {
                        backgroundColor: colorPalette[300],
                        borderColor: colorPalette[500],
                      }
                    }
                  >
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
                </div>

                <div className="z-10 mt-2">
                  {mediaDetails?.genres?.map((ele, idx) => (
                    <Chip
                      key={idx}
                      size="md"
                      className="mr-2 mt-2"
                      style={
                        colorPalette && {
                          backgroundColor: colorPalette[300],
                          borderColor: colorPalette[500],
                        }
                      }
                    >
                      {ele.name}
                    </Chip>
                  ))}
                </div>
              </div>
            </div>
            <div className="grid-in-buttons z-10">
              <Button size="lg" className="w-full bg-[#ED213A] bg-gradient-to-r from-[#ED213A] to-[#93291E] md:w-auto">
                Watch Now
              </Button>
            </div>
          </div>
        </div>
        <div className="relative top-[-40px] z-10">
          <Tabs
            aria-label="Options"
            radius="none"
            variant="underlined"
            classNames={{
              tab: 'text-base font-semibold',
            }}
            className="w-full px-6"
          >
            <Tab key="overview" title="Overview" className="px-0">
              <Card className="m-3">
                <CardBody>
                  <Overview overview={mediaDetails!.overview} />
                </CardBody>
              </Card>
              <Card className="m-3 p-2">
                <CardBody className="gap-y-2">
                  <div className="flex ">
                    <h6 className="grow-0 basis-1/3">Original Title</h6>
                    <span className="basis-2/3 flex-wrap">{titleOrig}</span>
                  </div>
                  <div className="flex ">
                    <h6 className="grow-0 basis-1/3">Status</h6>
                    <span className="basis-2/3 flex-wrap">{mediaDetails?.status}</span>
                  </div>
                  {(mediaDetails as ITvShowDetail).type ? (
                    <div className="flex ">
                      <h6 className="grow-0 basis-1/3">Type</h6>
                      {(mediaDetails as ITvShowDetail).type}
                    </div>
                  ) : null}
                  {(mediaDetails as ITvShowDetail).created_by &&
                  (mediaDetails as ITvShowDetail).created_by!.length > 0 ? (
                    <div className="flex">
                      <h6 className="grow-0 basis-1/3">Creator</h6>
                      <div className="basis-2/3 flex-wrap">
                        {(mediaDetails as ITvShowDetail)?.created_by!.map((creator) => (
                          <span key={`director-item-${creator.id}`} className="comma text-foreground">
                            {creator.name}
                          </span>
                        ))}
                      </div>
                    </div>
                  ) : directors && directors.length > 0 ? (
                    <div className="flex">
                      <h6 className="grow-0 basis-1/3">Director</h6>
                      <div className="basis-2/3 flex-wrap">
                        {directors.map((director) => (
                          <span key={`director-item-${director.id}`} className="comma text-foreground">
                            {director.name}
                          </span>
                        ))}
                      </div>
                    </div>
                  ) : null}
                  {mediaDetails?.production_companies && mediaDetails?.production_companies.length > 0 ? (
                    <div className="flex">
                      <h6 className="grow-0 basis-1/3">Production Companies</h6>
                      <div className="basis-2/3">
                        {mediaDetails?.production_companies.map((company) => (
                          <span key={`production-companies-${company.id}`} className="comma text-foreground">
                            {company.name}
                          </span>
                        ))}
                      </div>
                    </div>
                  ) : null}
                  {(mediaDetails as IMovieDetail).budget! >= 0 ? (
                    <>
                      <div className="flex ">
                        <h6 className="grow-0 basis-1/3">Budget</h6>
                        <span>
                          {(mediaDetails as IMovieDetail)?.budget
                            ? `$${(mediaDetails as IMovieDetail)?.budget?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`
                            : '-'}
                        </span>
                      </div>
                      <div className="flex ">
                        <h6 className="grow-0 basis-1/3">Revenue</h6>
                        {(mediaDetails as IMovieDetail)?.revenue
                          ? `$${(mediaDetails as IMovieDetail)?.revenue?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`
                          : '-'}
                      </div>
                    </>
                  ) : null}
                </CardBody>
              </Card>
              <div className="m-3">
                <MediaCarousel title="Top Cast" items={credits?.cast} />
              </div>
              <div className="m-3">
                <MediaCarousel title="Recommendations" items={recommendations?.results} />
              </div>
            </Tab>
            <Tab key="cast" title="Cast">
              <Card>
                <CardBody>
                  Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo
                  consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat
                  nulla pariatur.
                </CardBody>
              </Card>
            </Tab>
            <Tab key="videos" title="Videos">
              <Card>
                <CardBody>
                  Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est
                  laborum.
                </CardBody>
              </Card>
            </Tab>
            <Tab key="recommendations" title="Recommendations">
              <Card>
                <CardBody>
                  Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est
                  laborum.
                </CardBody>
              </Card>
            </Tab>
          </Tabs>
        </div>
      </div>
    </main>
  );
};
export const MediaBackgroundImage = (props: IMediaBackground) => {
  const { backdropPath, backgroundColor } = props;
  const [size, backgroundRef] = useMeasure<HTMLDivElement>();
  const isSm = useMediaQuery('(max-width: 650px)', { initializeWithValue: false });
  const { scrollY } = useScroll();
  const backgroundImageHeight = isSm ? 100 : 300;
  const height = useTransform(scrollY, [0, 800 - backgroundImageHeight], [backgroundImageHeight, 800]);
  return (
    <div
      ref={backgroundRef}
      className="relative z-[2] aspect-[2/1] h-[var(--height-bg-movie)] w-[var(--width-bg-movie)] bg-fixed bg-right-top bg-no-repeat"
      style={
        {
          '--width-bg-movie': size?.width,
          '--height-bg-movie': size?.height,
          backgroundImage: `url("${backdropPath}")`,
          backgroundSize: `${size ? size?.width + 'px' : '100%'}`,
        } as CSSProperties
      }
    >
      <div
        className={`absolute bottom-0 h-full w-full`}
        style={{ backgroundImage: `linear-gradient(0deg, ${backgroundColor}, transparent 50%)` }}
      ></div>
      <motion.div
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          width: '100%',
          height,
          backgroundImage: `linear-gradient(to top, ${backgroundColor}, ${tinycolor(backgroundColor).setAlpha(0)})`,
        }}
      />
    </div>
  );
};
