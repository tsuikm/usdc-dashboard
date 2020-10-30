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
        href: 'https://fonts.googleapis.com/css?family=Proxima+Nova:400,500,700&display=swap',
      },
    ],
  },
};
