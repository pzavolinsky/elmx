Feature: keyed children

Scenario: Empty ul
  When processing <ul keyed></ul>
  Then the elm is Html.Keyed.ul [] []

Scenario: Empty ol
  When processing <ol keyed></ol>
  Then the elm is Html.Keyed.ol [] []

Scenario: Empty div
  When processing <div keyed></div>
  Then the elm is Html.Keyed.node "div" [] []

Scenario: Implicitly keyed ul by li with key attribute
  When processing <ul><li key="first"></ul>
  Then the elm is Html.Keyed.ul [] [("first", Html.li [] [])]

Scenario: li with {key}
  When processing <li key={key1}></li>
  Then the elm is (key1, Html.li [] [])

Scenario: li with "key"
  When processing <li key="key1"></li>
  Then the elm is ("key1", Html.li [] [])

Scenario: li in map
  When processing List.map (\i -> <li key={k i}>{t i}</li>) items
  Then the elm is List.map (\i -> (k i, Html.li [] [t i])) items
