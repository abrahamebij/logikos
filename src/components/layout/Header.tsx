import { VscNewFile } from "react-icons/vsc";
import { FaRegFolderOpen } from "react-icons/fa";
import { AiOutlineSave } from "react-icons/ai";
import { FaPlus } from "react-icons/fa6";
import { BsPrinter } from "react-icons/bs";
import { LuSend } from "react-icons/lu";
import { Button } from "../ui/button";

const navLinks = [
    { name: "File" },
    { name: "Schedule" },
    { name: "Songs" },
    { name: "Live" },
    { name: "Profiles" },
    { name: "Help" },
];

export default function Header() {
    return (
        <header className="bg-card">
            {/* TOP HEADER */}
            <div className="py-2 px-4 flex items-center gap-8 border-b border-border">
                <div className="flex gap-2 font-semibold text-lg">
                    Logikos
                </div>
                <nav className="flex gap-6 text-sm text-muted-foreground">
                    {navLinks.map((link) => (
                        <button key={link.name} className="hover:underline">
                            {link.name}
                        </button>
                    ))}
                </nav>
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

                <Button><LuSend/> Go Live</Button>
            </div>
        </header>
    )
}