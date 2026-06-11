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
      // As aliases existentes são mantidas.
      // A pasta `public/admin` é servida automaticamente pelo Astro em modo estático.
    },
  },
});
