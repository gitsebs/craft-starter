var gulp        = require('gulp');
var browserSync = require('browser-sync');
var reload      = browserSync.reload;

gulp.task('browser-sync', function() {

    browserSync.init('./craft/templates/**/*', {
    proxy: "redefine.dev",
    notify: false,
    open: false
    });
});

gulp.task('default', ['browser-sync'], function () {
    // gulp.watch("./craft/templates/**/*", ['sass']);
});
