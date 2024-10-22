**Note: this is not really a transcript, but my notes while creating the video.**

# Behavioral Testing with Gherkin (a.k.a. Cucumber) and SvelteKit

Hi everyone, I'm David Hunt, and I've long been a fan of Gherkin Syntax, or Cucumber as it's sometimes known, for behaviroal testing. Today I'd like to show you how to get started with it in the context of Svelte and SvelteKit. Hopefully, ten minutes from now, you'll have a better understanding of:

* What Gherkin is
* The Two Important Points about it
* The Two Devious Problems of integration testing, and how Gherkin mitigates them
* How to set up Gherkin with SvelteKit using QuickPickle (my new baby project on NPM)
* How to use it for testing websites and/or components

I'm going to be using the SvelteKit demo project; hopefully most of us have are familiar with that. And, everything I do today will be available on Github.

So, let's take a look at the Playwright test that ships with the SvelteKit demo project.

## 1. Comparison with Playwright

Here it is on the right, and on the left is the same test in Gherkin. Note the keywords, like "Feature" and "Scenario", "Given", "When" and "Then"---these are the things that most people associate with Gherkin Syntax, but as you'll see they're not really that important.

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

So, let's take a look at how this works in real life by using Gherkin to test the Sverdle game. For this purpose I've drawn up some functional requirements, and we're going to convert them into tests, both in Gherkin and also in Playwright. And in Gherkin, you can usually replace bullet points with "Scenario" or "Rule" to

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
  - close matches (right letter, wrong position) with a blue border
  - missing letters slightly greyed

And I was going to do a coding battle where I work in Gherkin and Claude-Dev works in pure Playwright, but we were both so bad at writing tests in Playwright that it was too painful, so...that was quick!

Now let's take a look at these two files, starting with the Gherkin feature on the left, and right away to me this looks very clear and comprehensible. Here are our requirements: _Typing letters should work with Javascript enabled_, and the steps are very clear, _When I type the following keys: t i t l e_, _Then row 1 should be "title"_.

In my consulting work, I don't interact only with developers; I talk with project managers, business analysts, subject matter experts, grandmothers and parents, marketers, all kinds of people, and I'm confident that I could show them a file like this and a picture of our app, and every one of them would be able to participate in a meaningful conversation about what our app is doing and what it should do. If you read this Scenario:

    ```gherkin
    Scenario: Entries that are not real words should not be allowed

        Given I type the following keys: a s d f g Enter
        Then row 1 should be current
    ```

--everyone here knows what that means. And for the last scenario, just like we might do in Playwright, we can use a visual regression test to make sure that our design requirements are met with each release.

Looking over at the Playwright file: there is _no way_ that I could show this to most of the people on my team, it would just be unreasonable for me to expect it to interest or engage them, and instead we may end up talking in circles or in separate conversations where important ideas about our product are simply lost because there's no way to capture them, like fingers pointing at an imaginary moon.

So this is good, but then in real life there will be bugs and new feature requests, like "people should be able to choose easy, medium or hard mode, with different numbers of guesses". And right away, I can sketch out this new Rule in Gherkin, and this is what people mean when they say "Behavior Driven Development"; because AI might be terrible at writing Playwright tests but it is quite good at parsing natural language -- like the language in our Gherkin tests. So I'm just going to ask Claude ...

  > In the @/src/routes/sverdle/_game.feature file, there are some tests for the new feature that are marked with the todo tag. The new feature is to allow people to choose easy, medium or hard mode. Please change the files @/src/routes/sverdle/+page.server.ts , @/src/routes/sverdle/+page.svelte , and @/src/routes/sverdle/game.ts so that this is possible. Bear in mind you will have to change the structure of the cookie which stores the game state, and you will have to add buttons, which should look reasonably nice.

And we'll let Claude work away over here in the corner, while I show you how to install and configure QuickPickle.

## 9. Setting up QuickPickle

1.  Quickpickle makes Gherkin features run in Vitest, while @quickpickle/playwright provides test frameworks for the browser and a bunch of step definitions.

    ```
    pnpm add -D quickpickle @quickpickle/playright
    ```

2.  You'll _always_ need a step definition file, and you should _always_ name it something.steps.ts or js. In this file you'll import or set up your world variable and import or write your step definitions.

    ```ts
    // tests/playwright.steps.ts
    import '@quickpickle/playwright/world'
    import '@quickpickle/playwright/actions'
    import '@quickpickle/playwright/outcomes'
    ```

3.  Add QuickPickle to `vite.config.ts`, and make sure that vitest recognizes our .feature files and our step definitions. If you have multiple environments, you can also use a vitest.workspace.ts file.

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

4.  For tooling, do _not_ use the top result for "Gherkin", try the _official Cucumber plugin_ for VSCode. Then configure the `cucumber.glue` setting to get some code completion, which is why we should name our .steps.ts files consistently.

    ```json
    "cucumber.glue": [
        "**/*.steps.{ts,js,mjs}",
        "**/steps/*.{ts,js,mjs}"
    ],
    ```

## Conclusion

And we can see that Claude is done, and if we remove those todo flags the tests mostly pass, except for a couple of the original tests, so there's stuff to fix but if we go to the site we can see the new functionality and we _know_ it works because _those tests already pass,_ and crucially, none of the actual code has changed, so you never have to ask _who's testing the testers!_

Thank you for letting me talk at this Summit, I hope you got something out of it. I'm David Hunt, QuickPickle lets you run Gherkin features with Vitest, give it a try and I hope to see you in person at the next one. Thanks!




























