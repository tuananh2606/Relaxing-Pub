import type { Metadata } from 'next';
import MediaNav from '~/components/elements/Nav/MediaNav';

const movieNav = [
  {
    name: 'Popular Movies',
    href: '/movie/popular',
  },
  {
    name: 'Top Rated Movies',
    href: '/movie/top-rated',
  },
  {
    name: 'Upcoming Movies',
    href: '/movie/upcoming',
  },
  {
    name: 'Now Playing',
    href: '/movie/now-playing',
  },
];

const tvNav = [
  {
    name: 'Popular TV',
    href: '/tv/popular',
  },
  {
    name: 'Top Rated TV',
    href: '/tv/top-rated',
  },
  {
    name: 'Airing Today',
    href: '/tv/airing-today',
  },
  {
    name: 'On The Air',
    href: '/tv/on-the-air',
  },
];

export default function RootLayout({
  params,
  children,
}: {
  params: { type: 'movie' | 'tv' };
  children: React.ReactNode;
}) {
  return (
    <>
      <MediaNav items={params.type === 'movie' ? movieNav : tvNav} />
      <div className="mt-14">{children}</div>
    </>
  );
}
