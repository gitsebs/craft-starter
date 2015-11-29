var browserSync     = require('browser-sync').create();
var proxyMiddleware = require('http-proxy-middleware');
var webpack = require('webpack');
var webpackDevMiddleware = require('webpack-dev-middleware');
var webpackHotMiddleware = require('webpack-hot-middleware');

var webpackConfig = require('./webpack.config');
var bundler = webpack(webpackConfig);

var proxy = proxyMiddleware(['**', '!/assets/**', '!/__webpack_hmr'], {
    target: 'http://redefine.dev',
    autoRewrite: true,
    changeOrigin: true,
})

var webpackDev = webpackDevMiddleware(bundler, {
  publicPath: webpackConfig.output.publicPath,
  stats: { colors: true },
})

browserSync.init({
    server: {
        baseDir: "./",
        port: 3000,
        middleware: [
          proxy,
          webpackDev,
          webpackHotMiddleware(bundler),
        ]
    },
    open: false,
    files: [
      './craft/templates/**/*.*css',
      './craft/templates/**/*.html',
      './craft/templates/**/*.js',
    ]
});

console.log('listening on port 3000');
