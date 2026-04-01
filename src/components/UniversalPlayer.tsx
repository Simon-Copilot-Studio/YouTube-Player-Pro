

interface UniversalPlayerProps {
  url: string;
  isCamouflaged?: boolean;
}

/**
 * Universal Player - Pro Max 3.0 Engine
 * Handles non-YouTube links (TikTok, IG, Movies, Generic Websites).
 * Always expects pointer-events to be auto so users can interact with native controls.
 */
export function UniversalPlayer({ url, isCamouflaged }: UniversalPlayerProps) {
  if (isCamouflaged) return null;

  return (
    <div className="universal-player-wrapper">
      <iframe
        src={url}
        className="universal-iframe"
        sandbox="allow-scripts allow-same-origin allow-popups allow-forms allow-presentation"
        allow="autoplay; fullscreen; encrypted-media; picture-in-picture"
        frameBorder="0"
        title="Universal Media Player"
      ></iframe>
    </div>
  );
}
