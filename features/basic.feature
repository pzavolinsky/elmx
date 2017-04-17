Feature: basic translations

Scenario: Ignores normal Elm
  When processing code
  Then the elm is code

Scenario: Understands <<
  When processing List.head << List.map (\\x -> x + 1)
  Then the elm is List.head << List.map (\\x -> x + 1)

Scenario: Understands >>
  When processing List.map (\\x -> x + 1) >> List.head
  Then the elm is List.map (\\x -> x + 1) >> List.head

Scenario: Understands <|
  When processing print <| List.head <| l
  Then the elm is print <| List.head <| l

Scenario: Understands |>
  When processing l |> List.head
  Then the elm is l |> List.head

@ignore
Scenario: Understands empty spans
  When processing <span />-after
  Then the elm is Html.node "span" [] []-after
