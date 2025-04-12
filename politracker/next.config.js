/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: { unoptimized: true },
  cache: false,
  webpack: (config) => {
    config.cache = false;
    return config;
  }
};

module.exports = nextConfig;