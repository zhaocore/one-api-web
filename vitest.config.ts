import path from 'path';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  resolve: {
    alias: {
      '~': path.resolve(__dirname, 'src'),
      '@librechat/client': path.resolve(__dirname, 'src/librechat-client/index.ts'),
    },
  },
  test: {
    globals: true,
    environment: 'node',
    setupFiles: [],
    testTimeout: 10000,
    fileParallelism: false,
    pool: 'forks',
    poolOptions: {
      forks: {
        singleFork: true,
      },
    },
  },
});
