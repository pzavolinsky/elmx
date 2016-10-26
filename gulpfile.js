"use strict"

var gulp        = require('gulp');
var rename      = require('gulp-rename');
var uglify      = require('gulp-uglify');
var gutil       = require('gulp-util');
var minimist    = require('minimist');
var browserify  = require('browserify');
var source      = require('vinyl-source-stream');
var execSync    = require('child_process').execSync;
var del         = require('del');

function exec(command, env) {
  execSync(command, {
    stdio: [process.stdin, process.stdout, process.stderr],
    env: env
  });
}

var options = minimist(process.argv.slice(2), {});

gulp.task('default', ['uglify']);

gulp.task('clean', function() {
  return del(['./dist/*.js', './dist/steps/*.js']);
});

gulp.task('build', ['clean'], function() {
  return exec('./node_modules/.bin/tsc --pretty');
});
gulp.task('watch', function() {
  return exec('./node_modules/.bin/tsc --pretty -w');
});

gulp.task('test', ['build'], function () {
  return exec('./node_modules/.bin/cucumberjs -S -f progress -t ~@ignore');
});

gulp.task('copy-bundle', function () {
  gulp.src('./src/bundle.js')
  .pipe(gulp.dest('./dist'));
});

gulp.task('bundle', ['build', 'test', 'copy-bundle'], function () {
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
