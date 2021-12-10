import { defineConfig } from 'vite'
import { svelte } from '@sveltejs/vite-plugin-svelte'
import type { WatcherOptions } from 'rollup'

const watcherOptions: WatcherOptions = {}

export default defineConfig({
  base: 'dist/ui',
  build: {
    sourcemap: 'inline',
    outDir: 'dist/ui',
    watch: watcherOptions, // null to disable (default)
  },
  plugins: [svelte()],
})
