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
var gulpWebpack = require('gulp-webpack');
var webpack = require('webpack')
var webpackDevMiddleware = require('webpack-dev-middleware')
var webpackConfig = require('./webpack.config')
var bundler = webpack(webpackConfig)

//Images
var imagemin = require('gulp-imagemin')
var pngquant = require('imagemin-pngquant');
var minifyCss = require('gulp-minify-css');


//Config
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


//Tasks

gulp.task('styles', function(){
  var processors = [
        autoprefixer(autoprefixerOptions),
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
    .pipe(size({
      showFiles: true
    }))
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
    .pipe(flatten())
    .pipe(gulp.dest(paths.output));
});

gulp.task('browser-sync', ['styles'], function() {
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
  gulp.watch(paths.input.scss,['styles'])
  gulp.watch(paths.input.html).on('change', browserSync.reload);
    // gulp.watch("./craft/templates/**/*", ['sass']);
})
