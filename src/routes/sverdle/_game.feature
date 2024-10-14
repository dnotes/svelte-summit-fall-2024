@concurrent
Feature: Sverdle game

    Background: Setup

        Given I am on "http://localhost:5173/sverdle"
        Given I wait for 1000ms

    Scenario: Typing letters should work with Javascript enabled

        When I type the following keys: t i t l e
        Then row 1 should be "title"

        # Typing backspace erases a letter
        When I type the following keys: Backspace
        Then row 1 should be "titl"

        # The guess doesn't change when a 6th letter is typed
        When I type the following keys: e n
        Then row 1 should be "title"
        And row 2 should be ""

        # Typing enter submits the form
        When I type the following keys: Enter
        Then row 1 should be "title"
        And row 2 should be ""
        And row 2 should be current

    @js @nojs
    Scenario: Clicking letter buttons should work with or without Javascript

        When I click the following keys: t i t l e
        Then row 1 should be "title"

        # Clicking back erases a letter
        When I click the "back" button
        Then row 1 should be "titl"

        # clicking more than 5 letters doesn't add to the word
        When I click the following keys: e
        Then row 1 should be "title"
        And the "v" button should be disabled

        # Clicking enter submits the form
        When I click the "enter" button
        Then row 1 should be "title"
        And row 2 should be ""
        And row 2 should be current

    Scenario: If the correct word is guessed, a "you won" button should be displayed

        Given a new game with the word "enter"
        When I type the following keys: e n t e r Enter
        Then I should see a "button" with the text "you won"

    Scenario: If the guess limit is reached, a "game over" button should be displayed

        When I type the following keys: t i t l e Enter
        When I type the following keys: t i t l e Enter
        When I type the following keys: t i t l e Enter
        When I type the following keys: t i t l e Enter
        When I type the following keys: t i t l e Enter
        When I type the following keys: t i t l e Enter
        Then I should see a "button" with the text "game over"

    Scenario: Entries that are not real words should not be allowed

        Given I type the following keys: a s d f g Enter
        Then row 1 should be current

    Scenario: Letters in guesses should be highlighted

            exact matches in dark blue
            close matches (i.e. the right letter in the wrong position) with a dark blue border
            missing letters slightly greyed

        Given a new game with the word "enter"
        When I type the following keys: t i t l e Enter
        Then the screenshot "sverdle" should match

