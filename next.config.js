/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['utfs.io', '127.0.0.1', 'localhost', 'adzeelav.local'],
    unoptimized: true
  },
  experimental: {
    workerThreads: false,
    cpus: 1 // Limit to one CPU thread
  },
  eslint: {
    ignoreDuringBuilds: true
  }
};

module.exports = nextConfig;
