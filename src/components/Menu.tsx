import React from "react";

interface MenuProps {
  isOpen: boolean;
  onClose: () => void;
  url: string;
  setUrl: (val: string) => void;
  transparency: number;
  setTransparency: (val: number) => void;
  brightness: number;
  setBrightness: (val: number) => void;
  menuOpacity: number;
  setMenuOpacity: (val: number) => void;
  aspectRatio: string;
  setAspectRatio: (val: string) => void;
  showSubtitles: boolean;
  setShowSubtitles: (val: boolean) => void;
  subtitleSize: number;
  setSubtitleSize: (val: number) => void;
  playbackRate: number;
  setPlaybackRate: (val: number) => void;
  showTitlebar: boolean;
  setShowTitlebar: (val: boolean) => void;
  isNativeMode: boolean;
  setIsNativeMode: (val: boolean) => void;
  onPlay: () => void;
  onPause: () => void;
  onStop: () => void;
}

export function Menu({
  isOpen, onClose,
  url, setUrl,
  transparency, setTransparency,
  brightness, setBrightness,
  menuOpacity, setMenuOpacity,
  aspectRatio, setAspectRatio,
  showSubtitles, setShowSubtitles,
  subtitleSize, setSubtitleSize,
  playbackRate, setPlaybackRate,
  showTitlebar, setShowTitlebar,
  isNativeMode, setIsNativeMode,
  onPlay, onPause, onStop
}: MenuProps) {
  
  const ratios = [
    { label: "16:9", value: "16 / 9" },
    { label: "4:3", value: "4 / 3" },
    { label: "21:9", value: "21 / 9" },
    { label: "9:16", value: "9 / 16" },
    { label: "1:1", value: "1 / 1" }
  ];

  const speeds = [0.5, 0.75, 1, 1.25, 1.5, 2];
  const subSizes = [50, 100, 150, 200];

  return (
    <>
      <div className={`sidebar-menu glass ${isOpen ? 'open' : ''}`}>
        <div className="menu-inner-scroll">
          <div className="menu-header">Pro Max Control</div>
          
          <div className="menu-section">
            <div className="setting-field">
              <label className="setting-label">Source URL</label>
              <div className="url-input-wrapper">
                <input 
                  className="modern-input"
                  type="text" 
                  placeholder="Insert YouTube link..." 
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                />
                {url && (
                  <button className="input-clear-btn" onClick={() => setUrl("")} title="Clear URL">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="18" y1="6" x2="6" y2="18"></line>
                      <line x1="6" y1="6" x2="18" y2="18"></line>
                    </svg>
                  </button>
                )}
              </div>
              <div className="url-group-modern">
                <div className="action-grid-three">
                  <button className="action-card play" onClick={() => { onPlay(); onClose(); }}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>
                    <span>PLAY</span>
                  </button>
                  <button className="action-card pause" onClick={() => { onPause(); onClose(); }}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg>
                    <span>PAUSE</span>
                  </button>
                  <button className="action-card stop" onClick={() => { onStop(); onClose(); }}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M6 6h12v12H6z"/></svg>
                    <span>STOP</span>
                  </button>
                </div>
              </div>
            </div>

            <hr className="divider" />

            <div className="setting-field">
              <div className="toggle-row">
                <div className="setting-field compact">
                  <span className="setting-label">Title Bar</span>
                  <button 
                    className={`chip-item small ${showTitlebar ? 'active' : ''}`}
                    onClick={() => setShowTitlebar(!showTitlebar)}
                  >
                    {showTitlebar ? 'FIXED' : 'AUTO-HIDE'}
                  </button>
                </div>
                <div className="setting-field compact">
                  <span className="setting-label">Captions</span>
                  <button 
                    className={`chip-item small ${showSubtitles ? 'active' : ''}`}
                    onClick={() => setShowSubtitles(!showSubtitles)}
                  >
                    {showSubtitles ? 'ENABLED' : 'DISABLED'}
                  </button>
                </div>
              </div>
            </div>

            <div className="setting-field">
              <div className="setting-top">
                <span className="setting-label">Transparency</span>
                <span className="setting-value">{transparency}%</span>
              </div>
              <div className="slider-container-pro">
                <input type="range" min="10" max="100" value={transparency} onChange={(e) => setTransparency(parseInt(e.target.value))} />
              </div>
            </div>

            <div className="setting-field">
              <div className="setting-top">
                <span className="setting-label">Brightness</span>
                <span className="setting-value">{brightness}%</span>
              </div>
              <div className="slider-container-pro">
                <input type="range" min="20" max="150" value={brightness} onChange={(e) => setBrightness(parseInt(e.target.value))} />
              </div>
            </div>

            <div className="setting-field">
              <div className="setting-top">
                <span className="setting-label">Menu Opacity</span>
                <span className="setting-value">{menuOpacity}%</span>
              </div>
              <div className="slider-container-pro">
                <input 
                  type="range" 
                  min="10" max="100" 
                  value={menuOpacity} 
                  onChange={(e) => setMenuOpacity(parseInt(e.target.value))} 
                />
              </div>
            </div>

            <div className="setting-field">
              <span className="setting-label">Playback Performance</span>
              <div className="chip-group">
                {speeds.map(s => (
                  <button 
                    key={s}
                    className={`chip-item ${playbackRate === s ? 'active' : ''}`}
                    onClick={() => setPlaybackRate(s)}
                  >
                    {s === 1 ? 'Normal' : `${s}x`}
                  </button>
                ))}
              </div>
            </div>

            <div className="setting-field">
              <div className="setting-top">
                <span className="setting-label">Native Interaction</span>
                <span className="setting-value">{isNativeMode ? 'G ON' : 'G OFF'}</span>
              </div>
              <button 
                className={`chip-item ${isNativeMode ? 'active' : ''}`}
                style={{ width: '100%', marginTop: '4px' }}
                onClick={() => setIsNativeMode(!isNativeMode)}
              >
                {isNativeMode ? 'NATIVE MODE ENABLED' : 'QUICK GESTURES ACTIVE'}
              </button>
            </div>

            <div className="setting-field">
              <span className="setting-label">Aspect Ratio</span>
              <div className="chip-group">
                {ratios.map(r => (
                  <button 
                    key={r.value}
                    className={`chip-item ${aspectRatio === r.value ? 'active' : ''}`}
                    onClick={() => setAspectRatio(r.value)}
                  >
                    {r.label}
                  </button>
                ))}
              </div>
            </div>

            {showSubtitles && (
              <div className="setting-field">
                <span className="setting-label">Subtitle Scale</span>
                <div className="chip-group">
                  {subSizes.map(size => (
                    <button 
                      key={size}
                      className={`chip-item ${subtitleSize === size ? 'active' : ''}`}
                      onClick={() => setSubtitleSize(size)}
                    >
                      {size}%
                    </button>
                  ))}
                </div>
              </div>
            )}
            
            <div style={{ height: '60px' }}></div>
          </div>
        </div>
      </div>
      
      <div className={`click-overlay ${isOpen ? 'active' : ''}`} onClick={onClose}></div>
    </>
  );
}
