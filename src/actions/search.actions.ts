"use server"

import prisma from "@/lib/prisma"
import { auth } from "@/lib/auth"

export async function searchPosts({
  query,
  cursor,
  limit = 10
}: {
  query: string;
  cursor?: string;
  limit?: number;
}) {
  try {
    if (!query || query.trim().length === 0) {
      return { posts: [] }
    }

    const searchQuery = query.trim()
    const session = await auth()

    // Cari dari post content ATAU username pembuat post
    const posts = await prisma.post.findMany({
      where: {
        isDraft: false,
        parentId: null,
        OR: [
          {
            content: {
              contains: searchQuery,
              mode: "insensitive"
            }
          },
          {
            user: {
              username: {
                contains: searchQuery,
                mode: "insensitive"
              }
            }
          }
        ]
      },
      take: limit + 1,
      cursor: cursor ? { id: cursor } : undefined,
      skip: cursor ? 1 : 0,
      orderBy: { createdAt: "desc" },
      include: {
        user: { select: { id: true, name: true, username: true } },
        likes: { select: { userId: true } },
        bookmarks: { select: { userId: true } },
        _count: { select: { replies: true, likes: true } },
      },
    })

    if (posts.length > 0) {
      const postIds = posts.map((p) => p.id)
      prisma.post.updateMany({
        where: { id: { in: postIds } },
        data: { viewCount: { increment: 1 } }
      }).catch(err => console.error("Failed to increment view count on search", err))
    }

    let nextCursor: string | undefined = undefined;
    if (posts.length > limit) {
      const nextItem = posts.pop();
      nextCursor = nextItem?.id;
    }

    return { posts, nextCursor }
  } catch (error) {
    console.error("Failed to search posts:", error)
    return { posts: [], error: "Gagal mencari catatan" }
  }
}
