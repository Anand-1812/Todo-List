import { useState, useRef, useEffect } from "react";
import { Pin, MoreVertical, Pencil, Trash2, Tag } from "lucide-react";

interface NoteCardProps {
  note: any;
  onDelete: () => void;
  onEdit: () => void;
  onPin: () => void;
}

export default function NoteCard({
  note,
  onDelete,
  onEdit,
  onPin,
}: NoteCardProps) {
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
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
        break-inside-avoid rounded-2xl p-4 sm:p-6 transition-all group
        shadow-lg relative bg-neutral-900/40 border-t-4 ${color} border-x
        border-b border-white/5 hover:bg-neutral-900/60
      `}
    >
      <div className="flex justify-between items-start mb-4">
        {title && (
          <h3
            className="
              text-base sm:text-lg font-semibold text-neutral-100 leading-tight
            "
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
            ${
              isPinned
                ? "text-sky-400 fill-sky-400 opacity-100"
                : "text-neutral-500 opacity-100 sm:opacity-0 group-hover:opacity-100 hover:text-white"
            }
          `}
          size={18}
        />
      </div>

      <p
        className="
          text-neutral-400 text-xs sm:text-sm leading-relaxed mb-6 font-medium
          whitespace-pre-wrap
        "
      >
        {content}
      </p>

      <div className="flex items-center justify-between">
        {tag ? (
          <div
            className="
              flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px]
              font-bold uppercase tracking-wider text-neutral-500 bg-neutral-950/50
              border border-white/5
            "
          >
            <Tag size={12} /> {tag}
          </div>
        ) : (
          <div />
        )}

        <div className="relative" ref={menuRef}>
          <button
            onClick={() => setShowMenu(!showMenu)}
            className="
              p-1 text-neutral-500 hover:text-white cursor-pointer opacity-100
              sm:opacity-0 group-hover:opacity-100
            "
          >
            <MoreVertical size={18} />
          </button>

          {showMenu && (
            <div
              className="
                absolute right-0 bottom-full mb-2 w-32 z-40 bg-neutral-900
                border border-white/10 rounded-xl shadow-2xl backdrop-blur-xl
                overflow-hidden
              "
            >
              <button
                onClick={() => {
                  onEdit();
                  setShowMenu(false);
                }}
                className="
                  w-full flex items-center gap-3 px-4 py-3 text-xs
                  text-neutral-300 hover:bg-white/5 cursor-pointer
                "
              >
                <Pencil size={14} /> Edit
              </button>

              <button
                onClick={() => {
                  onDelete();
                  setShowMenu(false);
                }}
                className="
                  w-full flex items-center gap-3 px-4 py-3 text-xs
                  text-red-400 hover:bg-red-500/10 cursor-pointer
                "
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
