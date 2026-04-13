import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // Enable React strict mode for better development experience
  reactStrictMode: true,
  compress: true,
  experimental: {
    inlineCss: true,
    optimizeCss: true,
    cssChunking: true,
  },
};

export default nextConfig;
