require('dotenv').config();
module.exports = {
  srcDir: 'src/',
  plugins: [
    '@/plugins/material.js',
  ],
  head: {
    link: [
      {
        rel: 'stylesheet',
        href: 'https://fonts.googleapis.com/css?family=Roboto:400,500,700,400italic',
      },
      {
        rel: 'stylesheet',
        href: 'https://fonts.googleapis.com/icon?family=Material+Icons',
      },
      {
        rel: 'stylesheet',
        href: 'https://unpkg.com/vue-material/dist/vue-material.min.css',
      },
      {
        rel: 'stylesheet',
        href: 'https://unpkg.com/vue-material/dist/theme/default.css',
      },
      {
        rel: 'stylesheet',
        href: 'https://fonts.googleapis.com/css?family=Proxima+Nova&display=swap',
      },
    ],
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
    ],
  },
  css: [
    { src: '@/assets/styles/styles.scss', lang: 'scss'},
  ],
  build: {
    extend (config) {
      config.node = {
        fs: 'empty',
        child_process: 'empty',
        tls: 'empty',
        net: 'empty',
      };
    },
  },
  env: {
    // WEB3_PROVIDER: 'ws://some.local-or-remote.node:8546',
  },
  serverMiddleware: [
    // Will register file from project api directory to handle /api/* requires
    { path: '/api', handler: '@/api/rest.js' },
  ],
};
