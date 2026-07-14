import { Skeleton } from "@/components/ui/skeleton";

export default function ThreadSkeleton() {
  return (
    <article className="group relative flex gap-6 py-8 -mx-4 px-4 rounded-2xl w-full">
      {/* Timeline Node Skeleton */}
      <div className="relative flex flex-col items-center shrink-0 w-12 pt-0.5">
        <div className="absolute top-[0.65rem] left-1/2 -translate-x-1/2 w-2.5 h-2.5 rounded-full bg-zinc-700 z-10"></div>
        <div className="mt-8 flex flex-col items-center space-y-2">
          <Skeleton className="h-3 w-10 bg-white/[0.05]" />
          <Skeleton className="h-3 w-8 bg-white/[0.03]" />
        </div>
      </div>

      {/* Content Skeleton */}
      <div className="flex-1 flex flex-col space-y-4 pt-1 w-full">
        {/* Paragraph Lines */}
        <div className="space-y-2.5 w-full">
          <Skeleton className="h-4 w-full bg-white/[0.04]" />
          <Skeleton className="h-4 w-[90%] bg-white/[0.04]" />
          <Skeleton className="h-4 w-[60%] bg-white/[0.04]" />
        </div>
        
        {/* Author Signature Skeleton */}
        <div className="flex items-center space-x-3 pt-2">
          <span className="w-5 h-[1px] bg-zinc-700"></span>
          <Skeleton className="h-3 w-24 bg-white/[0.03]" />
          <Skeleton className="h-3 w-16 bg-white/[0.02]" />
        </div>
      </div>
    </article>
  );
}
