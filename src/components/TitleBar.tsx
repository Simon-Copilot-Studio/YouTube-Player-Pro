import { getCurrentWindow } from "@tauri-apps/api/window";

interface TitleBarProps {
  onMenuToggle: () => void;
  isMenuOpen: boolean;
  showTitlebar: boolean;
  theme?: 'default' | 'cmd';
}

export function TitleBar({ onMenuToggle, isMenuOpen, showTitlebar, theme = 'default' }: TitleBarProps) {
  const appWindow = getCurrentWindow();

  const handleMinimize = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try { await appWindow.minimize(); } catch (err) { console.error(err); }
  };

  const handleClose = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try { await appWindow.close(); } catch (err) { console.error(err); }
  };

  // Pro Max Dragging Implementation
  const handlePointerDown = async (e: React.PointerEvent) => {
    if (e.button === 0) {
      const target = e.target as HTMLElement;
      // Only drag if it's the title bar background or the drag-region div itself
      if (target.classList.contains('title-bar') || target.classList.contains('drag-region') || target.classList.contains('brand-text')) {
        try {
          await appWindow.startDragging();
        } catch (err) {
          console.error("Dragging failed:", err);
        }
      }
    }
  };

  const isCmd = theme === 'cmd';

  return (
    <div 
      className={`title-bar ${isCmd ? 'cmd-theme' : ''} ${!showTitlebar ? 'auto-hide' : ''} ${isMenuOpen ? 'force-show' : ''}`}
      onPointerDown={handlePointerDown}
    >
      <div className="title-left">
        {!isCmd ? (
          <>
            <div className="hamburger-btn" onClick={(e) => { e.stopPropagation(); onMenuToggle(); }} title="Control Menu">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#818cf8" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                {isMenuOpen ? <path d="M18 6L6 18M6 6l12 12" /> : <path d="M3 12h18M3 6h18M3 18h18" />}
              </svg>
            </div>
            <span className="brand-text">YOUTUBE PRO</span>
          </>
        ) : (
          <span className="cmd-text">npm list @tauri-apps/api @tauri-apps/plugin-localhost...</span>
        )}
      </div>

      <div className="drag-region">
        {/* Transparent area for dragging */}
      </div>

      <div className="window-controls">
        <div className="control-btn" onClick={handleMinimize} title="Minimize">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round">
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
        </div>
        <div className="control-btn close-btn" onClick={handleClose} title="Close">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </div>
      </div>
    </div>
  );
}
