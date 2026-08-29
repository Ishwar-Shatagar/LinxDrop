'use client';

import { Lock, ShieldCheck, UserX } from 'lucide-react';

export const PrivacySafety = () => {
  return (
    <section className="w-full max-w-4xl mx-auto px-4 my-16">
      <div className="p-6 sm:p-8 rounded-3xl bg-zinc-900/40 border border-zinc-800/80 backdrop-blur-xl">
        <div className="flex flex-col sm:flex-row items-start gap-4 sm:gap-6">
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center shrink-0">
            <ShieldCheck className="w-6 h-6 text-emerald-400" />
          </div>

          <div className="space-y-3">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <span>Privacy & Authorized Downloads Policy</span>
            </h3>

            <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed">
              LinkxDrop is designed strictly for downloading publicly accessible media that you own or are authorized to download for personal offline use. We do not bypass DRM protection, paywalls, private account privacy settings, or copyright access controls.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <div className="flex items-center gap-2 text-xs text-zinc-300 font-medium">
                <UserX className="w-4 h-4 text-violet-400" />
                <span>Zero Account Registration Required</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-zinc-300 font-medium">
                <Lock className="w-4 h-4 text-cyan-400" />
                <span>No File Tracking & Instant Server Purge</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
