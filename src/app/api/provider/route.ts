import { type NextRequest } from 'next/server';
import getProviderList from '~/services/providers.server';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const type = searchParams.get('type');
  const title = searchParams.get('title');
  const orgTitle = searchParams.get('orgTitle');
  const year = searchParams.get('year');
  const season = searchParams.get('season');
  const aid = searchParams.get('aid');
  const animeType = searchParams.get('animeType');
  const isEnded = searchParams.get('isEnded');
  const tmdbId = searchParams.get('tmdbId');
  if (!title || !type) throw new Response('Missing params', { status: 400 });
  const provider = await getProviderList({
    type,
    title,
    orgTitle,
    year,
    season,
    animeId: Number(aid),
    animeType,
    isEnded: isEnded === 'true',
    tmdbId: Number(tmdbId),
  });
  if (provider && provider.length > 0)
    return Response.json(provider, {
      status: 200,
      headers: {
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      },
    });
}
