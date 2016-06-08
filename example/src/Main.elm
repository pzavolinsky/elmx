import Html exposing (..)
import Html.App as Html
import Html.Attributes exposing (..)
import Html.Events exposing (onInput)

showError : List (Html.Attribute ()) -> Html ()
showError errorAttrs = Html.span errorAttrs [Html.text "Oops!"]


main =
  Html.beginnerProgram
    { model = model
    , view = view
    , update = update
    }



-- MODEL


type alias Model =
  { name : String
  , password : String
  , passwordAgain : String
  }


model : Model
model =
  Model "" "" ""



-- UPDATE


type Msg
    = Name String
    | Password String
    | PasswordAgain String


update : Msg -> Model -> Model
update action model =
  case action of
    Name name ->
      { model | name = name }

    Password password ->
      { model | password = password }

    PasswordAgain password ->
      { model | passwordAgain = password }



-- VIEW


view : Model -> Html Msg
view model =
  Html.div [] [
    Html.input [Html.Attributes.attribute "type" "text", Html.Attributes.attribute "placeholder" "Name", (onInput Name)] []
    , Html.input [Html.Attributes.attribute "type" "password", Html.Attributes.attribute "placeholder" "Password", (onInput Password)] []
    , Html.input [Html.Attributes.attribute "type" "password", Html.Attributes.attribute "placeholder" "Re-enter Password", (onInput PasswordAgain)] []
    , viewValidation model
  ]

viewValidation : Model -> Html msg
viewValidation model =
  let
    (color, message) =
      if model.password == model.passwordAgain then
        ("green", "OK")
      else
        ("red", "Passwords do not match!")
  in
    Html.div [Html.Attributes.attribute "style" ("color:" ++ color)] [Html.text message]
