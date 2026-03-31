import React, { useState, useEffect, useRef } from 'react';

const FAKE_LOGS = [
  "[vite] hmr update /src/App.tsx",
  "[vite] hmr update /src/index.css",
  "[vite] hmr update /src/components/Player.tsx",
  "[vite] hmr update /src/components/Menu.tsx",
  "Compiling frontend chunks (2/5)...",
  "Compiling backend modules (4/5)...",
  "Finished `dev` profile [unoptimized + debuginfo] target(s) in 1.23s",
  "Running `target\\debug\\youtube-player-pro.exe`",
  "Info Watching src/ for changes...",
  "[tauri] waiting for frontend update to complete...",
  "[rollup] building assets...",
  "warn: unused variable `video_id` in src-tauri/main.rs:12",
  "[plugin:vite:react-swc] Transform time: 142ms",
  "VITE v5.1.4  ready in 435 ms",
  "➜  Local:   http://localhost:1420/",
  "➜  Network: use --host to expose",
  "➜  press h to show help",
];

export function TerminalCamouflage() {
  const [logs, setLogs] = useState<string[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const startupSequence = [
      "Starting development server...",
      "VITE v5.1.4  ready in 1259 ms",
      "➜  Local:   http://localhost:1420/",
      "➜  Network: use --host to expose",
      "➜  press h to show help",
      "Compiling youtube-player-pro v0.1.0...",
      "Finished `dev` profile [unoptimized + debuginfo] target(s) in 1.69s",
      "Running `target\\debug\\youtube-player-pro.exe`",
      ""
    ];
    setLogs(startupSequence);
  }, []);

  useEffect(() => {
    const intervalId = setInterval(() => {
      const newLinesCount = Math.floor(Math.random() * 2) + 1;
      const newLines: string[] = [];
      for (let i = 0; i < newLinesCount; i++) {
        const randomLog = Math.random() < 0.8 
          ? `[vite] hmr update /src/${['App.tsx', 'index.css', 'Player.tsx', 'Menu.tsx'][Math.floor(Math.random() * 4)]}`
          : FAKE_LOGS[Math.floor(Math.random() * FAKE_LOGS.length)];
        const timestamp = new Date().toLocaleTimeString('zh-TW', { hour12: false });
        newLines.push(`[${timestamp}] ${randomLog}`);
      }
      setLogs(prev => [...prev, ...newLines].slice(-80));
    }, 2000 + Math.random() * 3000);
    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    if (containerRef.current) containerRef.current.scrollTop = containerRef.current.scrollHeight;
  }, [logs]);

  return (
    <div className="terminal-camouflage" ref={containerRef} onContextMenu={e => e.preventDefault()}>
      <div className="terminal-content">
        {logs.map((log, index) => {
          let colorClass = "term-text";
          // [Pro Max Fix] Robust text matching for terminal colors
          if (log.includes("VITE v") || log.includes("➜") || log.includes("ready in")) {
            colorClass = "term-success";
          } else if (log.includes("[vite] hmr") || log.includes("Compiling")) {
            colorClass = "term-info";
          } else if (log.includes("warn:") || log.includes("unoptimized")) {
            colorClass = "term-warn";
          }
          
          return (
            <div key={index} className="term-line">
              <span className={colorClass}>{log}</span>
            </div>
          );
        })}
        <div className="term-line"><span className="term-cursor">█</span></div>
      </div>
    </div>
  );
}
