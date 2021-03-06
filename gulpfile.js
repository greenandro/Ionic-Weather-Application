'use strict';

var gulp = require('gulp');
var gutil = require('gulp-util');
var bower = require('bower');
var concat = require('gulp-concat');
var sass = require('gulp-sass');
var minifyCss = require('gulp-minify-css');
var rename = require('gulp-rename');
var sh = require('shelljs');
var jshint = require('gulp-jshint');
var uglify = require('gulp-uglify');
var exec = require('child_process').exec;

var paths = {
  sass: ['./scss/**/*.scss'],
  js: ['./www/**/*.js', '!./www/**/*.min.js']
};

gulp.task('default', ['sass', 'jshint']);

gulp.task('sass', ['compress'], function (done) {
  gulp.src('./scss/ionic.app.scss')
    .pipe(sass({
      errLogToConsole: true
    }))
    .pipe(gulp.dest('./www/css/'))
    .pipe(minifyCss({
      keepSpecialComments: 0
    }))
    .pipe(rename({extname: '.min.css'}))
    .pipe(gulp.dest('./www/css/'))
    .on('end', done);
});

gulp.task('jshint', function () {
  return gulp.src(['./www/components/**/*.js', './www/js/*.js', '!./www/js/custom.min.js'])
    .pipe(jshint('.jshintrc'))
    .pipe(jshint.reporter('jshint-stylish'));
});

gulp.task('compress', ['jshint'], function () {
  return gulp.src(["www/components/weatherlist/weatherlist.controller.js",
    "www/components/weatherlist/weatherlist.factory.js",
    "www/components/weatherlist/weatherlist.constant.js",
    "www/components/menu/menu.controller.js",
    "www/components/locations/locations.controller.js",
    "www/components/locations/locations.storage.factory.js",
    "www/components/locations/locations.factory.js",
    "www/components/about/about.controller.js"])
    .pipe(uglify())
    .pipe(concat('custom.min.js'))
    .pipe(gulp.dest('./www/js/'));
});

gulp.task('watch', function () {
  gulp.watch(paths.sass, ['sass']);
  gulp.watch(paths.js, ['compress'])
});

gulp.task('install', ['git-check'], function () {
  return bower.commands.install()
    .on('log', function (data) {
      gutil.log('bower', gutil.colors.cyan(data.id), data.message);
    });
});

gulp.task('git-check', function (done) {
  if (!sh.which('git')) {
    console.log(
      '  ' + gutil.colors.red('Git is not installed.'),
      '\n  Git, the version control system, is required to download Ionic.',
      '\n  Download git here:', gutil.colors.cyan('http://git-scm.com/downloads') + '.',
      '\n  Once git is installed, run \'' + gutil.colors.cyan('gulp install') + '\' again.'
    );
    process.exit(1);
  }
  done();
});

gulp.task('run.android', ['default'], function (cb) {
  exec('ionic run android', function (err, stdout, stderr) {
    console.log(stdout);
    console.log(stderr);
    cb(err);
  });
});

gulp.task('run.ios', ['default'], function (cb) {
  exec('ionic run ios', function (err, stdout, stderr) {
    console.log(stdout);
    console.log(stderr);
    cb(err);
  });
});

gulp.task('build.android', ['default'], function (cb) {
  exec('ionic build android', function (err, stdout, stderr) {
    console.log(stdout);
    console.log(stderr);
    cb(err);
  });
});

gulp.task('build.ios', ['default'], function (cb) {
  exec('ionic build ios', function (err, stdout, stderr) {
    console.log(stdout);
    console.log(stderr);
    cb(err);
  });
});