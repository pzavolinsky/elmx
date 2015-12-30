"use strict"

var gulp = require('gulp');
var insert = require('gulp-insert');
var elmx = require('../dist/parser');

var src = './elmx/**/*.elm'

gulp.task('default', ['watch']);

gulp.task('build', function(cb) {
  return gulp.src(src)
    .pipe(insert.transform(elmx))
    .pipe(gulp.dest('./dist'));
});

gulp.task('watch', ['build'], function() {
  return gulp.watch(src, ['build']);
});
