import { test, expect } from '@playwright/test';
import { words } from '../src/routes/sverdle/words.server';
import { describe } from 'node:test';

function getRowText(text:string) {
  return text.split('\n').filter((line:any) => line.length <= 1).join('');
}

test.describe('Sverdle Game', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/sverdle');
    await page.waitForTimeout(1000);
  });

  test('Typing letters should work with Javascript enabled', async ({ page }) => {
    await page.keyboard.press('A');
    await page.keyboard.press('B');
    await page.keyboard.press('C');
    let text = getRowText(await page.locator('.grid div.row:nth-child(2)').innerText())
    await expect(text).toBe('abc');
  });

  test('Typing backspace erases a letter', async ({ page }) => {
    await page.keyboard.press('A');
    await page.keyboard.press('B');
    await page.keyboard.press('Backspace');
    let text = getRowText(await page.locator('.grid div.row:nth-child(2)').innerText())
    await expect(text).toBe('a');
  });

  test('The guess doesn\'t change when a 6th letter is typed', async ({ page }) => {
    await page.keyboard.press('A');
    await page.keyboard.press('B');
    await page.keyboard.press('C');
    await page.keyboard.press('D');
    await page.keyboard.press('E');
    await page.keyboard.press('F');
    let text = getRowText(await page.locator('.grid div.row:nth-child(2)').innerText())
    await expect(text).toBe('abcde');
  });

  test('Typing enter submits the form', async ({ page }) => {
    const word = words[0];
    for (const letter of word) {
      await page.keyboard.press(letter);
    }
    await page.keyboard.press('Enter');
    let text = getRowText(await page.locator('.grid div.row:nth-child(2)').innerText())
    await expect(text).toBe(word);
    await expect(await page.locator('.grid div.row:nth-child(4)').getAttribute('class')).toContain('current');
  });

  // Beyond this be dragons

  test('Clicking letter buttons should work with or without Javascript', async ({ page }) => {
    await page.getByLabel('A', { exact: true }).click();
    await page.getByLabel('B', { exact: true }).click();
    await page.getByLabel('C', { exact: true }).click();
    await expect(page.locator('.grid div.row:nth-child(2)')).toContainText('ABC');
  });

  test('Clicking back erases a letter', async ({ page }) => {
    await page.getByLabel('A', { exact: true }).click();
    await page.getByLabel('B', { exact: true }).click();
    await page.getByLabel('⌫', { exact: true }).click();
    await expect(page.locator('.grid div.row:nth-child(2)')).toContainText('A');
  });

  test('The guess doesn\'t change when a 6th letter is clicked', async ({ page }) => {
    await page.getByLabel('A', { exact: true }).click();
    await page.getByLabel('B', { exact: true }).click();
    await page.getByLabel('C', { exact: true }).click();
    await page.getByLabel('D', { exact: true }).click();
    await page.getByLabel('E', { exact: true }).click();
    await page.getByLabel('F', { exact: true }).click();
    await expect(page.locator('.grid div.row:nth-child(2)')).toContainText('ABCDE');
  });

  test('Clicking enter submits the form', async ({ page }) => {
    const word = words[0];
    for (const letter of word) {
      await page.getByLabel(letter, { exact: true }).click();
    }
    await page.getByLabel('Enter', { exact: true }).click();
    await expect(page.locator('.grid div.row:nth-child(4)')).toBeVisible();
  });

  test('When the correct word is guessed, a "you won" button should be displayed', async ({ page, context }) => {
    const word = words[0];
    await context.addCookies([{
      name: 'sverdle',
      value: `0--`,
      url: 'http://localhost:5173'
    }]);
    await page.reload();

    for (const letter of word) {
      await page.getByLabel(letter, { exact: true }).click();
    }
    await page.getByLabel('Enter', { exact: true }).click();
    await expect(page.getByText('you won!')).toBeVisible();
  });

  test('When the guess limit is reached, a "game over" button should be displayed', async ({ page }) => {
    for (let i = 0; i < 6; i++) {
      const word = words[i];
      for (const letter of word) {
        await page.getByLabel(letter, { exact: true }).click();
      }
      await page.getByLabel('Enter', { exact: true }).click();
    }
    await expect(page.getByText('game over')).toBeVisible();
  });

  test('Entries that are not real words should not be allowed', async ({ page }) => {
    const fakeWord = 'AAAAA';
    for (const letter of fakeWord) {
      await page.getByLabel(letter, { exact: true }).click();
    }
    await page.getByLabel('Enter', { exact: true }).click();
    await expect(page.locator('.grid div.row:nth-child(2)')).toContainText(fakeWord);
    await expect(page.locator('.grid div.row:nth-child(4)')).not.toBeVisible();
  });

});

describe('Tests with a known game', async () => {
  test.beforeEach(async ({ page, context }) => {
    const word = 'enter';
    await context.addCookies([{
      name: 'sverdle',
      value: `${words.indexOf(word)}--`,
      url: 'http://localhost:5173'
    }]);
    await page.goto('/sverdle');
    await page.waitForTimeout(1000);
  });

  test('Letters in guesses should be highlighted correctly', async ({ page, context }) => {

    const guess = 'title';
    for (const letter of guess) {
      await page.keyboard.press(letter);
    }
    await page.keyboard.press('Enter');
    await expect(await page.screenshot()).toMatchSnapshot();

  });


})