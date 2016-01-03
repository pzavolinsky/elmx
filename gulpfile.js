"use strict"

var gulp        = require('gulp');
var babel       = require('gulp-babel');
var jasmine     = require('gulp-jasmine');
var minimist    = require('minimist');

var options = minimist(process.argv.slice(2), {});

gulp.task('default', ['build']);

gulp.task('build', function(cb) {
  return gulp.src('./src/*.js')
    .pipe(babel())
    .pipe(gulp.dest('./dist'));
});

gulp.task('watch', ['build'], function() {
  return gulp.watch('./src/*.js', ['build']);
});

gulp.task('test', ['build'], function () {
  var src = options.only || './spec/**/*spec.js';
  return gulp.src(src)
    .pipe(jasmine({verbose: true, includeStackTrace: true}));
});
