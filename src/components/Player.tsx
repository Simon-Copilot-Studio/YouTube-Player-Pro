import { useEffect, useRef, useState } from "react";

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
}

export function Player({ videoId, onPlayerReady, showSubtitles, subtitleSize, playbackRate, isCamouflaged }: PlayerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const playerRef = useRef<any>(null);
  
  // Progress State
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isHovering, setIsHovering] = useState(false);

  // Seek Interaction State
  const [seekOverlay, setSeekOverlay] = useState<{ side: 'left' | 'right', amount: number, active: boolean } | null>(null);
  const clickCounter = useRef(0);
  const clickTimer = useRef<NodeJS.Timeout | null>(null);
  const totalSeek = useRef(0);

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
  }, [videoId]);

  // Sync state with player
  useEffect(() => {
    const interval = setInterval(() => {
      if (playerRef.current && playerRef.current.getCurrentTime) {
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

  const initPlayer = () => {
    if (playerRef.current) playerRef.current.destroy();
    playerRef.current = new window.YT.Player(containerRef.current, {
      videoId,
      playerVars: {
        autoplay: 1, modestbranding: 1, rel: 0,
        cc_load_policy: showSubtitles ? 1 : 0,
        cc_lang_pref: "en",
      },
      events: {
        onReady: (event: any) => {
          event.target.setPlaybackRate(playbackRate);
          onPlayerReady?.(event.target);
        },
      },
    });
  };

  const handleProgressBarClick = (e: React.MouseEvent) => {
    if (!playerRef.current) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const clickedPercentage = x / rect.width;
    const newTime = clickedPercentage * duration;
    playerRef.current.seekTo(newTime, true);
    setCurrentTime(newTime);
  };

  const handleInteraction = (e: React.MouseEvent | React.TouchEvent) => {
    if (isCamouflaged) return;
    e.preventDefault();
    e.stopPropagation();

    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    const x = ('clientX' in e ? e.clientX : (e as any).nativeEvent.touches[0].clientX) - rect.left;
    const side = x < rect.width / 2 ? 'left' : 'right';

    clickCounter.current += 1;
    if (clickCounter.current === 1) {
      setTimeout(() => {
        if (clickCounter.current === 1) {
          clickCounter.current = 0;
          // Toggle controls highlight or similar
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

  const progressPercentage = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div 
      className="aspect-wrapper" 
      onMouseEnter={() => setIsHovering(true)} 
      onMouseLeave={() => setIsHovering(false)}
    >
      <div ref={containerRef} style={{ width: "100%", height: "100%", pointerEvents: 'none' }}></div>
      <div 
        className="seek-interaction-layer" 
        onMouseDown={handleInteraction}
        style={{ pointerEvents: isCamouflaged ? 'none' : 'auto' }}
      ></div>

      {/* Modern Progress Bar */}
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

      {seekOverlay && (
        <div className={`seek-bubble ${seekOverlay.side} active`}>
          <div className="seek-text">{seekOverlay.amount} SECONDS</div>
        </div>
      )}
    </div>
  );
}
