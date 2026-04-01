import { useState, useEffect, useRef, useCallback } from "react";
import "./App.css";
import "./index.css";
import { TitleBar } from "./components/TitleBar";
import { Player } from "./components/Player";
import { Menu } from "./components/Menu";
import { TerminalCamouflage } from "./components/TerminalCamouflage";
import { ContextMenu } from "./components/ContextMenu";
import { getCurrentWindow, LogicalSize } from "@tauri-apps/api/window";

function App() {
  const loadState = (key: string, defaultValue: any) => {
    const saved = localStorage.getItem(key);
    return saved ? JSON.parse(saved) : defaultValue;
  };

  const [url, setUrl] = useState(loadState("yt-url", ""));
  const [currentVideoId, setCurrentVideoId] = useState("");
  const [transparency, setTransparency] = useState(loadState("yt-transparency", 100));
  const [brightness, setBrightness] = useState(loadState("yt-brightness", 100));
  const [aspectRatio, setAspectRatio] = useState(loadState("yt-aspect", "16 / 9"));
  const [showSubtitles, setShowSubtitles] = useState(loadState("yt-subtitles", true));
  const [subtitleSize, setSubtitleSize] = useState(loadState("yt-sub-size", 100));
  const [playbackRate, setPlaybackRate] = useState(loadState("yt-speed", 1));
  const [showTitlebar, setShowTitlebar] = useState(loadState("yt-titlebar", true));
  const [player, setPlayer] = useState<any>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isCamouflaged, setIsCamouflaged] = useState(false);
  const escapeCount = useRef(0);
  const escapeTimeout = useRef<NodeJS.Timeout | null>(null);
  const isInitialLoad = useRef(true);
  const [contextMenu, setContextMenu] = useState<{ x: number, y: number } | null>(null);

  // Persistence
  useEffect(() => {
    const state = { url, transparency, brightness, aspectRatio, showSubtitles, subtitleSize, playbackRate, showTitlebar };
    for (const [key, val] of Object.entries(state)) { localStorage.setItem(`yt-${key}`, JSON.stringify(val)); }
  }, [url, transparency, brightness, aspectRatio, showSubtitles, subtitleSize, playbackRate, showTitlebar]);

  // Window size memory
  useEffect(() => {
    const appWindow = getCurrentWindow();
    const savedWidth = localStorage.getItem("win-width");
    const savedHeight = localStorage.getItem("win-height");
    if (savedWidth && savedHeight) { appWindow.setSize(new LogicalSize(parseInt(savedWidth), parseInt(savedHeight))); }
    const resizeInterval = setInterval(async () => {
      const size = await appWindow.innerSize();
      if (size.width > 100 && size.height > 100) {
        localStorage.setItem("win-width", size.width.toString());
        localStorage.setItem("win-height", size.height.toString());
      }
    }, 2000);
    return () => clearInterval(resizeInterval);
  }, []);

  // Native resize logic
  useEffect(() => {
    if (isInitialLoad.current) { isInitialLoad.current = false; return; }
    const triggerResize = async () => {
      const appWindow = getCurrentWindow();
      const currentSize = await appWindow.innerSize();
      const [wRatio, hRatio] = aspectRatio.split("/").map((s: string) => parseFloat(s.trim()));
      const targetRatio = wRatio / hRatio;
      await appWindow.setSize(new LogicalSize(Math.round(currentSize.height * targetRatio), currentSize.height));
    };
    triggerResize();
  }, [aspectRatio]);

  const toggleCamouflage = useCallback(() => {
    setIsCamouflaged(prev => {
      const nextState = !prev;
      if (player && player.pauseVideo && player.playVideo) {
        if (nextState) { player.pauseVideo(); player.mute(); }
        else { player.unMute(); player.playVideo(); }
      }
      return nextState;
    });
  }, [player]);

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === 'Escape') {
      escapeCount.current += 1;
      if (escapeCount.current === 1) { escapeTimeout.current = setTimeout(() => { escapeCount.current = 0; }, 500); }
      else if (escapeCount.current === 2) { if (escapeTimeout.current) clearTimeout(escapeTimeout.current); escapeCount.current = 0; toggleCamouflage(); }
    }
  }, [toggleCamouflage]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    if (isCamouflaged) return;
    setContextMenu({ x: e.clientX, y: e.clientY });
  };

  const handlePlay = () => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    const id = (match && match[2].length === 11) ? match[2] : null;
    if (id) { if (id === currentVideoId) { player?.playVideo(); } else { setCurrentVideoId(id); } }
  };

  useEffect(() => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    const id = (match && match[2].length === 11) ? match[2] : null;
    if (id) setCurrentVideoId(id);
  }, []);

  return (
    <div className={`app-container ${isCamouflaged ? 'camouflaged' : ''}`} onContextMenu={handleContextMenu} onClick={() => setContextMenu(null)}>
      <TitleBar 
        onMenuToggle={() => setIsMenuOpen(!isMenuOpen)} 
        isMenuOpen={isMenuOpen} 
        showTitlebar={showTitlebar}
        theme={isCamouflaged ? 'cmd' : 'default'}
      />
      
      <main className="player-wrapper" style={{
        opacity: isCamouflaged ? 1 : transparency / 100,
        filter: `brightness(${isCamouflaged ? 1 : brightness / 100})`,
        flex: 1, position: 'relative', background: '#000'
      }}>
        <div style={{ display: isCamouflaged ? 'none' : 'block', width: '100%', height: '100%' }}>
          {currentVideoId && (
            <Player 
              videoId={currentVideoId} onPlayerReady={setPlayer} 
              showSubtitles={showSubtitles} subtitleSize={subtitleSize} playbackRate={playbackRate}
            />
          )}
        </div>

        {isCamouflaged && <TerminalCamouflage />}

        {!isCamouflaged && (
          <Menu 
            isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)}
            url={url} setUrl={setUrl} transparency={transparency} setTransparency={setTransparency}
            brightness={brightness} setBrightness={setBrightness} aspectRatio={aspectRatio} setAspectRatio={setAspectRatio}
            showSubtitles={showSubtitles} setShowSubtitles={setShowSubtitles} subtitleSize={subtitleSize} setSubtitleSize={setSubtitleSize}
            playbackRate={playbackRate} setPlaybackRate={setPlaybackRate} showTitlebar={showTitlebar} setShowTitlebar={setShowTitlebar}
            onPlay={handlePlay} onPause={() => player?.pauseVideo()} onStop={() => player?.stopVideo()}
          />
        )}

        {contextMenu && (
          <ContextMenu 
            x={contextMenu.x} y={contextMenu.y} onClose={() => setContextMenu(null)}
            onToggleMenu={() => setIsMenuOpen(!isMenuOpen)} onToggleCamouflage={toggleCamouflage}
            player={player} onPlay={handlePlay} onStop={() => player?.stopVideo()}
          />
        )}
      </main>
    </div>
  );
}

export default App;
