'use client';

import { PLATFORM_CONFIGS } from '@/config/platforms';
import { detectPlatform } from '@/lib/platform-detector';
import { PlatformType } from '@/lib/types';
import { motion } from 'framer-motion';
import {
  AlertCircle,
  ArrowRight,
  Clipboard,
  Facebook,
  Film,
  Globe,
  Instagram,
  Loader2,
  Twitter,
  Video,
  X,
  Youtube
} from 'lucide-react';
import React, { useEffect, useState } from 'react';

interface UrlInputFormProps {
  onAnalyze: (url: string) => void;
  isLoading: boolean;
}

export const UrlInputForm: React.FC<UrlInputFormProps> = ({ onAnalyze, isLoading }) => {
  const [url, setUrl] = useState('');
  const [detectedPlatform, setDetectedPlatform] = useState<PlatformType>('unsupported');
  const [isValid, setIsValid] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    if (!url.trim()) {
      setDetectedPlatform('unsupported');
      setIsValid(false);
      setErrorMsg(null);
      return;
    }

    const result = detectPlatform(url);
    setDetectedPlatform(result.platform);
    setIsValid(result.isValid);

    if (!result.isValid && url.length > 10) {
      setErrorMsg(result.errorMessage || 'Invalid media URL');
    } else {
      setErrorMsg(null);
    }
  }, [url]);

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (text) {
        setUrl(text.trim());
      }
    } catch {}
  };

  const handleClear = () => {
    setUrl('');
    setDetectedPlatform('unsupported');
    setIsValid(false);
    setErrorMsg(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isValid && !isLoading) {
      onAnalyze(url.trim());
    }
  };

  const renderPlatformIcon = () => {
    switch (detectedPlatform) {
      case 'youtube': return <Youtube className="w-5 h-5 sm:w-6 sm:h-6 text-red-500" />;
      case 'tiktok': return <Video className="w-5 h-5 sm:w-6 sm:h-6 text-pink-500" />;
      case 'instagram': return <Instagram className="w-5 h-5 sm:w-6 sm:h-6 text-purple-400" />;
      case 'twitter': return <Twitter className="w-5 h-5 sm:w-6 sm:h-6 text-sky-400" />;
      case 'facebook': return <Facebook className="w-5 h-5 sm:w-6 sm:h-6 text-blue-500" />;
      case 'vimeo': return <Film className="w-5 h-5 sm:w-6 sm:h-6 text-cyan-400" />;
      case 'generic': return <Globe className="w-5 h-5 sm:w-6 sm:h-6 text-emerald-400" />;
      default: return <Globe className="w-5 h-5 sm:w-6 sm:h-6 text-zinc-600" />;
    }
  };

  const config = PLATFORM_CONFIGS[detectedPlatform];

  return (
    <div className="w-full max-w-3xl mx-auto px-3 sm:px-4 my-4 sm:my-6">
      <form onSubmit={handleSubmit} className="relative">
        <div className={`relative flex flex-col sm:flex-row items-stretch sm:items-center p-2 sm:p-2.5 rounded-2xl sm:rounded-2xl glass-card transition-all duration-300 gap-2 sm:gap-0 ${
          isValid ? 'border-violet-500/50 glow-purple bg-black/95' : 'border-zinc-800/80 bg-black/85 focus-within:border-zinc-700'
        }`}>
          {/* Top Row on Mobile: Icon + Input + Clear/Paste */}
          <div className="flex items-center flex-1 min-w-0">
            <div className="pl-2.5 pr-2 flex items-center shrink-0">
              {renderPlatformIcon()}
            </div>

            <input
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="Paste YouTube, TikTok, Instagram link..."
              className="w-full bg-transparent py-2.5 sm:py-3 px-1.5 sm:px-2 text-sm sm:text-base md:text-lg text-white placeholder-zinc-500 focus:outline-none font-normal"
              disabled={isLoading}
            />

            {url ? (
              <button
                type="button"
                onClick={handleClear}
                className="p-2 rounded-xl text-zinc-400 hover:text-white hover:bg-zinc-800/80 transition-colors shrink-0 mr-1"
                title="Clear"
              >
                <X className="w-4 h-4" />
              </button>
            ) : (
              <button
                type="button"
                onClick={handlePaste}
                className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg sm:rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-300 text-xs font-medium border border-zinc-800 transition-all shrink-0 mr-1"
              >
                <Clipboard className="w-3.5 h-3.5 text-violet-400" />
                <span>Paste</span>
              </button>
            )}
          </div>

          {/* Action Button: Full width on small mobile, inline on tablet/desktop */}
          <div className="shrink-0 flex items-center">
            <button
              type="submit"
              disabled={!isValid || isLoading}
              className={`w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 sm:px-6 py-3 sm:py-3.5 rounded-xl font-bold text-sm sm:text-base text-white transition-all duration-300 ${
                isValid && !isLoading
                  ? 'gradient-button cursor-pointer active:scale-95'
                  : 'bg-zinc-900/90 text-zinc-600 cursor-not-allowed border border-zinc-800/60'
              }`}
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 sm:w-5 sm:h-5 animate-spin" />
                  <span>Analyzing...</span>
                </>
              ) : (
                <>
                  <span>Analyze</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </div>

        {/* Platform detection indicator */}
        {isValid && config && (
          <motion.div
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-between px-3 mt-2.5 text-xs"
          >
            <div className="flex items-center gap-2 text-zinc-400">
              <span>Platform:</span>
              <span className={`px-2 py-0.5 rounded-md border font-semibold ${config.badgeBg} ${config.badgeText}`}>
                {config.name}
              </span>
            </div>
            <span className="text-zinc-500 hidden sm:inline">Press Enter ↵ to analyze</span>
          </motion.div>
        )}

        {/* Error message */}
        {errorMsg && (
          <motion.div
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-1.5 px-3 mt-2.5 text-xs text-rose-400 font-medium"
          >
            <AlertCircle className="w-3.5 h-3.5 shrink-0" />
            <span>{errorMsg}</span>
          </motion.div>
        )}
      </form>
    </div>
  );
};
