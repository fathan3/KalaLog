"use server"

import prisma from "@/lib/prisma"
import { auth } from "@/lib/auth"
import { revalidatePath } from "next/cache"

export async function createPost(content: string, isDraft: boolean = false) {
  try {
    const session = await auth()
    
    if (!session?.user?.id) {
      return { error: "Unauthenticated" }
    }

    if (!content || !content.trim()) {
      return { error: "Konten tidak boleh kosong" }
    }

    await prisma.post.create({
      data: {
        content: content.trim(),
        userId: session.user.id,
        isDraft
      }
    })

    revalidatePath("/", "layout")
    return { success: true }
  } catch (error) {
    console.error("Failed to create post:", error)
    return { error: "Failed to create post" }
  }
}

export async function toggleLike(postId: string) {
  try {
    const session = await auth();
    if (!session?.user?.id) throw new Error("Unauthenticated");

    const existingLike = await prisma.like.findUnique({
      where: {
        userId_postId: {
          userId: session.user.id,
          postId: postId
        }
      }
    });

    if (existingLike) {
      await prisma.like.delete({
        where: { id: existingLike.id }
      });
    } else {
      await prisma.like.create({
        data: {
          userId: session.user.id,
          postId: postId
        }
      });
      
      const post = await prisma.post.findUnique({ where: { id: postId }, select: { userId: true } });
      if (post && post.userId !== session.user.id) {
        await prisma.notification.create({
          data: {
            userId: post.userId,
            senderId: session.user.id,
            type: "LIKE",
            postId: postId
          }
        });
      }
    }

    revalidatePath("/", "layout");
    return { success: true };
  } catch (error) {
    console.error("Failed to toggle like:", error);
    return { error: "Terjadi kesalahan" };
  }
}

export async function toggleBookmark(postId: string) {
  try {
    const session = await auth();
    if (!session?.user?.id) throw new Error("Unauthenticated");

    const existingBookmark = await prisma.bookmark.findUnique({
      where: {
        userId_postId: {
          userId: session.user.id,
          postId: postId
        }
      }
    });

    if (existingBookmark) {
      await prisma.bookmark.delete({
        where: { id: existingBookmark.id }
      });
    } else {
      await prisma.bookmark.create({
        data: {
          userId: session.user.id,
          postId: postId
        }
      });
    }

    revalidatePath("/", "layout");
    return { success: true };
  } catch (error) {
    console.error("Failed to toggle bookmark:", error);
    return { error: "Gagal menyimpan catatan" };
  }
}

export async function replyToPost(postId: string, content: string) {
  try {
    const session = await auth();
    if (!session?.user?.id) throw new Error("Unauthenticated");

    if (!content || !content.trim()) {
      return { error: "Konten tidak boleh kosong" };
    }

    await prisma.post.create({
      data: {
        content: content.trim(),
        userId: session.user.id,
        parentId: postId
      }
    });

    const parentPost = await prisma.post.findUnique({ where: { id: postId }, select: { userId: true } });
    if (parentPost && parentPost.userId !== session.user.id) {
      await prisma.notification.create({
        data: {
          userId: parentPost.userId,
          senderId: session.user.id,
          type: "REPLY",
          postId: postId
        }
      });
    }

    revalidatePath("/", "layout");
    return { success: true };
  } catch (error) {
    console.error("Failed to reply:", error);
    return { error: "Gagal membalas catatan" };
  }
}

export async function deletePost(postId: string) {
  try {
    const session = await auth();
    if (!session?.user?.id) throw new Error("Unauthenticated");

    const post = await prisma.post.findUnique({
      where: { id: postId },
      select: { userId: true }
    });

    if (!post) {
      return { error: "Catatan tidak ditemukan" };
    }

    if (post.userId !== session.user.id) {
      return { error: "Anda tidak berhak menghapus catatan ini" };
    }

    await prisma.post.delete({
      where: { id: postId }
    });

    revalidatePath("/", "layout");
    return { success: true };
  } catch (error) {
    console.error("Failed to delete post:", error);
    return { error: "Gagal menghapus catatan" };
  }
}

export async function editPost(postId: string, newContent: string) {
  try {
    const session = await auth();
    if (!session?.user?.id) throw new Error("Unauthenticated");

    if (!newContent || !newContent.trim()) {
      return { error: "Konten tidak boleh kosong" };
    }

    const post = await prisma.post.findUnique({
      where: { id: postId },
      select: { userId: true, createdAt: true }
    });

    if (!post) {
      return { error: "Catatan tidak ditemukan" };
    }

    if (post.userId !== session.user.id) {
      return { error: "Anda tidak berhak mengedit catatan ini" };
    }

    const now = new Date();
    const diffInMinutes = (now.getTime() - post.createdAt.getTime()) / (1000 * 60);

    if (diffInMinutes > 15) {
      return { error: "Waktu edit (15 menit) sudah habis." };
    }

    await prisma.post.update({
      where: { id: postId },
      data: {
        content: newContent.trim(),
      }
    });

    revalidatePath("/", "layout");
    return { success: true };
  } catch (error) {
    console.error("Failed to edit post:", error);
    return { error: "Gagal mengedit catatan" };
  }
}

export async function getPosts({
  cursor,
  limit = 10,
  username,
  query,
  bookmarksOnly,
  isDraft = false
}: {
  cursor?: string;
  limit?: number;
  username?: string;
  query?: string;
  bookmarksOnly?: boolean;
  isDraft?: boolean;
}) {
  try {
    const whereCondition: any = { parentId: null, isDraft };
    
    if (isDraft) {
      const session = await auth();
      if (!session?.user?.id) return { posts: [] };
      whereCondition.userId = session.user.id;
    }

    if (username && !isDraft) {
      const targetUser = await prisma.user.findUnique({
        where: { username }
      });
      if (!targetUser) return { posts: [] };
      whereCondition.userId = targetUser.id;
    }

    if (query && !isDraft) {
      whereCondition.OR = [
        {
          content: {
            contains: query,
            mode: "insensitive"
          }
        },
        {
          user: {
            username: {
              contains: query,
              mode: "insensitive"
            }
          }
        }
      ];
    }

    if (bookmarksOnly) {
      const session = await auth();
      if (!session?.user?.id) return { posts: [] };
      
      // If filtering by bookmarks, we want to get posts bookmarked by the user
      whereCondition.bookmarks = {
        some: {
          userId: session.user.id
        }
      };
    }

    const posts = await prisma.post.findMany({
      where: whereCondition,
      take: limit + 1, // Fetch one extra to know if there's a next page
      cursor: cursor ? { id: cursor } : undefined,
      skip: cursor ? 1 : 0, // Skip the cursor itself
      orderBy: { createdAt: "desc" },
      include: {
        user: { select: { id: true, name: true, username: true } },
        likes: { select: { userId: true } },
        bookmarks: { select: { userId: true } },
        _count: { select: { replies: true, likes: true } },
      },
    });

    if (posts.length > 0 && !isDraft) {
      const postIds = posts.map(p => p.id);
      // Increment view count asynchronously to avoid blocking the response
      prisma.post.updateMany({
        where: { id: { in: postIds } },
        data: { viewCount: { increment: 1 } }
      }).catch(err => console.error("Failed to increment view count", err));
    }

    let nextCursor: string | undefined = undefined;
    if (posts.length > limit) {
      const nextItem = posts.pop(); // Remove the extra item
      nextCursor = nextItem?.id;
    }

    return { posts, nextCursor };
  } catch (error) {
    console.error("Failed to fetch posts:", error);
    return { posts: [], error: "Failed to fetch posts" };
  }
}
