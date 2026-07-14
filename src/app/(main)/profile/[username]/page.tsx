import prisma from "@/lib/prisma"
import { auth } from "@/lib/auth"
import { notFound } from "next/navigation"
import Link from "next/link"
import ThreadCard from "@/components/ThreadCard"
import EditProfileDialog from "@/components/EditProfileDialog"
import LogoutButton from "@/components/LogoutButton"
import { formatRelativeTime } from "@/lib/utils"

export default async function ProfilePage({ params }: { params: Promise<{ username: string }> }) {
  const session = await auth()
  const { username } = await params;
  
  const profileUser = await prisma.user.findUnique({
    where: { username: username },
    include: {
      posts: {
        where: {
          parentId: null
        },
        orderBy: { createdAt: 'desc' },
        include: {
          likes: true,
          _count: {
            select: { replies: true, likes: true }
          }
        }
      }
    }
  })

  if (!profileUser) {
    notFound()
  }

  const isOwnProfile = session?.user?.id === profileUser.id

  return (
    <main className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 pt-12 pb-24">
      {/* Left Column (Sticky Profile Identity) */}
      <aside className="lg:col-span-5 flex flex-col space-y-12">
        <div className="sticky top-12 flex flex-col min-h-[calc(100vh-6rem)]">
          <div>
            {/* Back Button */}
            <Link href="/" className="inline-flex items-center text-zinc-500 hover:text-white transition-colors mb-8 group">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2 group-hover:-translate-x-1 transition-transform"><path d="m15 18-6-6 6-6"/></svg>
              Kembali ke Garis Waktu
            </Link>

            {/* Identity Card */}
            <div className="bg-white/[0.02] border border-white/5 rounded-3xl p-8 backdrop-blur-sm relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-zinc-500 to-transparent opacity-20"></div>
              
              <div className="w-20 h-20 rounded-full bg-zinc-800 border-4 border-background flex items-center justify-center text-3xl font-bold text-zinc-400 mb-6 shadow-xl">
                {profileUser.name ? profileUser.name.charAt(0).toUpperCase() : "?"}
              </div>
              
              <h1 className="text-3xl font-bold tracking-tight text-white mb-1">
                {profileUser.name || "Anonim"}
              </h1>
              <p className="text-zinc-500 font-medium tracking-wide">@{profileUser.username}</p>
              
              <div className="mt-8 flex space-x-6 text-sm">
                <div>
                  <span className="text-white font-bold block text-lg">{profileUser.posts.length}</span>
                  <span className="text-zinc-600">Catatan Waktu</span>
                </div>
              </div>

              {isOwnProfile && (
                <EditProfileDialog user={{ name: profileUser.name, username: profileUser.username }} />
              )}
            </div>
          </div>
          
          {isOwnProfile && (
            <div className="mt-auto pt-12 pb-6">
              <LogoutButton />
            </div>
          )}
        </div>
      </aside>

      {/* Right Column (User's Timeline Feed) */}
      <section className="lg:col-span-7 relative pt-4">
        {/* Glow Line Background */}
        <div className="absolute left-[29px] top-6 bottom-0 w-[2px] bg-gradient-to-b from-zinc-700/80 via-zinc-800/30 to-transparent"></div>
        
        <div className="flex flex-col relative">
          <div className="mb-10 pl-16">
            <h2 className="text-xl font-medium text-zinc-400">Riwayat Catatan</h2>
          </div>

          {profileUser.posts.map((post) => (
            <ThreadCard 
              key={post.id}
              id={post.id}
              author={profileUser.name || "Anonim"}
              handle={profileUser.username || "anon"}
              time={formatRelativeTime(post.createdAt)}
              content={post.content}
              likes={post._count.likes}
              replies={post._count.replies}
              isLiked={session?.user?.id ? post.likes.some(like => like.userId === session.user.id) : false}
              isOwner={session?.user?.id === post.userId}
              createdAt={post.createdAt}
              updatedAt={post.updatedAt}
            />
          ))}

          {profileUser.posts.length === 0 && (
            <div className="pl-16 pt-8 text-zinc-500 font-medium">
              Belum ada sejarah yang dicatat oleh pengguna ini.
            </div>
          )}
        </div>
      </section>
    </main>
  )
}
