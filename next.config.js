const path = require('path');

module.exports = {
  // Static export for Amplify static hosting (platform WEB). Output goes to ./out
  output: 'export',
  // Keep URLs without a trailing slash (/gallery -> gallery.html).
  // Amplify redirect rule "/<*>/" -> "/<*>" (301) handles URLs typed with a slash.
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
    // No image optimization server in a static export
    unoptimized: true,
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
  // redirects() is not supported by static export. Moved to an Amplify redirect rule:
  //   /blog/article/<*>  ->  /articles/<*>  (301)
}
