port module Main exposing (..)
import Html exposing (Html)
import Html.App as Html
import Html.Attributes
import Html.Events
import String

-- BOOTSTRAP
{-
  , inputs =
    [ onInit
    , onCodeCompiled
    ]
  }
-}

main : Program Never
main =
  Html.program
    { init = ([], Cmd.none)
    , update = update
    , view = view
    , subscriptions = subscriptions
    }

type Msg = NoOp
  | Init (List (String, String))
  | Update Test String
  | CodeCompiled (String, String)


-- INTEROP

port compileCode : (String, String) -> Cmd msg

port codeCompiled : ((String, String) -> msg) -> Sub msg

port init : (List (String, String) -> msg) -> Sub msg

subscriptions : Model -> Sub Msg
subscriptions _ = Sub.batch
  [ codeCompiled CodeCompiled
  , init Init
  ]

-- MODEL

type alias Test =
  { id: String
  , title : String
  , code : String
  , elm : String
  }

type alias Model = List Test


-- UPDATE

compileTest : Test -> Cmd Msg
compileTest test = compileCode (test.id, test.code)

update : Msg -> Model -> (Model, Cmd Msg)
update action model =
  case action of
    Init items ->
      let
        toTest i (title, code) =
          { id = toString i
          , title = title
          , code = code
          , elm = ""
          }
        newModel =
          List.indexedMap toTest items
        eff =
          List.map compileTest newModel
          |> Cmd.batch
      in
        (newModel, eff)

    Update test code ->
      let
        newTest =
          { test | code = code }
        newModel =
          List.map (\t -> if t == test then newTest else t) model
        eff =
          compileTest newTest
      in
        (newModel, eff)

    CodeCompiled (id, elm) ->
      let
        newModel =
          List.map (\t -> if t.id == id then { t | elm = elm } else t) model
      in
        (newModel, Cmd.none)

    NoOp ->
        (model, Cmd.none)

-- VIEW

view : Model -> Html Msg
view model =
  Html.div [] ([
    Html.h1 [] [Html.text "
      Interactive ", Html.a [Html.Attributes.attribute "href" "https://github.com/pzavolinsky/elmx"] [Html.text "elmx"], Html.text "
      cheatsheet
    "]
    ] ++ List.map viewModelItem model ++ [
  ])

viewModelItem : Test -> Html Msg
viewModelItem test =
  if test.code == "" && String.startsWith "=" test.title
  then viewTitle test
  else viewTest test

viewTitle : Test -> Html Msg
viewTitle test =
  Html.div [Html.Attributes.attribute "class" "test-title"] [
    Html.h2 [Html.Attributes.attribute "class" "title"] [Html.text (String.dropLeft 1 test.title)]
  ]

viewTest : Test -> Html Msg
viewTest test =
  let
    title =
      if test.title == ""
      then Html.span [] []
      else Html.h3 [Html.Attributes.attribute "class" "title bg-primary"] [Html.text test.title]
  in
    Html.div [Html.Attributes.attribute "class" "test"] [
      title
      , Html.div [Html.Attributes.attribute "class" "row"] [
        Html.div [Html.Attributes.attribute "class" "col-sm-6"] [
          Html.div [Html.Attributes.attribute "class" "text-right"] [Html.small [] [Html.text "elmx"]]
          , Html.textarea [Html.Events.onInput (Update test), Html.Attributes.attribute "rows" (testRows test.code)] [Html.text test.code]
        ]
        , Html.div [Html.Attributes.attribute "class" "col-sm-6"] [
          Html.div [Html.Attributes.attribute "class" "text-right"] [Html.small [] [Html.text "elm"]]
          , Html.textarea [Html.Attributes.attribute "readonly" "true", Html.Attributes.attribute "rows" (testRows test.elm)] [Html.text test.elm]
        ]
      ]
    ]

testRows : String -> String
testRows = toString << (+) 1 << List.length << String.split "\n"
