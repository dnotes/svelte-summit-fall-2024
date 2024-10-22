import { words, allowed } from './words.server';

export type Difficulty = 'easy' | 'medium' | 'hard';

export class Game {
	index: number;
	guesses: string[];
	answers: string[];
	answer: string;
	difficulty: Difficulty;

	/**
	 * Create a game object from the player's cookie, or initialise a new game
	 */
	constructor(serialized: string | undefined = undefined) {
		if (serialized) {
			const [index, guesses, answers, difficulty] = serialized.split('-');

			this.index = +index;
			this.guesses = guesses ? guesses.split(' ') : [];
			this.answers = answers ? answers.split(' ') : [];
			this.difficulty = (difficulty as Difficulty) || 'medium';
		} else {
			this.index = Math.floor(Math.random() * words.length);
			this.guesses = [];
			this.answers = [];
			this.difficulty = 'medium';
		}

		this.answer = words[this.index];
	}

	/**
	 * Update game state based on a guess of a five-letter word. Returns
	 * true if the guess was valid, false otherwise
	 */
	enter(letters: string[]) {
		const word = letters.join('');
		const valid = allowed.has(word);

		if (!valid) return false;

		this.guesses.push(word);

		const available = Array.from(this.answer);
		const answer = Array(5).fill('_');

		// first, find exact matches
		for (let i = 0; i < 5; i += 1) {
			if (letters[i] === available[i]) {
				answer[i] = 'x';
				available[i] = ' ';
			}
		}

		// then find close matches (this has to happen
		// in a second step, otherwise an early close
		// match can prevent a later exact match)
		for (let i = 0; i < 5; i += 1) {
			if (answer[i] === '_') {
				const index = available.indexOf(letters[i]);
				if (index !== -1) {
					answer[i] = 'c';
					available[index] = ' ';
				}
			}
		}

		this.answers.push(answer.join(''));

		return true;
	}

	/**
	 * Get the maximum number of guesses based on the difficulty
	 */
	get maxGuesses() {
		switch (this.difficulty) {
			case 'easy':
				return 8;
			case 'hard':
				return 5;
			default:
				return 6;
		}
	}

	/**
	 * Check if the game is over
	 */
	get gameOver() {
		return this.answers.length >= this.maxGuesses || this.answers.at(-1) === 'xxxxx';
	}

	/**
	 * Serialize game state so it can be set as a cookie
	 */
	toString() {
		return `${this.index}-${this.guesses.join(' ')}-${this.answers.join(' ')}-${this.difficulty}`;
	}

	/**
	 * Change the difficulty of the game
	 */
	setDifficulty(difficulty: Difficulty) {
		this.difficulty = difficulty;
		// Reset the game when changing difficulty
		this.guesses = [];
		this.answers = [];
		this.index = Math.floor(Math.random() * words.length);
		this.answer = words[this.index];
	}
}
