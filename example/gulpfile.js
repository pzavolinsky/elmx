"use strict"

var gulp   = require('gulp');
var insert = require('gulp-insert');
var rename = require('gulp-rename');
var elmx   = require('elmx');

var src = './src'

gulp.task('default', ['watch']);

gulp.task('build', function(cb) {
  return gulp.src(src + '/**/*.elmx')
    .pipe(insert.transform(elmx))
    .pipe(rename({extname: '.elm'}))
    .pipe(gulp.dest(src));
});

gulp.task('watch', ['build'], function() {
  return gulp.watch(src + '/**/*.elmx', ['build']);
});
