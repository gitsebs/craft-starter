// Gulp
var gulp = require('gulp')
var concat = require('gulp-concat')
var sourcemaps = require('gulp-sourcemaps')
var size = require('gulp-size')
var browserSync = require('browser-sync')
var proxyMiddleware = require('http-proxy-middleware')
var environments = require('gulp-environments');
var development = environments.development;
var production = environments.production;
var flatten = require('gulp-flatten');


//Styles
var postcss = require('gulp-postcss');
var autoprefixer = require('autoprefixer');
var scss = require('postcss-scss');
var precss = require('precss');
var cssnext = require("cssnext");
var cssnano = require('cssnano');

//JS
var webpackStream = require('webpack-stream');
var webpack = require('webpack')
var webpackDevMiddleware = require('webpack-dev-middleware')
var webpackConfig = require('./webpack.config')
var bundler = webpack(webpackConfig)

//Images
var imagemin = require('gulp-imagemin')
var pngquant = require('imagemin-pngquant');
var minifyCss = require('gulp-minify-css');


var config = require('./config')
var paths = config.paths

//Tasks

gulp.task('styles', function(){
  var processors = [
    autoprefixer(config.autoprefixerOptions),
    cssnext(),
    precss(),
    cssnano()
  ];
  return gulp.src(paths.input.scss)
    .pipe(development(sourcemaps.init()))
    .pipe(postcss(processors, {syntax: scss}))
    .pipe(concat('bundle.css'))
    .pipe(development(sourcemaps.write()))
    .pipe(gulp.dest(paths.output))
    .pipe(browserSync.stream())
    .pipe(size({
      showFiles: true
    }))
})

gulp.task('js', function() {
  return gulp.src(paths.input.js)
    .pipe(webpackStream(config.webpack))
    .pipe(gulp.dest(paths.output));
});

gulp.task('images', function () {
  gulp.src(paths.input.images)
    .pipe(imagemin({
      progressive: true,
      use: [pngquant()]
    }))
    .pipe(flatten())
    .pipe(gulp.dest(paths.output));
});

gulp.task('browser-sync', function() {
  var proxy = proxyMiddleware(['**', '!/assets/**'], {
      target: config.domain,
      autoRewrite: true,
      changeOrigin: true,
  })
  var webpackDev = webpackDevMiddleware(webpack(config.webpack), {
    publicPath: '/assets/',
    stats: { colors: true },
    watchOptions: {
        aggregateTimeout: 300,
        poll: true
    },
  })
  browserSync.init([paths.input.js],{
    server: {
        baseDir: "./",
        port: config.port,
        middleware: [ proxy, webpackDev ]
    },
    // tunnel: true,
    open: false,
    rewriteRules: [
      {
        match: config.domainRegEx,
        fn: function (match) {
          return 'localhost:'+config.port;
        }
      }
    ]
  })
})

gulp.task('default', ['browser-sync','styles','js','images'], function () {
  gulp.watch(paths.input.scss,['styles'])
  gulp.watch(paths.input.jsAll,['js']).on('change', browserSync.reload);
  gulp.watch(paths.input.html).on('change', browserSync.reload);
    // gulp.watch("./craft/templates/**/*", ['sass']);
})
