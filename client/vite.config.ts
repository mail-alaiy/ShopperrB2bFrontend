import { defineConfig } from 'vite';
import { resolve } from 'path';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
      '@shared': resolve(__dirname, '../shared'),
      '@assets': resolve(__dirname, '../attached_assets'),
    },
  },
  server: {
    port: 5173,
    open: true,
    host: '0.0.0.0',
    hmr: {
      clientPort: 443
    },
    cors: true,
    strictPort: false,
    // Allow Replit domains and others
    fs: {
      strict: false,
      allow: ['..']
    },
    // Explicitly set allowed hosts to all
    allowedHosts: ['localhost', '0.0.0.0', '.replit.dev', '.repl.co', '0681b775-a657-47a5-b14f-34f0f955b1e5-00-2g6z2x0b6r5pa.spock.replit.dev', 'all']
  }
});