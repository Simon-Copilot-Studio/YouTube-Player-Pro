/**
 * Media Parser Service - Pro Max 4.1 Architecture
 * Single Responsibility: Detect source engine and transform URLs to embed formats.
 */
export type EngineType = 'youtube' | 'universal' | null;

export interface MediaParseResult {
  type: EngineType;
  src: string;
}

export const parseMediaUrl = (targetUrl: string): MediaParseResult => {
  if (!targetUrl) return { type: null, src: '' };

  // Rule 1. YouTube
  const ytRegExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
  const ytMatch = targetUrl.match(ytRegExp);
  if (ytMatch && ytMatch[2].length === 11) {
    return { type: 'youtube', src: ytMatch[2] };
  }

  // Rule 2. TikTok (Embed Bypass)
  const ttRegExp = /tiktok\.com\/@.*\/video\/(\d+)/;
  const ttMatch = targetUrl.match(ttRegExp);
  if (ttMatch && ttMatch[1]) {
    return { type: 'universal', src: `https://www.tiktok.com/embed/v2/${ttMatch[1]}` };
  }

  // Rule 3. Instagram Reels/Posts
  const igRegExp = /(instagram\.com\/(p|reel)\/[\w-]+)/;
  const igMatch = targetUrl.match(igRegExp);
  if (igMatch && igMatch[1]) {
    return { type: 'universal', src: `https://${igMatch[1]}/embed` };
  }

  // Rule 4. MissAV (Direct Access)
  // Note: We reverted /embed/ because it 404ed, so we stick to Rule 5 broad matching
  if (targetUrl.includes('missav.')) {
    return { type: 'universal', src: targetUrl };
  }

  // Rule 5. Generic URLs
  if (targetUrl.startsWith('http://') || targetUrl.startsWith('https://')) {
    return { type: 'universal', src: targetUrl };
  }

  return { type: null, src: '' };
};
