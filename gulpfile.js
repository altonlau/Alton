var gulp = require('gulp');
var del = require('del');
var jshint = require('gulp-jshint');
var livereload = require('gulp-livereload');
var nodemon = require('gulp-nodemon');
var open = require('gulp-open');
var runSequence = require('run-sequence');
var sass = require('gulp-sass');
var wait = require('gulp-wait');

// Clean task ==================================================================
gulp.task('clean', function () {
  del('public/css/**/*.css');
});

// JSHint task =================================================================
gulp.task('jshint', function () {
  return gulp.src([
    'server/**/*.js',
    'public/**/*.js',
    '!public/bower_components/**/*.*'
  ])
    .pipe(jshint())
    .pipe(jshint.reporter('jshint-stylish'));
});

// Sass compiler task ==========================================================
gulp.task('build-css', function () {
  return gulp.src('public/scss/**/*.scss')
    .pipe(sass())
    .pipe(gulp.dest('public/css'));
});

// Node task ===================================================================
gulp.task('nodemon', function () {
  nodemon({
      script: 'server.js',
      env: {
        'NODE_ENV': 'development'
      }
    })
    .on('restart');
});

// Reload task =================================================================
gulp.task('reload', ['jshint', 'build-css'], function () {
  gulp.src('./')
    .pipe(wait(1000))
    .pipe(livereload());
});

// Watch task ==================================================================
gulp.task('watch', function () {
  livereload.listen();
  gulp.watch([
    'server/**/*.js',
    'public/**/*.{html,scss,js}'
  ], ['reload']);
});

// Open task ===================================================================
gulp.task('open', function () {
  return gulp.src('public/index.html')
    .pipe(wait(1000))
    .pipe(open({
      app: 'google chrome',
      uri: 'http://localhost:3000'
    }));
});

// Main task ===================================================================
gulp.task('default', function (done) {
  runSequence('clean', 'jshint', 'build-css', ['nodemon', 'watch'], 'open', done);
});
