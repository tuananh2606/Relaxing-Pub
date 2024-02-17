import { NextResponse, type NextRequest } from 'next/server';
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
  if (!title || !type) throw new NextResponse('Missing params', { status: 400 });
  try {
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
    return NextResponse.json(provider, {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    return NextResponse.json(
      { error: error },
      {
        status: 500,
      },
    );
  }
}
