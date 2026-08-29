'use client';

import { PLATFORM_CONFIGS } from '@/config/platforms';
import { PlatformType } from '@/lib/types';
import { motion } from 'framer-motion';
import { Facebook, Film, Globe, Instagram, Twitter, Video, Youtube } from 'lucide-react';
import React from 'react';

interface PlatformBadgesProps {
  activePlatform?: PlatformType;
  onSelectExample?: (url: string) => void;
}

export const PlatformBadges: React.FC<PlatformBadgesProps> = ({
  activePlatform,
  onSelectExample
}) => {
  const platforms: PlatformType[] = ['youtube', 'tiktok', 'instagram', 'twitter', 'facebook', 'vimeo', 'generic'];

  const getIcon = (id: PlatformType) => {
    switch (id) {
      case 'youtube': return <Youtube className="w-4 h-4 text-red-500" />;
      case 'tiktok': return <Video className="w-4 h-4 text-pink-500" />;
      case 'instagram': return <Instagram className="w-4 h-4 text-purple-400" />;
      case 'twitter': return <Twitter className="w-4 h-4 text-sky-400" />;
      case 'facebook': return <Facebook className="w-4 h-4 text-blue-500" />;
      case 'vimeo': return <Film className="w-4 h-4 text-cyan-400" />;
      default: return <Globe className="w-4 h-4 text-emerald-400" />;
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-4 my-8 text-center">
      <p className="text-xs uppercase tracking-widest text-zinc-500 font-semibold mb-4">
        Supported Platforms
      </p>

      <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3">
        {platforms.map((id) => {
          const config = PLATFORM_CONFIGS[id];
          const isActive = activePlatform === id;

          return (
            <motion.button
              key={id}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onSelectExample && config.exampleUrl && onSelectExample(config.exampleUrl)}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl border text-xs font-medium transition-all ${
                isActive
                  ? `${config.badgeBg} ${config.badgeText} border-violet-500/50 shadow-lg glow-purple`
                  : 'bg-zinc-900/60 border-zinc-800 text-zinc-400 hover:text-white hover:bg-zinc-800/80 hover:border-zinc-700'
              }`}
            >
              {getIcon(id)}
              <span>{config.name}</span>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
};
