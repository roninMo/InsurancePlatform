// vite-plugin-devlog.ts
import { Plugin } from 'vite';
import * as babel from '@babel/core';
import { createCompReferenceHierarchy, addRenderLogs } from './DevLogCompHierarchyBuilder_React';


export function vitePluginDevlog(): Plugin {
  return {
    name: 'vite-plugin-devlog',
    // Enforce running this before standard Vite features so it captures raw source components
    // enforce: 'pre', // This apparently helps, but doesn't seem necessary or worthwhile
    
    async transform(code: string, id: string) {
      // Only process user source files (skip node_modules, styles, assets)
      if (!/\.(t|j)sx?$/.test(id) || id.includes('node_modules')) {
        return null;
      }
      
      // Run Babel transformations sequentially
      const result = await babel.transformAsync(code, {
        filename: id,
        sourceMaps: true,
        plugins: [
          // createCompReferenceHierarchy, 
          addRenderLogs 
        ],
      });
      
      return {
        code: result?.code ?? code,
        map: result?.map
      };
    }
  };
}
