import '@quickpickle/playwright/world'
import '@quickpickle/playwright/actions'
import '@quickpickle/playwright/outcomes'

import type { PlaywrightWorld } from '@quickpickle/playwright'
import { Given, When, Then } from 'quickpickle'
import { expect } from '@playwright/test'
import { words } from '../src/routes/sverdle/words.server'

Then('row {int} should be {string}', async (world, row, expected) => {
  const raw = await world.page.locator(`.grid div.row:nth-child(${row * 2})`).innerText()
  const actual = raw.split('\n').filter((t:any) => t.length <= 1).join('')
  await expect(actual).toBe(expected)
})

Then('row {int} should be current', async(world, row) => {
  await expect(world.page.locator(`.grid div.row:nth-child(${row * 2}) div.letter.selected`)).toBeVisible()
})

When('I click the following keys: {}', async (world:PlaywrightWorld, keys) => {
  let toPress = keys.split(' ')
  for (let i=0; i<toPress.length; i++) {
    await world.page.getByLabel(toPress[i], { exact:true }).click()
  }
})

Given('a new game with the word {string}', async (world: PlaywrightWorld, word: string) => {
  expect(word.length, 'the word must be five letters').toBe(5)
  expect(words.includes(word), `the word ${word} isn't on the list of options`).toBe(true)

  let idx = words.indexOf(word)
  await world.browserContext.addCookies([{
    name: 'sverdle',
    value: `${idx}--`,
    url: 'http://localhost:5173'
  }])

  await world.page.goto('http://localhost:5173/sverdle')
})
