import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  server: {
    host: '0.0.0.0', // 绑定到所有网络接口
    port: 5173 // 保持原端口或修改为需要的端口
  },
  plugins: [react()],
})
