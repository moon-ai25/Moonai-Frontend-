import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'https://moon-ai-rxmz.onrender.com',
        changeOrigin: true,
        secure: false,
      },
      '/shared': {
        target: 'https://moon-ai-rxmz.onrender.com',
        changeOrigin: true,
        secure: false,
      },
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules/react') || id.includes('node_modules/react-dom') || id.includes('react-router-dom')) return 'vendor'
          if (id.includes('framer-motion')) return 'motion'
          if (id.includes('/gsap/')) return 'gsap'
          if (id.includes('react-markdown') || id.includes('remark-gfm') || id.includes('rehype-highlight')) return 'markdown'
          if (id.includes('lucide-react') || id.includes('react-hot-toast')) return 'ui'
        },
      },
    },
  },
})
