Feature: children interpolation

Scenario: "text string"
  When processing <span>text string</span>
  Then the elm is Html.node "span" [] [Html.text "text string"]

Scenario: 'a "quoted" string'
  When processing <span>a "quoted" string</span>
  Then the elm is Html.node "span" [] [Html.text "a \"quoted\" string"]

Scenario: {=textVariable}
  When processing <span>{=textVariable}</span>
  Then the elm is Html.node "span" [] [Html.text textVariable]

Scenario: {child}
  When processing <ul>{child}</ul>
  Then the elm is Html.node "ul" [] [child]

Scenario: {:children}
  When processing <ul>{:children}</ul>
  Then the elm is Html.node "ul" [] (children)

Scenario: Child tag
  When processing <span><img/></span>
  Then the elm is Html.node "span" [] [Html.node "img" [] []]

Scenario: Embedded tags
  When processing <span>Hi {=name}, <i>welcome!</i></span>
  Then the elm is Html.node "span" [] [Html.text "Hi ", Html.text name, Html.text ", ", Html.node "i" [] [Html.text "welcome!"]]

Scenario: List and tag
  When processing <span>{:list}<img/></span>
  Then the elm is Html.node "span" [] (list ++ [Html.node "img" [] []])

Scenario: Tag and list
  When processing <span><img/>{:list}</span>
  Then the elm is Html.node "span" [] ([Html.node "img" [] []] ++ list)

Scenario: Text, list, text and tag
  When processing <span>before{:list}after<img/></span>
  Then the elm is Html.node "span" [] ([Html.text "before"] ++ list ++ [Html.text "after", Html.node "img" [] []])

Scenario: Concats children with comma
  When processing <span>{:l}{a}{b}</span>
  Then the elm is Html.node "span" [] (l ++ [a, b])
