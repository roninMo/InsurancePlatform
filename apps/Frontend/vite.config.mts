/// <reference types='vitest' />
import { defineConfig } from 'vite';
import { nxViteTsPaths } from '@nx/vite/plugins/nx-tsconfig-paths.plugin';

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
  plugins: [
    nxViteTsPaths(), // when you serve an app that uses this library, vite watches this library and reloads the app when there are saved changes 
    react()
  ],
  
  // relative alias paths
  resolve: {
    alias: {
      // Relative path to the universal classes (if needed)
      // '@lib-cl': path.resolve(__dirname, '../../libraries/Classes/src'),

      // Relative path to the react component's library (for documentation jsx examples via './Comp.tsx?raw' )
      // '@lib-rc': path.resolve(__dirname, '../../libraries/ReactComponents/src'),
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
