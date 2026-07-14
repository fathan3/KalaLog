import { Button } from "./ui/button";
import Link from "next/link";

interface ThreadCardProps {
  author: string;
  handle: string;
  time: string;
  date?: string;
  content: string;
  likes: number;
  replies: number;
}

export default function ThreadCard({ author, handle, time, date, content, likes, replies }: ThreadCardProps) {
  return (
    <article className="group relative flex gap-6 py-8 transition-all hover:bg-white/[0.01] -mx-4 px-4 rounded-2xl">
      {/* Timeline Node */}
      <div className="relative flex flex-col items-center shrink-0 w-12 pt-0.5">
        <div className="absolute top-[0.65rem] left-1/2 -translate-x-1/2 w-2.5 h-2.5 rounded-full bg-zinc-500 ring-[6px] ring-background shadow-[0_0_12px_rgba(161,161,170,0.5)] group-hover:bg-zinc-100 group-hover:shadow-[0_0_20px_rgba(255,255,255,0.8)] transition-all duration-300 z-10"></div>
        <div className="mt-8 flex flex-col items-center space-y-1">
          <span className="text-sm font-bold text-zinc-500 group-hover:text-zinc-300 transition-colors">
            {time}
          </span>
          {date && (
            <span className="text-[10px] font-medium text-zinc-600 uppercase tracking-widest text-center leading-tight group-hover:text-zinc-400 transition-colors">
              {date}
            </span>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col space-y-3">
        <p className="text-zinc-200 leading-relaxed text-[17px] tracking-wide font-light">
          {content}
        </p>
        
        {/* Author Signature */}
        <div className="flex items-center space-x-2 pt-1 opacity-80">
          <span className="w-5 h-[1px] bg-zinc-700"></span>
          <Link href={`/profile/${handle}`} className="text-sm text-zinc-400 font-medium tracking-wide hover:text-zinc-200 cursor-pointer transition-colors">
            {author}
          </Link>
          <Link href={`/profile/${handle}`} className="text-sm text-zinc-600 hover:text-zinc-400 transition-colors">
            @{handle}
          </Link>
        </div>
        
        {/* Interaction (Subtle, appears on hover) */}
        <div className="flex items-center space-x-6 pt-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 -ml-2">
          <button className="flex items-center space-x-2 text-zinc-500 hover:text-sky-400 transition-colors">
            <div className="p-1.5 rounded-full hover:bg-sky-400/10 transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
            </div>
            <span className="text-xs font-semibold">{replies}</span>
          </button>
          <button className="flex items-center space-x-2 text-zinc-500 hover:text-pink-500 transition-colors">
            <div className="p-1.5 rounded-full hover:bg-pink-500/10 transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg>
            </div>
            <span className="text-xs font-semibold">{likes}</span>
          </button>
        </div>
      </div>
    </article>
  );
}
