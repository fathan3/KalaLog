import { notFound } from "next/navigation";
import prisma from "@/lib/prisma";
import { auth } from "@/lib/auth";
import ThreadCard from "@/components/ThreadCard";
import Link from "next/link";
import { formatRelativeTime } from "@/lib/utils";
import ReplyInput from "./ReplyInput";

export default async function ThreadView({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await auth();

  const post = await prisma.post.findUnique({
    where: { id },
    include: {
      user: true,
      likes: true,
      _count: {
        select: { replies: true, likes: true }
      },
      replies: {
        orderBy: { createdAt: 'asc' },
        include: {
          user: true,
          likes: true,
          _count: {
            select: { replies: true, likes: true }
          }
        }
      },
      parent: {
        include: {
          user: true
        }
      }
    }
  });

  if (!post) {
    notFound();
  }

  const isLikedByMe = (likesArray: any[]) => {
    if (!session?.user?.id) return false;
    return likesArray.some((like: any) => like.userId === session?.user?.id);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 max-w-7xl mx-auto w-full h-full p-4 md:p-8 mt-4 md:mt-8">
      <main className="lg:col-span-8 lg:col-start-3 max-w-4xl w-full">
        <div className="mb-8 flex items-center space-x-4">
          <Link href="/" className="p-2 rounded-full bg-white/5 hover:bg-white/10 transition-colors text-zinc-400">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
          </Link>
          <h1 className="text-xl font-bold text-zinc-100">Utas</h1>
        </div>

        {post.parent && (
          <div className="mb-4 pl-12">
            <Link href={`/thread/${post.parent.id}`} className="text-sm font-medium text-sky-400 hover:underline">
              Membalas utas dari @{post.parent.user.username || "anon"}
            </Link>
          </div>
        )}

        <div className="bg-white/[0.02] border border-white/5 rounded-3xl p-6 md:p-8">
          <ThreadCard 
            id={post.id}
            author={post.user.name || "Anonim"}
            handle={post.user.username || "anon"}
            time={formatRelativeTime(post.createdAt)}
            content={post.content}
            likes={post._count.likes}
            replies={post._count.replies}
            isLiked={isLikedByMe(post.likes)}
            isOwner={session?.user?.id === post.userId}
            createdAt={post.createdAt}
            updatedAt={post.updatedAt}
          />
        </div>

        <div className="mt-8 mb-12">
          <ReplyInput parentId={post.id} />
        </div>

        {post.replies.length > 0 && (
          <div className="relative space-y-2 mt-8">
            <div className="absolute left-[23px] top-0 bottom-8 w-[1px] bg-gradient-to-b from-white/10 via-white/5 to-transparent"></div>
            
            <h2 className="text-sm font-semibold text-zinc-500 mb-6 pl-4 uppercase tracking-wider">Balasan</h2>

            {post.replies.map((reply) => (
              <ThreadCard 
                key={reply.id}
                id={reply.id}
                author={reply.user.name || "Anonim"}
                handle={reply.user.username || "anon"}
                time={formatRelativeTime(reply.createdAt)}
                content={reply.content}
                likes={reply._count.likes}
                replies={reply._count.replies}
                isLiked={isLikedByMe(reply.likes)}
                isOwner={session?.user?.id === reply.userId}
                createdAt={reply.createdAt}
                updatedAt={reply.updatedAt}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
