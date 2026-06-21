import tailwindcss from '@tailwindcss/vite';
import { devtools } from '@tanstack/devtools-vite';
import { tanstackRouter } from '@tanstack/router-plugin/vite';

import viteReact from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

const config = defineConfig({
  resolve: { tsconfigPaths: true },
  plugins: [
    devtools(),
    tailwindcss(),
    tanstackRouter({
      target: 'react',
      autoCodeSplitting: true,
    }),
    viteReact(),
  ],
  server: {
    proxy: {
      // Intercepts any request starting with /api-deezer
      '/api-deezer': {
        target: 'https://api.deezer.com',
        changeOrigin: true,
        secure: false,
        // Removes the '/api-deezer' prefix before forwarding to Deezer
        rewrite: (path) => path.replace(/^\/api-deezer/, '')
      }
    }
  }
});

export default config;
