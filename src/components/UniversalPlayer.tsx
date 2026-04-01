import { useEffect, useRef } from "react";
import { Webview } from "@tauri-apps/api/webview";
import { getCurrentWindow, LogicalSize, LogicalPosition } from "@tauri-apps/api/window";

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

  // 2. Dynamic Resize Synchronization (Pro Max 4.1 Optimizer)
  useEffect(() => {
    if (!containerRef.current) return;

    const observer = new ResizeObserver(async (entries) => {
      const entry = entries[0];
      if (entry && webviewRef.current) {
        const { x, y, width, height } = entry.target.getBoundingClientRect();
        try {
          // Native Webview bounds must be synced manually with DOM container
          await webviewRef.current.setSize(new LogicalSize(Math.round(width), Math.round(height)));
          await webviewRef.current.setPosition(new LogicalPosition(Math.round(x), Math.round(y)));
        } catch (e) {
          // Webview might be closing or hidden during resize
        }
      }
    });

    observer.observe(containerRef.current);
    
    // Security Audit Log
    if (url) {
      console.info(`[Pro Max Security] Native Webview loading external domain. Source: ${new URL(url).hostname}`);
    }

    return () => observer.disconnect();
  }, [url]);

  // Re-create when URL changes or Component Unmounts
  useEffect(() => {
    return () => {
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
