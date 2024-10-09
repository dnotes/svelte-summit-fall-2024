# Demo Site

This Svelte Demo site is being created for the Svelte Summit Fall 2024.
My talk is on:

## Behavioral Testing with Gherkin and SvelteKit

This presentation will explain benefits, methods, tools, pitfalls and
workflows for using Gherkin for behavioral tests with SvelteKit projects.
The audience is very familiar with SvelteKit, but not as much with Gherkin
and behavioral testing. The outline is roughly as follows:

1.  The two important points of Gherkin and behavioral testing
    1.  tests written in natural language (e.g. English)
    2.  reusable discrete steps with minimal code
2. Brief overview of the Gherkin Syntax
    1.  Showing a real Gherkin Scenario
    2.  Showing the step definitions
    3.  Running the Gherkin Scenario
3. Comparing Gherkin with hard-coded tests
    1.  the problem: test code should change as little as possible,
        but functionality changes all the time
    3.  demo what happens as functionality is changed or added
        * with Gherkin, the requirements can change completely but the code
          (i.e. the corpus of step definitions) hardly changes at all
        * with hard-coded tests, almost all of the test code is continually
          changing, which means you need a dedicated developer translating
          from the requirements to the tests, leaving room for errors

### HOT TAKE: One of these methods is better than the other!

4.  Gherkin tooling in Javascript
    1.  cucumber-js is painfully outdated
    2.  other libraries completely miss the most important points of Gherkin
5.  Using Gherkin with Vitest
    1.  installing quickpickle
    2.  configuring quickpickle with vite.config.ts
        * plugin: import `quickpickle` and add to `plugins`
        * .feature files: glob include in `test.include`
        * step definitions: individual includes in `test.setupFiles`
    3.  step definitions
        * use a naming convention, I'm recommending `*.steps.{ts,js,mjs,cjs}`,
          so that IDE plugins can do syntax highlighting
        * import other modules' step files at the top of yours, e.g.
          `@quickpickle/playwright` if you're testing a website or app
    4.  configuring vscode
        * get the *official Cucumber extension*, not the top one for "Gherkin"
        * configure the `cucumber.glue` setting for your step definitions

