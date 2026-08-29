'use client';

import { motion } from 'framer-motion';
import { Download, Link as LinkIcon, Sliders } from 'lucide-react';

export const HowItWorks = () => {
  const steps = [
    {
      num: '01',
      title: 'Paste Link',
      desc: 'Copy any public media link from YouTube, TikTok, Instagram, Twitter/X, or Facebook and drop it into LinkxDrop.',
      icon: <LinkIcon className="w-6 h-6 text-violet-400" />
    },
    {
      num: '02',
      title: 'Choose Format',
      desc: 'Select your preferred output: Video (1080p/720p MP4), Audio (320kbps MP3/M4A/WAV), or High-Res Cover Poster.',
      icon: <Sliders className="w-6 h-6 text-cyan-400" />
    },
    {
      num: '03',
      title: 'Fast Download',
      desc: 'Click Download. Server processes the file and sends it straight to your browser Downloads folder. Zero ads, zero accounts.',
      icon: <Download className="w-6 h-6 text-emerald-400" />
    }
  ];

  return (
    <section className="w-full max-w-5xl mx-auto px-4 my-20">
      <div className="text-center mb-12">
        <span className="text-xs uppercase tracking-widest font-semibold text-violet-400">
          Super Simple Flow
        </span>
        <h2 className="text-3xl sm:text-4xl font-extrabold text-white mt-2">
          How LinkxDrop Works
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {steps.map((step, idx) => (
          <motion.div
            key={step.num}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: idx * 0.15 }}
            className="p-6 rounded-2xl glass-card glass-card-hover relative border border-zinc-800 space-y-4"
          >
            <div className="flex items-center justify-between">
              <div className="w-12 h-12 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center">
                {step.icon}
              </div>
              <span className="text-3xl font-black text-zinc-800 font-mono">
                {step.num}
              </span>
            </div>

            <div>
              <h3 className="text-xl font-bold text-white mb-2">
                {step.title}
              </h3>
              <p className="text-sm text-zinc-400 leading-relaxed font-normal">
                {step.desc}
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
};
