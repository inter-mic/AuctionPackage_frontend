/** @type {import('next').NextConfig} */
const nextConfig = {
  poweredByHeader: false,
  transpilePackages: ["mui-file-input"],
  // Material-UIのCSSクラス名の一貫性を保つ
  compiler: {
    emotion: true,
  },
  // CSSの最適化を無効化（クラス名の一貫性のため）
  swcMinify: false,
  // Material-UIのCSS最適化を無効化
  experimental: {
    optimizeCss: false,
  },
  // 環境変数の設定
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/',
    NEXT_PUBLIC_MEMBER_API_URL: process.env.NEXT_PUBLIC_MEMBER_API_URL || 'http://localhost:3001/member/',
    NEXT_PUBLIC_ADMIN_API_URL: process.env.NEXT_PUBLIC_ADMIN_API_URL || 'http://localhost:3001/admin/',
    NEXT_PUBLIC_PUBLIC_API_URL: process.env.NEXT_PUBLIC_PUBLIC_API_URL || 'http://localhost:3001/public/',
  },
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
  // HTTPSリダイレクトの設定
  async redirects() {
    return [
      {
        source: '/(.*)',
        has: [
          {
            type: 'header',
            key: 'x-forwarded-proto',
            value: 'http',
          },
        ],
        destination: 'https://:path*',
        permanent: true,
      },
    ];
  },
  // セキュリティヘッダーの設定
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'no-store, no-cache, must-revalidate, proxy-revalidate',
          },
          {
            key: 'Pragma',
            value: 'no-cache',
          },
          {
            key: 'Expires',
            value: '0',
          },
        ],
      },
    ];
  },
};

export default nextConfig;
