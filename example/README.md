elmx - Gulp Integration
=======================

This integration uses Gulp to monitor changes in `.elmx` files and pipes the file contents through the `elmx` parser to produce `.elm` files.

Installation
------------

```shell
git clone https://github.com/pzavolinsky/elmx.git
cd elmx/example
npm install
elm package install -y
```

Then skip to [Development workflow](#development-workflow).


Or, if you want to take the scenic route:

```shell
npm install --save-dev gulp gulp-insert gulp-rename elmx
elm package install -y evancz/elm-html
elm package install -y evancz/start-app
```

Edit `elm-package.json` and set:

```json
"source-directories": [
    "src"
]
```

Then create a `gulpfile.js`:

```javascript
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
```

Note that the `build` task pipes all the `.elmx` files in the `src` directory
through the `elmx` parser then renames the output to `.elm` and drops it right
next to the original `.elmx` file.

The `watch` task just watches for changes in `.elmx` files and runs `build`.

Hello, world!
-------------

A "*hello, world*" example could be `src/Hello.elmx`:

```elm
import Html
import Html.Attributes

main : Html.Html
main = <span style="color: green">Hello, <b>elmx!</b></span>
```

Development workflow
--------------------

In a terminal, run:
```shell
gulp
```

In another terminal run:
```shell
elm reactor
```

Then browse http://localhost:8000/src/Hello.elm
