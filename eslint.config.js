const nextCoreWebVitals = require('eslint-config-next/core-web-vitals');

module.exports = [
  ...nextCoreWebVitals,
  {
    ignores: ['.next/**', 'out/**', 'node_modules/**'],
  },
  {
    rules: {
      '@next/next/no-document-import-in-page': 'off',
    },
  },
];
