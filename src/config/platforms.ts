import { PlatformConfig, PlatformType } from '../lib/types';

export const PLATFORM_CONFIGS: Record<PlatformType, PlatformConfig> = {
  youtube: {
    id: 'youtube',
    name: 'YouTube',
    domain: 'youtube.com',
    iconName: 'Youtube',
    badgeBg: 'bg-red-500/10 border-red-500/30',
    badgeText: 'text-red-400',
    accentColor: '#ef4444',
    gradient: 'from-red-500 to-rose-600',
    supportedFormats: ['video', 'audio', 'image'],
    exampleUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ'
  },
  tiktok: {
    id: 'tiktok',
    name: 'TikTok',
    domain: 'tiktok.com',
    iconName: 'Video',
    badgeBg: 'bg-pink-500/10 border-pink-500/30',
    badgeText: 'text-pink-400',
    accentColor: '#ec4899',
    gradient: 'from-pink-500 via-cyan-400 to-emerald-400',
    supportedFormats: ['video', 'audio', 'image'],
    exampleUrl: 'https://www.tiktok.com/@username/video/123456789'
  },
  instagram: {
    id: 'instagram',
    name: 'Instagram',
    domain: 'instagram.com',
    iconName: 'Instagram',
    badgeBg: 'bg-purple-500/10 border-purple-500/30',
    badgeText: 'text-purple-400',
    accentColor: '#d946ef',
    gradient: 'from-amber-500 via-purple-600 to-pink-500',
    supportedFormats: ['video', 'audio', 'image'],
    exampleUrl: 'https://www.instagram.com/reel/C123456789/'
  },
  twitter: {
    id: 'twitter',
    name: 'X / Twitter',
    domain: 'x.com',
    iconName: 'Twitter',
    badgeBg: 'bg-sky-500/10 border-sky-500/30',
    badgeText: 'text-sky-400',
    accentColor: '#38bdf8',
    gradient: 'from-sky-400 to-blue-600',
    supportedFormats: ['video', 'audio', 'image'],
    exampleUrl: 'https://x.com/user/status/123456789'
  },
  facebook: {
    id: 'facebook',
    name: 'Facebook',
    domain: 'facebook.com',
    iconName: 'Facebook',
    badgeBg: 'bg-blue-500/10 border-blue-500/30',
    badgeText: 'text-blue-400',
    accentColor: '#3b82f6',
    gradient: 'from-blue-600 to-indigo-700',
    supportedFormats: ['video', 'audio', 'image'],
    exampleUrl: 'https://www.facebook.com/watch/?v=123456789'
  },
  vimeo: {
    id: 'vimeo',
    name: 'Vimeo',
    domain: 'vimeo.com',
    iconName: 'Film',
    badgeBg: 'bg-cyan-500/10 border-cyan-500/30',
    badgeText: 'text-cyan-400',
    accentColor: '#06b6d4',
    gradient: 'from-cyan-400 to-teal-600',
    supportedFormats: ['video', 'audio', 'image'],
    exampleUrl: 'https://vimeo.com/123456789'
  },
  generic: {
    id: 'generic',
    name: 'Public Media URL',
    domain: 'direct',
    iconName: 'Globe',
    badgeBg: 'bg-emerald-500/10 border-emerald-500/30',
    badgeText: 'text-emerald-400',
    accentColor: '#10b981',
    gradient: 'from-emerald-400 to-teal-600',
    supportedFormats: ['video', 'audio', 'image'],
    exampleUrl: 'https://example.com/media.mp4'
  },
  unsupported: {
    id: 'unsupported',
    name: 'Unsupported Link',
    domain: 'unknown',
    iconName: 'AlertCircle',
    badgeBg: 'bg-zinc-800 border-zinc-700',
    badgeText: 'text-zinc-400',
    accentColor: '#71717a',
    gradient: 'from-zinc-500 to-zinc-700',
    supportedFormats: [],
    exampleUrl: ''
  }
};
