'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Home, RefreshCw, GraduationCap } from 'lucide-react';

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

const SPARKS = [
  { x: '12%', y: '22%', s: 5,  d: 0,    dur: 2.8 },
  { x: '82%', y: '15%', s: 9,  d: 0.7,  dur: 3.5 },
  { x: '72%', y: '68%', s: 4,  d: 1.2,  dur: 3.1 },
  { x: '22%', y: '74%', s: 7,  d: 1.8,  dur: 2.4 },
  { x: '48%', y: '7%',  s: 5,  d: 0.9,  dur: 4.0 },
  { x: '90%', y: '42%', s: 6,  d: 2.2,  dur: 3.8 },
  { x: '6%',  y: '55%', s: 8,  d: 0.4,  dur: 2.9 },
  { x: '55%', y: '90%', s: 4,  d: 1.5,  dur: 3.3 },
  { x: '36%', y: '30%', s: 3,  d: 2.6,  dur: 4.2 },
];

export default function Error({ error, reset }: ErrorProps) {
  useEffect(() => {
    console.error('[EduStar] Runtime error:', error);
  }, [error]);

  return (
    <div
      className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden"
      style={{ background: 'linear-gradient(145deg, #1a0a04 0%, #3d1506 40%, #1a0800 100%)' }}
    >
      {/* Grid overlay */}
      <div className="absolute inset-0 pointer-events-none" style={{ opacity: 0.04 }}>
        <svg width="100%" height="100%">
          <defs>
            <pattern id="grid500" width="56" height="56" patternUnits="userSpaceOnUse">
              <path d="M 56 0 L 0 0 0 56" fill="none" stroke="white" strokeWidth="0.6" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid500)" />
        </svg>
      </div>

      {/* Radial glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse 65% 55% at 50% 50%, rgba(192,57,43,0.22) 0%, transparent 70%)' }}
      />

      {/* Floating sparks */}
      {SPARKS.map((p, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full pointer-events-none"
          style={{ left: p.x, top: p.y, width: p.s, height: p.s, background: 'rgba(220,80,40,0.55)' }}
          animate={{ y: [0, -16, 0], opacity: [0.2, 0.8, 0.2], scale: [1, 1.4, 1] }}
          transition={{ duration: p.dur, delay: p.d, repeat: Infinity, ease: 'easeInOut' }}
        />
      ))}

      {/* Ghost number */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden">
        <span
          className="font-serif"
          style={{
            fontSize: 'clamp(18rem, 45vw, 38rem)',
            lineHeight: 1,
            color: 'transparent',
            WebkitTextStroke: '1px rgba(255,255,255,0.04)',
            letterSpacing: '-0.04em',
          }}
        >
          500
        </span>
      </div>

      {/* ── Content ── */}
      <div className="relative z-10 flex flex-col items-center text-center px-6 max-w-md">

        {/* Brand */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.55 }} className="mb-10">
          <Link href="/dashboard" className="inline-flex items-center gap-3 group">
            <div
              className="w-11 h-11 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform"
              style={{ background: 'linear-gradient(135deg, #1a3c8f, #0099cc)' }}
            >
              <GraduationCap className="w-6 h-6 text-white" />
            </div>
            <span className="font-serif text-xl" style={{ color: 'rgba(255,255,255,0.85)' }}>EduStar</span>
          </Link>
        </motion.div>

        {/* Broken gear illustration */}
        <motion.div
          initial={{ opacity: 0, scale: 0.75 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, duration: 0.7, ease: [0.34, 1.56, 0.64, 1] }}
          className="mb-7"
        >
          <motion.div
            animate={{ rotate: [0, 360] }}
            transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
          >
            <svg width="130" height="130" viewBox="0 0 130 130" fill="none">
              {/* Gear outer ring */}
              <circle cx="65" cy="65" r="38" fill="rgba(192,57,43,0.1)" stroke="rgba(192,57,43,0.35)" strokeWidth="2" />
              {/* Gear teeth — 8 teeth */}
              {Array.from({ length: 8 }).map((_, idx) => {
                const angle = (idx / 8) * 2 * Math.PI - Math.PI / 8;
                const cos = Math.cos(angle); const sin = Math.sin(angle);
                const cos2 = Math.cos(angle + Math.PI / 8); const sin2 = Math.sin(angle + Math.PI / 8);
                const r1 = 38; const r2 = 50;
                const pts = [
                  `${65 + r1 * cos},${65 + r1 * sin}`,
                  `${65 + r2 * Math.cos(angle + 0.12)},${65 + r2 * Math.sin(angle + 0.12)}`,
                  `${65 + r2 * Math.cos(angle + Math.PI / 8 - 0.12)},${65 + r2 * Math.sin(angle + Math.PI / 8 - 0.12)}`,
                  `${65 + r1 * cos2},${65 + r1 * sin2}`,
                ].join(' ');
                return <polygon key={idx} points={pts} fill="rgba(192,57,43,0.45)" stroke="rgba(192,57,43,0.3)" strokeWidth="0.8" />;
              })}
              {/* Inner ring */}
              <circle cx="65" cy="65" r="22" fill="rgba(15,8,4,0.6)" stroke="rgba(192,57,43,0.4)" strokeWidth="1.5" />
              <circle cx="65" cy="65" r="8" fill="rgba(192,57,43,0.5)" />
              {/* Crack lines — static, gives "broken" feel */}
              <line x1="65" y1="43" x2="60" y2="58" stroke="rgba(255,200,100,0.7)" strokeWidth="1.5" strokeLinecap="round" />
              <line x1="60" y1="58" x2="68" y2="62" stroke="rgba(255,200,100,0.5)" strokeWidth="1" strokeLinecap="round" />
              {/* Warning lightning bolt */}
              <path d="M74 28 L67 44 L72 44 L64 62 L78 42 L72 42 Z" fill="rgba(255,200,60,0.85)" />
            </svg>
          </motion.div>
        </motion.div>

        {/* Digit row */}
        <div className="flex items-center gap-3 mb-6">
          {['5', '0', '0'].map((d, i) => (
            <motion.span
              key={i}
              initial={{ opacity: 0, y: 28 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.45 + i * 0.1, type: 'spring', stiffness: 280, damping: 22 }}
              className="font-serif"
              style={{
                fontSize: '4.5rem',
                lineHeight: 1,
                background: i === 0
                  ? 'linear-gradient(160deg, #c0392b, #e74c3c)'
                  : 'linear-gradient(160deg, rgba(255,255,255,0.75), rgba(255,255,255,0.35))',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                letterSpacing: '-0.02em',
              }}
            >
              {d}
            </motion.span>
          ))}
        </div>

        {/* Text */}
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="flex flex-col items-center"
        >
          <h1 className="font-serif text-2xl mb-3" style={{ color: 'rgba(255,255,255,0.9)' }}>
            Erreur interne du serveur
          </h1>
          <p className="text-sm leading-relaxed mb-8 max-w-[18rem]" style={{ color: 'rgba(255,255,255,0.4)' }}>
            Quelque chose s&apos;est cassé de notre côté. Notre équipe a été notifiée automatiquement.
          </p>

          <div className="flex items-center gap-3">
            <button
              onClick={reset}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 hover:scale-[1.03]"
              style={{
                background: 'rgba(255,255,255,0.07)',
                border: '1px solid rgba(255,255,255,0.14)',
                color: 'rgba(255,255,255,0.7)',
              }}
            >
              <RefreshCw className="w-4 h-4" />
              Réessayer
            </button>
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-white text-sm font-medium shadow-lg transition-all duration-150 hover:scale-[1.03] hover:opacity-90"
              style={{ background: 'linear-gradient(135deg, #1a3c8f, #0099cc)' }}
            >
              <Home className="w-4 h-4" />
              Tableau de bord
            </Link>
          </div>

          {error.digest && (
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.9 }}
              className="mt-5 px-3 py-2 rounded-lg"
              style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}
            >
              <p className="text-xs font-mono" style={{ color: 'rgba(255,255,255,0.35)' }}>
                Réf: <span style={{ color: 'rgba(255,255,255,0.55)' }}>{error.digest}</span>
              </p>
            </motion.div>
          )}
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.1 }}
          className="mt-12 text-xs font-mono tracking-widest"
          style={{ color: 'rgba(255,255,255,0.18)' }}
        >
          HTTP 500 — Internal Server Error
        </motion.p>
      </div>
    </div>
  );
}
