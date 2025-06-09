import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import * as fs from 'node:fs'

export default defineConfig(({ mode }) => {
  return {
    plugins: [
      react(),
      {
        name: 'generate-redirect-files',
        closeBundle() {
          // Create _redirects file
          fs.writeFileSync('./dist/_redirects', '/* /index.html 200');

          // Create rewrite file (specific for Render)
          fs.writeFileSync('./dist/rewrite', '/* /index.html 200');

          // Create _headers file
          fs.writeFileSync('./dist/_headers', '/*\n  Cache-Control: no-cache');

          console.log('Generated redirect files for SPA routing in production');
        }
      }
    ],
    build: {
      outDir: 'dist',
      sourcemap: mode === 'development', // Keep source maps for development
      minify: mode !== 'development' // Avoid minification for development
    },
    define: {
      'process.env.NODE_ENV': JSON.stringify(mode)
    }
  }
})
