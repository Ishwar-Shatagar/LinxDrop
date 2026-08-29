'use client';

import { FormatCategory, MediaFormat } from '@/lib/types';
import { motion } from 'framer-motion';
import { Check, Film, Image as ImageIcon, Music } from 'lucide-react';
import React, { useState } from 'react';

interface FormatSelectorProps {
  formats: MediaFormat[];
  selectedFormat: MediaFormat | null;
  onSelectFormat: (format: MediaFormat) => void;
}

export const FormatSelector: React.FC<FormatSelectorProps> = ({
  formats,
  selectedFormat,
  onSelectFormat
}) => {
  const [activeCategory, setActiveCategory] = useState<FormatCategory>('video');

  const videoFormats = formats.filter(f => f.category === 'video');
  const audioFormats = formats.filter(f => f.category === 'audio');
  const imageFormats = formats.filter(f => f.category === 'image');

  const currentCategoryFormats =
    activeCategory === 'video' ? videoFormats :
    activeCategory === 'audio' ? audioFormats : imageFormats;

  return (
    <div className="w-full space-y-3 sm:space-y-4">
      {/* Category Tabs: VIDEO / AUDIO / IMAGE */}
      <div className="flex items-center p-1 rounded-xl bg-zinc-950 border border-zinc-800">
        <button
          type="button"
          onClick={() => setActiveCategory('video')}
          className={`flex-1 flex items-center justify-center gap-1.5 py-2 sm:py-2.5 px-2 sm:px-3 rounded-lg text-xs sm:text-sm font-semibold transition-all ${
            activeCategory === 'video'
              ? 'bg-violet-600 text-white shadow-lg'
              : 'text-zinc-400 hover:text-white hover:bg-zinc-900'
          }`}
        >
          <Film className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" />
          <span>VIDEO ({videoFormats.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveCategory('audio')}
          className={`flex-1 flex items-center justify-center gap-1.5 py-2 sm:py-2.5 px-2 sm:px-3 rounded-lg text-xs sm:text-sm font-semibold transition-all ${
            activeCategory === 'audio'
              ? 'bg-violet-600 text-white shadow-lg'
              : 'text-zinc-400 hover:text-white hover:bg-zinc-900'
          }`}
        >
          <Music className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" />
          <span>AUDIO ({audioFormats.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveCategory('image')}
          className={`flex-1 flex items-center justify-center gap-1.5 py-2 sm:py-2.5 px-2 sm:px-3 rounded-lg text-xs sm:text-sm font-semibold transition-all ${
            activeCategory === 'image'
              ? 'bg-violet-600 text-white shadow-lg'
              : 'text-zinc-400 hover:text-white hover:bg-zinc-900'
          }`}
        >
          <ImageIcon className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" />
          <span>IMAGE ({imageFormats.length})</span>
        </button>
      </div>

      {/* Formats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-2.5">
        {currentCategoryFormats.map((fmt) => {
          const isSelected = selectedFormat?.id === fmt.id;

          return (
            <motion.button
              key={fmt.id}
              type="button"
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onSelectFormat(fmt)}
              className={`flex items-center justify-between p-3 sm:p-3.5 rounded-xl border text-left transition-all ${
                isSelected
                  ? 'bg-violet-500/10 border-violet-500/60 text-white shadow-md glow-purple'
                  : 'bg-zinc-950/60 border-zinc-800 text-zinc-300 hover:border-zinc-700 hover:bg-zinc-900'
              }`}
            >
              <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
                <div className={`w-7 h-7 sm:w-8 sm:h-8 rounded-lg flex items-center justify-center font-bold text-[11px] sm:text-xs shrink-0 ${
                  isSelected ? 'bg-violet-600 text-white' : 'bg-zinc-900 text-zinc-400'
                }`}>
                  {fmt.extension.toUpperCase()}
                </div>
                <div className="min-w-0">
                  <div className="text-xs sm:text-sm font-semibold flex items-center gap-1.5 truncate">
                    <span className="truncate">{fmt.label}</span>
                    {fmt.requiresConversion && (
                      <span className="px-1.5 py-0.5 text-[9px] sm:text-[10px] rounded bg-cyan-500/20 text-cyan-300 font-medium shrink-0">
                        Converted
                      </span>
                    )}
                  </div>
                  {fmt.sizeEstimate && (
                    <span className="text-[10px] sm:text-[11px] text-zinc-500 font-normal">
                      Est. {fmt.sizeEstimate}
                    </span>
                  )}
                </div>
              </div>

              <div className="shrink-0 ml-2">
                {isSelected ? (
                  <div className="w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-violet-500 flex items-center justify-center">
                    <Check className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-white" />
                  </div>
                ) : (
                  <div className="w-4 h-4 sm:w-5 sm:h-5 rounded-full border border-zinc-700" />
                )}
              </div>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
};
