module Page exposing (..)

import Html
import Html.Attributes exposing (title, align)
import List exposing (map)


main : Html.Html ()
main =
    let
        hello =
            Html.h1 [] [Html.text "Hello"]

        name =
            "Homer"

        lis =
            [ "Bart", "List", "Maggie" ] |> map (\s -> Html.li [] [Html.text s])

        commonAttrs =
            [ title "common title"
            , align "left"
            ]
  in
      Html.div ([Html.Attributes.attribute "class" "container"] ++ commonAttrs) [
        hello
        , Html.p [] [Html.text name, Html.text " is the father of: "]
        , Html.ul [] (lis)
      ]
