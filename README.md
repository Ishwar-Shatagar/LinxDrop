# 🚀 LinkxDrop — Fast & Minimal Media Downloader

> **"Drop a link. Get your media."**  
> A fast, modern, and privacy-first web application for downloading publicly accessible media from YouTube, TikTok, Instagram, Twitter/X, Facebook, and direct media URLs without signups or ads.

[![Deploy to Render](https://render.com/images/deploy-to-render-button.svg)](https://render.com/deploy?repo=https://github.com/Ishwar-Shatagar/LinxDrop)

---

## 👨‍💻 Author & Creator

- **Developer**: **Ishwar Shtagar**
- **Project**: LinkxDrop
- **Repository**: [https://github.com/Ishwar-Shatagar/LinxDrop](https://github.com/Ishwar-Shatagar/LinxDrop)
- **License**: MIT License

---

## 📖 What is LinkxDrop?

**LinkxDrop** is designed for extreme simplicity and speed:
1. You copy a public media link from YouTube, TikTok, Instagram, Twitter/X, or Facebook.
2. LinkxDrop instantly detects the platform, retrieves video details (title, creator, duration, thumbnail), and provides multiple download formats.
3. You select your format (**MP4 HD Video**, **MP3/M4A Audio**, or **Cover Poster**) and download it directly to your device.

---

## ⚡ Tech Stack

| Layer | Technology | Purpose |
| :--- | :--- | :--- |
| **Frontend Framework** | **Next.js 15 (App Router)** | Server & Client components, lightning-fast routing |
| **Language** | **TypeScript** | Strict type safety and error-free code |
| **Styling** | **Tailwind CSS** | Ultra-responsive layout for Mobile, Tablet, & Laptop |
| **Theme Design** | **Vanilla CSS + Glassmorphism** | Pitch-black obsidian theme (`#030303`) with neon glow accents |
| **Micro-Animations** | **Framer Motion** | Fluid page transitions, loading states, & toast alerts |
| **Iconography** | **Lucide React** | Clean, lightweight modern icons |
| **Backend Engine** | **Next.js API Routes (`/api/*`)** | Dynamic metadata extraction, streaming, & cleanup |
| **Media Processing** | **yt-dlp, FFmpeg, Node.js** | Extracts and converts 100% playable video and audio streams |

---

## 🔄 How LinkxDrop Works (Workflow)

```
[ User Pastes URL ] 
        │
        ▼
[ 1. Auto Platform Detection ] ──▶ (Identifies YouTube, TikTok, IG, X, FB)
        │
        ▼
[ 2. Metadata Extraction ] ──────▶ (/api/analyze parses title, duration, author, formats)
        │
        ▼
[ 3. Interactive Result Card ] ──▶ (User chooses Video MP4, Audio MP3/M4A, or Image)
        │
        ▼
[ 4. Streaming & Download ] ────▶ (/api/download streams real media file to Downloads folder)
```

---

## 📱 Responsive on All Devices

- **📱 Mobile (iPhone & Android)**: Seamless single-column view, touch-optimized buttons, no horizontal scrolling.
- **💻 Laptops & Desktops**: Dual-column dashboard with preview cards, hover effects, and keyboard shortcuts (`Enter ↵`).

---

## 🌐 1-Click Cloud Deployment (Render - Free)

Click the button below to deploy with full **Python + FFmpeg + yt-dlp** support:

👉 **[Deploy LinkxDrop on Render](https://render.com/deploy?repo=https://github.com/Ishwar-Shatagar/LinxDrop)**

---

## 🚀 How to Run Locally

### 1. Prerequisites
- [Node.js](https://nodejs.org/) (v18 or higher)
- [Python](https://www.python.org/) with `yt-dlp` (`pip install yt-dlp`)

### 2. Installation
```bash
# Clone repository
git clone https://github.com/Ishwar-Shatagar/LinxDrop.git
cd LinxDrop

# Install dependencies
npm install

# Start local server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🛡️ Privacy & Compliance
- **Zero Account Requirement**: No signups, no login, no tracking cookies.
- **Public Content Only**: Does not bypass DRM, paywalls, or private account restrictions.
- **Instant Server Cleanup**: Temporary files are purged automatically after streaming.

---

Designed & Developed by **Ishwar Shtagar** 
