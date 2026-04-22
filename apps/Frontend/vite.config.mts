/// <reference types='vitest' />
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import * as path from 'path';

export default defineConfig(() => ({
  root: import.meta.dirname,
  cacheDir: '../../node_modules/.vite/apps/Frontend',
  server: {
    port: 4200,
    host: 'localhost',
  },
  preview: {
    port: 4200,
    host: 'localhost',
  },
  plugins: [react()],
  
  // relative alias paths
  resole: {
    alias: {
      // Relative path to the universal classes (if needed)
      // '@lib-cl': path.resolve(__dirname, '../../libraries/Classes/src'),

      // Relative path to the react component's library (for documentation jsx examples via './Comp.tsx?raw' )
      '@lib-rc': path.resolve(__dirname, '../../libraries/ReactComponents/src'),
    }
  },

  // Uncomment this if you are using workers.
  // worker: {
  //  plugins: [],
  // },
  build: {
    outDir: './dist',
    emptyOutDir: true,
    reportCompressedSize: true,
    commonjsOptions: {
      transformMixedEsModules: true,
    },
  },
}));
