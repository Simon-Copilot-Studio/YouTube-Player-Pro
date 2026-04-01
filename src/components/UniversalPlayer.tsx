import { useEffect, useRef } from "react";
import { Webview } from "@tauri-apps/api/webview";
import { getCurrentWindow, LogicalSize, LogicalPosition } from "@tauri-apps/api/window";

interface UniversalPlayerProps {
  url: string;
  isCamouflaged?: boolean;
}

/**
 * Universal Player - Pro Max 4.2 (Pixel-Perfect Alignment)
 * Fixes coordinate shifts by leveraging stable ResizeObserver and unique ID management.
 */
export function UniversalPlayer({ url, isCamouflaged }: UniversalPlayerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const webviewRef = useRef<Webview | null>(null);
  // Persistent Unique ID for the current session to prevent ghosting
  const webviewId = useRef(`native-webview-${Math.random().toString(36).substring(2, 9)}`);

  useEffect(() => {
    let isMounted = true;
    let observer: ResizeObserver | null = null;
    let wv: Webview | null = null;

    const cleanupWebview = async (targetWv: Webview) => {
      try {
        await targetWv.close();
      } catch (e) {
        // Silently ignore close errors if already closed
      }
    };

    const init = async () => {
      if (!containerRef.current || !isMounted || isCamouflaged) return;

      try {
        const appWindow = getCurrentWindow();
        const rect = containerRef.current.getBoundingClientRect();

        // 1. Create Webview with a slight delay to ensure layout stability
        wv = new Webview(appWindow, webviewId.current, {
          url,
          x: Math.round(rect.x),
          y: Math.round(rect.y),
          width: Math.round(rect.width),
          height: Math.round(rect.height),
          transparent: true
        });

        webviewRef.current = wv;
        console.info(`[Pro Max 4.2] Native Webview Initialized: ${webviewId.current}`);

        // 2. Setup Continuous Sync
        observer = new ResizeObserver((entries) => {
          if (!isMounted || !webviewRef.current) return;
          const entry = entries[0];
          if (entry) {
            const { x, y, width, height } = entry.target.getBoundingClientRect();
            // Use requestAnimationFrame to sync with browser's repaint cycle
            requestAnimationFrame(async () => {
              if (!webviewRef.current) return;
              try {
                await webviewRef.current.setPosition(new LogicalPosition(Math.round(x), Math.round(y)));
                await webviewRef.current.setSize(new LogicalSize(Math.round(width), Math.round(height)));
              } catch (e) {
                // Resize during closing
              }
            });
          }
        });

        observer.observe(containerRef.current);
      } catch (e) {
        console.error("Native Webview Error:", e);
      }
    };

    init();

    return () => {
      isMounted = false;
      if (observer) observer.disconnect();
      if (wv) cleanupWebview(wv);
      webviewRef.current = null;
    };
  }, [url, isCamouflaged]); // Re-init on URL or Camouflage change

  return (
    <div 
      className="universal-player-wrapper" 
      ref={containerRef} 
      style={{ 
        width: '100%', 
        height: '100%', 
        position: 'absolute', 
        top: 0, 
        left: 0,
        pointerEvents: 'none', 
        background: 'transparent' 
      }}
    >
      {/* Native Webview overlays this transparent container */}
    </div>
  );
}
