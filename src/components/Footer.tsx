'use client';

import { Download, Heart, Shield, Sparkles } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="w-full border-t border-zinc-800/80 bg-zinc-950/90 pt-12 pb-8 px-4 mt-20">
      <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
        {/* Brand */}
        <div className="space-y-2">
          <div className="flex items-center justify-center md:justify-start gap-2">
            <div className="w-8 h-8 rounded-xl gradient-button flex items-center justify-center">
              <Download className="w-4 h-4 text-white" />
            </div>
            <span className="text-xl font-extrabold text-white tracking-tight">
              Linkx<span className="gradient-text">Drop</span>
            </span>
          </div>
          <p className="text-xs text-zinc-500 max-w-sm">
            Drop a link. Get your media. Minimal, ultra-fast public downloader.
          </p>
        </div>

        {/* Links & Status */}
        <div className="flex flex-wrap items-center justify-center gap-6 text-xs text-zinc-400 font-medium">
          <a href="#how-it-works" className="hover:text-white transition-colors">How It Works</a>
          <a href="#privacy" className="hover:text-white transition-colors">Privacy Note</a>
          <span className="w-1 h-1 rounded-full bg-zinc-800" />
          <div className="flex items-center gap-1.5 text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span>Server Status: Operational</span>
          </div>
        </div>
      </div>

      {/* Downside Watermark Section */}
      <div className="max-w-5xl mx-auto border-t border-zinc-900 mt-8 pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-zinc-500 gap-3">
        <p>© {new Date().getFullYear()} LinkxDrop. All rights reserved.</p>
        
        {/* Author Watermark */}
        <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-violet-500/10 border border-violet-500/20 text-xs font-semibold text-violet-300">
          <Sparkles className="w-3.5 h-3.5 text-violet-400" />
          <span>Designed & Developed by <strong className="text-white font-bold">Ishwar Shtagar</strong></span>
        </div>
      </div>
    </footer>
  );
};
