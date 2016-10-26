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
      Html.span [] [Html.text greeting]
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
  Html.ul [Html.Attributes.attribute "class" "message-list"] (
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
        Html.span [] (children)
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
        Html.span [] [child]
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
        Html.span [] [Html.text "Hi ", Html.text name, Html.text ", ", Html.i [] [Html.text "welcome!"]]
    """
