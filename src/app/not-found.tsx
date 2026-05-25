'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Home, ArrowLeft, GraduationCap } from 'lucide-react';

const PARTICLES = [
  { x: '8%',  y: '18%', s: 6,  d: 0,    dur: 3.2 },
  { x: '88%', y: '12%', s: 10, d: 0.6,  dur: 4.1 },
  { x: '78%', y: '72%', s: 5,  d: 1.1,  dur: 3.6 },
  { x: '18%', y: '78%', s: 8,  d: 1.7,  dur: 2.8 },
  { x: '52%', y: '8%',  s: 4,  d: 0.9,  dur: 3.9 },
  { x: '92%', y: '48%', s: 7,  d: 2.1,  dur: 4.4 },
  { x: '4%',  y: '52%', s: 9,  d: 0.4,  dur: 3.0 },
  { x: '42%', y: '88%', s: 5,  d: 1.4,  dur: 2.6 },
  { x: '65%', y: '25%', s: 4,  d: 0.2,  dur: 4.8 },
  { x: '30%', y: '40%', s: 3,  d: 2.5,  dur: 3.4 },
];

export default function NotFound() {
  return (
    <div
      className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden"
      style={{ background: 'linear-gradient(145deg, #0a1628 0%, #0d2252 40%, #071830 100%)' }}
    >
      {/* Grid overlay */}
      <div className="absolute inset-0 pointer-events-none" style={{ opacity: 0.04 }}>
        <svg width="100%" height="100%">
          <defs>
            <pattern id="grid404" width="56" height="56" patternUnits="userSpaceOnUse">
              <path d="M 56 0 L 0 0 0 56" fill="none" stroke="white" strokeWidth="0.6" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid404)" />
        </svg>
      </div>

      {/* Radial glow center */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse 65% 55% at 50% 50%, rgba(0,153,204,0.18) 0%, transparent 70%)' }}
      />

      {/* Floating particles */}
      {PARTICLES.map((p, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full pointer-events-none"
          style={{ left: p.x, top: p.y, width: p.s, height: p.s, background: 'rgba(0,153,204,0.4)' }}
          animate={{ y: [0, -18, 0], opacity: [0.25, 0.75, 0.25] }}
          transition={{ duration: p.dur, delay: p.d, repeat: Infinity, ease: 'easeInOut' }}
        />
      ))}

      {/* Ghost number — full width backdrop */}
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
          404
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

        {/* Compass illustration */}
        <motion.div
          initial={{ opacity: 0, scale: 0.75, rotate: -12 }}
          animate={{ opacity: 1, scale: 1, rotate: 0 }}
          transition={{ delay: 0.2, duration: 0.7, ease: [0.34, 1.56, 0.64, 1] }}
          className="mb-7"
        >
          <motion.div
            animate={{ rotate: [0, 8, -5, 8, 0] }}
            transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
          >
            <svg width="130" height="130" viewBox="0 0 130 130" fill="none">
              {/* Outer ring glow */}
              <circle cx="65" cy="65" r="60" fill="rgba(0,153,204,0.06)" stroke="rgba(0,153,204,0.25)" strokeWidth="1.5" />
              {/* Inner ring */}
              <circle cx="65" cy="65" r="44" fill="rgba(255,255,255,0.03)" stroke="rgba(255,255,255,0.1)" strokeWidth="1" />
              {/* Tick marks */}
              {Array.from({ length: 16 }).map((_, idx) => {
                const angle = (idx / 16) * 2 * Math.PI;
                const isMajor = idx % 4 === 0;
                const r1 = isMajor ? 52 : 55;
                const r2 = 59;
                return (
                  <line
                    key={idx}
                    x1={65 + r1 * Math.cos(angle)} y1={65 + r1 * Math.sin(angle)}
                    x2={65 + r2 * Math.cos(angle)} y2={65 + r2 * Math.sin(angle)}
                    stroke={isMajor ? 'rgba(0,153,204,0.6)' : 'rgba(255,255,255,0.15)'}
                    strokeWidth={isMajor ? 2 : 1}
                    strokeLinecap="round"
                  />
                );
              })}
              {/* Cardinal letters */}
              <text x="61.5" y="14" fill="rgba(0,153,204,0.8)" fontSize="9" fontWeight="600" fontFamily="DM Sans, sans-serif">N</text>
              <text x="62" y="122" fill="rgba(255,255,255,0.25)" fontSize="9" fontFamily="DM Sans, sans-serif">S</text>
              <text x="5"   y="68.5" fill="rgba(255,255,255,0.25)" fontSize="9" fontFamily="DM Sans, sans-serif">O</text>
              <text x="116" y="68.5" fill="rgba(255,255,255,0.25)" fontSize="9" fontFamily="DM Sans, sans-serif">E</text>
              {/* North needle */}
              <path d="M65 65 L60 28 L65 36 L70 28 Z" fill="#0099cc" />
              {/* South needle */}
              <path d="M65 65 L60 102 L65 94 L70 102 Z" fill="rgba(255,255,255,0.2)" />
              {/* Center dot */}
              <circle cx="65" cy="65" r="5" fill="#0099cc" />
              <circle cx="65" cy="65" r="2.5" fill="white" />
            </svg>
          </motion.div>
        </motion.div>

        {/* Animated digit row */}
        <div className="flex items-center gap-3 mb-6">
          {['4', '0', '4'].map((d, i) => (
            <motion.span
              key={i}
              initial={{ opacity: 0, y: 28 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.45 + i * 0.1, type: 'spring', stiffness: 280, damping: 22 }}
              className="font-serif"
              style={{
                fontSize: '4.5rem',
                lineHeight: 1,
                background: i === 1
                  ? 'linear-gradient(160deg, #0099cc, #e0f4fb)'
                  : 'linear-gradient(160deg, rgba(255,255,255,0.9), rgba(255,255,255,0.4))',
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
          transition={{ delay: 0.7, duration: 0.5 }}
          className="flex flex-col items-center"
        >
          <h1 className="font-serif text-2xl mb-3" style={{ color: 'rgba(255,255,255,0.9)' }}>
            Page introuvable
          </h1>
          <p className="text-sm leading-relaxed mb-8 max-w-[18rem]" style={{ color: 'rgba(255,255,255,0.45)' }}>
            La page que vous cherchez a peut-être été déplacée, supprimée ou n&apos;a jamais existé.
          </p>

          <div className="flex items-center gap-3">
            <button
              onClick={() => window.history.back()}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 hover:scale-[1.03]"
              style={{
                background: 'rgba(255,255,255,0.07)',
                border: '1px solid rgba(255,255,255,0.14)',
                color: 'rgba(255,255,255,0.7)',
              }}
            >
              <ArrowLeft className="w-4 h-4" />
              Retour
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
          HTTP 404 — Not Found
        </motion.p>
      </div>
    </div>
  );
}
