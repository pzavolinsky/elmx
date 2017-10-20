module Keyed exposing (..)

import Html
import Html.Attributes
import Html.Keyed


starWars : List ( Int, String )
starWars =
    [ ( 1, "The Phantom Menace" )
    , ( 2, "Attack of the Clones" )
    , ( 3, "Revenge of the Sith" )
    , ( 4, "A New Hope" )
    , ( 5, "The Empire Strikes Back" )
    , ( 6, "Return of the Jedi" )
    , ( 7, "The Force Awakens" )
    ]


main : Html.Html ()
main =
    let
        items =
            starWars |> List.map (\( i, name ) -> (toString i, Html.li [] [Html.text name]))
    in
        Html.Keyed.ul [] (items)
