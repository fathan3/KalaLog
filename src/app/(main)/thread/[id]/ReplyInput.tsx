"use client";

import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { replyToPost } from "@/actions/post.actions";

export default function ReplyInput({ postId }: { postId: string }) {
  const [content, setContent] = useState("");
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState("");

  const handleSubmit = () => {
    if (!content.trim()) return;
    setError("");

    startTransition(async () => {
      const res = await replyToPost(postId, content);
      if (res?.error) {
        setError(res.error);
      } else {
        setContent("");
      }
    });
  };

  return (
    <div className="flex flex-col space-y-4">
      <Textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Ketikkan balasan Anda di sini..."
        className="min-h-[120px] bg-white/[0.02] border border-white/5 rounded-2xl p-4 text-zinc-100 placeholder:text-zinc-600 focus-visible:ring-1 focus-visible:ring-zinc-500 focus-visible:border-transparent resize-none text-[17px] leading-relaxed transition-all"
        disabled={isPending}
      />
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
