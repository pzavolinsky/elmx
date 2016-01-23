import Html
import Html.Attributes

main : Html.Html
main = Html.span [Html.Attributes.attribute "style" "color: green"] [Html.text "Hello, ", Html.b [] [Html.text "elmx!"]]
