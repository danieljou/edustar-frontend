'use client';

import { useEffect } from 'react';

export function ServiceWorkerRegistration() {
  useEffect(() => {
    if (!('serviceWorker' in navigator)) return;

    const register = () => {
      navigator.serviceWorker
        .register('/sw.js', { scope: '/' })
        .then((reg) => {
          // Check for updates on every page load
          reg.update();
        })
        .catch(() => {
          // SW unavailable (e.g. HTTP in dev) — fail silently
        });
    };

    // Defer registration until after the page is fully loaded
    // so the SW install doesn't compete with page resources
    if (document.readyState === 'complete') {
      register();
    } else {
      window.addEventListener('load', register, { once: true });
    }
  }, []);

  return null;
}
