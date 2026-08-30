'use client';

import { PLATFORM_CONFIGS } from '@/config/platforms';
import { MediaFormat, MediaMetadata } from '@/lib/types';
import { motion } from 'framer-motion';
import {
  CheckCircle2,
  Clock,
  Download,
  ExternalLink,
  Loader2,
  Sparkles,
  User
} from 'lucide-react';
import Image from 'next/image';
import React, { useEffect, useState } from 'react';
import { FormatSelector } from './FormatSelector';

interface ResultCardProps {
  metadata: MediaMetadata;
  onDownloadStart?: () => void;
  onDownloadError?: (msg: string) => void;
}

export const ResultCard: React.FC<ResultCardProps> = ({
  metadata,
  onDownloadStart,
  onDownloadError
}) => {
  const [selectedFormat, setSelectedFormat] = useState<MediaFormat | null>(
    metadata.formats[0] || null
  );
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [downloadSpeed, setDownloadSpeed] = useState<string | null>(null);
  const [isCompleted, setIsCompleted] = useState(false);
  const [imgSrc, setImgSrc] = useState(metadata.thumbnail);

  useEffect(() => {
    if (metadata.formats.length > 0) {
      setSelectedFormat(metadata.formats[0]);
    }
    setImgSrc(metadata.thumbnail);
    setIsCompleted(false);
    setIsProcessing(false);
    setProgress(0);
  }, [metadata]);

  const handleDownload = async () => {
    if (!selectedFormat) return;

    setIsProcessing(true);
    setIsCompleted(false);
    setProgress(20);
    setDownloadSpeed('Downloading...');

    if (onDownloadStart) onDownloadStart();

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 92) {
          clearInterval(interval);
          return 92;
        }
        return prev + Math.floor(Math.random() * 15) + 10;
      });
      setDownloadSpeed(`${(Math.random() * 3 + 2).toFixed(1)} MB/s`);
    }, 200);

    try {
      const cleanTitle = metadata.title.replace(/[^a-zA-Z0-9_\-\s]/g, '').substring(0, 40) || 'Media';
      const targetFilename = `LinkxDrop_${cleanTitle}_${selectedFormat.quality}.${selectedFormat.extension}`;

      const downloadUrl = `/api/download?url=${encodeURIComponent(metadata.url)}&formatId=${encodeURIComponent(selectedFormat.id)}&title=${encodeURIComponent(metadata.title)}&ext=${encodeURIComponent(selectedFormat.extension)}&directUrl=${encodeURIComponent(selectedFormat.directUrl || '')}`;

      const response = await fetch(downloadUrl);

      if (response.ok) {
        const blob = await response.blob();
        clearInterval(interval);
        setProgress(100);

        const blobUrl = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = blobUrl;
        link.download = targetFilename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        setTimeout(() => window.URL.revokeObjectURL(blobUrl), 1000);

        setIsProcessing(false);
        setIsCompleted(true);

        setTimeout(() => {
          setIsCompleted(false);
          setProgress(0);
        }, 4000);
        return;
      }

      // Fallback if API returned non-200: use direct browser anchor trigger
      if (selectedFormat.directUrl) {
        clearInterval(interval);
        setProgress(100);
        const link = document.createElement('a');
        link.href = selectedFormat.directUrl;
        link.target = '_blank';
        link.rel = 'noopener noreferrer';
        link.download = targetFilename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        setIsProcessing(false);
        setIsCompleted(true);

        setTimeout(() => {
          setIsCompleted(false);
          setProgress(0);
        }, 4000);
        return;
      }

      throw new Error('Download could not be completed.');

    } catch (err: any) {
      clearInterval(interval);
      setIsProcessing(false);
      setProgress(0);
      setDownloadSpeed(null);
      if (onDownloadError) {
        onDownloadError(err.message || 'Download failed. Please try again.');
      }
    }
  };

  const platformConfig = PLATFORM_CONFIGS[metadata.platform];

  return (
    <motion.div
      initial={{ opacity: 0, y: 30, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.5, cubicBezier: [0.16, 1, 0.3, 1] }}
      className="w-full max-w-4xl mx-auto px-3 sm:px-4 my-6 sm:my-8"
    >
      <div className="p-4 sm:p-7 md:p-8 rounded-2xl sm:rounded-3xl glass-card border border-zinc-800/90 shadow-2xl relative overflow-hidden bg-black/90">
        <div className="absolute -top-24 -right-24 w-72 h-72 rounded-full bg-violet-600/10 blur-3xl pointer-events-none" />

        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-8 items-start">
          {/* Left Column: Media Thumbnail & Info */}
          <div className="md:col-span-5 space-y-3 sm:space-y-4">
            <div className="relative aspect-video rounded-xl sm:rounded-2xl overflow-hidden bg-zinc-950 border border-zinc-800 shadow-lg group">
              <Image
                src={imgSrc}
                alt={metadata.title}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
                unoptimized
                onError={() => {
                  setImgSrc('https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?w=800&auto=format&fit=crop&q=80');
                }}
              />
              
              {/* Platform badge overlay */}
              <div className="absolute top-2.5 left-2.5">
                <span className={`px-2.5 py-1 rounded-lg text-[11px] sm:text-xs font-semibold border backdrop-blur-md ${platformConfig.badgeBg} ${platformConfig.badgeText}`}>
                  {platformConfig.name}
                </span>
              </div>

              {/* Duration badge overlay */}
              {metadata.duration && (
                <div className="absolute bottom-2.5 right-2.5 flex items-center gap-1 px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-md bg-black/85 text-white text-[11px] sm:text-xs font-medium backdrop-blur-md">
                  <Clock className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-zinc-400" />
                  <span>{metadata.duration}</span>
                </div>
              )}
            </div>

            {/* Title & Channel Details */}
            <div className="space-y-1.5 sm:space-y-2">
              <h2 className="text-base sm:text-lg md:text-xl font-bold text-white leading-snug line-clamp-2">
                {metadata.title}
              </h2>

              <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-xs text-zinc-400">
                {metadata.author && (
                  <div className="flex items-center gap-1.5 font-medium text-zinc-300">
                    <User className="w-3.5 h-3.5 text-violet-400" />
                    <span className="truncate max-w-[180px] sm:max-w-[240px]">{metadata.author}</span>
                  </div>
                )}

                <a
                  href={metadata.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-zinc-500 hover:text-zinc-300 transition-colors ml-auto text-[11px] sm:text-xs"
                >
                  <span>Original</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          </div>

          {/* Right Column: Format Options & Download Trigger */}
          <div className="md:col-span-7 space-y-4 sm:space-y-6">
            <div>
              <div className="flex items-center justify-between mb-2.5 sm:mb-3">
                <h3 className="text-xs sm:text-sm font-semibold text-zinc-300 uppercase tracking-wider flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-violet-400" />
                  <span>Select Download Format</span>
                </h3>
              </div>

              <FormatSelector
                formats={metadata.formats}
                selectedFormat={selectedFormat}
                onSelectFormat={setSelectedFormat}
              />
            </div>

            {/* Progress indicator during processing */}
            {isProcessing && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="space-y-2 p-3 sm:p-4 rounded-xl sm:rounded-2xl bg-violet-950/30 border border-violet-500/20"
              >
                <div className="flex justify-between text-xs font-semibold text-violet-200">
                  <span className="flex items-center gap-2">
                    <Loader2 className="w-3.5 h-3.5 animate-spin text-violet-400" />
                    <span>Processing ({selectedFormat?.label})...</span>
                  </span>
                  <span>{progress}%</span>
                </div>

                <div className="w-full h-2 rounded-full bg-zinc-900 overflow-hidden">
                  <motion.div
                    className="h-full bg-gradient-to-r from-violet-500 to-cyan-400 rounded-full"
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 0.3 }}
                  />
                </div>

                {downloadSpeed && (
                  <div className="flex justify-between text-[11px] text-zinc-400 pt-1">
                    <span>Speed: {downloadSpeed}</span>
                    <span>Est. Size: {selectedFormat?.sizeEstimate || 'Auto'}</span>
                  </div>
                )}
              </motion.div>
            )}

            {/* Success Animation Banner */}
            {isCompleted && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex items-center gap-2.5 p-3 sm:p-4 rounded-xl sm:rounded-2xl bg-emerald-950/40 border border-emerald-500/30 text-emerald-300 text-xs sm:text-sm font-medium"
              >
                <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-400 shrink-0" />
                <span>Downloaded successfully to your device!</span>
              </motion.div>
            )}

            {/* Big Download Button */}
            <button
              type="button"
              onClick={handleDownload}
              disabled={!selectedFormat || isProcessing}
              className={`w-full flex items-center justify-center gap-2.5 py-3.5 sm:py-4 px-4 sm:px-6 rounded-xl sm:rounded-2xl font-bold text-sm sm:text-base md:text-lg text-white shadow-xl transition-all ${
                isProcessing
                  ? 'bg-zinc-800 text-zinc-400 cursor-not-allowed border border-zinc-700'
                  : 'gradient-button cursor-pointer hover:scale-[1.01] active:scale-[0.98]'
              }`}
            >
              {isProcessing ? (
                <>
                  <Loader2 className="w-4 h-4 sm:w-5 sm:h-5 animate-spin" />
                  <span>Preparing Download...</span>
                </>
              ) : (
                <>
                  <Download className="w-4 h-4 sm:w-5 sm:h-5" />
                  <span>Download {selectedFormat ? selectedFormat.label : 'Media'}</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
