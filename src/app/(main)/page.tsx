import ThreadInput from "@/components/ThreadInput";
import InfiniteFeed from "@/components/InfiniteFeed";
import Clock from "@/components/Clock";
import LogoutButton from "@/components/LogoutButton";
import prisma from "@/lib/prisma";
import { getPosts } from "@/actions/post.actions";
import { auth } from "@/lib/auth";
import Link from "next/link";
import { formatRelativeTime } from "@/lib/utils";

function formatTime(date: Date) {
  return new Intl.DateTimeFormat('id-ID', { hour: '2-digit', minute: '2-digit', hour12: false }).format(date).replace('.', ':');
}

export default async function Home() {
  const session = await auth();
  
  let currentUser = null;
  if (session?.user?.id) {
    currentUser = await prisma.user.findUnique({
      where: { id: session.user.id }
    });
  }
  
  const result = await getPosts({ limit: 10 });
  const posts = result.posts;
  const nextCursor = result.nextCursor;

  return (
    <main className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 pt-12 pb-24">
      {/* Left Column (Sticky Sidebar) */}
      <aside className="lg:col-span-4 flex flex-col space-y-12">
        <div className="sticky top-20 flex flex-col min-h-[calc(100vh-8rem)]">
          <div>
            <Clock />
            
            <div className="mt-8">
              <ThreadInput />
            </div>
          </div>
        </div>
      </aside>

      {/* Right Column (Timeline Feed) */}
      <section className="lg:col-span-8 relative pt-4">
        {/* Glow Line Background */}
        <div className="absolute left-[23px] top-6 bottom-0 w-[2px] bg-gradient-to-b from-zinc-700/80 via-zinc-800/30 to-transparent"></div>
        
        <InfiniteFeed 
          initialPosts={posts as any} 
          initialNextCursor={nextCursor} 
          currentUserId={session?.user?.id} 
        />
      </section>
    </main>
  )
}
