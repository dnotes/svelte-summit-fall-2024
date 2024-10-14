This Svelte Demo site is being created for the Svelte Summit Fall 2024.
My talk is on:

## Behavioral Testing with Gherkin (a.k.a. Cucumber) and SvelteKit

This presentation will explain benefits, methods, tools, pitfalls and
workflows for using Gherkin for behavioral tests with SvelteKit projects.
The audience is very familiar with SvelteKit, but not as much with Gherkin
and behavioral testing. The outline is roughly as follows:

1.  Brief overview of the Gherkin Syntax

    To help you explore Gherkin, I'm going to use the default SvelteKit demo app,
    and demonstrate how to test the Sverdle game and the Counter component.

    But first, here is a side-by-side view of the default integration tests from
    this demo app, in Gherkin and in Playwright

    1.  showing a real Gherkin Scenario
    2.  running the Gherkin Scenario
    3.  showing the step definitions
    4.  writing a step definition with a "nojs" tag
    5.  verifying that the step actually tests what it should test

2.  the two important points of behavioral testing with Gherkin Syntax
    1.  write tests in natural language (e.g. English)
    2.  write reusable discrete "step definitions" with minimal code

3.  Comparing Gherkin with hard-coded tests

    Gherkin mitigates the two biggest problems in integration testing, which I call
    "fingers pointing at an imaginary moon" and "who tests the testers"

    1.  Problem 1: "fingers pointing at an imaginary moon":
        1.  from Zen Buddhism: words are like "a finger pointing at the moon";
            they cannot hold the essence of an idea, but are mere tools that we use to
            approach a truth that is inherently greater
        2.  your functional requirements are like this, except the moon doesn't exist yet
        3.  it is _really difficult_ to come to a common understanding of its essence
        4.  Gherkin at least gives you a common language that everyone can use
            to describe and verify the most important aspects of your application
        5.  and to demonstrate the importance of that common language, imagine
            if I had named this problem "maihao tohu ki te marama pohewa"
    2.  the "who tests the testers" problem:
        1.  assuming testers understand what you want perfectly
        2.  any time code is written or modified, it should be tested
        3.  test code should change as little as possible
        4.  functionality changes all the $°*&!n@ time
        5.  if your integration tests are changing, you should test that code...
        6.  you have two apps, your original app and the one you use to test it

4.  Setting up Gherkin with Vitest and QuickPickle
    1.  js support for Gherkin has been very poor for years
        * cucumber-js is painfully outdated, but you can certainly use it
        * most (all?) other js libraries **completely** miss the point of Gherkin
          * [vitest-gherkin] does not use natural language or step definitions
          * [@amiceli/vitest-cucumber] requires you to write code for each step
          * [Sam Ziegler] had the right idea but re-implemented the Gherkin parser
            in a way that didn't work and made some other changes I didn't like
    2.  I made [quickpickle] last weekend, try installing that
    3.  create a step definition file
        * use a naming convention, I'm recommending `*.steps.{ts,js,mjs,cjs}`,
          so that IDE plugins can do syntax highlighting
        * import other modules' step files at the top of yours, e.g.
          [@quickpickle/playwright] if you're testing a website or app
    4.  configuring quickpickle with vite.config.ts
        * plugin: import `quickpickle` and add to `plugins`
        * .feature files: glob include in `test.include`
        * step definitions: individual includes in `test.setupFiles`
    5.  configuring vscode
        * get the *official Cucumber extension*, not the top result for "Gherkin"
        * configure the `cucumber.glue` extension setting for your step definitions

### Demonstrations

5.  Demo 1: testing the behavior of the "sverdle" game

    I'm going to have a coding competition against Anthropic Claude.
    I'll be writing Gherkin tests, and Claude can write Playwright tests.

    1.  Functional requirements
        - Typing letters should work with Javascript enabled
        - Typing backspace erases a letter
        - The guess doesn't change when a 6th letter is typed
        - Typing enter submits the form
        - Clicking letter buttons should work with or without Javascript
        - Clicking back erases a letter
        - The guess doesn't change when a 6th letter is clicked
        - Clicking enter submits the form
        - When the correct word is guessed, a "you won" button should be displayed
        - When the guess limit is reached, a "game over" button should be displayed
        - Entries that are not real words should not be allowed
        - Letters in guesses should be highlighted
          - exact matches in dark blue
          - close matches (i.e. the right letter in the wrong position) with a dark blue border
          - missing letters slightly greyed

    2. Configuration
        - vite.config.ts
          - setting QuickPickle "explodeTags"
          - making sure our step definition file is in the "setupFiles" setting
        - the step definition file
          - imports from '@quickpickle/playwright'
        - creating a feature file, _game.feature

    2. (demo 1 coding)

6.  Demo 2: testing the behavior of the `Counter.svelte` component

    Usually you should NOT use Gherkin for unit testing, but for components
    it might make sense, because components units that encapsulate behavior.
    ---and, it's pretty easy.

    1.  Functional requirements
        - Clicking + should increment the count
        - Clicking - should decrement the count

    2.  Configuration
        - move vitest configuration to vitest.workspace.ts
          - integration environment, for the page testing
          - component environment, for components
        - create the new step file
          - import from [@quickpickle/browser]

    3. (demo 2 coding)

### The Solution

7.  Look at the "code", and think about our problems
    1.  "fingers pointing at an imaginary moon":
        - with Gherkin features, everyone on the team has a common language to
          describe what the application does; they can all understand the tests
          and help to write them
        - with the playwright files, this would be an unreasonable expectation
    2. "who tests the testers":
        - with Gherkin, the requirements can change completely but the "code"
          ---i.e. the corpus of step definitions---changes very little
        - with hard-coded tests, almost all of the test code changes whenever
          there is a change in the application, meaning:
          - you need a dedicated developer coding tests based on requirements
          - integration testing will quickly become unmanageable

### HOT TAKE: One of these methods is better than the other!

8.  Conclusion

    Every web project should be using Gherkin syntax _with appropriate tooling_
    for 90% of its integration testing

    1.  Remember the most important points:
      - write tests in natural language
      - write minimal code for step definitions
    2.  Remember the problems those points solve:
      - fingers pointing at an imaginary moon
      - who tests the testers
    3.  Don't settle for anything less

9.  Possibilities
    - Libraries of step definitions like [@quickpickle/playwright] and
      [@quickpickle/browser] can provide a shared lexicon in any language for the most
      common Gherkin steps in all web projects, so you might not need to
      write any code at all!
    - How about a [Svelte component that reads your step definitions]?
      Put it on your project's documentation site and let your users
      write tests **for** you with every bug report or feature request!
    - Put those tests into your issues, and have each one of them get
      converted automatically into a test suite that verifies the
      functionality before you even look at it!
    - What else is really good at working with natural language?
      Hook up an n8n workflow to let AI fulfil those behavioral
      requirements within your issue workflow!





[quickpickle]: [https://github.com/dnotes/quickpickle]
[@quickpickle/playwright]: [https://github.com/dnotes/quickpickle/tree/main/packages/playwright]
[@quickpickle/browser]: [https://github.com/dnotes/quickpickle/tree/main/packages/browser]
[@quickpickle/svelte]: [https://github.com/dnotes/quickpickle/tree/main/packages/browser]
[Svelte component that reads your step definitions]: [https://github.com/dnotes/quickpickle/tree/main/packages/browser]
[Sam Ziegler]: [https://github.com/samuel-ziegler/vitest-cucumber-plugin]
[vitest-gherkin]: [https://github.com/joelmagner/vitest-gherkin]
[@amiceli/vitest-cucumber]: [https://github.com/amiceli/vitest-cucumber#readme]
