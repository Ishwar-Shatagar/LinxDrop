import type { Metadata, Viewport } from "next";
import "./globals.css";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#030303",
};

export const metadata: Metadata = {
  title: "LinkxDrop — Drop a link. Get your media.",
  description: "Fast, minimal, eye-catching media downloader for publicly accessible content from YouTube, TikTok, Instagram, Twitter/X, Facebook, and direct media URLs.",
  authors: [{ name: "Ishwar Shtagar" }],
  keywords: ["media downloader", "youtube downloader", "tiktok downloader", "instagram reel downloader", "twitter video downloader", "mp4 downloader", "mp3 converter"],
  openGraph: {
    title: "LinkxDrop — Drop a link. Get your media.",
    description: "Instant public media downloader. No login, no ads, high speed MP4 & MP3 conversion.",
    type: "website",
    url: "https://linkxdrop.com",
  },
  twitter: {
    card: "summary_large_image",
    title: "LinkxDrop — Fast Media Downloader",
    description: "Drop a link. Get your media in seconds.",
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark scroll-smooth">
      <body className="min-h-screen bg-[#030303] text-zinc-100 mesh-gradient-bg antialiased selection:bg-violet-500 selection:text-white">
        {children}
      </body>
    </html>
  );
}
