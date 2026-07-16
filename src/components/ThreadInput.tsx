"use client";

import { useState, useTransition, useRef, useEffect } from "react";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import { createPost } from "@/actions/post.actions";
import MarkdownToolbar from "./MarkdownToolbar";

export default function ThreadInput() {
  const [content, setContent] = useState("");
  const [isPending, startTransition] = useTransition();
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const DRAFT_KEY = "kalalog-draft-home";

  // Load draft on mount
  useEffect(() => {
    const savedDraft = localStorage.getItem(DRAFT_KEY);
    if (savedDraft) {
      setContent(savedDraft);
    }
  }, []);

  // Save draft on change
  useEffect(() => {
    if (content.trim()) {
      localStorage.setItem(DRAFT_KEY, content);
    } else {
      localStorage.removeItem(DRAFT_KEY);
    }
  }, [content]);

  const handleSubmit = (isDraft: boolean = false) => {
    if (!content.trim() || isPending) return;
    
    startTransition(async () => {
      const result = await createPost(content, isDraft);
      if (result?.error) {
        alert(result.error);
      } else {
        setContent(""); // Clear input on success
        localStorage.removeItem(DRAFT_KEY); // Clear draft
        if (isDraft) {
          alert("Draft berhasil disimpan!");
        }
      }
    });
  };

  return (
    <div className="flex flex-col space-y-4 w-full">
      <div className="flex flex-col w-full group">
        <MarkdownToolbar 
          textareaRef={textareaRef} 
          content={content} 
          setContent={setContent} 
          disabled={isPending} 
        />
        <Textarea 
          ref={textareaRef}
          placeholder="Tuliskan log untuk waktu ini..." 
          className="min-h-[140px] w-full resize-none bg-white/[0.02] border border-white/5 rounded-b-xl rounded-t-none p-5 focus-visible:ring-1 focus-visible:ring-sky-500/50 text-lg placeholder:text-zinc-600 transition-all focus:bg-white/[0.04] leading-relaxed relative z-0"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          disabled={isPending}
        />
      </div>
      <div className="flex justify-end mt-2 gap-3">
        <Button 
          onClick={() => handleSubmit(true)}
          variant="outline"
          className="rounded-full px-6 py-6 text-md font-bold tracking-wide border-white/10 hover:bg-white/5 transition-all disabled:opacity-50" 
          disabled={!content.trim() || isPending}
        >
          {isPending ? "Menyimpan..." : "Simpan Draft"}
        </Button>
        <Button 
          onClick={() => handleSubmit(false)}
          className="rounded-full px-8 py-6 text-md font-bold tracking-wide bg-zinc-100 text-zinc-900 shadow-xl shadow-white/5 hover:bg-white hover:scale-105 transition-all disabled:opacity-50 disabled:hover:scale-100" 
          disabled={!content.trim() || isPending}
        >
          {isPending ? "Mencatat..." : "Catat Log"}
        </Button>
      </div>
    </div>
  );
}
