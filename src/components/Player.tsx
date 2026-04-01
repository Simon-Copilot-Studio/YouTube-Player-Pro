import React, { useEffect, useRef, useState, useCallback } from "react";

declare global {
  interface Window {
    onYouTubeIframeAPIReady: () => void;
    YT: any;
  }
}

interface PlayerProps {
  videoId: string;
  onPlayerReady?: (player: any) => void;
  showSubtitles: boolean;
  subtitleSize: number;
  playbackRate: number;
  isCamouflaged?: boolean;
  isNativeMode?: boolean;
}

interface SeekOverlayState {
  side: 'left' | 'right';
  amount: number;
  active: boolean;
}

/**
 * YouTube Pro Player Component
 * Handles the heavy lifting of IFrame API and Gesture Interactions.
 */
export function Player({ videoId, onPlayerReady, showSubtitles, playbackRate, isCamouflaged, isNativeMode }: PlayerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const playerRef = useRef<any>(null);
  
  // Progress State
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [duration, setDuration] = useState<number>(0);
  const [isHovering, setIsHovering] = useState<boolean>(false);

  // Seek Interaction State
  const [seekOverlay, setSeekOverlay] = useState<SeekOverlayState | null>(null);
  const clickCounter = useRef<number>(0);
  const clickTimer = useRef<any>(null); // Use any for cross-env compatibility
  const totalSeek = useRef<number>(0);

  // 1. YouTube API Initialization (Async Handling)
  const initPlayer = useCallback(() => {
    if (playerRef.current) playerRef.current.destroy();
    if (!window.YT) return;

    playerRef.current = new window.YT.Player(containerRef.current, {
      videoId,
      playerVars: {
        autoplay: 1, modestbranding: 1, rel: 0,
        cc_load_policy: showSubtitles ? 1 : 0,
        cc_lang_pref: "en",
      },
      events: {
        onReady: (event: any) => {
          // Dynamic setting without needing to re-init
          event.target.setPlaybackRate(playbackRate);
          onPlayerReady?.(event.target);
        },
      },
    });
  }, [videoId, onPlayerReady]); // Decoupled playbackRate/showSubtitles from init

  useEffect(() => {
    if (!window.YT) {
      const tag = document.createElement("script");
      tag.src = "https://www.youtube.com/iframe_api";
      const firstScriptTag = document.getElementsByTagName("script")[0];
      firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag);
      window.onYouTubeIframeAPIReady = () => initPlayer();
    } else {
      initPlayer();
    }
    return () => playerRef.current?.destroy();
  }, [videoId, initPlayer]);

  // 2. Playback State Synchronization
  useEffect(() => {
    const interval = setInterval(() => {
      if (playerRef.current?.getCurrentTime) {
        setCurrentTime(playerRef.current.getCurrentTime());
        setDuration(playerRef.current.getDuration() || 0);
      }
    }, 500);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (playerRef.current?.setPlaybackRate) {
      playerRef.current.setPlaybackRate(playbackRate);
    }
  }, [playbackRate]);

  // 3. User Interaction Handlers (Gestures)
  const handleProgressBarClick = (e: React.MouseEvent) => {
    if (!playerRef.current) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const newTime = (x / rect.width) * duration;
    playerRef.current.seekTo(newTime, true);
    setCurrentTime(newTime);
  };

  const handleInteraction = (e: React.MouseEvent | React.TouchEvent) => {
    if (isCamouflaged) return;
    e.preventDefault();
    e.stopPropagation();

    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    const x = ('clientX' in e ? (e as React.MouseEvent).clientX : (e as React.TouchEvent).nativeEvent.touches[0].clientX) - rect.left;
    const side: 'left' | 'right' = x < rect.width / 2 ? 'left' : 'right';

    clickCounter.current += 1;
    if (clickCounter.current === 1) {
      setTimeout(() => {
        if (clickCounter.current === 1) {
          clickCounter.current = 0;
          setIsHovering(true);
          setTimeout(() => setIsHovering(false), 2000);
        }
      }, 300);
    } else {
      const step = 10;
      const delta = side === 'right' ? step : -step;
      playerRef.current?.seekTo(playerRef.current.getCurrentTime() + delta, true);
      totalSeek.current += step;
      setSeekOverlay({ side, amount: totalSeek.current, active: true });
      
      if (clickTimer.current) clearTimeout(clickTimer.current);
      clickTimer.current = setTimeout(() => {
        setSeekOverlay(null);
        totalSeek.current = 0;
        clickCounter.current = 0;
      }, 800);
    }
  };

  const handleAuxClick = (e: React.MouseEvent) => {
    if (isCamouflaged || !playerRef.current) return;
    if (e.button === 1) { // Middle Click
      e.preventDefault();
      const state = playerRef.current.getPlayerState?.();
      state === 1 ? playerRef.current.pauseVideo() : playerRef.current.playVideo();
    }
  };

  const progressPercentage = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div 
      className="aspect-wrapper" 
      onMouseEnter={() => setIsHovering(true)} 
      onMouseLeave={() => setIsHovering(false)}
    >
      <div 
        ref={containerRef} 
        style={{ 
          width: "100%", 
          height: "100%", 
          pointerEvents: isNativeMode ? 'auto' : 'none' // Allow click in Native Mode
        }}
      ></div>
      <div 
        className="seek-interaction-layer" 
        onClick={handleInteraction}
        onAuxClick={handleAuxClick}
        style={{ 
          pointerEvents: (isCamouflaged || isNativeMode) ? 'none' : 'auto' // Disable gestures in Native Mode
        }}
      ></div>

      {/* Indigo Progress Bar Layer */}
      <div 
        className={`progress-bar-container ${isHovering ? 'visible' : ''}`}
        onClick={handleProgressBarClick}
      >
        <div className="progress-bar-bg">
          <div className="progress-bar-fill" style={{ width: `${progressPercentage}%` }}>
            <div className="progress-dot"></div>
          </div>
        </div>
      </div>

      {/* Double-Click Seek Bubbles (Minimal Symbols) */}
      {seekOverlay && (
        <div className={`seek-bubble ${seekOverlay.side} active`}>
          <div className="seek-icon">{seekOverlay.side === 'right' ? '>>' : '<<'}</div>
          <div className="seek-amount">{seekOverlay.amount}s</div>
        </div>
      )}
    </div>
  );
}
