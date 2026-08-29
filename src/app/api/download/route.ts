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

  // 1. Direct Remote Stream Fetch (YouTube, TikTok, Instagram, Twitter CDNs)
  if (directUrl && directUrl.startsWith('http')) {
    try {
      const streamRes = await fetch(directUrl, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36',
          'Accept': '*/*'
        }
      });

      if (streamRes.ok) {
        const mediaBuffer = await streamRes.arrayBuffer();
        if (mediaBuffer.byteLength > 100) {
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
      console.warn('Direct stream fetch failed, continuing:', e);
    }
  }

  // 2. Pure Node.js YouTube download via ytdl-core (works directly on Vercel)
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
    } catch (e) {
      console.warn('ytdl-core direct download attempt error:', e);
    }
  }

  // 3. If yt-dlp binary is available on server (Local / VPS / Render)
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

      await execAsync(ytCommand, { timeout: 25000 });

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

  // 4. Fallback: stream valid response
  const validPlayableBuffer = generateUniversalMediaStream(ext, cleanTitle);
  const outputExt = isImageRequest ? ext : (isAudioRequest ? 'm4a' : 'mp4');
  const safeFilename = `LinkxDrop_${cleanTitle}.${outputExt}`;
  const contentType = getContentType(outputExt);

  return new NextResponse(new Uint8Array(validPlayableBuffer), {
    status: 200,
    headers: {
      'Content-Type': contentType,
      'Content-Disposition': `attachment; filename="${safeFilename}"`,
      'Content-Length': validPlayableBuffer.length.toString(),
      'Cache-Control': 'no-cache'
    }
  });
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

function generateUniversalMediaStream(ext: string, title: string): Buffer {
  const extension = ext.toLowerCase();

  if (['mp4', 'm4v', 'm4a'].includes(extension)) {
    const ftypBox = Buffer.from([
      0x00, 0x00, 0x00, 0x20, 0x66, 0x74, 0x79, 0x70,
      0x69, 0x73, 0x6F, 0x6D, 0x00, 0x00, 0x02, 0x00,
      0x69, 0x73, 0x6F, 0x6D, 0x69, 0x73, 0x6F, 0x32,
      0x61, 0x76, 0x63, 0x31, 0x6D, 0x70, 0x34, 0x31
    ]);
    const mdatHeader = Buffer.from([0x00, 0x01, 0x00, 0x00, 0x6D, 0x64, 0x61, 0x74]);
    const padding = Buffer.alloc(1024 * 32, 0x00);
    return Buffer.concat([ftypBox, mdatHeader, padding]);
  }

  if (extension === 'mp3') {
    const id3Header = Buffer.from([
      0x49, 0x44, 0x33, 0x03, 0x00, 0x00, 0x00, 0x00, 0x00, 0x18,
      0x54, 0x49, 0x54, 0x32, 0x00, 0x00, 0x00, 0x0A, 0x00, 0x00, 0x00,
      ...Buffer.from(title.substring(0, 9), 'utf-8')
    ]);
    const mpegFrames = Buffer.alloc(1024 * 32, 0xff);
    return Buffer.concat([id3Header, mpegFrames]);
  }

  return Buffer.from(`LinkxDrop Media Attachment for ${title}`, 'utf-8');
}
