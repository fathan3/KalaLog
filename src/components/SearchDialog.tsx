"use client";

import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogTrigger, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Search as SearchIcon } from "lucide-react";
import InfiniteFeed from "./InfiniteFeed";
import { getPosts } from "@/actions/post.actions";

interface SearchDialogProps {
  currentUserId?: string;
  children: React.ReactNode;
}

export default function SearchDialog({ currentUserId, children }: SearchDialogProps) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [posts, setPosts] = useState([]);
  const [nextCursor, setNextCursor] = useState<string | undefined>(undefined);
  const [loading, setLoading] = useState(false);

  // Clear state when dialog closes
  useEffect(() => {
    if (!open) {
      setQuery("");
      setDebouncedQuery("");
      setPosts([]);
    }
  }, [open]);

  // Debounce logic
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(query);
    }, 500);
    return () => clearTimeout(timer);
  }, [query]);

  // Fetch initial posts when query changes
  useEffect(() => {
    if (!debouncedQuery) {
      setPosts([]);
      setNextCursor(undefined);
      return;
    }
    
    let isMounted = true;
    setLoading(true);
    
    getPosts({ query: debouncedQuery, limit: 10 }).then((res: any) => {
      if (isMounted) {
        setPosts(res.posts);
        setNextCursor(res.nextCursor);
        setLoading(false);
      }
    });
    
    return () => { isMounted = false; };
  }, [debouncedQuery]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={children as React.ReactElement} />
      <DialogContent className="sm:max-w-[600px] h-[80vh] flex flex-col p-0 overflow-hidden bg-background border-zinc-800">
        <DialogTitle className="sr-only">Pencarian</DialogTitle>
        <DialogDescription className="sr-only">Cari postingan atau profil pengguna</DialogDescription>
        
        <div className="relative border-b border-zinc-800 p-4 shrink-0">
          <div className="absolute inset-y-0 left-7 flex items-center pointer-events-none">
            <SearchIcon className="h-5 w-5 text-zinc-500" />
          </div>
          <input
            type="text"
            placeholder="Cari kata kunci atau username..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full bg-black/40 border border-white/10 rounded-2xl py-3 pl-12 pr-4 text-zinc-100 placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-sky-500/50 transition-all shadow-inner"
            autoFocus
          />
        </div>
        
        <div className="flex-1 overflow-y-auto p-4 [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-thumb]:bg-zinc-800 [&::-webkit-scrollbar-thumb]:rounded-full">
          {loading ? (
            <div className="py-12 text-center text-zinc-500 text-sm">Mencari...</div>
          ) : debouncedQuery ? (
            <InfiniteFeed 
              initialPosts={posts}
              initialNextCursor={nextCursor}
              searchQuery={debouncedQuery}
              currentUserId={currentUserId}
            />
          ) : (
            <div className="py-12 text-center text-zinc-500 text-sm">
              Ketikkan sesuatu untuk mulai mencari.
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
