import { getPosts } from "@/actions/post.actions";
import InfiniteFeed from "@/components/InfiniteFeed";
import { auth } from "@/lib/auth";
import { Search as SearchIcon } from "lucide-react";
import Link from "next/link";

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const session = await auth();
  const resolvedParams = await searchParams;
  const query = resolvedParams.q || "";

  // Fetch initial posts based on query
  const result = await getPosts({ query, limit: 10 });
  const posts = result.posts;
  const nextCursor = result.nextCursor;

  return (
    <main className="max-w-2xl mx-auto w-full h-full p-4 md:p-8 mt-4 md:mt-8">
      <Link href="/" className="inline-flex items-center text-zinc-500 hover:text-white transition-colors mb-8 group">
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2 group-hover:-translate-x-1 transition-transform"><path d="m15 18-6-6 6-6"/></svg>
        Kembali ke Garis Waktu
      </Link>

      <div className="mb-12">
        <h1 className="text-3xl font-bold text-white mb-6 tracking-tight">Pencarian Pintar</h1>
        
        <form action="/search" method="GET" className="relative group">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <SearchIcon className="h-5 w-5 text-zinc-500 group-focus-within:text-sky-400 transition-colors" />
          </div>
          <input
            type="text"
            name="q"
            defaultValue={query}
            placeholder="Cari kata kunci atau username..."
            className="w-full bg-black/40 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-zinc-100 placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-sky-500/50 transition-all text-lg shadow-inner"
            autoFocus
          />
          <button type="submit" className="hidden">Search</button>
        </form>
      </div>

      <section className="relative pt-4">
        {query ? (
          <div className="mb-8 pl-8 border-l border-white/10">
            <h2 className="text-lg font-medium text-zinc-400">
              Hasil untuk <span className="text-white">"{query}"</span>
            </h2>
          </div>
        ) : (
          <div className="mb-8 pl-8 border-l border-white/10">
            <h2 className="text-lg font-medium text-zinc-500">
              Ketikkan sesuatu untuk mulai mencari.
            </h2>
          </div>
        )}

        {query && (
          <div className="flex flex-col relative">
            <InfiniteFeed 
              initialPosts={posts as any} 
              initialNextCursor={nextCursor} 
              searchQuery={query}
              currentUserId={session?.user?.id} 
            />
          </div>
        )}
      </section>
    </main>
  );
}
