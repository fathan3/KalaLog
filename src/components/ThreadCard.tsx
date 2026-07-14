import Link from "next/link";
import LikeButton from "./LikeButton";
import ThreadOptions from "./ThreadOptions";
import ExportQuoteDialog from "./ExportQuoteDialog";
import MarkdownRenderer from "./MarkdownRenderer";

interface ThreadCardProps {
  id: string;
  author: string;
  handle: string;
  time: string;
  date?: string;
  content: string;
  likes: number;
  replies: number;
  isLiked: boolean;
  isOwner?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export default function ThreadCard({ 
  id, author, handle, time, date, content, likes, replies, isLiked, isOwner, createdAt, updatedAt 
}: ThreadCardProps) {
  
  const isEdited = createdAt && updatedAt && new Date(updatedAt).getTime() - new Date(createdAt).getTime() > 1000;

  return (
    <article className="group relative flex gap-6 py-8 transition-all hover:bg-white/[0.01] -mx-4 px-4 rounded-2xl">
      {isOwner && createdAt && (
        <ThreadOptions postId={id} initialContent={content} createdAt={createdAt} />
      )}
      
      {/* Timeline Node */}
      <div className="relative flex flex-col items-center shrink-0 w-12 pt-0.5">
        <div className="absolute top-[0.65rem] left-1/2 -translate-x-1/2 w-2.5 h-2.5 rounded-full bg-zinc-500 ring-[6px] ring-background shadow-[0_0_12px_rgba(161,161,170,0.5)] group-hover:bg-zinc-100 group-hover:shadow-[0_0_20px_rgba(255,255,255,0.8)] transition-all duration-300 z-10"></div>
        <div className="mt-8 flex flex-col items-center space-y-1 bg-background/90 backdrop-blur-sm z-10 py-1 px-2 rounded-md">
          <span className="text-sm font-bold text-zinc-500 group-hover:text-zinc-300 transition-colors whitespace-nowrap">
            {time}
          </span>
          {date && (
            <span className="text-[10px] font-medium text-zinc-600 uppercase tracking-widest text-center leading-tight group-hover:text-zinc-400 transition-colors whitespace-nowrap">
              {date}
            </span>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col space-y-3">
        <MarkdownRenderer content={content} />
        
        {/* Author Signature */}
        <div className="flex items-center space-x-2 pt-1 opacity-80 flex-wrap gap-y-1">
          <span className="w-5 h-[1px] bg-zinc-700"></span>
          <Link href={`/profile/${handle}`} className="text-sm text-zinc-400 font-medium tracking-wide hover:text-zinc-200 cursor-pointer transition-colors">
            {author}
          </Link>
          <Link href={`/profile/${handle}`} className="text-sm text-zinc-600 hover:text-zinc-400 transition-colors">
            @{handle}
          </Link>
          {isEdited && (
            <span className="text-xs text-zinc-600 italic ml-2">(diedit)</span>
          )}
        </div>
        
        {/* Interaction (Subtle, appears on hover) */}
        <div className="flex items-center space-x-6 pt-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 -ml-2">
          <Link href={`/thread/${id}`} className="flex items-center space-x-2 text-zinc-500 hover:text-sky-400 transition-colors">
            <div className="p-1.5 rounded-full hover:bg-sky-400/10 transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
            </div>
            <span className="text-xs font-semibold">{replies}</span>
          </Link>
          <LikeButton postId={id} initialLikes={likes} initialLikedByUser={isLiked} />

          <ExportQuoteDialog 
            content={content} 
            author={author} 
            handle={handle} 
            date={date} 
            time={time} 
          />
        </div>
      </div>
    </article>
  );
}
