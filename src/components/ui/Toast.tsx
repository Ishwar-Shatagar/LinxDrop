'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { AlertCircle, CheckCircle2, Info, X } from 'lucide-react';
import React from 'react';

export interface ToastProps {
  type: 'error' | 'success' | 'info';
  message: string;
  onClose: () => void;
}

export const Toast: React.FC<ToastProps> = ({ type, message, onClose }) => {
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 50, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 20, scale: 0.95 }}
        className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 px-5 py-4 rounded-xl border shadow-2xl backdrop-blur-xl max-w-md ${
          type === 'error'
            ? 'bg-rose-950/80 border-rose-500/30 text-rose-200'
            : type === 'success'
            ? 'bg-emerald-950/80 border-emerald-500/30 text-emerald-200'
            : 'bg-zinc-900/90 border-zinc-700 text-zinc-200'
        }`}
      >
        {type === 'error' && <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />}
        {type === 'success' && <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />}
        {type === 'info' && <Info className="w-5 h-5 text-sky-400 shrink-0" />}
        
        <p className="text-sm font-medium leading-relaxed pr-2">{message}</p>
        
        <button
          onClick={onClose}
          className="p-1 rounded-lg hover:bg-white/10 text-zinc-400 hover:text-white transition-colors ml-auto"
          aria-label="Close notification"
        >
          <X className="w-4 h-4" />
        </button>
      </motion.div>
    </AnimatePresence>
  );
};
