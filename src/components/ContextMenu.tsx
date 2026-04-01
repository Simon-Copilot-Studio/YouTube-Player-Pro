

interface ContextMenuProps {
  x: number;
  y: number;
  onClose: () => void;
  onToggleMenu: () => void;
  onToggleCamouflage: () => void;
  player: any;
  onPlay: () => void;
  onStop: () => void;
}

export function ContextMenu({ x, y, onClose, onToggleMenu, onToggleCamouflage, player, onPlay, onStop }: ContextMenuProps) {
  const isPaused = player?.getPlayerState?.() === 2;

  const menuItems = [
    {
      label: isPaused ? "Play" : "Pause",
      icon: isPaused 
        ? <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>
        : <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="6" y="4" width="4" height="16"></rect><rect x="14" y="4" width="4" height="16"></rect></svg>,
      onClick: () => { if (isPaused) onPlay(); else player?.pauseVideo(); }
    },
    {
      label: "Stop",
      icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect></svg>,
      onClick: onStop
    },
    { type: "divider" },
    {
      label: "Settings Menu",
      shortcut: "S",
      icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>,
      onClick: onToggleMenu
    },
    {
      label: "Camouflage (Boss Key)",
      shortcut: "Esc x2",
      icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>,
      onClick: onToggleCamouflage
    },
    { type: "divider" },
    {
      label: "Rewind 10s",
      shortcut: "J",
      icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 17l-5-5 5-5M18 17l-5-5 5-5"></path></svg>,
      onClick: () => player?.seekTo(player.getCurrentTime() - 10, true)
    },
    {
      label: "Forward 10s",
      shortcut: "L",
      icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M13 17l5-5-5-5M6 17l5-5-5-5"></path></svg>,
      onClick: () => player?.seekTo(player.getCurrentTime() + 10, true)
    },
    { type: "divider" },
    {
      label: "Exit Application",
      shortcut: "Q",
      className: "exit-item",
      icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>,
      onClick: async () => {
        const { getCurrentWindow } = await import("@tauri-apps/api/window");
        getCurrentWindow().close();
      }
    }
  ];

  return (
    <div 
      className="custom-context-menu" 
      style={{ top: y, left: x }}
      onClick={(e) => e.stopPropagation()}
    >
      {menuItems.map((item, i) => (
        item.type === "divider" ? (
          <div key={i} className="context-divider" />
        ) : (
          <div 
            key={i} 
            className={`context-item ${item.className || ""}`} 
            onClick={() => { item.onClick?.(); onClose(); }}
          >
            <span className="context-icon">{item.icon}</span>
            <span className="context-label">{item.label}</span>
            {item.shortcut && <span className="context-shortcut">{item.shortcut}</span>}
          </div>
        )
      ))}
    </div>
  );
}
