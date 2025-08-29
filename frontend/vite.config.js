import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'
export default defineConfig({
  plugins: [
    tailwindcss(),
  ],
  build: {
    outDir: 'build',   // 👈 now Vite makes "build/" instead of "dist/"
  },

})