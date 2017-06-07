const gulp = require('gulp');
const eslint = require('gulp-eslint');
const clean = require('gulp-clean');

gulp.task('js', function() {
  return gulp.src('src/**/*.js')
    .pipe(eslint())
    .pipe(eslint.format())
    // .pipe(eslint.failAfterError())
    .pipe(gulp.dest('build'));
});

gulp.task('scripts', function() {
  return gulp.start(['js']);
});

gulp.task('watch', ['clean'], function() {
  gulp.start('scripts');

  gulp.watch(['src/**/*.js'], ['js']);
});
gulp.task('clean', function() {
  return gulp.src(['build/*'], {read: false})
    .pipe(clean());
});
gulp.task('build', ['clean'], function() {
  return gulp.start('scripts');
});