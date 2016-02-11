"use strict"

var gulp        = require('gulp');
var babel       = require('gulp-babel');
var jasmine     = require('gulp-jasmine');
var rename      = require('gulp-rename');
var uglify      = require('gulp-uglify');
var gutil       = require('gulp-util');
var minimist    = require('minimist');
var browserify  = require('browserify');
var source      = require('vinyl-source-stream');

var options = minimist(process.argv.slice(2), {});

gulp.task('default', ['uglify']);

gulp.task('build', function(cb) {
  return gulp.src('./src/*.js')
    .pipe(babel())
    .pipe(gulp.dest('./dist'));
});

gulp.task('bundle', ['build'], function () {
  return browserify({ entries: ['./dist/bundle.js'],  })
    .bundle()
    .on('error', gutil.log.bind(gutil, 'Browserify Error'))
    .pipe(source('elmx-bundle.js'))
    .pipe(gulp.dest('./cheatsheet'));
});

gulp.task('uglify', ['bundle'], function () {
  gulp.src('./cheatsheet/elmx-bundle.js')
    .pipe(uglify().on('error', gutil.log.bind(gutil, 'Uglify Error')))
    .pipe(rename({ suffix: '.min' }))
    .pipe(gulp.dest('./cheatsheet'));
});

gulp.task('watch', ['bundle'], function() {
  return gulp.watch('./src/*.js', ['bundle']);
});

gulp.task('test', ['build'], function () {
  var src = options.only || './spec/**/*spec.js';
  return gulp.src(src)
    .pipe(jasmine({verbose: true, includeStackTrace: true}));
});
