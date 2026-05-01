import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Absolute base for Vercel — relative paths break when a user arrives
// at a deep URL directly (e.g. /salon/settings via a Stripe redirect):
// "./assets/foo.js" resolves to "/salon/assets/foo.js", Vercel's SPA
// rewrite returns index.html, and the browser refuses to execute
// text/html as a JS module → blank screen with "Expected a
// JavaScript-or-Wasm module script" in the console.
//
// Capacitor's WKWebView needs './' instead. When we run
// `npx cap sync` we set BUILD_TARGET=capacitor in the environment;
// detect it here and flip the base back.
export default defineConfig({
  plugins: [react()],
  base: process.env.BUILD_TARGET === 'capacitor' ? './' : '/',
  server: { port: 5173, host: true },
});
