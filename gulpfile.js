// Gulp
var gulp = require('gulp')
var concat = require('gulp-concat')
var sourcemaps = require('gulp-sourcemaps')
var size = require('gulp-size')
var browserSync = require('browser-sync')
var proxyMiddleware = require('http-proxy-middleware')
var environments = require('gulp-environments');

var flatten = require('gulp-flatten');
var plumber = require('gulp-plumber');
var config = require('./config')

var logger = require('./utils/log')

var paths = config.paths
var development = environments.development;
var production = environments.production;

//Styles
var postcss = require('gulp-postcss');
var autoprefixer = require('autoprefixer');
var scss = require('postcss-scss');
var precss = require('precss');
var cssnext = require("postcss-cssnext");
var cssnano = require('cssnano');
var rucksack = require('rucksack-css')
var stylelint = require("stylelint")
var short = require('postcss-short')
var reporter = require('postcss-reporter')
var atImport = require("postcss-import")

//JS
var webpackStream = require('webpack-stream');
var webpack = require('webpack')
var webpackDevMiddleware = require('webpack-dev-middleware')
var webpackConfig = require('./webpack.config')
var bundler = webpack(webpackConfig)
var eslint = require('gulp-eslint');

//Images
var imagemin = require('gulp-imagemin')
var pngquant = require('imagemin-pngquant');




// Linting
gulp.task('scripts-lint', function() {
  return gulp.src(config.paths.input.jsAll)
  .pipe(eslint({
    extends: "airbnb/base"
  }))
  .pipe(eslint.formatEach('compact', process.stderr));
})
gulp.task("lint-styles", function() {
    return gulp.src(config.paths.input.scss)
    .pipe(postcss([
        stylelint(),
        reporter({
            clearMessages: true,
        }),
    ]));
});


gulp.task('scripts',['scripts-lint'], function() {
  return gulp.src('')
    .pipe(webpackStream(config.webpack,webpack,function(){}))
    .pipe(gulp.dest(paths.output))
});

gulp.task('styles', ['lint-styles'], function(){
  var processors = [
    atImport({skipDuplicates:false}),
    autoprefixer(config.autoprefixerOptions),
    short(),
    cssnext(),
    precss(),
    cssnano(),
    rucksack()
  ];
  return gulp.src(paths.input.scss)
    .pipe(plumber())
    .pipe(development(sourcemaps.init()))
    .pipe(postcss(processors, {syntax: scss}))
    .pipe(concat('bundle.css'))
    .pipe(development(sourcemaps.write()))
    .pipe(gulp.dest(paths.output))
    .pipe(browserSync.stream())
})

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
  var proxy = proxyMiddleware(['**', '!/assets/**','!/__webpack_hmr'], {
      target: config.domain,
      autoRewrite: true,
      changeOrigin: true,
      logLevel: 'error',
      onError: function(err, req, res){
        logger.error('proxy',err.code)
         res.writeHead(500, {
              'Content-Type': 'text/json'
          });
          res.end(JSON.stringify(err));
      }
  })
  var webpackDev = webpackDevMiddleware(webpack(config.webpack), {
    publicPath: '/assets/',
    quiet: true,
    noInfo: true,
    watchOptions: {
        aggregateTimeout: 300,
        poll: true
    },
  })
  browserSync.init([paths.input.js],{
    server: {
        baseDir: './',
        port: config.port,
        middleware: [ proxy, webpackDev ]
    },
    open: false,
    reloadOnRestart: false,
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

gulp.task('default', ['browser-sync','styles','images'], function () {
  gulp.watch(paths.input.scss,['styles'])
  gulp.watch(paths.input.jsAll,['scripts-lint']).on('change', browserSync.reload);
  gulp.watch(paths.input.html).on('change', browserSync.reload);
  // gutil.log('stuff happened', 'Really it did', gutil.colors.magenta('123'));
  // gutil.beep();
})

gulp.task('build', ['styles','scripts','images'])
