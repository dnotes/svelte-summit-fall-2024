import { fail } from '@sveltejs/kit';
import { Game, type Difficulty } from './game';
import type { PageServerLoad, Actions } from './$types';

export const load = (({ cookies }) => {
	const game = new Game(cookies.get('sverdle'));

	return {
		guesses: game.guesses,
		answers: game.answers,
		maxGuesses: game.maxGuesses,
		answer: game.gameOver ? game.answer : null,
		difficulty: game.difficulty
	};
}) satisfies PageServerLoad;

export const actions = {
	update: async ({ request, cookies }) => {
		const game = new Game(cookies.get('sverdle'));

		const data = await request.formData();
		const key = data.get('key');

		const i = game.answers.length;

		if (key === 'backspace') {
			game.guesses[i] = game.guesses[i]?.slice(0, -1) ?? '';
		} else {
			game.guesses[i] = (game.guesses[i] ?? '') + key;
		}

		cookies.set('sverdle', game.toString(), { path: '/' });
	},

	enter: async ({ request, cookies }) => {
		const game = new Game(cookies.get('sverdle'));

		const data = await request.formData();
		const guess = data.getAll('guess') as string[];

		if (!game.enter(guess)) {
			return fail(400, { badGuess: true });
		}

		cookies.set('sverdle', game.toString(), { path: '/' });
	},

	restart: async ({ cookies }) => {
		cookies.delete('sverdle', { path: '/' });
	},

	setDifficulty: async ({ request, cookies }) => {
		const game = new Game(cookies.get('sverdle'));

		const data = await request.formData();
		const difficulty = data.get('difficulty') as Difficulty;

		game.setDifficulty(difficulty);

		cookies.set('sverdle', game.toString(), { path: '/' });
	}
} satisfies Actions;
