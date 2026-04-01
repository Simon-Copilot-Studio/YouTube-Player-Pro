import { useState, useEffect, useRef } from "react";
import { getCurrentWindow, LogicalSize } from "@tauri-apps/api/window";

export interface WindowState {
  transparency: number;
  brightness: number;
  aspectRatio: string;
  showTitlebar: boolean;
}

export function useWindowState() {
  const loadState = (key: string, defaultValue: any) => {
    const saved = localStorage.getItem(key);
    return saved ? JSON.parse(saved) : defaultValue;
  };

  const [transparency, setTransparency] = useState<number>(loadState("yt-transparency", 100));
  const [brightness, setBrightness] = useState<number>(loadState("yt-brightness", 100));
  const [menuOpacity, setMenuOpacity] = useState<number>(loadState("yt-menu-opacity", 80));
  const [aspectRatio, setAspectRatio] = useState<string>(loadState("yt-aspect", "16 / 9"));
  const [showTitlebar, setShowTitlebar] = useState<boolean>(loadState("yt-titlebar", true));
  const isInitialLoad = useRef(true);

  // Persistence logic
  useEffect(() => {
    localStorage.setItem("yt-transparency", JSON.stringify(transparency));
    localStorage.setItem("yt-brightness", JSON.stringify(brightness));
    localStorage.setItem("yt-menu-opacity", JSON.stringify(menuOpacity));
    localStorage.setItem("yt-aspect", JSON.stringify(aspectRatio));
    localStorage.setItem("yt-titlebar", JSON.stringify(showTitlebar));
  }, [transparency, brightness, menuOpacity, aspectRatio, showTitlebar]);

  // Window size persistence & Auto-resize
  useEffect(() => {
    const appWindow = getCurrentWindow();
    
    const initSize = async () => {
      const savedWidth = localStorage.getItem("win-width");
      const savedHeight = localStorage.getItem("win-height");
      if (savedWidth && savedHeight) {
        await appWindow.setSize(new LogicalSize(parseInt(savedWidth), parseInt(savedHeight)));
      }
    };
    initSize();

    const resizeInterval = setInterval(async () => {
      const size = await appWindow.innerSize();
      if (size.width > 100 && size.height > 100) {
        localStorage.setItem("win-width", size.width.toString());
        localStorage.setItem("win-height", size.height.toString());
      }
    }, 2000);

    return () => clearInterval(resizeInterval);
  }, []);

  // Handle Aspect Ratio changes
  useEffect(() => {
    if (isInitialLoad.current) { isInitialLoad.current = false; return; }
    const triggerResize = async () => {
      const appWindow = getCurrentWindow();
      const currentSize = await appWindow.innerSize();
      const [wRatio, hRatio] = aspectRatio.split("/").map((s) => parseFloat(s.trim()));
      const targetRatio = wRatio / hRatio;
      await appWindow.setSize(new LogicalSize(Math.round(currentSize.height * targetRatio), currentSize.height));
    };
    triggerResize();
  }, [aspectRatio]);

  return {
    transparency, setTransparency,
    brightness, setBrightness,
    menuOpacity, setMenuOpacity,
    aspectRatio, setAspectRatio,
    showTitlebar, setShowTitlebar
  };
}
