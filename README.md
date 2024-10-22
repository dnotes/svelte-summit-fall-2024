This Svelte Demo site was created for the Svelte Summit Fall 2024.

In this talk, I compared the process of writing tests in Gherkin vs. writing tests in pure playwright. **Note: Some of what I demonstrated is in a pull request, not the main branch.** See "Writing a feature request in Gherkin" below.

Here are some key moments of the talk for developers:

### Comparing [_FrontPage.feature] (Gherkin) vs. [test.ts] (playwright) [19:01]

The Svelte Demo app ships with one Playwright test in [test.ts]. I re-created that test in Gherkin at [_FrontPage.feature]. I later extended that Gherkin test to make sure the site works without Javsacript running.

### Running feature files with Vitest [19:22]

Files written in Gherkin run as tests with Vitest, and you can see that happening. This works because every step in a .feature file corresponds to a "step definition" in a test support file. Those step definitions are written in Playwright (or another testing framework) and included in your tests through the "setupFiles" configuration for Vitest, probably in [vite.config.ts].

In this case, I'm using the step definitions from [@quickpickle/playwright/actions], an experimental library of pre-made Gherkin step definitions for testing behavior through UI elements. Full disclosure: Testing based on the UI is often considered a beginner mistake in the behavioral testing world, but I think it could have some utility and I'm trying it out.

### Starting a Gherkin Feature [22:34]

I wrote the Gherkin tests in the [_game.feature] file.

### Testing the "Sverdle" game: Gherkin vs. Playwright [23:25]

I wrote the Gherkin tests in the [_game.feature] file. These tests use the step definitions from [gherkin.steps.ts], which I also wrote.

I tried to have Claude 3.5 Sonnet write some tests in pure Playwright at [sverdle.test.ts], but it didn't work very well. I had to spend a bunch of time debugging so I only fixed a few of them, and the rest still fail because the tests are bad. Nonetheless, it was useful to have some sort of comparison.

### Writing a feature request in Gherkin [25:29]

I wanted to imagine adding some new functionality, and how that works in Gherkin. The functionality I chose was [adding easy, medium and hard mode]. So, I wrote a new Rule and Scenarios and [added them to _game.feature].

Then, based on those Gherkin tests, I asked Claude to make the changes necessary so that they passed, and the results are in [https://github.com/dnotes/svelte-summit-fall-2024/pull/1].

### Setting up QuickPickle [26:28]

I demonstrate how to setup QuickPickle to run Gherkin tests in Vitest:

* installing [quickpickle] and [@quickpickle/playwright]
* writing a [step definition file]
* configuring [vite.config.ts] to use QuickPickle and find your .feature files and setupFiles
* installing and configuring the [official cucumber plugin] for VSCode


[test.ts]: https://github.com/dnotes/svelte-summit-fall-2024/blob/main/tests/test.ts
[_FrontPage.feature]: https://github.com/dnotes/svelte-summit-fall-2024/blob/main/src/routes/_FrontPage.feature
[_game.feature]: https://github.com/dnotes/svelte-summit-fall-2024/blob/main/src/routes/sverdle/_game.feature
[step definition file]: https://github.com/dnotes/svelte-summit-fall-2024/blob/main/tests/gherkin.steps.ts
[gherkin.steps.ts]: https://github.com/dnotes/svelte-summit-fall-2024/blob/main/tests/gherkin.steps.ts
[.steps.ts file]: https://github.com/dnotes/svelte-summit-fall-2024/blob/main/tests/gherkin.steps.ts
[.steps.ts]: https://github.com/dnotes/svelte-summit-fall-2024/blob/main/tests/gherkin.steps.ts
[sverdle.test.ts]: https://github.com/dnotes/svelte-summit-fall-2024/blob/main/tests/sverdle.test.ts
[vite.config.ts]: https://github.com/dnotes/svelte-summit-fall-2024/blob/main/vite.config.ts

[adding easy, medium and hard mode]: https://github.com/dnotes/svelte-summit-fall-2024/pull/1
[added them to _game.feature]: https://github.com/dnotes/svelte-summit-fall-2024/pull/1/files

[official cucumber plugin]: https://marketplace.visualstudio.com/items?itemName=CucumberOpen.cucumber-official

[@quickpickle/playwright/actions]: https://github.com/dnotes/quickpickle/blob/main/packages/playwright/src/actions.steps.ts

[19:01]: https://www.youtube.com/live/fAPFsRP-mbc?t=1141
[19:22]: https://www.youtube.com/live/fAPFsRP-mbc?t=1162
[22:34]: https://www.youtube.com/live/fAPFsRP-mbc?t=1354
[23:25]: https://www.youtube.com/live/fAPFsRP-mbc?t=1405
[25:29]: https://www.youtube.com/live/fAPFsRP-mbc?t=1529
[26:28]: https://www.youtube.com/live/fAPFsRP-mbc?t=1588

[quickpickle]: [https://github.com/dnotes/quickpickle]
[@quickpickle/playwright]: [https://github.com/dnotes/quickpickle/tree/main/packages/playwright]
[@quickpickle/browser]: [https://github.com/dnotes/quickpickle/tree/main/packages/browser]
[@quickpickle/svelte]: [https://github.com/dnotes/quickpickle/tree/main/packages/browser]
[Svelte component that reads your step definitions]: [https://github.com/dnotes/quickpickle/tree/main/packages/browser]
[Sam Ziegler]: [https://github.com/samuel-ziegler/vitest-cucumber-plugin]
[vitest-gherkin]: [https://github.com/joelmagner/vitest-gherkin]
[@amiceli/vitest-cucumber]: [https://github.com/amiceli/vitest-cucumber#readme]
