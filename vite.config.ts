import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vitest/config';
import { quickpickle } from 'quickpickle'

export default defineConfig({
	plugins: [sveltekit(),quickpickle({
		explodeTags: [
			['@js', '@nojs']
		],
		worldConfig: {
			port: 5173,
			slowMo: 50,
		}
	})],
	test: {
		testTimeout: 15000,
		include: ['src/**/*.{test,spec}.{js,ts}','src/**/*.feature'],
		setupFiles: ['./tests/gherkin.steps.ts'],
	}
});
