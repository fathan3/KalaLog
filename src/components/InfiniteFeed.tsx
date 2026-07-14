"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import ThreadCard from "./ThreadCard";
import ThreadSkeleton from "./ThreadSkeleton";
import { getPosts } from "@/actions/post.actions";
import { formatRelativeTime } from "@/lib/utils";

interface Post {
  id: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
  userId: string;
  user: {
    id: string;
    name: string | null;
    username: string | null;
  };
  likes: { userId: string }[];
  bookmarks?: { userId: string }[];
  _count: {
    replies: number;
    likes: number;
  };
}

interface InfiniteFeedProps {
  initialPosts: Post[];
  initialNextCursor?: string;
  username?: string;
  currentUserId?: string;
  searchQuery?: string;
  bookmarksOnly?: boolean;
}

export default function InfiniteFeed({
  initialPosts,
  initialNextCursor,
  username,
  currentUserId,
  searchQuery,
  bookmarksOnly
}: InfiniteFeedProps) {
  const [posts, setPosts] = useState<Post[]>(initialPosts);
  const [nextCursor, setNextCursor] = useState<string | undefined>(initialNextCursor);
  const [isLoading, setIsLoading] = useState(false);
  const observerTarget = useRef<HTMLDivElement>(null);

  const fetchMorePosts = useCallback(async () => {
    if (!nextCursor || isLoading) return;
    
    setIsLoading(true);
    const result = await getPosts({ cursor: nextCursor, limit: 10, username, query: searchQuery, bookmarksOnly });
    
    if (result.posts && result.posts.length > 0) {
      setPosts(prev => {
        // Prevent duplicates in strict mode
        const existingIds = new Set(prev.map(p => p.id));
        const newPosts = result.posts.filter((p: any) => !existingIds.has(p.id));
        return [...prev, ...newPosts];
      });
      setNextCursor(result.nextCursor);
    } else {
      setNextCursor(undefined);
    }
    
    setIsLoading(false);
  }, [nextCursor, isLoading, username, searchQuery, bookmarksOnly]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        if (entries[0].isIntersecting) {
          fetchMorePosts();
        }
      },
      { threshold: 1.0 }
    );

    if (observerTarget.current) {
      observer.observe(observerTarget.current);
    }

    return () => observer.disconnect();
  }, [fetchMorePosts]);

  // Sync with initialPosts if they change (e.g. after a new post is created and revalidatePath runs)
  useEffect(() => {
    setPosts(initialPosts);
    setNextCursor(initialNextCursor);
  }, [initialPosts, initialNextCursor]);

  const isLikedByMe = (likes: { userId: string }[]) => {
    if (!currentUserId) return false;
    return likes.some(like => like.userId === currentUserId);
  };

  const isBookmarkedByMe = (bookmarks?: { userId: string }[]) => {
    if (!currentUserId || !bookmarks) return false;
    return bookmarks.some(bookmark => bookmark.userId === currentUserId);
  };

  return (
    <div className="flex flex-col relative">
      {posts.map((post) => (
        <ThreadCard 
          key={post.id}
          id={post.id}
          author={post.user.name || "Anonim"}
          handle={post.user.username || "anon"}
          time={formatRelativeTime(post.createdAt)}
          content={post.content}
          likes={post._count.likes}
          replies={post._count.replies}
          isLiked={isLikedByMe(post.likes)}
          isBookmarked={isBookmarkedByMe(post.bookmarks)}
          isOwner={currentUserId === post.userId}
          createdAt={post.createdAt}
          updatedAt={post.updatedAt}
        />
      ))}
      
      {nextCursor && (
        <div ref={observerTarget} className="py-4">
          <ThreadSkeleton />
        </div>
      )}
      
      {!nextCursor && posts.length > 0 && (
        <div className="py-12 text-center text-zinc-500 text-sm">
          Tidak ada lagi catatan untuk ditampilkan.
        </div>
      )}
      
      {!nextCursor && posts.length === 0 && (
        <div className="py-12 text-center text-zinc-500 text-sm">
          Belum ada catatan.
        </div>
      )}
    </div>
  );
}
