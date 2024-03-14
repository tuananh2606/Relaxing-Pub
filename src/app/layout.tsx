import { Inter } from 'next/font/google';
import './globals.css';
import { SessionProvider, ProviderNextUi, ProviderTopLoader } from '~/components/providers';
import { Metadata, Viewport } from 'next';
import { PWALifeCycle } from '~/components/pwa/PWALifecycle';

const inter = Inter({ subsets: ['latin', 'vietnamese'] });

const APP_NAME = 'FilmPub';
const APP_DEFAULT_TITLE = 'FilmPub';
const APP_TITLE_TEMPLATE = '%s - FilmPub';
const APP_DESCRIPTION = 'Xem phim online';

export const metadata: Metadata = {
  applicationName: APP_NAME,
  title: APP_DEFAULT_TITLE,
  description: APP_DESCRIPTION,
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'FilmPub',
    // startUpImage: [],
  },
  formatDetection: {
    telephone: false,
  },
  keywords: ['relaxing', 'movie', 'filmpub', 'watch movies', 'watch online', 'xem phim', 'Film Pub'],
  icons: [
    { url: '/icons/favicon-16x16.png', sizes: '16x16', type: 'image/png', rel: 'icon' },
    { url: '/icons/favicon-32x32.png', sizes: '32x32', type: 'image/png', rel: 'icon' },
    { url: '/icons/favicon-96x96.png', sizes: '96x96', type: 'image/png', rel: 'icon' },
  ],
  metadataBase: new URL('http://localhost:3000'),
  openGraph: {
    url: 'https://relaxing-pub.vercel.app',
    type: 'website',
    siteName: APP_NAME,
    title: {
      default: APP_DEFAULT_TITLE,
      template: APP_TITLE_TEMPLATE,
    },
    description: APP_DESCRIPTION,
  },
  twitter: {
    card: 'summary',
    title: {
      default: APP_DEFAULT_TITLE,
      template: APP_TITLE_TEMPLATE,
    },
    description: APP_DESCRIPTION,
  },
};

export const viewport: Viewport = {
  themeColor: '#221F1F',
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className}`}>
        <PWALifeCycle />
        <ProviderNextUi>
          <ProviderTopLoader>
            <SessionProvider>{children} </SessionProvider>
          </ProviderTopLoader>
        </ProviderNextUi>
      </body>
    </html>
  );
}
