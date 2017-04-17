Feature: attribute interpolation

Scenario: "attr"
  When processing <img id="attr" />
  Then the elm is Html.node "img" [Html.Attributes.attribute "id" "attr"] []

Scenario: {attr}
  When processing <img id={attr} />
  Then the elm is Html.node "img" [Html.Attributes.attribute "id" (attr)] []

Scenario: {:attrs}
  When processing <img {:attrs} />
  Then the elm is Html.node "img" (attrs) []

Scenario: "attr" and {:attrs}
  When processing <img id="i1" {:attrs} />
  Then the elm is Html.node "img" ([Html.Attributes.attribute "id" "i1"] ++ attrs) []

Scenario: onClick
  When processing <button onClick={Clicked}>Click me</button>
  Then the elm is Html.node "button" [Html.Events.onClick (Clicked)] [Html.text "Click me"]

Scenario: Understands repeated constructs in attribute expressions
  When processing <img src={"http://foo.com/bar" ++ authorId ++ ".png"}></img>
  Then the elm is Html.node "img" [Html.Attributes.attribute "src" ("http://foo.com/bar" ++ authorId ++ ".png")] []
