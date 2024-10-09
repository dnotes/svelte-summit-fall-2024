import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vitest/config';
import { quickpickle } from 'quickpickle'

export default defineConfig({
	plugins: [sveltekit(),quickpickle()],
	test: {
		include: ['src/**/*.{test,spec}.{js,ts}','src/**/*.feature'],
		setupFiles: ['./tests/gherkin.steps.ts'],
	}
});
