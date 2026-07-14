import ThreadInput from "@/components/ThreadInput";
import ThreadCard from "@/components/ThreadCard";
import Clock from "@/components/Clock";
import LogoutButton from "@/components/LogoutButton";
import prisma from "@/lib/prisma";
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
  
  const posts = await prisma.post.findMany({
    where: {
      parentId: null
    },
    orderBy: {
      createdAt: 'desc'
    },
    include: {
      user: true,
      likes: true,
      _count: {
        select: {
          replies: true,
          likes: true
        }
      }
    }
  });

  return (
    <main className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 pt-12 pb-24">
      {/* Left Column (Sticky Sidebar) */}
      <aside className="lg:col-span-5 flex flex-col space-y-12">
        <div className="sticky top-12 flex flex-col min-h-[calc(100vh-6rem)]">
          <div>
            <Clock />
            
            {/* Profil Saya Link */}
            {currentUser && (
              <Link 
                href={`/profile/${currentUser.username}`} 
                className="mt-6 flex items-center p-4 rounded-2xl bg-white/[0.02] border border-white/5 hover:bg-white/[0.04] transition-all group"
              >
                <div className="w-10 h-10 rounded-full bg-zinc-800 flex items-center justify-center text-lg font-bold text-zinc-400 mr-4 group-hover:scale-105 transition-transform">
                  {currentUser.name ? currentUser.name.charAt(0).toUpperCase() : "?"}
                </div>
                <div className="flex-1">
                  <h3 className="text-sm font-semibold text-zinc-200">{currentUser.name || "Anonim"}</h3>
                  <p className="text-xs text-zinc-500">Lihat Profil Saya</p>
                </div>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-zinc-600 group-hover:text-zinc-300 transition-colors"><path d="m9 18 6-6-6-6"/></svg>
              </Link>
            )}

            <div className="mt-8">
              <ThreadInput />
            </div>
          </div>
          <div className="mt-auto pt-12 pb-6">
            <LogoutButton />
          </div>
        </div>
      </aside>

      {/* Right Column (Timeline Feed) */}
      <section className="lg:col-span-7 relative pt-4">
        {/* Glow Line Background */}
        <div className="absolute left-[29px] top-6 bottom-0 w-[2px] bg-gradient-to-b from-zinc-700/80 via-zinc-800/30 to-transparent"></div>
        
        <div className="flex flex-col relative">
          {posts.map((post) => (
            <ThreadCard 
              key={post.id}
              id={post.id}
              author={post.user.name || "Anonim"}
              handle={post.user.username || post.user.email?.split('@')[0] || post.user.id.substring(0, 8)}
              time={formatRelativeTime(post.createdAt)}
              content={post.content}
              likes={post._count.likes}
              replies={post._count.replies}
              isLiked={session?.user?.id ? post.likes.some(like => like.userId === session.user.id) : false}
            />
          ))}

          {posts.length === 0 && (
            <div className="pl-16 pt-8 text-zinc-500 font-medium">
              Belum ada catatan log waktu. Silakan ukir sejarah pertama Anda.
            </div>
          )}
        </div>
      </section>
    </main>
  )
}
