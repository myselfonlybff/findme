import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export',
  // Ajoute ces deux lignes pour que GitHub Pages charge les scripts au bon endroit :
  basePath: '/findme',
  assetPrefix: '/findme/',
  images: {
    unoptimized: true,
  },
};

export default nextConfig;