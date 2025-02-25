/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ['mui-file-input'],
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'localhost-dev-newqbrick.s3-ap-northeast-1.amazonaws.com',
      },
      {
        protocol: 'https',
        hostname: 'localhost-newqbrick.s3-ap-northeast-1.amazonaws.com',
      },
      {
        protocol: 'https',
        hostname: 's3.ap-northeast-1.amazonaws.com',
      },
    ],
  },
};

export default nextConfig;
