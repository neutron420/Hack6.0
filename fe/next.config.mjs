/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config) => {
    config.watchOptions = {
      poll: 1000, // Check for file changes every second
      aggregateTimeout: 300,
    };
    return config;
  },
};

export default nextConfig;