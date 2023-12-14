/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config) => {
    config.resolve.fallback = { ...config.resolve.fallback, tls: false, net: false, fs: false };
    return config;
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'image.tmdb.org',
        port: '',
        pathname: '**',
      },
      {
        protocol: 'https',
        hostname: 'themoviedb.org',
        port: '',
        pathname: '**',
      },
    ],
  },
};

module.exports = nextConfig;
