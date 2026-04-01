import { useState, useEffect, useRef, useCallback } from "react";

/**
 * Terminal Camilla - Dynamic Stealth Simulator
 * Optimized for low CPU usage and memory safety during prolonged camouflage.
 */
export function TerminalCamouflage() {
  const [logs, setLogs] = useState<string[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);

  const MAX_LOGS = 100; // Persistence Safety

  const generateLog = useCallback(() => {
    const timestamp = new Date().toLocaleTimeString();
    const prefixes = ["[INFO]", "[DEBUG]", "[SUCCESS]", "[WAIT]", "[DONE]"];
    const prefix = prefixes[Math.floor(Math.random() * prefixes.length)];
    const messages = [
      "Vite HMR updated modules...",
      "Compiling src/App.tsx (2.4ms)",
      "Checking for vulnerabilities (0 found)",
      "Analyzing dependency graph...",
      "Network idle - listening on http://localhost:1420",
      "Building for production...",
      "Rust (Tauri) backend synchronized.",
      "Optimizing CSS modules (Outfit, Inter)",
      "Garbage collection executed (12ms savings)",
      "Hot-reload triggered in renderer process."
    ];
    const msg = messages[Math.floor(Math.random() * messages.length)];
    
    let colorClass = "term-info";
    if (prefix === "[SUCCESS]" || prefix === "[DONE]") colorClass = "term-success";
    if (prefix === "[WAIT]") colorClass = "term-warn";

    return `<span class="${colorClass}">${timestamp} ${prefix}</span> ${msg}`;
  }, []);

  useEffect(() => {
    // 1. Initial burst of logs
    const initialLogs = Array.from({ length: 20 }, () => generateLog());
    setLogs(initialLogs);

    // 2. High-performance log stream
    const interval = setInterval(() => {
      setLogs(prev => {
        const newLogs = [...prev, generateLog()];
        if (newLogs.length > MAX_LOGS) return newLogs.slice(newLogs.length - MAX_LOGS);
        return newLogs;
      });
    }, 800);

    return () => clearInterval(interval);
  }, [generateLog]);

  // Auto-scroll logic
  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [logs]);

  return (
    <div className="terminal-container" style={{
      position: 'absolute', inset: 0, background: '#0c0c0c', color: '#ccc',
      padding: '24px', fontFamily: '"Fira Code", monospace', fontSize: '13px',
      overflow: 'hidden', zIndex: 1000
    }}>
      <div 
        ref={containerRef}
        style={{ height: '100%', overflowY: 'auto', scrollBehavior: 'smooth' }}
      >
        {logs.map((log, i) => (
          <div 
            key={i} 
            dangerouslySetInnerHTML={{ __html: log }} 
            style={{ marginBottom: '4px', opacity: 0.9 }}
          />
        ))}
      </div>
    </div>
  );
}
