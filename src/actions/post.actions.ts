"use server"

import prisma from "@/lib/prisma"
import { auth } from "@/lib/auth"
import { revalidatePath } from "next/cache"

export async function createPost(content: string) {
  try {
    const session = await auth()
    
    if (!session?.user?.id) {
      throw new Error("Unauthenticated")
    }

    await prisma.post.create({
      data: {
        content,
        userId: session.user.id
      }
    })

    revalidatePath("/", "layout")
  } catch (error) {
    console.error("Failed to create post:", error)
    throw new Error("Failed to create post")
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
    }

    revalidatePath("/", "layout");
    return { success: true };
  } catch (error) {
    console.error("Failed to toggle like:", error);
    return { error: "Terjadi kesalahan" };
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
