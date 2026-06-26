import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export', // Conserve uniquement l'export statique
  images: {
    unoptimized: true,
  },
};

export default nextConfig;