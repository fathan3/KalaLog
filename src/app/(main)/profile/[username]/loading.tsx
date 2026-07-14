import ThreadSkeleton from "@/components/ThreadSkeleton";
import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <main className="grid grid-cols-1 lg:grid-cols-12 gap-8 max-w-7xl mx-auto w-full h-full p-4 md:p-8 mt-12 md:mt-24">
      <aside className="lg:col-span-3 lg:col-start-2">
        <div className="sticky top-24">
          <div className="bg-white/[0.02] border border-white/5 rounded-3xl p-6 md:p-8 flex flex-col items-center text-center">
            <Skeleton className="w-24 h-24 rounded-full bg-white/[0.02] mb-6" />
            <Skeleton className="h-6 w-32 bg-white/[0.04] mb-2" />
            <Skeleton className="h-4 w-24 bg-white/[0.02] mb-8" />
            <Skeleton className="h-10 w-full bg-white/[0.03] rounded-full" />
          </div>
        </div>
      </aside>

      <section className="lg:col-span-6 relative pt-4">
        <div className="absolute left-[2.25rem] top-8 bottom-0 w-[1px] bg-gradient-to-b from-white/10 via-white/5 to-transparent"></div>
        <div className="space-y-2">
          <ThreadSkeleton />
          <ThreadSkeleton />
          <ThreadSkeleton />
          <ThreadSkeleton />
        </div>
      </section>
    </main>
  );
}
