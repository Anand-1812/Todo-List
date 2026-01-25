import { Plus } from "lucide-react";

interface EmptyStateProps {
  isSearching: boolean;
  onClear: () => void;
}

export default function EmptyState({ isSearching, onClear }: EmptyStateProps) {
  return (
    <div
      className="
      flex flex-col items-center justify-center py-20
      animate-in fade-in zoom-in-95 duration-500
    "
    >
      <div
        className="
        w-24 h-24 bg-neutral-900 rounded-full
        flex items-center justify-center mb-6 border border-white/5
      "
      >
        <Plus className="text-neutral-700 w-10 h-10" />
      </div>

      <h3 className="text-xl font-semibold text-neutral-200 mb-2">
        {isSearching ? "No matches found" : "Your workspace is empty"}
      </h3>

      <p
        className="
        text-neutral-500 text-sm max-w-[250px] text-center
        leading-relaxed mb-8
      "
      >
        {isSearching
          ? "We couldn't find any notes matching your current search query."
          : "Start capturing your DSA solutions, ML notes, and project ideas today."}
      </p>

      {isSearching && (
        <button
          onClick={onClear}
          className="
            px-6 py-2 bg-neutral-900 border border-white/10
            text-neutral-300 rounded-full text-sm font-medium
            hover:bg-neutral-800 transition-all cursor-pointer
          "
        >
          Clear search
        </button>
      )}
    </div>
  );
}
