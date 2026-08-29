export type PlatformType = 
  | 'youtube' 
  | 'tiktok' 
  | 'instagram' 
  | 'twitter' 
  | 'facebook' 
  | 'vimeo'
  | 'generic' 
  | 'unsupported';

export type FormatCategory = 'video' | 'audio' | 'image';

export type VideoQuality = '1080p' | '720p' | '480p' | '360p';
export type AudioFormat = 'MP3' | 'M4A' | 'WAV';
export type ImageFormat = 'JPG' | 'PNG' | 'WebP';

export type FormatQuality = VideoQuality | AudioFormat | ImageFormat;

export interface MediaFormat {
  id: string;
  category: FormatCategory;
  label: string;
  extension: string; // mp4, mp3, m4a, wav, jpg, png, webp
  quality: FormatQuality;
  sizeEstimate?: string;
  directUrl?: string;
  mimeType: string;
  isAvailable: boolean;
  requiresConversion?: boolean;
}

export interface MediaMetadata {
  id: string;
  url: string;
  platform: PlatformType;
  title: string;
  author?: string;
  authorAvatar?: string;
  duration?: string; // e.g. "03:45"
  durationSeconds?: number;
  thumbnail: string;
  formats: MediaFormat[];
  isRestricted?: boolean;
  restrictedReason?: string;
}

export interface AnalyzeRequest {
  url: string;
}

export interface AnalyzeResponse {
  success: boolean;
  data?: MediaMetadata;
  error?: string;
  errorCode?: 'INVALID_URL' | 'UNSUPPORTED_PLATFORM' | 'PRIVATE_CONTENT' | 'RESTRICTED_CONTENT' | 'PROCESSING_FAILED' | 'RATE_LIMITED';
}

export interface DownloadRequest {
  url: string;
  formatId: string;
  platform: PlatformType;
}

export interface PlatformConfig {
  id: PlatformType;
  name: string;
  domain: string;
  iconName: string;
  badgeBg: string;
  badgeText: string;
  accentColor: string;
  gradient: string;
  supportedFormats: FormatCategory[];
  exampleUrl: string;
}
