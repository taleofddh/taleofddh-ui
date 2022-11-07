const path = require('path');

module.exports = {
  trailingSlash: false,
  reactStrictMode: true,
  sassOptions: {
    includePaths: [path.join(__dirname, 'styles')],
  },
  env: {
    AWS_COOKIE_SECURED_FLAG: process.env.NEXT_PUBLIC_AWS_COOKIE_SECURED_FLAG,
    INDEX_FLAG: process.env.NEXT_PUBLIC_INDEX_FLAG
  }
}
