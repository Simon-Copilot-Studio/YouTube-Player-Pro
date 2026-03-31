import { useState } from "react";

interface ControlsProps {
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
  onPlay: () => void;
  onStop: () => void;
}

export function Controls({
  url, setUrl,
  transparency, setTransparency,
  brightness, setBrightness,
  aspectRatio, setAspectRatio,
  showSubtitles, setShowSubtitles,
  subtitleSize, setSubtitleSize,
  onPlay, onStop
}: ControlsProps) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className={`controls-overlay glass ${expanded ? 'expanded' : ''}`}>
      <div className="settings-panel">
        <div className="url-input-container">
          <input 
            type="text" 
            placeholder="YouTube URL (e.g. https://www.youtube.com/watch?v=...)" 
            value={url}
            onChange={(e) => setUrl(e.target.value)}
          />
          <button className="play-btn" onClick={onPlay}>▶ PLAY</button>
          <button className="play-btn stop-btn" onClick={onStop}>■ STOP</button>
        </div>

        <div className="setting-row">
          <span className="setting-label">Opacity</span>
          <input 
            type="range" 
            min="0" max="100" 
            value={transparency} 
            onChange={(e) => setTransparency(parseInt(e.target.value))} 
          />
          <span className="setting-value">{transparency}%</span>
        </div>

        <div className="setting-row">
          <span className="setting-label">Brightness</span>
          <input 
            type="range" 
            min="0" max="150" 
            value={brightness} 
            onChange={(e) => setBrightness(parseInt(e.target.value))} 
          />
          <span className="setting-value">{brightness}%</span>
        </div>

        <div className="setting-row">
          <span className="setting-label">Aspect</span>
          <select 
            className="size-btn" 
            value={aspectRatio} 
            onChange={(e) => setAspectRatio(e.target.value)}
          >
            <option value="16 / 9">16:9 (HD)</option>
            <option value="4 / 3">4:3 (SD)</option>
            <option value="21 / 9">21:9 (Cinema)</option>
            <option value="1 / 1">1:1 (Square)</option>
          </select>
        </div>

        <div className="setting-row">
          <span className="setting-label">Subtitles</span>
          <button 
            className={`size-btn ${showSubtitles ? 'active' : ''}`}
            onClick={() => setShowSubtitles(!showSubtitles)}
          >
            {showSubtitles ? 'ON' : 'OFF'}
          </button>
          <div style={{ marginLeft: '12px', display: 'flex', gap: '4px' }}>
            {[50, 100, 150, 200].map(size => (
              <button 
                key={size}
                className={`size-btn ${subtitleSize === size ? 'active' : ''}`}
                onClick={() => setSubtitleSize(size)}
              >
                {size}%
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
