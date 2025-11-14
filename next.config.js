const path = require('path');

module.exports = {
  trailingSlash: false,
  reactStrictMode: true,
  sassOptions: {
    includePaths: [path.join(__dirname, 'styles')],
  },
  env: {
    AWS_COOKIE_SECURED_FLAG: process.env.NEXT_PUBLIC_AWS_COOKIE_SECURED_FLAG,
    INDEX_FLAG: process.env.NEXT_PUBLIC_INDEX_FLAG,
    MEASUREMENT_FLAG: process.env.NEXT_PUBLIC_MEASUREMENT_FLAG
  },
  eslint: {
    // Warning: This allows production builds to successfully complete even if
    // your project has ESLint errors.
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: process.env.NEXT_PUBLIC_MEDIA_DOMAIN,
        port: '',
      },
      {
        protocol: 'https',
        hostname: process.env.NEXT_PUBLIC_MEDIA_PROTECTED_DOMAIN,
        port: '',
      },
    ],
  },
  async redirects() {
    return [
      {
        source: '/gallery/photo/:path*',
        destination: '/albums/:path*',
        permanent: true,
      },
      {
        source: '/blog/article/:path*',
        destination: '/articles/:path*',
        permanent: true,
      },
      {
        source: '/links/travel-guides',
        destination: '/travel-guides',
        permanent: true,
      },
    ]
  },
}
