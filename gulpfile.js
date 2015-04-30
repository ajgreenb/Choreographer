var gulp   = require('gulp');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');

gulp.task('build', function () {
  return gulp.src('choreographer.js')
    .pipe(uglify())
    .pipe(rename('choreographer.min.js'))
    .pipe(gulp.dest('./'));
});

gulp.task('default', [ 'build' ]);
