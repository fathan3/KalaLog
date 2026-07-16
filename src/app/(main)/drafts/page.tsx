import { getPosts } from "@/actions/post.actions";
import InfiniteFeed from "@/components/InfiniteFeed";
import { auth } from "@/lib/auth";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function DraftsPage() {
  const session = await auth();
  if (!session?.user) redirect("/");

  const result = await getPosts({ isDraft: true, limit: 10 });
  const posts = result.posts;
  const nextCursor = result.nextCursor;

  return (
    <main className="max-w-2xl mx-auto w-full h-full p-4 md:p-8 mt-4 md:mt-8">
      <Link href="/" className="inline-flex items-center text-zinc-500 hover:text-white transition-colors mb-8 group">
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2 group-hover:-translate-x-1 transition-transform"><path d="m15 18-6-6 6-6"/></svg>
        Kembali ke Garis Waktu
      </Link>

      <div className="mb-12">
        <h1 className="text-3xl font-bold text-white mb-2 tracking-tight">Drafts Anda</h1>
        <p className="text-zinc-500">Catatan yang belum Anda publikasikan.</p>
      </div>

      <section className="relative pt-4">
        {posts.length > 0 ? (
          <div className="flex flex-col relative">
            <InfiniteFeed 
              initialPosts={posts as any} 
              initialNextCursor={nextCursor} 
              currentUserId={session.user.id} 
              isDraft={true}
            />
          </div>
        ) : (
          <div className="py-12 text-center text-zinc-500 text-sm border-t border-white/5 pt-8">
            Anda belum memiliki draft.
          </div>
        )}
      </section>
    </main>
  );
}
