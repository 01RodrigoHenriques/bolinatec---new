import { resolve } from 'node:path';
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';

export default defineConfig({
  output: 'static',
  devToolbar: {
    enabled: false,
  },
  integrations: [react()],
  vite: {
    resolve: {
      alias: {
        'use-sync-external-store/shim/with-selector.js': resolve('./src/shims/use-sync-external-store-with-selector.ts'),
        'use-sync-external-store/shim/with-selector': resolve('./src/shims/use-sync-external-store-with-selector.ts'),
      },
    },
  },
});
