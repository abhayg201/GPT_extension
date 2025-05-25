import { copyFileSync, existsSync, mkdirSync } from 'fs';
import { resolve } from 'path';
import { defineConfig, UserConfig } from 'vite';
import { viteStaticCopy } from 'vite-plugin-static-copy';

export default defineConfig({
  build: {
    target: 'es2015',
    minify: false, // Optional: disable minification for debugging
    sourcemap: false,
    outDir: 'dist',
    assetsDir: '',
    emptyOutDir: false,  
    rollupOptions: {
      input: {
        background: resolve(__dirname, 'src/background.ts'),
        settings: resolve(__dirname, 'src/settings/settings.ts'),
        'popup/popup': resolve(__dirname, 'src/popup/popup.ts'),
      },
      external: [],
      // Force bundling of all dependencies
      treeshake: false,
      output: {
        entryFileNames: '[name].js',
        chunkFileNames: '[name].js',
        assetFileNames: '[name][extname]',
        inlineDynamicImports: false,
      },
      preserveEntrySignatures: false,
    },
  },
  plugins: [
    viteStaticCopy({
      targets: [
        {
          src: 'src/manifest.json',
          dest: '.',
        },
        {
          src: 'src/popup/popup.html',
          dest: 'popup',
        },
        {
          src: 'src/popup/popup.css',
          dest: 'popup',
        },
        {
          src: 'src/templates/*',
          dest: 'src/templates',
        },
        {
          src: 'src/styles/components.css',
          dest: 'src/styles',
        },
      ],
    }),
    {
      name: 'copy-files',
      writeBundle() {
        // Copy settings.html
        if (!existsSync('dist/settings')) {
          mkdirSync('dist/settings', { recursive: true });
        }
        if (existsSync('src/settings/settings.html')) {
          copyFileSync(
            'src/settings/settings.html',
            'dist/settings/settings.html'
          );
        }

        // Copy manifest.json
        copyFileSync('manifest.json', 'dist/manifest.json');
      },
    },
  ],
} as UserConfig);
