Feature: Basic features

  Rule: The site should work.

    Scenario: The site works
      Given I am on "http://localhost:5173"
      Then I should see an "h1" element

    @nojs
    Scenario: The site works without Javascript
      Given I am on "http://localhost:5173"
      Then I should see an "h1" element
