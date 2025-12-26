
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  // 如果你的 GitHub 仓库名是 'my-repo'，base 应该设置为 '/my-repo/'
  // 如果是个人主页根目录，请设置为 '/'
  base: './', 
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: false,
    minify: 'terser',
  }
});
