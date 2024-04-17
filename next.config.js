/** @type {import('next').NextConfig} */
const withPWA = require('@ducanh2912/next-pwa').default({
  dest: 'public',
  workboxOptions: {
    disableDevLogs: true,
  },
});
const nextConfig = {
  webpack: (config) => {
    config.resolve.fallback = { ...config.resolve.fallback, tls: false, net: false, fs: false };
    return config;
  },
  images: {
    domains: ['image.tmdb.org', 'themoviedb.org'],
  },
};

module.exports = withPWA(nextConfig);
