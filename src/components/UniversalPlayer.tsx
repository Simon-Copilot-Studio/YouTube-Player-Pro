import { useEffect, useRef } from "react";
import { Webview } from "@tauri-apps/api/webview";
import { getCurrentWindow } from "@tauri-apps/api/window";

interface UniversalPlayerProps {
  url: string;
  isCamouflaged?: boolean;
}

/**
 * Universal Player - Pro Max 4.0 (God Mode)
 * Replaces iframe with a Native OS Webview to bypass ALL anti-hotlinking and X-Frame-Options limitations.
 */
export function UniversalPlayer({ url, isCamouflaged }: UniversalPlayerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const webviewRef = useRef<Webview | null>(null);

  // 1. Lifecycle & Initiation
  useEffect(() => {
    let isMounted = true;

    const initWebview = async () => {
      try {
        if (!containerRef.current) return;
        const appWindow = getCurrentWindow();
        const rect = containerRef.current.getBoundingClientRect();
        
        // Native Webview overlays React DOM perfectly
        const wv = new Webview(appWindow, 'native-universal-media', {
          url,
          x: Math.round(rect.x),
          y: Math.round(rect.y),
          width: Math.round(rect.width),
          height: Math.round(rect.height),
          transparent: true
        });

        if (isMounted) {
          webviewRef.current = wv;
        } else {
          wv.close();
        }
      } catch (e) {
        console.error("Failed to initialize Native Webview:", e);
      }
    };

    if (!isCamouflaged) {
      if (!webviewRef.current) {
        initWebview();
      } else {
        webviewRef.current.show();
      }
    } else {
      if (webviewRef.current) {
        webviewRef.current.hide();
      }
    }

    return () => {
      isMounted = false;
      // We explicitly leave teardown to a separate clean-up 
      // when URL changes or component completely unmounts.
    };
  }, [isCamouflaged]); // Listen only to camouflage to toggle visibility fast

  // Re-create when URL changes
  useEffect(() => {
    return () => {
      // Unmount complete destruction
      if (webviewRef.current) {
        webviewRef.current.close().catch(console.error);
        webviewRef.current = null;
      }
    };
  }, [url]);

  return (
    <div 
      className="universal-player-wrapper" 
      ref={containerRef} 
      style={{ pointerEvents: 'none', background: 'transparent' }}
    >
      {/* 
        Native Webview will hover here. 
        It is rendered by OS, bypassing Chromium's X-Frame restrictions.
      */}
    </div>
  );
}
