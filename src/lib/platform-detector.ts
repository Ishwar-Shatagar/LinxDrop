import { PlatformType } from './types';

export interface DetectionResult {
  isValid: boolean;
  platform: PlatformType;
  cleanUrl: string;
  mediaId?: string;
  errorMessage?: string;
}

export function detectPlatform(inputUrl: string): DetectionResult {
  if (!inputUrl || typeof inputUrl !== 'string') {
    return { isValid: false, platform: 'unsupported', cleanUrl: '' };
  }

  let trimmed = inputUrl.trim();
  if (!trimmed.startsWith('http://') && !trimmed.startsWith('https://')) {
    trimmed = 'https://' + trimmed;
  }

  let parsedUrl: URL;
  try {
    parsedUrl = new URL(trimmed);
  } catch {
    return {
      isValid: false,
      platform: 'unsupported',
      cleanUrl: inputUrl,
      errorMessage: 'Please enter a valid HTTP or HTTPS media link.'
    };
  }

  const hostname = parsedUrl.hostname.toLowerCase();
  const pathname = parsedUrl.pathname;

  // 1. YouTube
  if (hostname.includes('youtube.com') || hostname.includes('youtu.be')) {
    let videoId: string | null = null;

    if (hostname.includes('youtu.be')) {
      videoId = pathname.slice(1);
    } else if (pathname.includes('/watch')) {
      videoId = parsedUrl.searchParams.get('v');
    } else if (pathname.includes('/shorts/')) {
      videoId = pathname.split('/shorts/')[1]?.split('/')[0] || null;
    } else if (pathname.includes('/embed/')) {
      videoId = pathname.split('/embed/')[1]?.split('/')[0] || null;
    }

    if (videoId) {
      // sanitize video ID
      videoId = videoId.split('&')[0].split('?')[0];
      return {
        isValid: true,
        platform: 'youtube',
        cleanUrl: `https://www.youtube.com/watch?v=${videoId}`,
        mediaId: videoId
      };
    }
  }

  // 2. TikTok
  if (hostname.includes('tiktok.com')) {
    const videoMatch = pathname.match(/\/video\/(\d+)/);
    if (videoMatch || pathname.includes('/@') || hostname.includes('vm.tiktok.com') || hostname.includes('vt.tiktok.com')) {
      return {
        isValid: true,
        platform: 'tiktok',
        cleanUrl: parsedUrl.toString(),
        mediaId: videoMatch ? videoMatch[1] : undefined
      };
    }
  }

  // 3. Instagram
  if (hostname.includes('instagram.com')) {
    if (pathname.includes('/p/') || pathname.includes('/reel/') || pathname.includes('/tv/')) {
      const parts = pathname.split('/').filter(Boolean);
      const codeIndex = parts.findIndex(p => ['p', 'reel', 'tv'].includes(p)) + 1;
      const code = parts[codeIndex];

      return {
        isValid: true,
        platform: 'instagram',
        cleanUrl: parsedUrl.toString(),
        mediaId: code
      };
    }
  }

  // 4. X / Twitter
  if (hostname.includes('twitter.com') || hostname.includes('x.com')) {
    const statusMatch = pathname.match(/\/status\/(\d+)/);
    if (statusMatch) {
      return {
        isValid: true,
        platform: 'twitter',
        cleanUrl: parsedUrl.toString(),
        mediaId: statusMatch[1]
      };
    }
  }

  // 5. Facebook
  if (hostname.includes('facebook.com') || hostname.includes('fb.watch')) {
    if (pathname.includes('/videos/') || pathname.includes('/watch') || pathname.includes('/reel/') || hostname.includes('fb.watch')) {
      return {
        isValid: true,
        platform: 'facebook',
        cleanUrl: parsedUrl.toString()
      };
    }
  }

  // 6. Vimeo
  if (hostname.includes('vimeo.com')) {
    const vimeoMatch = pathname.match(/\/(\d+)/);
    if (vimeoMatch) {
      return {
        isValid: true,
        platform: 'vimeo',
        cleanUrl: `https://vimeo.com/${vimeoMatch[1]}`,
        mediaId: vimeoMatch[1]
      };
    }
  }

  // 7. Generic direct media extension detection
  const lowerPath = pathname.toLowerCase();
  const directMediaExtensions = ['.mp4', '.m4v', '.webm', '.mkv', '.mp3', '.m4a', '.wav', '.ogg', '.jpg', '.jpeg', '.png', '.webp'];
  if (directMediaExtensions.some(ext => lowerPath.endsWith(ext))) {
    return {
      isValid: true,
      platform: 'generic',
      cleanUrl: parsedUrl.toString()
    };
  }

  // If hostname is standard web URL but not matched to exact patterns, return as generic attempt if valid protocol
  if (parsedUrl.protocol === 'http:' || parsedUrl.protocol === 'https:') {
    return {
      isValid: true,
      platform: 'generic',
      cleanUrl: parsedUrl.toString()
    };
  }

  return {
    isValid: false,
    platform: 'unsupported',
    cleanUrl: inputUrl,
    errorMessage: 'Unsupported platform or invalid media link format.'
  };
}
