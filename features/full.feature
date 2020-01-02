Feature: examples

Scenario: Html.text for {=text}
  When processing
  """
  main =
    let
      greeting = "Hi!"
    in
      <span>{=greeting}</span>
  """
  Then the elm is
  """
  main =
    let
      greeting = "Hi!"
    in
      Html.node "span" [] [Html.text greeting]
  """

Scenario: Lists
  When processing
  """
  <ul class="message-list">
    {:List.map chatMessage model.messages}
  </ul>
  """
  Then the elm is
  """
  Html.node "ul" [Html.Attributes.attribute "class" "message-list"] (
    List.map chatMessage model.messages
  )
  """

Scenario: List expressions as children
    When processing
    """
    main =
      let
        children = [Html.text "Hi!"]
      in
        <span>{:children}</span>
    """
    Then the elm is
    """
    main =
      let
        children = [Html.text "Hi!"]
      in
        Html.node "span" [] (children)
    """

Scenario: Singleton expressions as children
    When processing
    """
    main =
      let
        child = Html.text "Hi!"
      in
        <span>{child}</span>
    """
    Then the elm is
    """
    main =
      let
        child = Html.text "Hi!"
      in
        Html.node "span" [] [child]
    """

Scenario: Mixed expressions
    When processing
    """
    main =
      let
        name = "John"
      in
        <span>Hi {=name}, <i>welcome!</i></span>
    """
    Then the elm is
    """
    main =
      let
        name = "John"
      in
        Html.node "span" [] [Html.text "Hi ", Html.text name, Html.text ", ", Html.node "i" [] [Html.text "welcome!"]]
    """

Scenario: Multi-line text
    When processing
    """
    main =
      <p>
        I am a paragraph
      </p>
    """
    Then the elm is
    """
    main =
      Html.node "p" [] [Html.text \"\"\"
        I am a paragraph
      \"\"\"]
    """

Scenario: Multi-line and single-line text
    When processing
    """
    main =
      <p>
        I am a <i>paragraph</i>
      </p>
    """
    Then the elm is
    """
    main =
      Html.node "p" [] [Html.text \"\"\"
        I am a \"\"\", Html.node "i" [] [Html.text "paragraph"]
      ]
    """

# ====================================================================== #
# Clarification on """ in this scenario                                  #
# ---------------------------------------------------------------------- #
# Gherkin uses """ to delimit multi-line strings, and so does Elm. So we #
# need some way to escape the """ in the expected Elm output. This can   #
# be done with \"\"\", but it seems that this only works once per line.  #
# After the first instance of \"\"\", the current version of cucumber    #
# (^1.3.1) stops parsing the rest of the line and interprets it          #
# literally, and skips to the next line. That's why in this scenario's   #
# "Then" statement, in the lines where multiple """s are expected in the #
# Elm output, only the first is escaped.                                 #
#                                                                        #
# This seems likely to change with newer versions of cucumber.           #
# ====================================================================== #

Scenario: Multi-line within multi-line
    When processing
    """
    main =
      <div>
        First line
        <h1>
          Middle line
        </h1>
        Last line
      </div>
    """
    Then the elm is
    """
    main =
      Html.node "div" [] [Html.text \"\"\"
        First line
        \"\"\", Html.node "h1" [] [Html.text """
          Middle line
        \"\"\"], Html.text """
        Last line
      \"\"\"]
    """

Scenario: Nested multi-line
    When processing
    """
    main =
      <div><div>
        A
        B
      </div></div>
    """
    Then the elm is
    """
    main =
      Html.node "div" [] [Html.node "div" [] [Html.text \"\"\"
        A
        B
      \"\"\"]]
    """

Scenario: Multi-line with list expression
    When processing
    """
    main =
      let
        links = [a1, a2, a3]
      in
        <div>
          Header
          {:links}
          Footer
        </div>
    """
    Then the elm is
    """
    main =
      let
        links = [a1, a2, a3]
      in
        Html.node "div" [] ([Html.text \"\"\"
          Header
          \"\"\"] ++ links ++ [Html.text """
          Footer
        \"\"\"])
    """

# TODO: Bug fix for failing scenario "Multi-line and {=text}"
@ignore
Scenario: Multi-line and {=text}
    When processing
    """
    main =
      <div>
        {=foo} {=bar}
      </div>
    """
    Then the elm is
    """
    main =
      Html.node "div" [] [Html.text \"\"\"
        \"\"\", Html.text foo, Html.text " ", Html.text bar, Html.text """
      \"\"\"]
    """
