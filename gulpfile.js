var gulp = require('gulp'),
    browserSync = require('browser-sync').create();

gulp.task('serve', function() {
    browserSync.init({
        server: {
            baseDir: "./"
        }
    });
    gulp.watch(["*.html","**/*.js"]).on('change', browserSync.reload);
});