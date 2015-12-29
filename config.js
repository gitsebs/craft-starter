module.exports = {
  domain: 'http://craft.dev',
  domainRegEx: /craft\.dev/g,
  port: 3000,
  webpack: require('./webpack.config'),
  autoprefixerOptions: {
    browsers: ['last 2 versions', '> 5%', 'Firefox ESR']
  },
  paths: {
    input: {
      all: './craft/templates/**/*',
      html: './craft/templates/**/*.html',
      scss: './craft/templates/**/*.*css',
      js: './craft/templates/_index.js',
      jsAll: './craft/templates/**/*.js',
      images: [
        './craft/templates/**/*.png',
        './craft/templates/**/*.jpg',
        './craft/templates/**/*.jpeg',
        './craft/templates/**/*.svg',
        './craft/templates/**/*.gif',
      ],
    },
    output: './assets'
  }
}
