module TryElmx where
import Html exposing (Html, Attribute, toElement)
import Html.Attributes
import Html.Events exposing (on, targetValue)
import String
import Effects exposing (Effects)
import Signal exposing (Address)
import Task
import StartApp


-- BOOTSTRAP

app : StartApp.App Model
app = StartApp.start
  { init = ([], Effects.none)
  , view = view
  , update = update
  , inputs =
    [ onInit
    , onCodeCompiled
    ]
  }

main : Signal Html
main =
  app.html

port tasks : Signal (Task.Task Effects.Never ())
port tasks =
  app.tasks


-- INTEROP

compileCodeMailbox : Signal.Mailbox (String, String)
compileCodeMailbox = Signal.mailbox ("", "")

port compileCode : Signal (String, String)
port compileCode = compileCodeMailbox.signal

port codeCompiled : Signal (String, String)
onCodeCompiled : Signal Action
onCodeCompiled =
  Signal.map (\(id, elm) -> CodeCompiled id elm) codeCompiled

port init : Signal (List (String, String))
onInit : Signal Action
onInit =
  Signal.map Init init


-- MODEL

type alias Test =
  { id: String
  , title : String
  , code : String
  , elm : String
  }

type alias Model = List Test


-- UPDATE

type Action = NoOp
  | Init (List (String, String))
  | Update Test String
  | CodeCompiled String String

compileTest : Test -> Effects Action
compileTest test =
  Signal.send compileCodeMailbox.address (test.id, test.code)
  |> Task.map (\_ -> NoOp)
  |> Effects.task

update : Action -> Model -> (Model, Effects Action)
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
          |> Effects.batch
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

    CodeCompiled id elm ->
      let
        newModel =
          List.map (\t -> if t.id == id then { t | elm = elm } else t) model
      in
        (newModel, Effects.none)

    NoOp ->
        (model, Effects.none)


-- VIEW

view : Address Action -> Model -> Html
view address model =
    Html.div [] ([
      Html.h1 [] [Html.text "
        Interactive ", Html.a [Html.Attributes.attribute "href" "https://github.com/pzavolinsky/elmx"] [Html.text "elmx"], Html.text "
        cheatsheet
      "]
      ] ++ List.map (viewModelItem address) model ++ [
    ])

viewModelItem : Address Action -> Test -> Html
viewModelItem address test =
  if test.code == "" && String.startsWith "=" test.title
  then viewTitle test
  else viewTest address test

viewTitle : Test -> Html
viewTitle test =
  Html.div [Html.Attributes.attribute "class" "test-title"] [
    Html.h2 [Html.Attributes.attribute "class" "title"] [Html.text (String.dropLeft 1 test.title)]
  ]

viewTest : Address Action -> Test -> Html
viewTest address test =
  let
    updateMessage =
      Signal.message address << Update test
    onInput =
      on "input" targetValue updateMessage
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
          , Html.textarea [onInput, Html.Attributes.attribute "rows" (testRows test.code)] [Html.text test.code]
        ]
        , Html.div [Html.Attributes.attribute "class" "col-sm-6"] [
          Html.div [Html.Attributes.attribute "class" "text-right"] [Html.small [] [Html.text "elm"]]
          , Html.textarea [Html.Attributes.attribute "readonly" "true", Html.Attributes.attribute "rows" (testRows test.elm)] [Html.text test.elm]
        ]
      ]
    ]

testRows : String -> String
testRows = toString << (+) 1 << List.length << String.split "\n"
