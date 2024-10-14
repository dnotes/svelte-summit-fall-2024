import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vitest/config';
import { quickpickle } from 'quickpickle' // <--- import the plugin

export default defineConfig({
	plugins: [sveltekit(),quickpickle({ // <--- use the plugin, here with some options
		explodeTags: [ // <--- explode tags into multiple tests, e.g. @js and @nojs run separately
			['@js', '@nojs'],
			['@chromium','@firefox','@webkit'],
		],
		worldConfig: { // <--- configuration for the world, e.g. PlaywrightWorld in this case
			port: 5173,
			slowMo: 50,
		}
	})],
	test: {
		testTimeout: 15000,
		include: ['src/**/*.{test,spec}.{js,ts}','src/**/*.feature'], // <--- include all features
		setupFiles: ['./tests/gherkin.steps.ts'], // <--- include your ".steps.ts" file
	}
});
