import { defineConfig } from 'vite'
import { cpSync, existsSync } from 'fs'
import { resolve } from 'path'

// Pre-copy public assets before build (ensures they survive emptyOutDir)
const publicAssets = resolve(__dirname, 'public/assets')
const distAssets = resolve(__dirname, 'dist/assets')

export default defineConfig({
  base: '/',
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    assetsDir: 'assets',
  },
  publicDir: 'public',
})
