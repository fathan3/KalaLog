"use client";

import { useState, useTransition } from "react";
import { deletePost, editPost } from "@/actions/post.actions";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "./ui/dropdown-menu";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "./ui/dialog";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";

interface ThreadOptionsProps {
  postId: string;
  initialContent: string;
  createdAt: Date;
}

export default function ThreadOptions({ postId, initialContent, createdAt }: ThreadOptionsProps) {
  const [isPending, startTransition] = useTransition();
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editContent, setEditContent] = useState(initialContent);
  const [error, setError] = useState("");

  const now = new Date();
  const diffInMinutes = (now.getTime() - new Date(createdAt).getTime()) / (1000 * 60);
  const canEdit = diffInMinutes <= 15;

  const handleDelete = () => {
    if (confirm("Apakah Anda yakin ingin menghapus catatan ini? Tindakan ini tidak dapat dibatalkan.")) {
      startTransition(async () => {
        const res = await deletePost(postId);
        if (res?.error) {
          alert(res.error);
        }
      });
    }
  };

  const handleEdit = () => {
    setError("");
    startTransition(async () => {
      const res = await editPost(postId, editContent);
      if (res?.error) {
        setError(res.error);
      } else {
        setIsEditDialogOpen(false);
      }
    });
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button className="p-1.5 rounded-full text-zinc-500 hover:text-zinc-300 hover:bg-white/5 transition-colors absolute top-6 right-2 opacity-0 group-hover:opacity-100 focus:opacity-100">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="1"/><circle cx="12" cy="5" r="1"/><circle cx="12" cy="19" r="1"/></svg>
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-40 bg-zinc-900 border-white/10 text-zinc-300">
          {canEdit ? (
            <DropdownMenuItem onClick={() => setIsEditDialogOpen(true)} className="cursor-pointer hover:bg-white/5">
              Edit catatan
            </DropdownMenuItem>
          ) : (
            <DropdownMenuItem disabled className="opacity-50 cursor-not-allowed">
              Waktu edit habis
            </DropdownMenuItem>
          )}
          <DropdownMenuItem onClick={handleDelete} className="cursor-pointer text-red-400 hover:text-red-300 hover:bg-red-400/10 focus:bg-red-400/10 focus:text-red-300">
            Hapus
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[500px] bg-zinc-900 border-white/10 text-zinc-100">
          <DialogHeader>
            <DialogTitle>Edit Catatan</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <Textarea
              value={editContent}
              onChange={(e) => setEditContent(e.target.value)}
              className="min-h-[120px] bg-white/[0.02] border border-white/10 rounded-xl p-4 text-zinc-100 placeholder:text-zinc-600 focus-visible:ring-1 focus-visible:ring-zinc-500 resize-none"
              disabled={isPending}
            />
            {error && <p className="text-red-400 text-sm mt-2">{error}</p>}
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setIsEditDialogOpen(false)} disabled={isPending} className="text-zinc-400 hover:text-zinc-200">
              Batal
            </Button>
            <Button onClick={handleEdit} disabled={!editContent.trim() || isPending || editContent === initialContent} className="bg-zinc-100 text-zinc-900 hover:bg-white">
              {isPending ? "Menyimpan..." : "Simpan Perubahan"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
