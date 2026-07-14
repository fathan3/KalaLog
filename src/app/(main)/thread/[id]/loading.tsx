import ThreadSkeleton from "@/components/ThreadSkeleton";
import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 max-w-7xl mx-auto w-full h-full p-4 md:p-8 mt-24">
      <main className="lg:col-span-8 lg:col-start-3 max-w-3xl w-full">
        <div className="mb-8 flex items-center space-x-4">
          <div className="p-2 rounded-full bg-white/5">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="opacity-0"><path d="m15 18-6-6 6-6"/></svg>
          </div>
          <h1 className="text-xl font-bold text-zinc-100">Utas</h1>
        </div>

        <div className="bg-white/[0.02] border border-white/5 rounded-3xl p-6 md:p-8">
          <ThreadSkeleton />
        </div>

        <div className="mt-8 mb-12 flex flex-col space-y-4">
          <Skeleton className="min-h-[120px] bg-white/[0.02] rounded-2xl w-full" />
          <div className="flex justify-end">
            <Skeleton className="w-24 h-10 bg-white/[0.02] rounded-full" />
          </div>
        </div>

        <div className="relative space-y-2 mt-8">
          <div className="absolute left-[2.25rem] top-0 bottom-8 w-[1px] bg-gradient-to-b from-white/10 via-white/5 to-transparent"></div>
          
          <h2 className="text-sm font-semibold text-zinc-500 mb-6 pl-4 uppercase tracking-wider">Balasan</h2>

          <ThreadSkeleton />
          <ThreadSkeleton />
        </div>
      </main>
    </div>
  );
}
