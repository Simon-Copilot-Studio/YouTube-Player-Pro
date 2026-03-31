import React from "react";

interface MenuProps {
  isOpen: boolean;
  onClose: () => void;
  url: string;
  setUrl: (url: string) => void;
  transparency: number;
  setTransparency: (val: number) => void;
  brightness: number;
  setBrightness: (val: number) => void;
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
  onPlay: () => void;
  onStop: () => void;
}

export function Menu({
  isOpen, onClose,
  url, setUrl,
  transparency, setTransparency,
  brightness, setBrightness,
  aspectRatio, setAspectRatio,
  showSubtitles, setShowSubtitles,
  subtitleSize, setSubtitleSize,
  playbackRate, setPlaybackRate,
  showTitlebar, setShowTitlebar,
  onPlay, onStop
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
            {/* YouTube Link Section */}
            <div className="setting-item">
              <label className="setting-label">Source URL</label>
              <div className="url-group-modern">
                <input 
                  className="modern-input"
                  type="text" 
                  placeholder="Insert YouTube link..." 
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                />
                <div className="action-grid">
                  <button className="action-card play" onClick={() => { onPlay(); onClose(); }}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>
                    <span>PLAY</span>
                  </button>
                  <button className="action-card stop" onClick={() => { onStop(); onClose(); }}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M6 6h12v12H6z"/></svg>
                    <span>STOP</span>
                  </button>
                </div>
              </div>
            </div>

            <hr className="divider" />

            {/* Quick Toggles */}
            <div className="toggle-row">
              <div className="setting-item compact">
                <span className="setting-label">Title Bar</span>
                <button 
                  className={`chip-item small ${showTitlebar ? 'active' : ''}`}
                  onClick={() => setShowTitlebar(!showTitlebar)}
                >
                  {showTitlebar ? 'FIXED' : 'AUTO-HIDE'}
                </button>
              </div>
              <div className="setting-item compact">
                <span className="setting-label">Captions</span>
                <button 
                  className={`chip-item small ${showSubtitles ? 'active' : ''}`}
                  onClick={() => setShowSubtitles(!showSubtitles)}
                >
                  {showSubtitles ? 'ENABLED' : 'DISABLED'}
                </button>
              </div>
            </div>

            {/* Visual Controls */}
            <div className="setting-item">
              <div className="setting-top">
                <span className="setting-label">Transparency</span>
                <span className="setting-value">{transparency}%</span>
              </div>
              <div className="slider-container-pro">
                <input type="range" min="10" max="100" value={transparency} onChange={(e) => setTransparency(parseInt(e.target.value))} />
              </div>
            </div>

            <div className="setting-item">
              <div className="setting-top">
                <span className="setting-label">Brightness</span>
                <span className="setting-value">{brightness}%</span>
              </div>
              <div className="slider-container-pro">
                <input type="range" min="20" max="150" value={brightness} onChange={(e) => setBrightness(parseInt(e.target.value))} />
              </div>
            </div>

            {/* Selection Groups */}
            <div className="setting-item">
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

            <div className="setting-item">
              <span className="setting-label">Display Ratio</span>
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
              <div className="setting-item">
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
