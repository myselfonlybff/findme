/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  basePath: '/findme',
  assetPrefix: '/findme/',
  images: {
    unoptimized: true,
  },
};

export default nextConfig;