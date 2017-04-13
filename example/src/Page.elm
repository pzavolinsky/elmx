import Html
import Html.Attributes exposing (title, align)
import List exposing (map)

main : Html.Html ()
main =
  let
    hello = Html.node "h1" [] [Html.text "Hello"]
    name = "Homer"
    lis = map (\s -> Html.node "li" [] [Html.text s]) [ "Bart", "List", "Maggie" ]
    commonAttrs =
      [ title "common title"
      , align "left"
      ]
  in
    Html.node "div" ([Html.Attributes.attribute "class" "container"] ++ commonAttrs) [
      hello
      , Html.text name, Html.text " is the father of:
      ", Html.node "ul" [] (lis)
    ]
