"use client";

import { useState, useTransition, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { replyToPost } from "@/actions/post.actions";
import MarkdownToolbar from "@/components/MarkdownToolbar";

interface ReplyInputProps {
  parentId: string;
  onSuccess?: () => void;
}

export default function ReplyInput({ parentId, onSuccess }: ReplyInputProps) {
  const [content, setContent] = useState("");
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const DRAFT_KEY = `kalalog-draft-reply-${parentId}`;

  // Load draft on mount
  useEffect(() => {
    const savedDraft = localStorage.getItem(DRAFT_KEY);
    if (savedDraft) {
      setContent(savedDraft);
    }
  }, [DRAFT_KEY]);

  // Save draft on change
  useEffect(() => {
    if (content.trim()) {
      localStorage.setItem(DRAFT_KEY, content);
    } else {
      localStorage.removeItem(DRAFT_KEY);
    }
  }, [content, DRAFT_KEY]);

  const handleSubmit = () => {
    if (!content.trim()) return;
    setError("");

    startTransition(async () => {
      const res = await replyToPost(parentId, content);
      if (res?.error) {
        setError(res.error);
      } else {
        setContent("");
        localStorage.removeItem(DRAFT_KEY); // Clear draft
        if (onSuccess) onSuccess();
      }
    });
  };

  return (
    <div className="flex flex-col space-y-3 w-full animate-in fade-in slide-in-from-top-4 duration-300">
      <div className="flex flex-col w-full group">
        <MarkdownToolbar 
          textareaRef={textareaRef} 
          content={content} 
          setContent={setContent} 
          disabled={isPending} 
        />
        <Textarea 
          ref={textareaRef}
          placeholder="Tulis balasan Anda..." 
          className="min-h-[100px] w-full resize-none bg-black/40 border border-white/5 rounded-b-xl rounded-t-none p-4 focus-visible:ring-1 focus-visible:ring-sky-500/50 text-base placeholder:text-zinc-600 transition-all leading-relaxed relative z-0"
          value={content}
          onChange={(e) => {
            setContent(e.target.value);
            if (error) setError(null);
          }}
          disabled={isPending}
        />
      </div>
      {error && <p className="text-red-400 text-sm">{error}</p>}
      <div className="flex justify-end">
        <Button 
          onClick={handleSubmit} 
          disabled={!content.trim() || isPending}
          className="bg-zinc-100 text-zinc-900 rounded-full px-6 hover:bg-white transition-colors"
        >
          {isPending ? "Membalas..." : "Balas"}
        </Button>
      </div>
    </div>
  );
}
