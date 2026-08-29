# LinkxDrop 🚀

> **Drop a link. Get your media.**
> A production-ready, ultra-fast, minimal media downloader for publicly accessible YouTube, TikTok, Instagram, Twitter/X, Facebook, Vimeo, and direct media content.

**Author**: Ishwar Shtagar

---

## ✨ Key Features

- ⚡ **Zero Login / Signup**: Direct paste & download experience with zero friction.
- 🎨 **Modern Dark Aesthetics**: Premium charcoal theme with animated mesh gradients, light glassmorphism, and Framer Motion micro-interactions.
- 🔍 **Instant Platform Detection**: Automatic URL recognition for YouTube, TikTok, Instagram, Twitter/X, Facebook, Vimeo, and direct media files.
- 🎬 **Multi-Format Extraction**:
  - **Video**: MP4 1080p Full HD, 720p HD, 480p SD, 360p Mobile.
  - **Audio**: MP3 (320kbps), M4A (AAC), WAV Lossless.
  - **Image**: Cover Artwork & Posters in JPG, PNG, and WebP formats.
- 🛡️ **Fair Use & Copyright Compliant**: Built strictly for authorized/public media; rejects private/paywalled content with human-friendly alerts.
- ⚡ **Stream Processing & Auto Cleanup**: Temporary files purged every 15 minutes to guarantee zero disk clutter.
- 🔒 **Rate-Limited API**: In-memory sliding window rate limiter protecting endpoints against spam.

---

## 🛠️ Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS + Vanilla CSS animations
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **API Engine**: Next.js Server Routes (`/api/analyze` and `/api/download`)

---

## 🚀 Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## 📜 License

Created by **Ishwar Shtagar**. MIT License. Designed for fair-use public media downloading.
