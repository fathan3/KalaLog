import prisma from "@/lib/prisma"
import { auth } from "@/lib/auth"
import { notFound } from "next/navigation"
import Link from "next/link"
import ThreadCard from "@/components/ThreadCard"
import EditProfileDialog from "@/components/EditProfileDialog"
import InfiniteFeed from "@/components/InfiniteFeed"
import { getPosts } from "@/actions/post.actions"
import LogoutButton from "@/components/LogoutButton"
import { formatRelativeTime } from "@/lib/utils"
import { Metadata } from "next"

export async function generateMetadata({ 
  params 
}: { 
  params: Promise<{ username: string }> 
}): Promise<Metadata> {
  const { username } = await params;
  const user = await prisma.user.findUnique({ where: { username } });
  
  if (!user) {
    return {
      title: "Profil Tidak Ditemukan | KalaLog"
    };
  }

  const title = `${user.name || "Anonim"} (@${user.username}) | KalaLog`;
  const description = `Lihat catatan waktu dari ${user.name || user.username} di KalaLog.`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "profile",
      url: `/profile/${username}`,
    },
    twitter: {
      card: "summary",
      title,
      description,
    }
  };
}

export default async function ProfilePage({ 
  params,
  searchParams
}: { 
  params: Promise<{ username: string }>,
  searchParams: Promise<{ tab?: string }>
}) {
  const session = await auth()
  const { username } = await params;
  const resolvedSearchParams = await searchParams;
  const tab = resolvedSearchParams.tab || "posts";
  
  const profileUser = await prisma.user.findUnique({
    where: { username: username },
    include: {
      _count: {
        select: {
          posts: {
            where: { parentId: null }
          }
        }
      }
    }
  })

  if (!profileUser) {
    notFound()
  }

  const isOwnProfile = session?.user?.id === profileUser.id
  
  const isBookmarksTab = tab === "bookmarks" && isOwnProfile;

  const result = await getPosts({ 
    username: isBookmarksTab ? undefined : username, 
    limit: 10,
    bookmarksOnly: isBookmarksTab
  });
  const posts = result.posts;
  const nextCursor = result.nextCursor;

  return (
    <main className="grid grid-cols-1 lg:grid-cols-12 gap-8 max-w-6xl mx-auto w-full h-full p-4 md:p-8 mt-4 md:mt-8">
      {/* Left Column (Sticky Profile Identity) */}
      <aside className="lg:col-span-4">
        <div className="sticky top-20 flex flex-col min-h-[calc(100vh-8rem)]">
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
                  <span className="text-white font-bold block text-lg">{profileUser._count.posts}</span>
                  <span className="text-zinc-600">Catatan Waktu</span>
                </div>
              </div>

              {isOwnProfile && (
                <EditProfileDialog user={{ name: profileUser.name, username: profileUser.username }} />
              )}
            </div>
          </div>
          
        </div>
      </aside>

      {/* Right Column (User's Timeline Feed) */}
      <section className="lg:col-span-8 relative pt-4">
        {/* Glow Line Background */}
        <div className="absolute left-[23px] top-8 bottom-0 w-[1px] bg-gradient-to-b from-white/10 via-white/5 to-transparent"></div>
        
        <div className="flex flex-col relative">
          <div className="mb-10 pl-16 flex items-center space-x-6 border-b border-white/10 pb-4">
            <Link 
              href={`/profile/${username}`}
              className={`text-lg font-medium transition-colors ${!isBookmarksTab ? 'text-zinc-100 border-b-2 border-white pb-4 -mb-[17px]' : 'text-zinc-500 hover:text-zinc-300'}`}
            >
              Postingan
            </Link>
            {isOwnProfile && (
              <Link 
                href={`/profile/${username}?tab=bookmarks`}
                className={`text-lg font-medium transition-colors ${isBookmarksTab ? 'text-zinc-100 border-b-2 border-white pb-4 -mb-[17px]' : 'text-zinc-500 hover:text-zinc-300'}`}
              >
                Tersimpan
              </Link>
            )}
          </div>

          <InfiniteFeed 
            initialPosts={posts as any} 
            initialNextCursor={nextCursor} 
            username={isBookmarksTab ? undefined : username}
            bookmarksOnly={isBookmarksTab}
            currentUserId={session?.user?.id} 
          />
        </div>
      </section>
    </main>
  )
}
