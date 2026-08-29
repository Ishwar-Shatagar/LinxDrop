import { checkRateLimit } from '@/lib/rate-limit';
import { cleanupOldTempFiles, ensureTempDirExists } from '@/lib/temp-cleaner';
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
  // 1. Rate Limiting
  const ip = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || '127.0.0.1';
  const rateCheck = checkRateLimit(`download-${ip}`, 40, 60 * 1000);

  if (!rateCheck.isAllowed) {
    return NextResponse.json(
      { error: 'Download rate limit exceeded. Please wait a moment.' },
      { status: 429 }
    );
  }

  // 2. Sanitize filename
  const cleanTitle = rawTitle.replace(/[^a-zA-Z0-9_\-\s]/g, '').trim().substring(0, 50) || 'LinkxDrop_Media';
  
  // Format selection
  const isAudioRequest = ['mp3', 'm4a', 'wav'].includes(ext.toLowerCase());
  const isImageRequest = ['jpg', 'jpeg', 'png', 'webp'].includes(ext.toLowerCase());

  // 3. Handle Image direct downloads
  if (isImageRequest && directUrl && directUrl.startsWith('http')) {
    try {
      const imgRes = await fetch(directUrl);
      if (imgRes.ok) {
        const imageBuffer = await imgRes.arrayBuffer();
        const contentType = ext === 'png' ? 'image/png' : ext === 'webp' ? 'image/webp' : 'image/jpeg';
        const safeFilename = `LinkxDrop_${cleanTitle}.${ext}`;

        return new NextResponse(new Uint8Array(imageBuffer), {
          status: 200,
          headers: {
            'Content-Type': contentType,
            'Content-Disposition': `attachment; filename="${safeFilename}"`,
            'Content-Length': imageBuffer.byteLength.toString(),
            'Cache-Control': 'no-cache'
          }
        });
      }
    } catch (e) {
      console.error('Image fetch error:', e);
    }
  }

  // 4. Download Real Audio / Video Media using yt-dlp to temp file
  if (url && url.startsWith('http')) {
    try {
      const tempDir = ensureTempDirExists();
      const uniqueId = crypto.randomBytes(8).toString('hex');
      const tempOutputPattern = path.join(tempDir, `${uniqueId}.%(ext)s`);

      // Determine appropriate yt-dlp format selector
      let formatSelector = 'b[ext=mp4]/best';
      if (isAudioRequest) {
        formatSelector = 'ba[ext=m4a]/ba/b';
      }

      const ytCommand = `python -m yt_dlp --no-warnings --no-playlist --extractor-args "youtube:player_client=android,web" -f "${formatSelector}" -o "${tempOutputPattern}" "${url.replace(/"/g, '\\"')}"`;

      await execAsync(ytCommand, { timeout: 35000 });

      // Find the generated file in temp directory
      const files = fs.readdirSync(tempDir);
      const downloadedFile = files.find(f => f.startsWith(uniqueId));

      if (downloadedFile) {
        const filePath = path.join(tempDir, downloadedFile);
        const fileExt = path.extname(downloadedFile).replace('.', '').toLowerCase() || ext;
        const fileBuffer = fs.readFileSync(filePath);

        // Clean up temp file immediately after reading into buffer
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
    } catch (error: any) {
      console.error('yt-dlp download execution error:', error);
    }
  }

  // 5. Fallback: Direct stream fetch if directUrl is available
  if (directUrl && directUrl.startsWith('http')) {
    try {
      const streamRes = await fetch(directUrl, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36'
        }
      });

      if (streamRes.ok) {
        const mediaBuffer = await streamRes.arrayBuffer();
        const outputExt = isAudioRequest ? 'm4a' : ext;
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
    } catch {}
  }

  // 6. Generic Error response
  return NextResponse.json(
    { error: 'Media stream could not be extracted. The source may be restricted or unavailable.' },
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
