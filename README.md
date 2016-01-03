elmx
====

Elmx is to Elm what React's JSX is to Javascript. That is, Elmx is a tiny compiler that takes an Elm program with embedded HTML and desugars the HTML into [elm-html](https://github.com/evancz/elm-html) syntax.

Installation
------------

```
npm install --save-dev elmx
```

Gulp integration
----------------

```
npm install --save-dev gulp-insert gulp-rename
```

`gulpfile.js`:

```javascript
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
```

`elm-package.json`:

```javascript
{
  ...
  "source-directories": [
    "src",
    "dist"
  ],
  ...
}

```

`src/Main.elmx`:

```elm
import Html exposing (Html)
--import Html.Attributes

main : Html
main = <span>Hello, elmx!</span>
```

in a terminal, type:
```shell
gulp watch
```

in another terminal:
```shell
elm reactor
```

finally browse [http://localhost:8000/dist/Main.elm](http://localhost:8000/dist/Main.elm)
