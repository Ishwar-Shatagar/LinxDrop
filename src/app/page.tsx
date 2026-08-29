'use client';

import { Footer } from '@/components/Footer';
import { HeroSection } from '@/components/HeroSection';
import { HowItWorks } from '@/components/HowItWorks';
import { PlatformBadges } from '@/components/PlatformBadges';
import { PrivacySafety } from '@/components/PrivacySafety';
import { ResultCard } from '@/components/ResultCard';
import { Toast, ToastProps } from '@/components/ui/Toast';
import { UrlInputForm } from '@/components/UrlInputForm';
import { detectPlatform } from '@/lib/platform-detector';
import { MediaMetadata, PlatformType } from '@/lib/types';
import { AnimatePresence, motion } from 'framer-motion';
import { Download, Sparkles } from 'lucide-react';
import { useState } from 'react';

export default function Home() {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [activePlatform, setActivePlatform] = useState<PlatformType>('unsupported');
  const [mediaData, setMediaData] = useState<MediaMetadata | null>(null);
  const [toast, setToast] = useState<Omit<ToastProps, 'onClose'> | null>(null);

  const showToast = (type: 'error' | 'success' | 'info', message: string) => {
    setToast({ type, message });
    setTimeout(() => {
      setToast(null);
    }, 5000);
  };

  const handleAnalyze = async (inputUrl: string) => {
    setIsAnalyzing(true);
    setMediaData(null);

    const detection = detectPlatform(inputUrl);
    setActivePlatform(detection.platform);

    try {
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: inputUrl })
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.error || 'Failed to analyze media link.');
      }

      setMediaData(result.data);
      showToast('success', `Successfully analyzed ${result.data.platform.toUpperCase()} media! Select format below.`);

      // Smooth scroll down to result card
      setTimeout(() => {
        const el = document.getElementById('result-section');
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 200);

    } catch (err: any) {
      showToast('error', err.message || 'Unable to fetch media info. Please verify the URL.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-between">
      {/* Top Navbar */}
      <header className="w-full border-b border-zinc-800/60 bg-zinc-950/60 backdrop-blur-xl sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl gradient-button flex items-center justify-center shadow-lg">
              <Download className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-black text-white tracking-tight">
              Linkx<span className="gradient-text">Drop</span>
            </span>
          </div>

          <div className="flex items-center gap-3">
            <span className="hidden sm:inline-flex items-center gap-1.5 text-xs text-violet-300 bg-violet-500/10 px-3 py-1.5 rounded-full border border-violet-500/20 font-medium">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Free Public Downloader</span>
            </span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 pb-12">
        <HeroSection />

        {/* Input Form */}
        <UrlInputForm onAnalyze={handleAnalyze} isLoading={isAnalyzing} />

        {/* Supported Platforms Indicators */}
        <PlatformBadges
          activePlatform={activePlatform}
          onSelectExample={(exampleUrl) => handleAnalyze(exampleUrl)}
        />

        {/* Loading Skeleton */}
        {isAnalyzing && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full max-w-4xl mx-auto px-4 my-8"
          >
            <div className="p-8 rounded-3xl glass-card border border-zinc-800 space-y-6 animate-pulse">
              <div className="flex items-center gap-3">
                <div className="w-6 h-6 rounded-full bg-zinc-800" />
                <div className="h-4 w-48 bg-zinc-800 rounded-md" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
                <div className="md:col-span-5 space-y-4">
                  <div className="aspect-video bg-zinc-800 rounded-2xl" />
                  <div className="h-6 bg-zinc-800 rounded-md w-3/4" />
                </div>
                <div className="md:col-span-7 space-y-4">
                  <div className="h-10 bg-zinc-800 rounded-xl" />
                  <div className="grid grid-cols-2 gap-3">
                    <div className="h-14 bg-zinc-800 rounded-xl" />
                    <div className="h-14 bg-zinc-800 rounded-xl" />
                  </div>
                  <div className="h-14 bg-zinc-800 rounded-2xl" />
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Result Card Section */}
        <div id="result-section">
          {mediaData && (
            <ResultCard
              metadata={mediaData}
              onDownloadError={(err) => showToast('error', err)}
            />
          )}
        </div>

        {/* Informational Sections */}
        <div id="how-it-works">
          <HowItWorks />
        </div>

        <div id="privacy">
          <PrivacySafety />
        </div>
      </main>

      {/* Footer */}
      <Footer />

      {/* Toast Notification Container */}
      <AnimatePresence>
        {toast && (
          <Toast
            type={toast.type}
            message={toast.message}
            onClose={() => setToast(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
