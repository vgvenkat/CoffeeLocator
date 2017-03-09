var gulp = require('gulp'),
    browserSync = require('browser-sync').create();
   
gulp.task('serve', function() {
    browserSync.init({
        server: {
            baseDir: "./"
        }
    });
    gulp.watch(["*.html","**/*.js","**/*.css"]).on('change', browserSync.reload);
});