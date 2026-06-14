/// <reference types='vitest' />
import { defineConfig } from 'vite';
import { nxViteTsPaths } from '@nx/vite/plugins/nx-tsconfig-paths.plugin';

// This is retrieved before vite rolls up the project into flat optimized bundles
import { vitePluginDevlog } from '../../libraries/ReactComponents/src/Common/Utilities/Logging/vite-plugin-devlog.ts';
// WE may get a crash here because this plugin is also using files from the library, import them here to be safe, or stick with relative imports

import react from '@vitejs/plugin-react';
import * as path from 'path';

export default defineConfig(() => ({
  root: import.meta.dirname,
  cacheDir: '../../node_modules/.vite/apps/Frontend',
  define: {
    'process.env': {} // Catch for babel plugin's old webpack logic for implementing environmental stuff
  },
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
    vitePluginDevlog(),
    react()
  ],
  
  // ? relative alias paths
  resolve: {
    alias: {
      // using nxViteTsPaths(), only use these for vite's ?raw refs to retrieve code snippets for the Documentation page
      // Relative path to the universal classes (if needed)
      '@lib-cl': path.resolve(__dirname, '../../libraries/Classes/src'),
      
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
