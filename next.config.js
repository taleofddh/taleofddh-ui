const path = require('path');

module.exports = {
  // Static export for Amplify static hosting (platform WEB). Output goes to ./out
  output: 'export',
  // Export each page as <path>/index.html. Amplify static hosting then serves
  // /gallery/ directly and redirects /gallery -> /gallery/ itself, so no
  // trailing-slash rewrite rules are needed (and none can loop).
  trailingSlash: true,
  reactStrictMode: true,
  sassOptions: {
    includePaths: [path.join(__dirname, 'styles')],
    loadPaths: [path.join(__dirname, 'styles'), __dirname],
  },
  env: {
    AWS_COOKIE_SECURED_FLAG: process.env.NEXT_PUBLIC_AWS_COOKIE_SECURED_FLAG,
    INDEX_FLAG: process.env.NEXT_PUBLIC_INDEX_FLAG,
    MEASUREMENT_FLAG: process.env.NEXT_PUBLIC_MEASUREMENT_FLAG
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
