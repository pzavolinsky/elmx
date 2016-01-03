"use strict"

var gulp = require('gulp');
var insert = require('gulp-insert');
var rename = require('gulp-rename');
var elmx = require('../dist/parser');

var src = './src/**/*.elmx'

gulp.task('default', ['watch']);

gulp.task('build', function(cb) {
  return gulp.src(src)
    .pipe(insert.transform(elmx))
    .pipe(rename({extname: '.elm'}))
    .pipe(gulp.dest('./dist'));
});

gulp.task('watch', ['build'], function() {
  return gulp.watch(src, ['build']);
});
