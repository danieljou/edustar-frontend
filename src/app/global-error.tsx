'use client';

import { useEffect } from 'react';

interface GlobalErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

// global-error.tsx replaces the root layout entirely — must include <html><body>
// Uses inline styles (Tailwind not guaranteed at this level)
export default function GlobalError({ error, reset }: GlobalErrorProps) {
  useEffect(() => {
    console.error('[EduStar] Critical error:', error);
  }, [error]);

  return (
    <html lang="fr">
      <body
        style={{
          margin: 0,
          fontFamily: '"DM Sans", system-ui, sans-serif',
          background: 'linear-gradient(145deg, #1a0a04 0%, #3d1506 40%, #1a0800 100%)',
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
          padding: '1.5rem',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Radial glow */}
        <div style={{
          position: 'absolute', inset: 0, pointerEvents: 'none',
          background: 'radial-gradient(ellipse 65% 55% at 50% 50%, rgba(192,57,43,0.22) 0%, transparent 70%)',
        }} />

        {/* Ghost number */}
        <div style={{
          position: 'absolute', inset: 0,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          pointerEvents: 'none', userSelect: 'none', overflow: 'hidden',
        }}>
          <span style={{
            fontFamily: '"DM Serif Display", serif',
            fontSize: 'clamp(16rem, 40vw, 34rem)',
            lineHeight: 1,
            color: 'transparent',
            WebkitTextStroke: '1px rgba(255,255,255,0.04)',
            letterSpacing: '-0.04em',
          }}>500</span>
        </div>

        {/* Content */}
        <div style={{ position: 'relative', zIndex: 10, display: 'flex', flexDirection: 'column', alignItems: 'center', maxWidth: '28rem' }}>

          {/* Brand */}
          <a href="/dashboard" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.75rem', marginBottom: '2.5rem', textDecoration: 'none' }}>
            <div style={{
              width: '2.75rem', height: '2.75rem', borderRadius: '0.75rem',
              background: 'linear-gradient(135deg, #1a3c8f, #0099cc)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 4px 20px rgba(0,0,0,0.4)',
            }}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
                <path d="M6 12v5c3 3 9 3 12 0v-5" />
              </svg>
            </div>
            <span style={{ fontFamily: '"DM Serif Display", serif', fontSize: '1.25rem', color: 'rgba(255,255,255,0.85)' }}>EduStar</span>
          </a>

          {/* Broken star illustration */}
          <div style={{ marginBottom: '1.75rem' }}>
            <svg width="110" height="110" viewBox="0 0 110 110" fill="none">
              {/* Outer glow ring */}
              <circle cx="55" cy="55" r="50" fill="rgba(192,57,43,0.08)" stroke="rgba(192,57,43,0.3)" strokeWidth="1.5" />
              {/* Alert triangle */}
              <path d="M55 22 L88 78 L22 78 Z" fill="rgba(192,57,43,0.2)" stroke="rgba(192,57,43,0.6)" strokeWidth="2" strokeLinejoin="round" />
              {/* Exclamation */}
              <rect x="51.5" y="40" width="7" height="22" rx="3.5" fill="rgba(255,200,100,0.9)" />
              <circle cx="55" cy="70" r="3.5" fill="rgba(255,200,100,0.9)" />
              {/* Spark lines */}
              <line x1="20" y1="28" x2="28" y2="36" stroke="rgba(255,160,40,0.5)" strokeWidth="2" strokeLinecap="round" />
              <line x1="90" y1="28" x2="82" y2="36" stroke="rgba(255,160,40,0.5)" strokeWidth="2" strokeLinecap="round" />
              <line x1="15" y1="55" x2="25" y2="55" stroke="rgba(255,160,40,0.35)" strokeWidth="2" strokeLinecap="round" />
              <line x1="95" y1="55" x2="85" y2="55" stroke="rgba(255,160,40,0.35)" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </div>

          {/* Digits */}
          <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1.5rem' }}>
            {[
              { d: '5', color: 'linear-gradient(160deg, #c0392b, #e74c3c)' },
              { d: '0', color: 'linear-gradient(160deg, rgba(255,255,255,0.75), rgba(255,255,255,0.35))' },
              { d: '0', color: 'linear-gradient(160deg, rgba(255,255,255,0.75), rgba(255,255,255,0.35))' },
            ].map(({ d, color }, i) => (
              <span key={i} style={{
                fontFamily: '"DM Serif Display", serif',
                fontSize: '4.5rem', lineHeight: 1,
                background: color,
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                letterSpacing: '-0.02em',
              }}>{d}</span>
            ))}
          </div>

          <h1 style={{ fontFamily: '"DM Serif Display", serif', fontSize: '1.5rem', color: 'rgba(255,255,255,0.9)', margin: '0 0 0.75rem' }}>
            Erreur critique de l&apos;application
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.875rem', lineHeight: 1.65, marginBottom: '2rem', maxWidth: '18rem' }}>
            L&apos;application a rencontré une erreur critique et n&apos;a pas pu se charger. Veuillez réessayer ou contacter le support.
          </p>

          {/* Actions */}
          <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center' }}>
            <button
              onClick={reset}
              style={{
                display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
                padding: '0.625rem 1rem', borderRadius: '0.75rem',
                background: 'rgba(255,255,255,0.07)',
                border: '1px solid rgba(255,255,255,0.14)',
                color: 'rgba(255,255,255,0.7)', fontSize: '0.875rem', fontWeight: 500,
                cursor: 'pointer', fontFamily: 'inherit',
              }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M23 4v6h-6" /><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10" />
              </svg>
              Réessayer
            </button>
            <a
              href="/dashboard"
              style={{
                display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
                padding: '0.625rem 1rem', borderRadius: '0.75rem',
                background: 'linear-gradient(135deg, #1a3c8f, #0099cc)',
                color: 'white', fontSize: '0.875rem', fontWeight: 500,
                textDecoration: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
              }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                <polyline points="9 22 9 12 15 12 15 22" />
              </svg>
              Tableau de bord
            </a>
          </div>

          {error.digest && (
            <p style={{ marginTop: '1.5rem', fontSize: '0.75rem', fontFamily: '"DM Mono", monospace', color: 'rgba(255,255,255,0.3)' }}>
              Réf: <span style={{ color: 'rgba(255,255,255,0.5)' }}>{error.digest}</span>
            </p>
          )}

          <p style={{ marginTop: '3rem', fontSize: '0.75rem', fontFamily: '"DM Mono", monospace', color: 'rgba(255,255,255,0.18)', letterSpacing: '0.1em' }}>
            HTTP 500 — Critical Error
          </p>
        </div>
      </body>
    </html>
  );
}
