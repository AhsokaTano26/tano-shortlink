import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  base: './',
  plugins: [vue()],
  build: {
    rollupOptions: {
      input: {
        main: 'index.html',
        go: 'go.html',
        notfound: '404.html'
      }
    }
  }
})
