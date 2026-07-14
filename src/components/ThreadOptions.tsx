"use client";

import { useState, useTransition, useRef, useEffect } from "react";
import { deletePost, editPost } from "@/actions/post.actions";
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
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [editContent, setEditContent] = useState(initialContent);
  const [error, setError] = useState("");
  const menuRef = useRef<HTMLDivElement>(null);

  const now = new Date();
  const diffInMinutes = (now.getTime() - new Date(createdAt).getTime()) / (1000 * 60);
  const canEdit = diffInMinutes <= 15;

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleDeleteClick = () => {
    setIsMenuOpen(false);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    startTransition(async () => {
      const res = await deletePost(postId);
      if (res?.error) {
        alert(res.error);
      } else {
        setIsDeleteDialogOpen(false);
      }
    });
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
    <div className="absolute top-6 right-2 z-20" ref={menuRef}>
      <button 
        onClick={() => setIsMenuOpen(!isMenuOpen)}
        className={`p-1.5 rounded-full text-zinc-500 hover:text-zinc-300 hover:bg-white/5 transition-colors ${isMenuOpen ? 'opacity-100' : 'opacity-0 group-hover:opacity-100 focus:opacity-100'}`}
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="1"/><circle cx="12" cy="5" r="1"/><circle cx="12" cy="19" r="1"/></svg>
      </button>

      {isMenuOpen && (
        <div className="absolute right-0 top-10 w-40 bg-zinc-900 border border-white/10 rounded-md shadow-xl py-1 text-sm text-zinc-300 z-50">
          {canEdit ? (
            <button 
              onClick={() => { setIsEditDialogOpen(true); setIsMenuOpen(false); }}
              className="w-full text-left px-4 py-2 hover:bg-white/5 transition-colors"
            >
              Edit catatan
            </button>
          ) : (
            <div className="w-full text-left px-4 py-2 opacity-50 cursor-not-allowed">
              Waktu edit habis
            </div>
          )}
          <button 
            onClick={handleDeleteClick}
            className="w-full text-left px-4 py-2 text-red-400 hover:bg-red-400/10 transition-colors"
          >
            Hapus
          </button>
        </div>
      )}

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

      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-[425px] bg-zinc-900 border-white/10 text-zinc-100">
          <DialogHeader>
            <DialogTitle className="text-red-400">Hapus Catatan</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p className="text-zinc-400 text-sm leading-relaxed">
              Apakah Anda yakin ingin menghapus catatan ini? Tindakan ini tidak dapat dibatalkan dan data akan hilang selamanya.
            </p>
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setIsDeleteDialogOpen(false)} disabled={isPending} className="text-zinc-400 hover:text-zinc-200">
              Batal
            </Button>
            <Button onClick={confirmDelete} disabled={isPending} className="bg-red-500/10 text-red-400 hover:bg-red-500/20 hover:text-red-300 border border-red-500/20">
              {isPending ? "Menghapus..." : "Ya, Hapus"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
