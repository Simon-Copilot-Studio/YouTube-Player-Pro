import { useState, useEffect, useCallback } from "react";
import "./App.css";
import "./index.css";
import { TitleBar } from "./components/TitleBar";
import { Player } from "./components/Player";
import { Menu } from "./components/Menu";
import { TerminalCamouflage } from "./components/TerminalCamouflage";
import { ContextMenu } from "./components/ContextMenu";

// Custom Hooks (SRP Implementation)
import { useWindowState } from "./hooks/useWindowState";
import { useKeyboardManager } from "./hooks/useKeyboardManager";

/**
 * YouTube Player Pro v2.0 - Core Dispatcher
 * Adheres to Clean Code & SOLID principles by delegating state logic to Hooks.
 */
function App() {
  // 1. Persistence & Window State Hook
  const {
    transparency, setTransparency,
    brightness, setBrightness,
    menuOpacity, setMenuOpacity,
    aspectRatio, setAspectRatio,
    showTitlebar, setShowTitlebar
  } = useWindowState();

  // 2. Application Logic State
  const [url, setUrl] = useState<string>(() => {
    const saved = localStorage.getItem("yt-url");
    return saved ? JSON.parse(saved) : "";
  });
  const [currentVideoId, setCurrentVideoId] = useState<string>("");
  const [showSubtitles, setShowSubtitles] = useState<boolean>(true);
  const [playbackRate, setPlaybackRate] = useState<number>(1);
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
  const [isCamouflaged, setIsCamouflaged] = useState<boolean>(false);
  const [isNativeMode, setIsNativeMode] = useState<boolean>(false); // New Mode
  const [player, setPlayer] = useState<any>(null);
  const [contextMenu, setContextMenu] = useState<{ x: number, y: number } | null>(null);

  // Sync Menu Opacity to CSS Variable
  useEffect(() => {
    document.documentElement.style.setProperty('--menu-bg-opacity', (menuOpacity / 100).toString());
  }, [menuOpacity]);

  // Persistence Sync
  useEffect(() => {
    localStorage.setItem("yt-url", JSON.stringify(url));
  }, [url]);

  // 3. Camouflage Manager (Boss Key Logic)
  const toggleCamouflage = useCallback(() => {
    setIsCamouflaged(prev => {
      const nextState = !prev;
      if (player) {
        if (nextState) { player.pauseVideo(); player.mute(); }
        else { player.unMute(); player.playVideo(); }
      }
      return nextState;
    });
  }, [player]);

  const toggleNativeMode = useCallback(() => {
    setIsNativeMode(prev => !prev);
  }, []);

  // 5. Global Click Listener (Hide Context Menu)
  useEffect(() => {
    const handleGlobalClick = () => {
      if (contextMenu) setContextMenu(null);
    };
    window.addEventListener('click', handleGlobalClick);
    return () => window.removeEventListener('click', handleGlobalClick);
  }, [contextMenu]);

  // 4. Keyboard Shortcuts Hook
  useKeyboardManager({
    toggleCamouflage,
    toggleNativeMode,
    player,
    isCamouflaged,
    isMenuOpen,
    setIsMenuOpen,
    setShowSubtitles,
    setShowTitlebar
  });

  // 5. URL Parsing Service
  const parseYouTubeId = useCallback((targetUrl: string) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = targetUrl.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  }, []);

  const handlePlay = useCallback(() => {
    const id = parseYouTubeId(url);
    if (id) {
      if (id === currentVideoId) player?.playVideo();
      else setCurrentVideoId(id);
    }
  }, [url, currentVideoId, player, parseYouTubeId]);

  // Initial URL load
  useEffect(() => {
    const id = parseYouTubeId(url);
    if (id) setCurrentVideoId(id);
  }, []);

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation(); // Prevents global click listener from closing it immediately
    if (isCamouflaged) return;
    setContextMenu({ x: e.clientX, y: e.clientY });
  };

  return (
    <div 
      className={`app-container ${isCamouflaged ? 'camouflaged' : ''}`} 
      onContextMenu={handleContextMenu} 
      onClick={() => setContextMenu(null)}
    >
      <TitleBar 
        onMenuToggle={() => setIsMenuOpen(!isMenuOpen)} 
        isMenuOpen={isMenuOpen} 
        showTitlebar={showTitlebar}
        theme={isCamouflaged ? 'cmd' : 'default'}
      />
      
      <main 
        className="player-wrapper" 
        style={{
          opacity: isCamouflaged ? 1 : transparency / 100,
          filter: `brightness(${isCamouflaged ? 1 : brightness / 100})`,
        }}
      >
        {/* Render Layer: Player vs Camouflage */}
        <div style={{ display: isCamouflaged ? 'none' : 'block', width: '100%', height: '100%' }}>
          {currentVideoId && (
            <Player 
              videoId={currentVideoId} 
              onPlayerReady={setPlayer} 
              showSubtitles={showSubtitles} 
              subtitleSize={100} 
              playbackRate={playbackRate}
              isNativeMode={isNativeMode} // Passing new mode
            />
          )}
        </div>

        {isCamouflaged && <TerminalCamouflage />}

        {/* Interaction Layer: Settings Menu */}
        {!isCamouflaged && (
          <Menu 
            isOpen={isMenuOpen} 
            onClose={() => setIsMenuOpen(false)}
            url={url} setUrl={setUrl} 
            transparency={transparency} setTransparency={setTransparency}
            brightness={brightness} setBrightness={setBrightness} 
            menuOpacity={menuOpacity} setMenuOpacity={setMenuOpacity} // New
            aspectRatio={aspectRatio} setAspectRatio={setAspectRatio}
            showSubtitles={showSubtitles} setShowSubtitles={setShowSubtitles} 
            subtitleSize={100} setSubtitleSize={() => {}} 
            playbackRate={playbackRate} setPlaybackRate={setPlaybackRate} 
            showTitlebar={showTitlebar} setShowTitlebar={setShowTitlebar}
            isNativeMode={isNativeMode} setIsNativeMode={setIsNativeMode} // New
            onPlay={handlePlay} 
            onPause={() => player?.pauseVideo()} 
            onStop={() => player?.stopVideo()}
          />
        )}

        {/* Global Context Menu */}
        {contextMenu && (
          <ContextMenu 
            x={contextMenu.x} y={contextMenu.y} 
            onClose={() => setContextMenu(null)}
            onToggleMenu={() => setIsMenuOpen(!isMenuOpen)} 
            onToggleCamouflage={toggleCamouflage}
            player={player} 
            onPlay={handlePlay} 
            onStop={() => player?.stopVideo()}
          />
        )}
      </main>
    </div>
  );
}

export default App;
