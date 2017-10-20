module Hello exposing (..)

import Html
import Html.Attributes


main : Html.Html ()
main =
    Html.node "span" [Html.Attributes.attribute "style" "color: green"] [Html.text "Hello, ", Html.node "b" [] [Html.text "elmx!"]]
