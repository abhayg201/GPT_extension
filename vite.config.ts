import { resolve } from 'path';
import { defineConfig } from 'vite';
import { viteStaticCopy } from 'vite-plugin-static-copy';

export default defineConfig(({ mode }) => ({
  define: {
    'process.env.NODE_ENV': JSON.stringify(mode)
  },
  build: {
    outDir: 'dist',
    sourcemap: true,
    rollupOptions: {
      input: {
        background: resolve(__dirname, 'src/background.ts'),
        'content-script': resolve(__dirname, 'src/content-script.ts'),
        popup: resolve(__dirname, 'src/popup/popup.ts'),
        'reload-client': resolve(__dirname, 'src/reload-client.ts'),
      },
      output: {
        entryFileNames: '[name].js',
        chunkFileNames: '[name].js',
        assetFileNames: '[name].[ext]',
        // Bundle everything into single files - no code splitting
        manualChunks: undefined,
      },
      external: [],
      // Ensure content script bundles everything it needs
      preserveEntrySignatures: false,
    },
    minify: false, // Keep readable for development
  },
  plugins: [
    viteStaticCopy({
      targets: [
        {
          src: 'src/manifest.json',
          dest: '.'
        },
        {
          src: 'src/popup/popup.html',
          dest: 'popup'
        },
        {
          src: 'src/popup/popup.css',
          dest: 'popup'
        },
        {
          src: 'src/templates/*',
          dest: 'src/templates'
        },
        {
          src: 'src/styles/components.css',
          dest: 'src/styles'
        }
      ]
    })
  ]
}));