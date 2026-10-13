import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  worker: {
    // The Excel parser runs in a module Web Worker so large files never freeze the UI.
    format: 'es',
  },
  build: {
    target: 'es2020',
    sourcemap: false,
    // SheetJS (~400 KB raw) lives only in the worker chunk and is loaded on demand.
    chunkSizeWarningLimit: 600,
  },
})
