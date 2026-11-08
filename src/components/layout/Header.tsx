import { VscNewFile } from "react-icons/vsc";
import { FaMinus, FaRegFolderOpen, FaTimes } from "react-icons/fa";
import { AiOutlineSave } from "react-icons/ai";
import { FaPlus } from "react-icons/fa6";
import { BsPrinter } from "react-icons/bs";
import { MdOutlineCheckBoxOutlineBlank as BlankIcon } from "react-icons/md";
import { LuSend } from "react-icons/lu";
import { PiCopy } from "react-icons/pi";
import { Button } from "../ui/button";
import { getCurrentWindow } from "@tauri-apps/api/window";
import { useEffect, useState } from "react";
import { useIsTauri } from "@/hooks/useIsTauri";

const navLinks = [
  { name: "File" },
  { name: "Schedule" },
  { name: "Songs" },
  { name: "Live" },
  { name: "Profiles" },
  { name: "Help" },
];

export default function Header() {
  const isApp = useIsTauri();
  const [isMaximized, setIsMaximized] = useState(false);
  const [appWindow, setAppWindow] = useState<any>(null);

  // 1. Initialize appWindow only when we know we are inside Tauri
  useEffect(() => {
    if (isApp) {
      setAppWindow(getCurrentWindow());
    }
  }, [isApp]);

  // 2. Wrap window listeners so they don't fire or execute in the browser
  useEffect(() => {
    if (!isApp || !appWindow) return;

    let unlisten: (() => void) | null = null;

    const setupListener = async () => {
      try {
        const maximized = await appWindow.isMaximized();
        setIsMaximized(maximized);

        unlisten = await appWindow.onResized(async () => {
          const currentMaximized = await appWindow.isMaximized();
          setIsMaximized(currentMaximized);
        });
      } catch (err) {
        console.error("Failed to setup Tauri window listeners:", err);
      }
    };

    setupListener();

    return () => {
      if (unlisten) unlisten();
    };
  }, [isApp, appWindow]);

  const handleMinimize = () => {
    if (appWindow) appWindow.minimize();
  };

  const handleMaximize = async () => {
    if (appWindow) {
      await appWindow.toggleMaximize();
      const maximized = await appWindow.isMaximized();
      setIsMaximized(maximized);
    }
  };

  const handleClose = () => {
    if (appWindow) appWindow.close();
  };

  return (
    <header className="bg-card select-none">
      <div
        data-tauri-drag-region={isApp ? "" : undefined}
        className={`flex justify-between items-center border-b border-border ${
          isApp ? "cursor-grab active:cursor-grabbing w-full" : ""
        }`}
      >
        {/* TOP HEADER */}
        <div className={`py-2 px-4 flex items-center gap-8 ${isApp ? "pointer-events-none" : ""}`}>
          <div className={`flex gap-2 font-semibold text-lg ${isApp ? "pointer-events-auto" : ""}`}>Logikos</div>
          <nav className={`flex gap-6 text-sm text-muted-foreground ${isApp ? "pointer-events-auto" : ""}`}>
            {navLinks.map((link) => (
              <button key={link.name} className="hover:underline">
                {link.name}
              </button>
            ))}
          </nav>
        </div>

        {/* Controls - Rendered only when running inside the Tauri environment */}
        {isApp && (
          <div className="titlebar relative z-50 pointer-events-auto flex items-center justify-end gap-2 pr-2">
            <button title="Minimize" onClick={handleMinimize}>
              <FaMinus />
            </button>
            <button title="Maximize" onClick={handleMaximize}>
              {isMaximized ? <PiCopy /> : <BlankIcon /> }
            </button>
            <button title="Close" onClick={handleClose} className="hover:bg-destructive! hover:text-card">
              <FaTimes />
            </button>
          </div>
        )}
      </div>

      {/* BOTTOM HEADER */}
      <div className="py-2 px-4 flex items-center gap-8">
        <div className="flex text-muted-foreground gap-4">
          <VscNewFile />
          <FaRegFolderOpen />
          <AiOutlineSave />
          <FaPlus />
          <BsPrinter />
        </div>

        <Button>
          <LuSend /> Go Live
        </Button>
      </div>
    </header>
  );
}
