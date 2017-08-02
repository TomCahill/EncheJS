'use strict';

const gulp = require('gulp');
const eslint = require('gulp-eslint');
const clean = require('gulp-clean');

const replace = require('gulp-replace');
const git = require('git-rev');

const Paths = {
  SOURCE: './src/',
  BUILD: './build/',
  BUILD_ASSETS: './build/assets/',
};
const Sources = {
  JS: [`${Paths.SOURCE}/**/*.js`],
  HTML: [`${Paths.SOURCE}/**/*.html`],
  CSS: [`${Paths.SOURCE}/**/*.css`],
  DATA: [`${Paths.SOURCE}/**/*.json`],
  IMAGES: [
    `${Paths.SOURCE}/**/*.svg`,
    `${Paths.SOURCE}/**/*.png`,
    `${Paths.SOURCE}/**/*.ico`,
  ],
  AUDIO: [`${Paths.SOURCE}/**/*.mp3`],
};

// JS
gulp.task('js', () => {
  return gulp.src(Sources.JS)
    .pipe(eslint())
    .pipe(eslint.format())
    .pipe(gulp.dest(Paths.BUILD_ASSETS));
});

// Static
gulp.task('html', function() {
  return git.short(hash => {
    let srcStream = gulp.src(Sources.HTML, {base: Paths.SOURCE});

    return srcStream
      .pipe(replace('\{\{GIT_HASH\}\}', hash))
      .pipe(replace('\{\{BUILD_DATE\}\}', new Date()))
      .pipe(gulp.dest(Paths.BUILD));
  });
});
gulp.task('css', () => {
  return gulp.src(Sources.CSS, {base: Paths.SOURCE})
    .pipe(gulp.dest(Paths.BUILD_ASSETS));
});
gulp.task('images', () => {
  return gulp.src(Sources.IMAGES, {base: Paths.SOURCE})
    .pipe(gulp.dest(Paths.BUILD_ASSETS));
});
gulp.task('audio', () => {
  return gulp.src(Sources.AUDIO, {base: Paths.SOURCE})
    .pipe(gulp.dest(Paths.BUILD_ASSETS));
});
gulp.task('static', () => {
  return gulp.start(['html', 'css', 'images', 'audio']);
});

// Data
gulp.task('data', () => {
  return gulp.src(Sources.DATA, {base: Paths.SOURCE})
    .pipe(gulp.dest(Paths.BUILD));
});

// Commands
gulp.task('watch', ['build'], function() {
  gulp.start('js');
  gulp.start('static');
  gulp.start('data');

  gulp.watch(Sources.JS, ['js']);
  gulp.watch(Sources.HTML, ['html']);
  gulp.watch(Sources.CSS, ['css']);
  gulp.watch(Sources.IMAGES, ['images']);
  gulp.watch(Sources.AUDIO, ['audio']);
  gulp.watch(Sources.DATA, ['data']);
});
gulp.task('clean', function() {
  return gulp.src(['build/*'], {read: false})
    .pipe(clean());
});
gulp.task('build', ['clean'], function() {
  return gulp.start(['js', 'static', 'data']);
});
