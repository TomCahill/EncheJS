const gulp = require('gulp');
const eslint = require('gulp-eslint');
const clean = require('gulp-clean');

gulp.task('html', function() {
  return gulp.src('src/**/*.html')
    .pipe(gulp.dest('build'));
});
gulp.task('css', function() {
  return gulp.src('src/**/*.css')
    .pipe(gulp.dest('build/assets'));
});

gulp.task('json', function() {
  return gulp.src('src/**/*.json')
    .pipe(gulp.dest('build'));
});
gulp.task('data', function() {
  return gulp.start(['json']);
});

gulp.task('png', function() {
  return gulp.src('src/**/*.png')
    .pipe(gulp.dest('build/assets'));
});
gulp.task('images', function() {
  return gulp.start(['png']);
});

gulp.task('js', function() {
  return gulp.src('src/**/*.js')
    .pipe(eslint())
    .pipe(eslint.format())
    .pipe(gulp.dest('build/assets'));
});
gulp.task('scripts', function() {
  return gulp.start(['js']);
});

// Commands
gulp.task('watch', ['clean'], function() {
  gulp.start('html');
  gulp.start('css');
  gulp.start('data');
  gulp.start('images');
  gulp.start('scripts');

  gulp.watch(['src/**/*.js'], ['js']);
  gulp.watch(['src/**/*.png'], ['images']);
  gulp.watch(['src/**/*.css'], ['css']);
  gulp.watch(['src/**/*.json'], ['data']);
  gulp.watch(['src/**/*.html'], ['html']);
});
gulp.task('clean', function() {
  return gulp.src(['build/*'], {read: false})
    .pipe(clean());
});
gulp.task('build', ['clean'], function() {
  gulp.start('html');
  gulp.start('css');
  gulp.start('data');
  gulp.start('images');
  return gulp.start('scripts');
});