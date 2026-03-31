import React from 'react';

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
  const isPaused = player && player.getPlayerState ? player.getPlayerState() === 2 : false;

  const handleAction = (cb: () => void) => {
    cb();
    onClose();
  };

  return (
    <div 
      className="custom-context-menu glass" 
      style={{ top: y, left: x }}
      onClick={(e) => e.stopPropagation()}
    >
      <div className="menu-item-group">
        <div className="menu-item" onClick={() => handleAction(() => {
          if (isPaused) player.playVideo();
          else player.pauseVideo();
        })}>
          {isPaused ? '▶ Play' : '⏸ Pause'}
        </div>
        <div className="menu-item" onClick={() => handleAction(onStop)}>⏹ Stop</div>
      </div>
      
      <div className="menu-divider"></div>
      
      <div className="menu-item" onClick={() => handleAction(onToggleMenu)}>⚙ Settings Menu</div>
      <div className="menu-item danger" onClick={() => handleAction(onToggleCamouflage)}>🛡 Camouflage (Boss Key)</div>
      
      <div className="menu-divider"></div>
      
      <div className="menu-item" onClick={() => handleAction(() => player?.seekTo(player.getCurrentTime() - 10, true))}>⏪ Rewind 10s</div>
      <div className="menu-item" onClick={() => handleAction(() => player?.seekTo(player.getCurrentTime() + 10, true))}>⏩ Forward 10s</div>
    </div>
  );
}
