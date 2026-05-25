'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Home, RefreshCw, GraduationCap } from 'lucide-react';

const PULSES = [
  { x: '10%', y: '20%', s: 6,  d: 0,    dur: 3.5 },
  { x: '86%', y: '14%', s: 9,  d: 0.8,  dur: 4.2 },
  { x: '76%', y: '70%', s: 5,  d: 1.3,  dur: 3.0 },
  { x: '20%', y: '76%', s: 7,  d: 1.9,  dur: 2.7 },
  { x: '50%', y: '6%',  s: 4,  d: 1.0,  dur: 4.1 },
  { x: '92%', y: '45%', s: 6,  d: 2.3,  dur: 3.7 },
  { x: '5%',  y: '53%', s: 8,  d: 0.5,  dur: 3.1 },
  { x: '44%', y: '88%', s: 4,  d: 1.6,  dur: 2.9 },
  { x: '62%', y: '28%', s: 5,  d: 0.3,  dur: 4.5 },
];

export default function BadGatewayPage() {
  return (
    <div
      className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden"
      style={{ background: 'linear-gradient(145deg, #0e0620 0%, #250b5a 40%, #0a0318 100%)' }}
    >
      {/* Grid overlay */}
      <div className="absolute inset-0 pointer-events-none" style={{ opacity: 0.04 }}>
        <svg width="100%" height="100%">
          <defs>
            <pattern id="grid502" width="56" height="56" patternUnits="userSpaceOnUse">
              <path d="M 56 0 L 0 0 0 56" fill="none" stroke="white" strokeWidth="0.6" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid502)" />
        </svg>
      </div>

      {/* Radial glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse 65% 55% at 50% 50%, rgba(107,72,255,0.22) 0%, transparent 70%)' }}
      />

      {/* Floating pulses */}
      {PULSES.map((p, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full pointer-events-none"
          style={{ left: p.x, top: p.y, width: p.s, height: p.s, background: 'rgba(107,72,255,0.5)' }}
          animate={{ y: [0, -18, 0], opacity: [0.2, 0.7, 0.2], scale: [1, 1.5, 1] }}
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
          502
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

        {/* Disconnected cloud illustration */}
        <motion.div
          initial={{ opacity: 0, scale: 0.75, y: 12 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.7, ease: [0.34, 1.56, 0.64, 1] }}
          className="mb-7"
        >
          <svg width="160" height="110" viewBox="0 0 160 110" fill="none">
            {/* Left server block */}
            <rect x="8" y="34" width="36" height="48" rx="5" fill="rgba(107,72,255,0.15)" stroke="rgba(107,72,255,0.5)" strokeWidth="1.5" />
            <rect x="15" y="42" width="22" height="3" rx="1.5" fill="rgba(107,72,255,0.6)" />
            <rect x="15" y="50" width="16" height="3" rx="1.5" fill="rgba(107,72,255,0.4)" />
            <rect x="15" y="58" width="18" height="3" rx="1.5" fill="rgba(107,72,255,0.4)" />
            <circle cx="34" cy="71" r="3" fill="rgba(107,72,255,0.7)" />
            <circle cx="34" cy="63" r="2" fill="rgba(107,72,255,0.4)" />

            {/* Right server block */}
            <rect x="116" y="34" width="36" height="48" rx="5" fill="rgba(107,72,255,0.15)" stroke="rgba(107,72,255,0.5)" strokeWidth="1.5" />
            <rect x="123" y="42" width="22" height="3" rx="1.5" fill="rgba(107,72,255,0.6)" />
            <rect x="123" y="50" width="16" height="3" rx="1.5" fill="rgba(107,72,255,0.4)" />
            <rect x="123" y="58" width="18" height="3" rx="1.5" fill="rgba(107,72,255,0.4)" />
            <circle cx="130" cy="71" r="3" fill="rgba(107,72,255,0.7)" />
            <circle cx="130" cy="63" r="2" fill="rgba(107,72,255,0.4)" />

            {/* Connection line — broken in center */}
            <line x1="44" y1="58" x2="62" y2="58" stroke="rgba(107,72,255,0.6)" strokeWidth="2" strokeDasharray="4 2" />
            <line x1="98" y1="58" x2="116" y2="58" stroke="rgba(107,72,255,0.6)" strokeWidth="2" strokeDasharray="4 2" />

            {/* Center — broken link */}
            <circle cx="80" cy="58" r="18" fill="rgba(15,5,30,0.8)" stroke="rgba(107,72,255,0.3)" strokeWidth="1.5" />
            {/* X mark */}
            <line x1="72" y1="50" x2="88" y2="66" stroke="rgba(192,57,43,0.9)" strokeWidth="2.5" strokeLinecap="round" />
            <line x1="88" y1="50" x2="72" y2="66" stroke="rgba(192,57,43,0.9)" strokeWidth="2.5" strokeLinecap="round" />

            {/* Status dots on servers — blinking */}
            <circle cx="26" cy="74" r="2.5" fill="rgba(255,160,40,0.9)" />
            <circle cx="144" cy="74" r="2.5" fill="rgba(255,160,40,0.9)" />

            {/* Signal waves above left server */}
            <path d="M 18 28 Q 26 18 34 28" stroke="rgba(107,72,255,0.4)" strokeWidth="1.5" fill="none" strokeLinecap="round" />
            <path d="M 14 24 Q 26 10 38 24" stroke="rgba(107,72,255,0.25)" strokeWidth="1.5" fill="none" strokeLinecap="round" />

            {/* Signal waves above right server (faded = weak) */}
            <path d="M 126 28 Q 134 18 142 28" stroke="rgba(107,72,255,0.2)" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeDasharray="3 2" />
            <path d="M 122 24 Q 134 10 146 24" stroke="rgba(107,72,255,0.12)" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeDasharray="3 2" />
          </svg>
        </motion.div>

        {/* Digit row */}
        <div className="flex items-center gap-3 mb-6">
          {['5', '0', '2'].map((d, i) => (
            <motion.span
              key={i}
              initial={{ opacity: 0, y: 28 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.45 + i * 0.1, type: 'spring', stiffness: 280, damping: 22 }}
              className="font-serif"
              style={{
                fontSize: '4.5rem',
                lineHeight: 1,
                background: i === 2
                  ? 'linear-gradient(160deg, #6b48ff, #a78bfa)'
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
            Passerelle indisponible
          </h1>
          <p className="text-sm leading-relaxed mb-6 max-w-[18rem]" style={{ color: 'rgba(255,255,255,0.4)' }}>
            Le serveur n&apos;a pas pu obtenir de réponse valide d&apos;un service en amont. Patientez quelques instants.
          </p>

          {/* Maintenance badge */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.85 }}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full mb-7"
            style={{ background: 'rgba(107,72,255,0.15)', border: '1px solid rgba(107,72,255,0.3)' }}
          >
            <motion.span
              className="inline-block w-2 h-2 rounded-full"
              style={{ background: '#f59e0b' }}
              animate={{ opacity: [1, 0.3, 1] }}
              transition={{ duration: 1.2, repeat: Infinity }}
            />
            <span className="text-xs font-medium" style={{ color: 'rgba(167,139,250,0.9)' }}>
              Maintenance en cours
            </span>
          </motion.div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => window.location.reload()}
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
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.1 }}
          className="mt-12 text-xs font-mono tracking-widest"
          style={{ color: 'rgba(255,255,255,0.18)' }}
        >
          HTTP 502 — Bad Gateway
        </motion.p>
      </div>
    </div>
  );
}
