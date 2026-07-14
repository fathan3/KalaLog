import ThreadSkeleton from "@/components/ThreadSkeleton";
import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <main className="grid grid-cols-1 lg:grid-cols-12 gap-8 h-[calc(100vh-8rem)]">
      {/* Sidebar Loading */}
      <aside className="lg:col-span-3 lg:col-start-2 pt-12 md:pt-24 h-full hidden lg:block">
        <div className="sticky top-24 flex flex-col space-y-8">
          <Skeleton className="w-[180px] h-[72px] bg-white/[0.02]" />
          <Skeleton className="w-[180px] h-[48px] bg-white/[0.02] rounded-full" />
        </div>
      </aside>

      {/* Main Content Loading */}
      <section className="lg:col-span-6 flex flex-col h-full border-x border-white/5 bg-black/20">
        <div className="p-4 md:p-8 space-y-6">
          {/* Thread Input Skeleton */}
          <div className="flex flex-col space-y-4 pt-4 md:pt-16">
            <Skeleton className="w-full h-24 bg-white/[0.02] rounded-2xl" />
            <div className="flex justify-end">
              <Skeleton className="w-24 h-10 bg-white/[0.02] rounded-full" />
            </div>
          </div>
          
          <div className="pt-8 relative">
            <div className="absolute left-[2.25rem] top-8 bottom-0 w-[1px] bg-gradient-to-b from-white/10 via-white/5 to-transparent"></div>
            <div className="space-y-2">
              <ThreadSkeleton />
              <ThreadSkeleton />
              <ThreadSkeleton />
              <ThreadSkeleton />
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
