import Html
import Html.Attributes
import List exposing (map)

main : Html.Html
main =
  let
    title = Html.h1 [] [Html.text "Hello"]
    name = "Homer"
    lis = map (\s -> Html.li [] [Html.text s]) [ "Bart", "List", "Maggie" ]
  in
    Html.div [Html.Attributes.attribute "class" "container"] [
      title
      , Html.text name, Html.text " is the father or:
      ", Html.ul [] lis
    ]
