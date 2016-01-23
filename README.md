elmx
====

`elmx` is to Elm what React's JSX is to Javascript. That is, Elmx is a tiny precompiler that takes an Elm program with embedded HTML and desugars the HTML into [elm-html](https://github.com/evancz/elm-html) syntax.

Atom integration
----------------

```
apm install language-elmx
```

If you also have the Elm Atom packages installed you will get additional functionality in your `.elmx` files:
 - If you have `language-elm`, you will get auto-complete.
 - If you have `linter-elm-make`, you will get `.elmx` to `.elm` compilation.

See [language-elmx](TODO) for more details.

Library installation
--------------------

```
npm install --save-dev elmx
```

Then:

```javascript
var elmxParser = require('elmx');

var elmSource = elmxParser(elmxSource);
```

Gulp integration
----------------
This integration uses Gulp to monitor changes in `.elmx` files and pipes the file contents through `elmx` to produce `.elm` files.

```
npm install --save-dev elmx gulp gulp-insert gulp-rename
```

`gulpfile.js`:

```javascript
"use strict"

var gulp = require('gulp');
var insert = require('gulp-insert');
var rename = require('gulp-rename');
var elmx = require('elmx');

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

Syntax
------

In the same spirit of JSX, `elmx` syntax allows HTML tags embedded in the Elm code and uses `{` and `}` to interpolate Elm code into the HTML.

For example:

```elm
main : Html
main = <span>Hello, elmx!</span>
```

Translates to:

```elm
main : Html
main = Html.span [] [Html.text "Hello, elmx!"]
```

Attributes can be specified with:

```elm
showError : Html
showError = <span class="error">Oops!</span>
```

Or:

```elm
showError : String -> Html
showError errorClass = <span class={errorClass}>Oops!</span>
```

Elm expressions can be interpolated into HTML with:

```elm
addBorder : Html -> Html
addBorder s = <div class="border">{s}</div>
```

Elm strings can be interpolated with:

```elm
showMessage : String -> Html
showMessage s = <span>{=s}</span>
```

(note the `=` in `{=s}`)

Elm lists can be interpolated with:

```elm
makeList : [Html] -> Html
makeList lis = <ul>{:lis}</ul>
```

(note the `:` in `{:lis}`)

Additionally, for `elmx` to work you need to import both `Html` and `Html.Attributes`:

```elm
import Html
import Html.Attributes
```

All together:

```elm
import Html
import Html.Attributes
import List exposing (map)

main : Html.Html
main =
  let
    title = <h1>Hello</h1>
    name = "Homer"
    lis = map (\s -> <li>{=s}</li>) [ "Bart", "List", "Maggie" ]
  in
    <div class="container">
      {title}
      {=name} is the father or:
      <ul>{:lis}</ul>
    </div>
```
