"use strict"

var gulp   = require('gulp');
var insert = require('gulp-insert');
var rename = require('gulp-rename');
var elmx   = require('elmx');
var exec   = require('child_process').execSync;

var src = './src'

gulp.task('default', ['watch']);

gulp.task('build', function() {
  return gulp.src(src + '/**/*.elmx')
    .pipe(insert.transform(elmx))
    .pipe(rename({extname: '.elm'}))
    .pipe(gulp.dest(src));
});

gulp.task('make', ['build'], function() {
  exec('elm make src/TryElmx.elm --output elm.js', { stdio: [0,1,2] });
});

gulp.task('watch', ['make'], function() {
  return gulp.watch(src + '/**/*.elmx', ['build']);
});
