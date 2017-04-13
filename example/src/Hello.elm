module Main exposing (..)

import Html
import Html.Attributes


main : Html.Html ()
main =
    Html.node "node" "span" [ Html.Attributes.attribute "style" "color: green" ] [ Html.text "Hello, ", Html.node "node" "b" [] [ Html.text "elmx!" ] ]
