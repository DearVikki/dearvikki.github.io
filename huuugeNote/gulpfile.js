var gulp        = require('gulp');
var browserSync = require('browser-sync').create();
var less = require('gulp-less');
var path = require('path');

gulp.task('serve', ['less'], function() {
    browserSync.init({
        server: {
            baseDir: "./"
        }
    });
    gulp.watch('./resource/stylesheet/*.less', ['less']);
    gulp.watch('**/*.html').on('change', browserSync.reload);
    gulp.watch('**/*.js').on('change', browserSync.reload);
});

gulp.task('less', function () {
  return gulp.src('./resource/stylesheet/*.less')
    .pipe(less({
      paths: [ path.join(__dirname, 'resource', 'stylesheet') ]
    }))
    .pipe(gulp.dest('./resource/stylesheet'))
    .pipe(browserSync.stream());
});

gulp.task('dev', ['serve'])