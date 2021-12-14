import { defineConfig } from 'vite'
import { svelte } from '@sveltejs/vite-plugin-svelte'
import copy from 'rollup-plugin-copy'
import { WatcherOptions } from 'rollup'

export default defineConfig({
  build: {
    sourcemap: 'inline',
    outDir: 'dist',
    emptyOutDir: false,
  },
  plugins: [
    svelte(),
    copy({
      targets: [{ src: ['manifest.json', 'icon*'], dest: 'dist' }],
    }),
  ],
})
