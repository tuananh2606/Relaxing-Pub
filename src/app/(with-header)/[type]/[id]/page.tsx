import { getCredits, getMovieDetail, getRecommendation, getTvShowDetail } from '~/services/tmdb/tmdb.server';
import { TMDB } from '~/services/tmdb/utils.server';
import Vibrant from 'node-vibrant';
import { MediaDetails } from '~/components/Details/list/MediaDetails';

const DetailsPage = async ({
  params,
  searchParams,
}: {
  params: { id: number; type: string };
  searchParams: { [key: string]: string | string[] | undefined };
}) => {
  const id = params.id as number;
  const type = params.type as string;
  const detailsData = type === 'movie' ? getMovieDetail(id as number) : getTvShowDetail(id as number);
  const creditsData = getCredits(type as 'movie' | 'tv', id as number);
  const recommendationsData = getRecommendation(type as 'movie' | 'tv', id as number, 1);

  const [credits, mediaDetails, recommendations] = await Promise.all([creditsData, detailsData, recommendationsData]);

  const data = {
    credits: credits,
    mediaDetails: mediaDetails,
    recommendations: recommendations,
  };
  const extractColorImageUrl =
    process.env.NODE_ENV === 'development'
      ? TMDB.backdropUrl(mediaDetails?.backdrop_path || mediaDetails?.poster_path || '', 'w300')
      : `https://corsproxy.io/?${encodeURIComponent(
          TMDB.backdropUrl(mediaDetails?.backdrop_path || mediaDetails?.poster_path || '', 'w300'),
        )}`;
  const fimg = await fetch(extractColorImageUrl);
  const fimgb = Buffer.from(await fimg.arrayBuffer());
  const palette =
    mediaDetails?.backdrop_path || mediaDetails?.poster_path ? await Vibrant.from(fimgb).getPalette() : undefined;
  const color = palette
    ? Object.values(palette).sort((a, b) =>
        a?.population === undefined || b?.population === undefined ? 0 : b.population - a.population,
      )[0]?.hex
    : undefined;

  return <MediaDetails data={data} color={color} />;
};

export default DetailsPage;
