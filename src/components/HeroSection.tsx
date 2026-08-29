'use client';

import { motion } from 'framer-motion';
import { ShieldCheck, Sparkles, Zap } from 'lucide-react';

export const HeroSection = () => {
  return (
    <section className="relative text-center pt-8 sm:pt-12 pb-6 sm:pb-8 px-4 max-w-4xl mx-auto">
      {/* Top Floating Badge */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 rounded-full bg-violet-500/10 border border-violet-500/20 text-violet-300 text-[11px] sm:text-xs font-semibold tracking-wide uppercase mb-4 sm:mb-6"
      >
        <Sparkles className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-violet-400 animate-pulse shrink-0" />
        <span>Fast & Secure Media Downloader</span>
        <span className="w-1 h-1 sm:w-1.5 sm:h-1.5 rounded-full bg-violet-400 shrink-0" />
        <span className="text-zinc-400 normal-case font-normal">No Login</span>
      </motion.div>

      {/* Main Headline */}
      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight text-white leading-tight mb-4 sm:mb-6"
      >
        Drop a link.{' '}
        <span className="gradient-text">Get your media.</span>
      </motion.h1>

      {/* Subtitle */}
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="text-sm sm:text-lg md:text-xl text-zinc-400 max-w-2xl mx-auto font-normal leading-relaxed mb-6 sm:mb-8 px-2"
      >
        Instant public media downloader for YouTube, TikTok, Instagram, Twitter/X, and Facebook.
        Convert to MP4 HD, MP3 audio, or grab original cover posters in seconds.
      </motion.p>

      {/* Quick Value Props */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3 }}
        className="flex flex-wrap items-center justify-center gap-3 sm:gap-6 text-xs sm:text-sm text-zinc-400"
      >
        <div className="flex items-center gap-1.5">
          <Zap className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-cyan-400 shrink-0" />
          <span>High-Speed Server</span>
        </div>
        <div className="flex items-center gap-1.5">
          <ShieldCheck className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-400 shrink-0" />
          <span>100% Private</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping shrink-0" />
          <span className="text-emerald-300 font-medium">1080p & 320kbps</span>
        </div>
      </motion.div>
    </section>
  );
};
