import fs from 'fs';
import path from 'path';

const TEMP_DIR = path.join(process.cwd(), 'tmp', 'media-downloads');
const MAX_AGE_MS = 15 * 60 * 1000; // 15 minutes

export function ensureTempDirExists(): string {
  if (!fs.existsSync(TEMP_DIR)) {
    fs.mkdirSync(TEMP_DIR, { recursive: true });
  }
  return TEMP_DIR;
}

export function cleanupOldTempFiles(): void {
  try {
    if (!fs.existsSync(TEMP_DIR)) return;

    const files = fs.readdirSync(TEMP_DIR);
    const now = Date.now();

    for (const file of files) {
      const filePath = path.join(TEMP_DIR, file);
      try {
        const stats = fs.statSync(filePath);
        if (now - stats.mtimeMs > MAX_AGE_MS) {
          fs.unlinkSync(filePath);
        }
      } catch {
        // file might be in use or deleted already
      }
    }
  } catch (err) {
    console.error('Error during temp file cleanup:', err);
  }
}

// Trigger periodic cleanup every 5 minutes in background
if (typeof window === 'undefined') {
  setInterval(() => {
    cleanupOldTempFiles();
  }, 5 * 60 * 1000);
}
