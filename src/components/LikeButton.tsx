"use client";

import { useState, useTransition } from "react";
import { toggleLike } from "@/actions/post.actions";
import { cn } from "@/lib/utils";

interface LikeButtonProps {
  postId: string;
  initialLikes: number;
  initialLikedByUser: boolean;
}

export default function LikeButton({ postId, initialLikes, initialLikedByUser }: LikeButtonProps) {
  const [likes, setLikes] = useState(initialLikes);
  const [isLiked, setIsLiked] = useState(initialLikedByUser);
  const [isPending, startTransition] = useTransition();

  const handleLike = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    // Optimistic UI update
    setIsLiked(!isLiked);
    setLikes(isLiked ? likes - 1 : likes + 1);
    
    startTransition(async () => {
      const result = await toggleLike(postId);
      // Revert if error
      if (result?.error) {
        setIsLiked(isLiked);
        setLikes(likes);
      }
    });
  };

  return (
    <button 
      onClick={handleLike}
      disabled={isPending}
      className={cn(
        "flex items-center space-x-2 transition-colors",
        isLiked ? "text-pink-500" : "text-zinc-500 hover:text-pink-500"
      )}
    >
      <div className={cn(
        "p-1.5 rounded-full transition-colors",
        isLiked ? "bg-pink-500/10" : "hover:bg-pink-500/10"
      )}>
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          width="16" height="16" 
          viewBox="0 0 24 24" 
          fill={isLiked ? "currentColor" : "none"}
          stroke="currentColor" 
          strokeWidth="2" 
          strokeLinecap="round" 
          strokeLinejoin="round"
        >
          <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/>
        </svg>
      </div>
      <span className="text-xs font-semibold">{likes}</span>
    </button>
  );
}
