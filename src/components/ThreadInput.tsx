"use client";

import { useState, useTransition } from "react";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import { createPost } from "@/actions/post.actions";

export default function ThreadInput() {
  const [content, setContent] = useState("");
  const [isPending, startTransition] = useTransition();

  const handleSubmit = () => {
    if (!content.trim() || isPending) return;
    
    startTransition(async () => {
      const result = await createPost(content);
      if (result.error) {
        alert(result.error);
      } else {
        setContent(""); // Clear input on success
      }
    });
  };

  return (
    <div className="flex flex-col space-y-4 w-full">
      <Textarea 
        placeholder="Tuliskan log untuk waktu ini..." 
        className="min-h-[140px] w-full resize-none bg-white/[0.02] border border-white/5 rounded-xl p-5 focus-visible:ring-1 focus-visible:ring-zinc-700 text-lg placeholder:text-zinc-600 transition-all focus:bg-white/[0.04] leading-relaxed"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        disabled={isPending}
      />
      <div className="flex justify-end">
        <Button 
          onClick={handleSubmit}
          className="rounded-full px-8 py-6 text-md font-bold tracking-wide bg-zinc-100 text-zinc-900 shadow-xl shadow-white/5 hover:bg-white hover:scale-105 transition-all disabled:opacity-50 disabled:hover:scale-100" 
          disabled={!content.trim() || isPending}
        >
          {isPending ? "Mencatat..." : "Catat Log"}
        </Button>
      </div>
    </div>
  );
}
