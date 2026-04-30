import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  // Relative asset paths so the bundle works inside Capacitor's WKWebView.
  // Vercel + browsers handle '/' vs './' identically for SPAs.
  base: './',
  server: { port: 5173, host: true },
});
