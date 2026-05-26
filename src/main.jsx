import React from 'react';
import ReactDOM from 'react-dom/client';
import { Analytics } from '@vercel/analytics/react';
import App from './App.jsx';
import ErrorBoundary from './components/ErrorBoundary.jsx';
import { ToastProvider } from './components/Toast.jsx';
import { AuthProvider } from './store.jsx';
import { initSentry } from './lib/sentry.js';

// Init Sentry before any app code runs so it captures errors from
// React lifecycle, routing, and async calls. No-op if VITE_SENTRY_DSN
// isn't set (local dev, forks without a Sentry project).
initSentry();

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ErrorBoundary>
      <AuthProvider>
        <ToastProvider>
          <App />
          {/* Vercel Analytics — page-view + route-change tracking. No-op
              in dev; sends beacons only on Vercel-hosted deploys. */}
          <Analytics />
        </ToastProvider>
      </AuthProvider>
    </ErrorBoundary>
  </React.StrictMode>
);
