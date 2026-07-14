"use client";

import { useState, useTransition } from "react";
import { toggleBookmark } from "@/actions/post.actions";
import { Bookmark } from "lucide-react";

interface BookmarkButtonProps {
  postId: string;
  initialBookmarked: boolean;
}

export default function BookmarkButton({ postId, initialBookmarked }: BookmarkButtonProps) {
  const [isBookmarked, setIsBookmarked] = useState(initialBookmarked);
  const [isPending, startTransition] = useTransition();

  const handleBookmark = (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent navigating to post page
    setIsBookmarked(!isBookmarked); // Optimistic UI
    
    startTransition(async () => {
      const res = await toggleBookmark(postId);
      if (res?.error) {
        // Revert on error
        setIsBookmarked(isBookmarked);
        alert(res.error);
      }
    });
  };

  return (
    <button 
      onClick={handleBookmark}
      disabled={isPending}
      className={`group flex items-center space-x-1.5 transition-colors disabled:opacity-50 ${
        isBookmarked ? 'text-sky-400' : 'text-zinc-500 hover:text-sky-400'
      }`}
      aria-label="Simpan catatan"
      title="Simpan"
    >
      <div className={`p-1.5 rounded-full transition-colors ${
        isBookmarked ? 'bg-sky-400/10' : 'group-hover:bg-sky-400/10'
      }`}>
        <Bookmark 
          size={16} 
          className="transition-transform group-hover:scale-110 active:scale-95" 
          fill={isBookmarked ? "currentColor" : "none"} 
        />
      </div>
    </button>
  );
}
