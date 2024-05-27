import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig(({ mode }) => {
  return {
    plugins: [react()],
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
  