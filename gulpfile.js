var gulp = require('gulp');
var cache = require('gulp-cache');
var cssnano = require('gulp-cssnano');
var gulpIf = require('gulp-if');
var del = require('del');
var htmlmin = require('gulp-htmlmin');
var imagemin = require('gulp-imagemin');
var inject = require('gulp-inject');
var jshint = require('gulp-jshint');
var livereload = require('gulp-livereload');
var ngAnnotate = require('gulp-ng-annotate');
var nodemon = require('gulp-nodemon');
var open = require('gulp-open');
var runSequence = require('run-sequence');
var sass = require('gulp-sass');
var uglify = require('gulp-uglify');
var useref = require('gulp-useref');
var wait = require('gulp-wait');

//==============================================================================
// Development Tasks
//==============================================================================

// Clean task ==================================================================
gulp.task('clean:public', function () {
  del.sync('public/css/**/*.css');
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
gulp.task('build-sass:public', function () {
  return gulp.src('public/scss/**/*.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest('public/css'));
});

// Inject task =================================================================
gulp.task('inject:public', function () {
  return gulp.src('public/index.html')
    .pipe(inject(gulp.src('public/css/**/*.css', {
      read: false
    }), {
      relative: true
    }))
    .pipe(gulp.dest('public'));
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
gulp.task('reload-css', function (done) {
  runSequence('clean:public', 'build-sass:public', 'inject:public', 'refresh', done);
});

gulp.task('reload-js', function (done) {
  runSequence('jshint', 'refresh', done);
});

// Refresh page task ===========================================================
gulp.task('refresh', function () {
  gulp.src('./')
    .pipe(wait(1000))
    .pipe(livereload());
});

// Watch task ==================================================================
gulp.task('watch', function () {
  livereload.listen();
  gulp.watch('public/**/*.html', ['refresh']);
  gulp.watch('public/scss/**/*.scss', ['reload-css']);
  gulp.watch([
    'public/**/*.js',
    'server/**/*.js'
  ], ['reload-js']);
});

//==============================================================================
// Build Tasks
//==============================================================================

// Clean task ==================================================================
gulp.task('clean:dist', function () {
  del.sync('dist');
});

// HTML minify task ============================================================
gulp.task('build-views:dist', function () {
  return gulp.src('public/views/**/*.html')
    .pipe(htmlmin({
      collapseWhitespace: true
    }))
    .pipe(gulp.dest('dist/views'));
});

// Image minify task ===========================================================
gulp.task('build-images:dist', function () {
  return gulp.src('public/assets/**/*.+(png|jpg|jpeg|gif|svg)')
    .pipe(cache(imagemin()))
    .pipe(gulp.dest('dist/images'));
});

// Copy font task =============================================================
gulp.task('build-fonts:dist', function () {
  return gulp.src('public/bower_components/font-awesome/fonts/*')
    .pipe(gulp.dest('dist/fonts'))
});

// Javascript minify task ======================================================
gulp.task('build:dist', function () {
  return gulp.src('public/*.html')
    .pipe(useref())
    .pipe(gulpIf('*.js', ngAnnotate()))
    .pipe(gulpIf('*.js', uglify()))
    .pipe(gulpIf('*.css', cssnano()))
    .pipe(gulp.dest('dist'));
});

//==============================================================================
// Runnable Tasks
//==============================================================================

gulp.task('default', function (done) {
  runSequence('clean:public', ['jshint', 'build-sass:public'], 'inject:public', ['nodemon', 'watch'], done);
});

gulp.task('browser', ['default'], function (done) {
  return gulp.src('public/index.html')
    .pipe(wait(1000))
    .pipe(open({
      app: 'google chrome',
      uri: 'http://localhost:3000'
    }));
});

gulp.task('build', function (done) {
  runSequence('clean:dist', 'build-sass:public', 'inject:public', ['build:dist', 'build-views:dist', 'build-images:dist', 'build-fonts:dist'], done);
})
