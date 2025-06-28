/** @type {import('next').NextConfig} */
const nextConfig = {
  poweredByHeader: false,
  transpilePackages: ["mui-file-input"],
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "s3.ap-northeast-1.amazonaws.com",
      },
    ],
  },
  i18n: {
    locales: ["en", "ja"],
    defaultLocale: "ja",
  },
};

export default nextConfig;
