module.exports = {
  srcDir: 'src/',
  plugins: [
    '@/plugins/material.js'
  ],
  head: {
    link: [
      {
        rel: 'stylesheet',
        href: 'https://fonts.googleapis.com/css?family=Roboto:400,500,700,400italic'
      },
      {
        rel: 'stylesheet',
        href: 'https://fonts.googleapis.com/icon?family=Material+Icons'
      }
    ]
  }
}