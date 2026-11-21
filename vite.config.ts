import fs from 'fs';
import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig} from 'vite';

const copyAppJs = () => ({
  name: 'copy-root-app-js',
  writeBundle(options: { dir?: string }) {
    const outDir = options.dir || 'dist';
    const src = path.resolve(import.meta.dirname, 'app.js');
    if (fs.existsSync(src)) {
      fs.copyFileSync(src, path.join(outDir, 'app.js'));
    }
  }
});

export default defineConfig(() => {
  return {
    plugins: [react(), tailwindcss(), copyAppJs()],
    resolve: {
      alias: {
        '@': path.resolve(import.meta.dirname, '.'),
      },
    },
    server: {
      port: 3000,
      host: '0.0.0.0',
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modify—file watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
