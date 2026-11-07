import { VscNewFile } from "react-icons/vsc";
import { FaMinus, FaRegFolderOpen, FaTimes } from "react-icons/fa";
import { AiOutlineSave } from "react-icons/ai";
import { FaPlus } from "react-icons/fa6";
import { BsPrinter } from "react-icons/bs";
import { MdOutlineCheckBoxOutlineBlank } from "react-icons/md";
import { LuSend } from "react-icons/lu";
import { FiMinimize2 } from "react-icons/fi";
import { Button } from "../ui/button";
import { getCurrentWindow } from "@tauri-apps/api/window";
import { useEffect, useState } from "react";

const navLinks = [
  { name: "File" },
  { name: "Schedule" },
  { name: "Songs" },
  { name: "Live" },
  { name: "Profiles" },
  { name: "Help" },
];

const appWindow = getCurrentWindow();

export default function Header() {
  const [isMaximized, setIsMaximized] = useState(false);

    useEffect(() => {
    let unlisten: (() => void) | null = null;

    const setupListener = async () => {
      // Set initial window state
      const maximized = await appWindow.isMaximized();
      setIsMaximized(maximized);

      // Listen for OS native maximizes or manual resizes
      unlisten = await appWindow.onResized(async () => {
        const currentMaximized = await appWindow.isMaximized();
        setIsMaximized(currentMaximized);
      });
    };

    setupListener();

    // Clean up event listener when the component unmounts
    return () => {
      if (unlisten) unlisten();
    };
  }, []);

  const handleMinimize = () => {
    appWindow.minimize();
  };

  const handleMaximize = async () => {
    appWindow.toggleMaximize();
    setIsMaximized(!isMaximized);
  };

  const handleClose = () => {
    appWindow.close();
  };

  return (
    <header className="bg-card">
      <div
        data-tauri-drag-region
        className="flex justify-between items-center border-b border-border"
      >
        {/* TOP HEADER */}
        <div className="py-2 px-4 flex items-center gap-8">
          <div className="flex gap-2 font-semibold text-lg">Logikos</div>
          <nav className="flex gap-6 text-sm text-muted-foreground">
            {navLinks.map((link) => (
              <button key={link.name} className="hover:underline">
                {link.name}
              </button>
            ))}
          </nav>
        </div>

        {/* Controls */}
        <div className="titlebar">
          <button title="Minimize" onClick={handleMinimize}>
            <FaMinus />
          </button>
          <button title="Maximize" onClick={handleMaximize}>
            {isMaximized ? <FiMinimize2 /> : <MdOutlineCheckBoxOutlineBlank /> }
          </button>
          <button title="Close" onClick={handleClose}>
            <FaTimes />
          </button>
        </div>
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
