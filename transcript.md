# Behavioral Testing with Gherkin (a.k.a. Cucumber) and SvelteKit

Hi everyone, I'm David Hunt, and I've long been a fan of Gherkin Syntax, or Cucumber as it's sometimes known, for behaviroal testing. Today I'd like to show you how to get started with it in the context of Svelte and SvelteKit. Hopefully, ten minutes from now, you'll have a better understanding of:

* What Gherkin is
* The Two Important Points about it
* The Two Devious Problems of integration testing, and how Gherkin mitigates them
* How to set up Gherkin with SvelteKit using QuickPickle (my new baby project)
* How to use it for testing websites and/or components
* And, some intriguing ideas for the future

I'm going to be using the SvelteKit demo project, with the "sverdle" game; hopefully most of us have are familiar with that. And, everything I do today will be available on Github.

## 1. Comparison with Playwright

The SvelteKit demo project ships with a sample Playwright test, so let's see what that would look like in Gherkin syntax, and here it is. Note the keywords, like "Feature" and "Scenario", "Given," "When" and "Then"---these are the things that most people associate with Gherkin Syntax, but as you'll see they're not really that important.

What I would like you to see is that this file "runs" as a test; if I do "npx vitest --run" you can see the results; there's the Feature, with the Rules and Scenarios listed out.

It does this because behind the scenes, these steps are referring to "step definitions," which is where the code is located. These step definitions can be re-used across all your tests and even across projects.

So, if we wanted to add another rule, like "The site must function without Javascript", we could copy the same test under a "tag" that says to turn off Javascript for this Scenario, and that also will run, and if we later break our site so that it shows a blank screen without javascript enabled, our test will rightly complain.

## 2. Two Important Points

So even in this brief overview, you can see the two most important points of behavioral testing in general and Gherkin Syntax in particular:

1.  you write tests in natural language, either English or the language your team shares
2.  you write reusable, discrete step definitions with minimal code

## 3. Two Devious Problems

With these two key points, Gherkin mitigates the two biggest problems in integration testing, which for the sake of being memorable we can call "fingers pointing at an imaginary moon" and "who tests the testers"

1.  The first problem: "fingers pointing at an imaginary moon"

    ...refers to a Zen Buddhist idea that words are like "a finger pointed at the moon," they cannot hold the essence of an idea, but are mere tools that we use to approach a truth that is inherently greater.

    Your functional requirements are like this, except that the moon doesn't even exist yet; so it's _incredibly difficult_ to reach a common understanding of the _essence_ of your project, i.e. **WHAT DOES THIS DO**? But Gherkin at least gives you a common language that everyone can use to both describe _and verify_ the most important aspects of your application.

2.  The second problem: "who tests the testers"

    Imagine for a moment that your testers understand exactly what you want, which of couse isn't possible in real life, but imagine it is and they're working hard to make sure that every time code is created or modified, it gets tested.

    The problem is, ideally that test code should _never_ change, but _functionality_ changes all the time. In this very common scenario, if your integration tests are written in code, then they're changing, and if they're changing then you should test them, and before you know it you have _two_ projects, your original project and your test suite, and integration testing will quickly become unmanageable.

[TRANSITION_330]: [#3:30]

## 4. Demo 1: Testing the Sverdle game

So, right now we're going to see how Gherkin tries to mitigate these two problems. For this purpose, I've drawn up some functional requirements for the Sverdle game as it exists now, so I'm going to set up a test suite that works in Gherkin, and I'm going to have Claude set one up in Playwright.

    ```
    Here are some functional requirements for the game at /sverdle. Please write integration tests for all of them using Playwright. Put the test files in the /tests folder, as *.test.ts.

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

    Only write to the test files or playwright configuration. Your task is finished when each of the functional requirements has tests and each of the tests pass. You can run the tests with `pnpm run test:integration`.
    ```

## 9. Setting up QuickPickle

1.  Install the package, and any others you might use. I'm going to be using a `playwright` package for testing the site, and a `browser` package for testing a component. These haven't got full releases yet but they should work for today.

    ```
    pnpm add -D quickpickle @quickpickle/playright @quickpickle/browser
    ```

2.  Create a step definition file; you're going to need it no matter what other modules you use. I'm going to be using playwright for integration testing first, so I'll put this at `tests/playwright.steps.ts`. In any case, this is going to be the support file for all our Gherkin integration tests; but `@quickpickle/playwright` gives us a lot of step definitions and a "world constructor" to use, so I'll import them here.

    ```ts
    // tests/playwright.steps.ts
    import '@quickpickle/playwright/world'
    import '@quickpickle/playwright/actions'
    import '@quickpickle/playwright/outcomes'
    ```

3.  We're going to add QuickPickle to `vite.config.ts`, and make sure that vitest recognizes our .feature files and our setup files. So:

    ```ts
    import { sveltekit } from '@sveltejs/kit/vite';
    import { defineConfig } from 'vitest/config';
    import { quickpickle } from 'quickpickle' // <-- 1. import quickpickle

    export default defineConfig({
      plugins: [sveltekit(),quickpickle()], // <-- 2. add it to the plugins array
      test: {
        include: ['src/**/*.{test,spec}.{js,ts}','src/**/*.feature'], // <-- add feature files here
        setupFiles: ['./tests/playwright.steps.ts'], // <-- specify setup files here
      }
    });
    ```

4.  For our tooling, we need the _official Cucumber plugin_ for VSCode, _not_ the top result for "Gherkin". Then we need to configure the `cucumber.glue` extension setting, which is why we should name our steps.ts files consistently.

    ```json
    "cucumber.glue": [
        "**/*.steps.{ts,js,mjs}",
        "**/steps/*.{ts,js,mjs}"
    ],
    ```

Now we should be all set up, and we can get started with the demo. I thought I'd demonstrate testing the behavior of the "Sverdle" game, in the format of a coding competition between myself and Claude, where I use Gherkin and Claude uses Playwright.

