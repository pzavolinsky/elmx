"use strict"

var gulp        = require('gulp');
var babel       = require('gulp-babel');
var jasmine     = require('gulp-jasmine');

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
  return gulp.src('./spec/**/*spec.js')
    .pipe(jasmine({verbose: true, includeStackTrace: true}));
});
