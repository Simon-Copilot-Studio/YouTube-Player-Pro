import { useCallback, useEffect, useRef } from "react";
// No NodeJS namespace needed or use window.setTimeout
import { getCurrentWindow } from "@tauri-apps/api/window";

export interface ShortcutActions {
  toggleCamouflage: () => void;
  toggleNativeMode: () => void;
  player: any;
  isCamouflaged: boolean;
  isMenuOpen: boolean;
  setIsMenuOpen: (val: boolean) => void;
  setShowSubtitles: (val: (prev: boolean) => boolean) => void;
  setShowTitlebar: (val: (prev: boolean) => boolean) => void;
}

export function useKeyboardManager({
  toggleCamouflage,
  toggleNativeMode,
  player,
  isCamouflaged,
  isMenuOpen,
  setIsMenuOpen,
  setShowSubtitles,
  setShowTitlebar
}: ShortcutActions) {
  const escapeCount = useRef(0);


  const handleKeyDown = useCallback(async (e: KeyboardEvent) => {
    const key = e.key.toLowerCase();
    
    // 1. Boss Key & Emergency Menu Close (Esc)
    if (e.key === 'Escape') {
      if (isMenuOpen) { setIsMenuOpen(false); return; }
      escapeCount.current += 1;
      if (escapeCount.current === 1) { 
        (window as any).escapeTimeout = window.setTimeout(() => { escapeCount.current = 0; }, 500); 
      }
      else if (escapeCount.current === 2) { 
        if ((window as any).escapeTimeout) window.clearTimeout((window as any).escapeTimeout); 
        escapeCount.current = 0; 
        toggleCamouflage(); 
      }
      return;
    }

    // 2. Disable other keys if camouflaged
    if (isCamouflaged) return;

    // 3. Native Mode Toggle (G)
    if (key === 'g') {
      toggleNativeMode();
    }


    // 3. Transport Controls
    if (key === 'k' || key === ' ') {
      e.preventDefault();
      const state = player?.getPlayerState?.();
      if (state === 1) player.pauseVideo();
      else player.playVideo();
    }
    if (key === 'j' || key === 'arrowleft') {
      player?.seekTo(player.getCurrentTime() - 10, true);
    }
    if (key === 'l' || key === 'arrowright') {
      player?.seekTo(player.getCurrentTime() + 10, true);
    }
    if (key === 'm') {
      if (player?.isMuted?.()) player.unMute();
      else player.mute();
    }
    if (key === 'c') {
      setShowSubtitles(prev => !prev);
    }
    if (key === 't') {
      setShowTitlebar(prev => !prev);
    }
    if (key === 's') {
      setIsMenuOpen(!isMenuOpen);
    }
    if (key === 'q') {
      const appWindow = getCurrentWindow();
      await appWindow.close();
    }
    if (/[0-9]/.test(key)) {
      const percent = parseInt(key) * 10;
      const duration = player?.getDuration?.() || 0;
      if (duration) player.seekTo(duration * (percent / 100), true);
    }
  }, [toggleCamouflage, isCamouflaged, isMenuOpen, player, setIsMenuOpen, setShowSubtitles, setShowTitlebar]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);
}
