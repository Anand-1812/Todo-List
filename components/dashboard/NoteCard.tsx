import { useState, useRef, useEffect } from "react";
import { Pin, MoreVertical, Pencil, Trash2, Tag, Archive } from "lucide-react";

interface NoteCardProps {
  note: any;
  density: string;
  onDelete: () => void;
  onEdit: () => void;
  onPin: () => void;
  onArchive: () => void; // New prop
}

export default function NoteCard({
  note,
  density,
  onDelete,
  onEdit,
  onPin,
  onArchive,
}: NoteCardProps) {
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const isCompact = density === "compact";
  const { title, content, tag, color = "border-white/10", isPinned } = note;

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node))
        setShowMenu(false);
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  return (
    <div
      className={`
      break-inside-avoid rounded-2xl transition-all duration-300
      group shadow-lg relative bg-neutral-900/40 border-t-4
      ${color} border-x border-b border-white/5 hover:bg-neutral-900/60
      ${isCompact ? "p-3 mb-3" : "p-6 mb-6"}
    `}
    >
      <div
        className={`
        flex justify-between items-start
        ${isCompact ? "mb-2" : "mb-4"}
      `}
      >
        {title && (
          <h3
            className={`
            font-semibold text-neutral-100 leading-tight
            ${isCompact ? "text-sm" : "text-base sm:text-lg"}
          `}
          >
            {title}
          </h3>
        )}
        <Pin
          onClick={(e) => {
            e.stopPropagation();
            onPin();
          }}
          className={`
            cursor-pointer transition-all duration-200
            ${isPinned ? "text-sky-400 fill-sky-400" : "text-neutral-500 opacity-100 sm:opacity-0 sm:group-hover:opacity-100"}
            ${isCompact ? "w-3.5 h-3.5" : "w-[18px] h-[18px]"}
          `}
        />
      </div>

      <p
        className={`
        text-neutral-400 leading-relaxed font-medium whitespace-pre-wrap
        ${isCompact ? "text-[11px] mb-3" : "text-xs sm:text-sm mb-6"}
      `}
      >
        {content}
      </p>

      <div className="flex items-center justify-between">
        <div
          className={`
          flex items-center gap-1.5 rounded-full bg-neutral-950/50
          border border-white/5 text-neutral-500 font-bold uppercase tracking-wider
          ${isCompact ? "px-2 py-0.5 text-[8px]" : "px-3 py-1.5 text-[10px]"}
        `}
        >
          <Tag size={isCompact ? 10 : 12} /> {tag || "general"}
        </div>

        <div className="relative" ref={menuRef}>
          <button
            onClick={() => setShowMenu(!showMenu)}
            className="
              p-1 text-neutral-500 hover:text-white cursor-pointer
              opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity
            "
          >
            <MoreVertical size={isCompact ? 14 : 18} />
          </button>

          {showMenu && (
            <div
              className="
              absolute right-0 bottom-full mb-2 w-36 z-40
              bg-neutral-900 border border-white/10 rounded-xl
              shadow-2xl backdrop-blur-xl overflow-hidden
            "
            >
              <button
                onClick={() => {
                  onEdit();
                  setShowMenu(false);
                }}
                className="w-full flex items-center gap-3 px-4 py-3 text-xs text-neutral-300 hover:bg-white/5 cursor-pointer"
              >
                <Pencil size={14} /> Edit
              </button>

              <button
                onClick={() => {
                  onArchive();
                  setShowMenu(false);
                }}
                className="w-full flex items-center gap-3 px-4 py-3 text-xs text-neutral-300 hover:bg-white/5 cursor-pointer"
              >
                <Archive size={14} /> Archive
              </button>

              <button
                onClick={() => {
                  onDelete();
                  setShowMenu(false);
                }}
                className="w-full flex items-center gap-3 px-4 py-3 text-xs text-red-400 hover:bg-red-500/10 cursor-pointer"
              >
                <Trash2 size={14} /> Delete
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
