import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    coverage: {
      exclude: [
        'commitlint.config.js',
        'eslint.config.js',
        'vitest.config.ts',
        'dist',
        'src/shared/types',
      ],
    },
  },
});
