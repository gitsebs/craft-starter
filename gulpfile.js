// Gulp
var gulp = require('gulp')
var sass = require('gulp-sass')
var concat = require('gulp-concat')
var sourcemaps = require('gulp-sourcemaps')
var autoprefixer = require('gulp-autoprefixer')
var imagemin = require('gulp-imagemin'),
    pngquant = require('imagemin-pngquant');
    var minifyCss = require('gulp-minify-css');
    var gulpWebpack = require('gulp-webpack');
var browserSync = require('browser-sync')
var proxyMiddleware = require('http-proxy-middleware')
var webpack = require('webpack')
var webpackDevMiddleware = require('webpack-dev-middleware')
var webpackConfig = require('./webpack.config')
var bundler = webpack(webpackConfig)

var paths = {
  input: {
    all: './craft/templates/**/*',
    html: './craft/templates/**/*.html',
    scss: './craft/templates/**/*.*css',
    js: './craft/templates/_index.js',
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

var autoprefixerOptions = {
  browsers: ['last 2 versions', '> 5%', 'Firefox ESR']
};

var sassOptions = {
  errLogToConsole: true,
  outputStyle: 'compressed'
};

gulp.task('sass', function(){
  return gulp.src(paths.input.scss)
    .pipe(sourcemaps.init())
    .pipe(sass().on('error', sass.logError))
    .pipe(concat('bundle.css'))
    .pipe(autoprefixer(autoprefixerOptions))
    .pipe(minifyCss({compatibility: 'ie8'}))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest(paths.output))
    .pipe(browserSync.stream())
})

gulp.task('js', function() {
  return gulp.src(paths.input.js)
    .pipe(gulpWebpack(require('./webpack.config.js'), webpack))
    .pipe(gulp.dest('dist/'));
});

gulp.task('image', function () {
  gulp.src(paths.input.images)
    .pipe(imagemin({
      progressive: true,
      use: [pngquant()]
    }))
    .pipe(gulp.dest(paths.output));
});

gulp.task('browser-sync', ['sass'], function() {
  var proxy = proxyMiddleware(['**', '!/assets/**'], {
      target: 'http://craft.dev',
      autoRewrite: true,
      changeOrigin: true,
  })
  var webpackDev = webpackDevMiddleware(bundler, {
    publicPath: webpackConfig.output.publicPath,
    stats: { colors: true },
    watchOptions: {
        aggregateTimeout: 300,
        poll: true
    },
  })
  browserSync.init([paths.input.js],{
    server: {
        baseDir: "./",
        port: 3000,
        middleware: [ proxy, webpackDev ]
    },
    // tunnel: true,
    open: false,
    rewriteRules: [
      {
        match: /craft\.dev/g,
        fn: function (match) {
          return 'localhost:3000';
        }
      }
    ]
  })


})

gulp.task('dev', ['browser-sync'], function () {
  gulp.watch(paths.input.scss,['sass'])
  gulp.watch(paths.input.html).on('change', browserSync.reload);
    // gulp.watch("./craft/templates/**/*", ['sass']);
})
