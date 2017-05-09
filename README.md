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

See [language-elmx](https://github.com/pzavolinsky/atom-language-elmx) for more details.

Emacs integration
-----------------

Sorry but currently there is no Emacs integration for `elmx`. You could check the [Gulp integration example](https://github.com/pzavolinsky/elmx/tree/master/example) for an alternative workflow that runs `elmx` independently of your editor.

On the flip side, if you are an Emacs fan then probably you are a hacker as well and could help with the integration. If you are up for it, check the [TextMate grammar file for elmx](https://github.com/pzavolinsky/atom-language-elmx/blob/master/grammars/elmx.cson). Also maybe you can hack (ehm, I mean *compose*) the existing linter and auto-complete Elm plugins like I did for the [language-elm Atom package](https://github.com/pzavolinsky/atom-language-elmx/blob/master/index.js).

If you want to contribute with this or any other `elmx` integration let me know in an issue and I'll put the link here.


Webpack integration
----------------
Use [elmx-webpack-preloader](https://www.npmjs.com/package/elmx-webpack-preloader).


Gulp integration
----------------
This integration uses Gulp to monitor changes in `.elmx` files and pipes the file contents through the `elmx` parser to produce `.elm` files.

See the full integration example in: [Gulp integration example](https://github.com/pzavolinsky/elmx/tree/master/example)


Library installation
--------------------

```
npm install --save-dev elmx
```

Then:

```javascript
const elmxParser = require('elmx');

const elmSource = elmxParser(elmxSource);
```


Syntax
------

In the same spirit of JSX, `elmx` syntax allows HTML tags embedded in the Elm code and uses `{` and `}` to interpolate Elm code into the HTML.

Check the [live cheatsheet](http://pzavolinsky.github.io/elmx) to play around with `elmx` directly in the browser

For example:

```elm
import Html
import Html.Attributes

main : Html.Html msg
main = <span>Hello, elmx!</span>
```

Translates to:

```elm
import Html
import Html.Attributes

main : Html.Html msg
main = Html.node "span" [] [Html.text "Hello, elmx!"]
```

Note that for `elmx` to work you need to import both `Html` and `Html.Attributes`.

#### Attributes

Attributes can be specified with:

```elm
showError : Html msg
showError = <span class="error">Oops!</span>
```

Or:

```elm
showError : String -> Html msg
showError errorClass = <span class={errorClass}>Oops!</span>
```

Or:

```elm
showError : Html.Attribute msg -> Html msg
showError errorAttr = <span {errorAttr}>Oops!</span>
```

Or:

```elm
import Html.Events exposing (onInput)
-- note the import above!

myInput : (String -> msg) -> Html msg
myInput tagFn = <input {onInput tagFn}/>
```

Or, for any of the following, `onClick`, `onDoubleClick`, `onMouseDown`, `onMouseUp`, `onMouseEnter`, `onMouseLeave`, `onMouseOver`, `onMouseOut`, `onInput`, `onCheck`, `onSubmit`, `onSubmitOptions`, `onBlur`, `onFocus`:

```elm
import Html.Events
-- note the import above!

myInput : (String -> msg) -> Html msg
myInput tagFn = <input onInput={tagFn} />

myButton : Html msg
myButton = <button onClick={Clicked}>Click Me!</button>
```

Or:

```elm
showError : List (Html.Attribute msg) -> Html msg
showError errorAttrs = <span {:errorAttrs}>Oops!</span>
```

(note the `:` in `{:errorAttrs}`)

#### Children

Elm expressions can be interpolated into HTML with:

```elm
addBorder : Html msg -> Html msg
addBorder s = <div class="border">{s}</div>
```

Unlike JSX, `elmx` requires a few extensions to accommodate for Elm's types, namely:
  - `{=text}`, where `text : String` (only required for element interpolation)
  - `{:list}`, where `list : List (Html msg)`

Elm strings can be interpolated with:

```elm
showMessage : String -> Html msg
showMessage s = <span>{=s}</span>
```

(note the `=` in `{=s}`)

Elm lists can be interpolated with:

```elm
makeList : List (Html msg) -> Html msg
makeList lis = <ul>{:lis}</ul>
```

(note the `:` in `{:lis}`)

#### Keyed children

Keyed elements are supported in two flavours: explicit and implicit. Explicit keyed elements require that you specify the `keyed` attribute in the list container (e.g. 'ul', 'ol', etc.), for example:

```elm
import Html.Keyed -- remember this!

keyedList : List (String, Html.Html msg) -> Html.Html msg
keyedList items = <ul keyed>{:items}</ul>
 ```

(note the `keyed` attribute in `<ul keyed>`, also note the `Html.Keyed` import)

In some limited cases, `elmx` can deduce that an element is keyed because it contains at least one child with a `key` attribute, when this happens, the `keyed` attribute becomes optional:

```elm
import Html.Keyed -- remember this!

keyedList : List (String, Html.Html msg) -> Html.Html msg
keyedList items =
   <ul>
     <li key="i1">If one child has a key the parent is keyed</li>
     {:items}
   </ul>
 ```

In both cases (explicit and implicit), whenever `elmx` finds a tag with a `key` attribute, it will generate a keyed tuple instead of the normal element. That is:

```elm
<li key={toString id}>{=name}</li>
```

Translates to:

```elm
(toString id, Html.node "li" [] [Html.text name])
```

#### Summary

All together:

```elm
import Html
import Html.Attributes exposing (title, align)
import List exposing (map)

main : Html.Html msg
main =
  let
    hello = <h1>Hello</h1>
    name = "Homer"
    lis = map (\s -> <li>{=s}</li>) [ "Bart", "List", "Maggie" ]
    commonAttrs =
      [ title "common title"
      , align "left"
      ]
  in
    <div class="container" {:commonAttrs}>
      {hello}
      {=name} is the father of:
      <ul>{:lis}</ul>
    </div>
```

Considerations, cool stuff, limitations and workarounds
-------------------------------------------------------

  * No runtime dependencies: `elmx` just takes Elm code embedded with HTML and produces vanilla `elm-html` code. This means that, other than suboptimal indentation (see below), once compiled into Elm, your original `.elmx` should look just like normal Elm code written in pure Elm.

  * Symmetric code generation: a major goal of `elmx` is to generate the Elm code preserving the line numbers of the original `.elmx` file. This makes finding and fixing issues in your `.elmx` very easy since the line numbers reported by the Elm compiler match the line numbers in your `.elmx`.

  * Non-compliant Elm indentation: because of the *symmetric code generation*, the Elm code produced does not comply with the Elm syntax guide.

  * Easy to opt-out: since almost every Elm program is a valid `elmx` program, you can mix-and-match `elmx` code with traditional `elm-html` code. Even more, if at any point you decide that you want to stop using `elmx`, you can always take the generated `.elm` files, fix the indentation and you are good to go.

  * Non-recursive interpolation: currently Elm code interpolated between `{` and `}` is not recursive (i.e. is a regular grammar not a CFG). This means that you cannot include curly brackets inside curly brackets. For example:

    ```elm
    -- BROKEN CODE
    <ul>{:map (\s -> <li>{=s}</li>) items}</ul>
    ```

    Note that the interpolated code includes curly brackets and this is not supported. Fortunately this limitation is trivial to overcome with a `let` binding:

    ```elm
    let
      lis = map (\s -> <li>{=s}</li>) items
    in
      <ul>{:lis}</ul>
    ```

  * Required whitespace around `<`: since `elmx` tries to parse HTML tags, valid Elm expressions that look like HTML tags will probably confuse the `elmx` parser. For this reason is best to include some whitespace around your `<` operators.

  * If you want to see more examples make sure you check the human-readable tests in the [features/](https://github.com/pzavolinsky/elmx/tree/master/features) directory. You can also try your own code in the [live cheatsheet](http://pzavolinsky.github.io/elmx).

  * If you find a bug, try the repro in the [live cheatsheet](http://pzavolinsky.github.io/elmx) and [report the issue!](https://github.com/pzavolinsky/elmx/issues)
