// import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import vuetify from 'vite-plugin-vuetify';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  plugins: [
    vue({
      script: {
        defineModel: true,
        propsDestructure: true,
      },
    }),
    vuetify({ autoImport: true }),
  ],
  test: {
    environment: 'jsdom',
    globals: true, 
      deps: {
      inline: ['vuetify'],
  },
   coverage: {
      exclude: [
        '**/*.cjs',
        '**/*.mjs',
        'node_modules/',
        'dist/',
        '**/*.d.ts',
       ],
    },
  },
});