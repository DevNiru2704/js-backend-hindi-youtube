import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': "http://turbo-fiesta-jjj5wv5pw45vc5vv4-3000.app.github.dev/"
    }
  }
})
