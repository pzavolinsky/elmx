Feature: expressions

Scenario: whitespace with special chars
  When parsing ' \t\n\r '
  Then the expression type is whitespace

Scenario: whitespace
  When parsing ''
  Then the expression type is whitespace

Scenario: text
  When parsing 'text'
  Then the expression type is text

Scenario: {code}
  When parsing '{code}'
  Then the expression type is code with value 'code'

Scenario: {=text}
  When parsing '{=text}'
  Then the expression type is textExpr with value 'text'

Scenario: code
  When parsing '{:code}'
  Then the expression type is list with value 'code'

Scenario: text with leading whitespace
  When parsing '    text'
  Then the expression type is text with value '    text'

Scenario: code with leading whitespace
  When parsing '   {code}'
  Then the 1st expression type is whitespace with value '   '
  And the 2nd expression type is code with value 'code'

Scenario: code with trailing whitespace
  When parsing '{code}   '
  Then the 1st expression type is code with value 'code'
  And the 2nd expression type is whitespace with value '   '

Scenario: text and code
  When parsing 'text{code}'
  Then the 1st expression type is text with value 'text'
  And the 2nd expression type is code with value 'code'

Scenario: code and text
  When parsing '{code}text'
  Then the 1st expression type is code with value 'code'
  And the 2nd expression type is text with value 'text'
