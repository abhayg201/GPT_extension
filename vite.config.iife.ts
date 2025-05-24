import { resolve } from 'path';
import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    outDir: 'dist', // keep outputs separate
    rollupOptions: {
      input: resolve(__dirname, 'src/content-script.ts'),
      output: {
        format: 'iife',
        name: 'contentScript', // global exposed by the IIFE
        entryFileNames: 'content-script.js', // filename inside outDir
        inlineDynamicImports: true, // must be single chunk
      },
    },
  },
});
