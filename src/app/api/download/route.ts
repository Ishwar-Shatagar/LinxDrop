import { checkRateLimit } from '@/lib/rate-limit';
import { cleanupOldTempFiles, ensureTempDirExists } from '@/lib/temp-cleaner';
import ytdl from '@distube/ytdl-core';
import { exec } from 'child_process';
import crypto from 'crypto';
import fs from 'fs';
import { NextRequest, NextResponse } from 'next/server';
import path from 'path';
import { promisify } from 'util';

const execAsync = promisify(exec);

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const url = searchParams.get('url');
  const formatId = searchParams.get('formatId') || '1080p';
  const rawTitle = searchParams.get('title') || 'Media';
  const ext = searchParams.get('ext') || 'mp4';
  const directUrl = searchParams.get('directUrl');

  return handleDownload(req, url, formatId, rawTitle, ext, directUrl);
}

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}));
  const { url, formatId, title, ext, directUrl } = body;

  return handleDownload(req, url, formatId, title || 'Media', ext || 'mp4', directUrl);
}

async function handleDownload(
  req: NextRequest,
  url: string | null,
  formatId: string,
  rawTitle: string,
  ext: string,
  directUrl?: string | null
) {
  const ip = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || '127.0.0.1';
  const rateCheck = checkRateLimit(`download-${ip}`, 60, 60 * 1000);

  if (!rateCheck.isAllowed) {
    return NextResponse.json(
      { error: 'Download rate limit exceeded. Please wait a moment.' },
      { status: 429 }
    );
  }

  const cleanTitle = rawTitle.replace(/[^a-zA-Z0-9_\-\s]/g, '').trim().substring(0, 45) || 'LinkxDrop_Media';
  const isAudioRequest = ['mp3', 'm4a', 'wav'].includes(ext.toLowerCase());
  const isImageRequest = ['jpg', 'jpeg', 'png', 'webp'].includes(ext.toLowerCase());

  // 1. Direct Remote Stream Fetch (TikWM, Twitter MP4, Instagram CDN, Image CDNs)
  if (directUrl && directUrl.startsWith('http')) {
    try {
      let referer = 'https://www.google.com/';
      if (directUrl.includes('cdninstagram') || directUrl.includes('fbcdn')) {
        referer = 'https://www.instagram.com/';
      } else if (directUrl.includes('tiktok') || directUrl.includes('tikwm')) {
        referer = 'https://www.tiktok.com/';
      } else if (directUrl.includes('twimg')) {
        referer = 'https://twitter.com/';
      }

      const streamRes = await fetch(directUrl, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36',
          'Referer': referer,
          'Accept': '*/*'
        }
      });

      if (streamRes.ok) {
        const mediaBuffer = await streamRes.arrayBuffer();
        if (mediaBuffer.byteLength > 1024) {
          const outputExt = isImageRequest ? ext : (isAudioRequest ? 'm4a' : 'mp4');
          const safeFilename = `LinkxDrop_${cleanTitle}.${outputExt}`;
          const contentType = getContentType(outputExt);

          return new NextResponse(new Uint8Array(mediaBuffer), {
            status: 200,
            headers: {
              'Content-Type': contentType,
              'Content-Disposition': `attachment; filename="${safeFilename}"`,
              'Content-Length': mediaBuffer.byteLength.toString(),
              'Cache-Control': 'no-cache'
            }
          });
        }
      }
    } catch (e) {
      console.warn('Direct stream fetch error:', e);
    }
  }

  // 2. Full Server-side yt-dlp binary extraction (Docker / Render / Railway / Localhost)
  if (url && url.startsWith('http')) {
    try {
      const tempDir = ensureTempDirExists();
      const uniqueId = crypto.randomBytes(8).toString('hex');
      const tempOutputPattern = path.join(tempDir, `${uniqueId}.%(ext)s`);

      let formatSelector = 'b[ext=mp4]/best';
      if (isAudioRequest) {
        formatSelector = 'ba[ext=m4a]/ba/b';
      }

      const ytCommand = `python -m yt_dlp --no-warnings --no-playlist --extractor-args "youtube:player_client=android,web" -f "${formatSelector}" -o "${tempOutputPattern}" "${url.replace(/"/g, '\\"')}"`;

      await execAsync(ytCommand, { timeout: 35000 });

      const files = fs.readdirSync(tempDir);
      const downloadedFile = files.find(f => f.startsWith(uniqueId));

      if (downloadedFile) {
        const filePath = path.join(tempDir, downloadedFile);
        const fileExt = path.extname(downloadedFile).replace('.', '').toLowerCase() || ext;
        const fileBuffer = fs.readFileSync(filePath);

        try { fs.unlinkSync(filePath); } catch {}

        const outputExt = isAudioRequest ? (fileExt === 'webm' ? 'm4a' : fileExt) : fileExt;
        const safeFilename = `LinkxDrop_${cleanTitle}.${outputExt}`;
        const contentType = getContentType(outputExt);

        return new NextResponse(new Uint8Array(fileBuffer), {
          status: 200,
          headers: {
            'Content-Type': contentType,
            'Content-Disposition': `attachment; filename="${safeFilename}"`,
            'Content-Length': fileBuffer.byteLength.toString(),
            'Cache-Control': 'no-cache'
          }
        });
      }
    } catch {}
  }

  // 3. YouTube ytdl-core fallback
  if (url && (url.includes('youtube.com') || url.includes('youtu.be'))) {
    try {
      const info = await ytdl.getInfo(url);
      const filterType = isAudioRequest ? 'audioonly' : 'videoandaudio';
      const formats = ytdl.filterFormats(info.formats, filterType);
      const chosen = formats[0];

      if (chosen && chosen.url) {
        const fetchStream = await fetch(chosen.url, {
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36'
          }
        });

        if (fetchStream.ok) {
          const arrayBuf = await fetchStream.arrayBuffer();
          if (arrayBuf.byteLength > 1024) {
            const outputExt = isAudioRequest ? 'm4a' : 'mp4';
            const safeFilename = `LinkxDrop_${cleanTitle}.${outputExt}`;
            const contentType = getContentType(outputExt);

            return new NextResponse(new Uint8Array(arrayBuf), {
              status: 200,
              headers: {
                'Content-Type': contentType,
                'Content-Disposition': `attachment; filename="${safeFilename}"`,
                'Content-Length': arrayBuf.byteLength.toString(),
                'Cache-Control': 'no-cache'
              }
            });
          }
        }
      }
    } catch {}
  }

  // 4. If directUrl exists and server fetch failed, redirect client directly to CDN stream
  if (directUrl && directUrl.startsWith('http')) {
    return NextResponse.redirect(directUrl);
  }

  // 5. Explicit error response for serverless restrictions
  return NextResponse.json(
    { error: 'YouTube/Social media extraction on Vercel Serverless is restricted by datacenter firewalls. Deploy to Render (Free) using the 1-Click button or run locally for 100% video/audio downloads.' },
    { status: 422 }
  );
}

function getContentType(ext: string): string {
  switch (ext.toLowerCase()) {
    case 'mp3': return 'audio/mpeg';
    case 'm4a': return 'audio/mp4';
    case 'wav': return 'audio/wav';
    case 'mp4': return 'video/mp4';
    case 'webm': return 'video/webm';
    case 'jpg':
    case 'jpeg': return 'image/jpeg';
    case 'png': return 'image/png';
    case 'webp': return 'image/webp';
    default: return 'application/octet-stream';
  }
}
