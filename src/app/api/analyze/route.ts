import { detectPlatform } from '@/lib/platform-detector';

import { extractMediaMetadata } from '@/lib/media-processor';
import { checkRateLimit } from '@/lib/rate-limit';
import { AnalyzeResponse } from '@/lib/types';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest): Promise<NextResponse<AnalyzeResponse>> {
  try {
    // 1. IP Rate limiting
    const ip = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || '127.0.0.1';
    const rateCheck = checkRateLimit(ip, 30, 60 * 1000); // 30 req/min

    if (!rateCheck.isAllowed) {
      return NextResponse.json(
        {
          success: false,
          error: 'Rate limit exceeded. Please wait a minute before analyzing more media links.',
          errorCode: 'RATE_LIMITED'
        },
        { status: 429 }
      );
    }

    // 2. Parse request body
    const body = await req.json().catch(() => ({}));
    const { url } = body;

    if (!url || typeof url !== 'string' || !url.trim()) {
      return NextResponse.json(
        {
          success: false,
          error: 'Please provide a valid media URL.',
          errorCode: 'INVALID_URL'
        },
        { status: 400 }
      );
    }

    // 3. Platform detection
    const detection = detectPlatform(url);
    if (!detection.isValid) {
      return NextResponse.json(
        {
          success: false,
          error: detection.errorMessage || 'Unsupported or invalid URL format. Please paste a public YouTube, TikTok, Instagram, Twitter/X, or Facebook link.',
          errorCode: 'UNSUPPORTED_PLATFORM'
        },
        { status: 400 }
      );
    }

    // 4. Metadata extraction
    const metadata = await extractMediaMetadata(detection.cleanUrl);

    return NextResponse.json({
      success: true,
      data: metadata
    });

  } catch (error: any) {
    console.error('Analyze Route Error:', error);
    
    let errorMessage = error.message || 'Failed to extract media information. Please verify the URL and try again.';
    let errorCode: AnalyzeResponse['errorCode'] = 'PROCESSING_FAILED';

    if (errorMessage.includes('private') || errorMessage.includes('restricted')) {
      errorCode = 'RESTRICTED_CONTENT';
      errorMessage = 'This media is private, age-restricted, or requires login credentials to access.';
    }

    return NextResponse.json(
      {
        success: false,
        error: errorMessage,
        errorCode
      },
      { status: 422 }
    );
  }
}
