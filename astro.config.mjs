import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';
 
export default defineConfig({
  output: 'static',
  site: 'https://bolinatec.com',
  devToolbar: {
    enabled: false,
  },
  integrations: [react(), sitemap()],
});
